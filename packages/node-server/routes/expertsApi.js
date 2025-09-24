const { verifyToken } = require('../auth/authMiddleware.js');
const { sesClient } = require('../utils/sesClient.js');
const { createSendEmailCommand } = require('../utils/sesCommands.js');
const {randomExpertNameGenerator} = require('../utils/randomExpertNameGenerator.js');
const {
  trimWhitespace,
  SURVEY_STATUS,
  EXPERT_STATUS,
} = require('../utils/index.js');
const { Survey } = require('../database/survey.model.js');
const { Expert } = require('../database/expert.model.js');
const mongoose = require('mongoose');

const expertsApi = function (app) {
  // get all experts for a survey for a tenant/admin
  app.get(
    '/tenants/:tenantId/surveys/:surveyId/experts',
    verifyToken,
    async (req, res) => {
      try {
        let survey = await Survey.findOne({ id: req.params.surveyId }).populate(
          'experts'
        );
        if (!survey)
          return res
            .status(404)
            .json({ error: 'Survey not found', success: false });
        if (survey.tenantId !== req.tenantId)
          return res
            .status(401)
            .json({ error: 'Not authorised', success: false });
        res.status(200).json({ experts: survey.experts, success: true });
      } catch (e) {
        res.status(500).json({ error: e, success: false });
      }
    }
  );

  // get survey for an admin to review the survey
  app.get(
    '/tenants/:tenantId/surveys/:surveyId/experts/test',
    verifyToken,
    async (req, res) => {
      try {
        let survey = await Survey.findOne({
          id: req.params.surveyId,
          tenantId: req.params.tenantId,
        });
        const expert = {
          name: 'Test User',
          _id: 'test',
          survey: survey,
          status: EXPERT_STATUS.ARCHIVED,
          surveyId: req.params.surveyId,
          tenantId: req.params.tenantId,
          responses: [],
        };

        res.status(200).json({ expert: expert, success: true });
      } catch (e) {
        res.status(500).json({ error: e, success: false });
      }
    }
  );

  // allow user to self-create a new expert with a random animal name
  app.post(
    '/tenants/:tenantId/surveys/:surveyId/experts/new',
    async (req, res) => {
      try {
        let survey = await Survey.findOne({
          id: req.params.surveyId,
          tenantId: req.params.tenantId,
        });
        if (!survey) {
          return res
            .status(404)
            .json({ error: 'Survey not found', success: false });
        }
        if (!survey.config?.allowExpertSelfCreation) {
          return res.status(403).json({ error: 'This survey does not allow expert to self-register', success: false });
        }
        const randomExpertName = randomExpertNameGenerator(false); 
        const newData = {
          name: randomExpertName,
          surveyId: req.params.surveyId,
          tenantId: req.params.tenantId,
          survey: survey._id,
          compositeKey: `${req.params.tenantId}${req.params.surveyId}${randomExpertName}`,
          selfCreated: true,
        };

        session = await mongoose.startSession();
        session.startTransaction();

        let expert;
        expert = await Expert.create([newData], { session: session });
        if (!survey.experts.includes(expert[0]._id)) {
          survey.experts.push(expert[0]._id);
          await survey.save({ session: session });
        }
        const expertWithSurvey = expert[0].toObject();
        expertWithSurvey.survey = survey;
        await session.commitTransaction();
        session.endSession();
        res.json({ expert: expertWithSurvey, success: true });
      } catch (e) {
        if (session && !session.hasEnded) {
          await session.abortTransaction();
          session.endSession();
        }
        res.status(500).json({ error: e, success: false });
      }
    }
  );

  // get survey and responses for an expert (expert opens survey)
  app.get(
    '/tenants/:tenantId/surveys/:surveyId/experts/:expertId',
    async (req, res) => {
      try {
        let expert = await Expert.findOne({
          _id: req.params.expertId,
        }).populate('survey');

        if (!expert) {
          return res
            .status(404)
            .json({ error: 'Expert not found', success: false });
        } else if (expert.tenantId !== req.params.tenantId) {
          return res.status(404).json({
            error: 'TenantId does not match expert details',
            success: false,
          });
        } else if (expert.survey.id !== req.params.surveyId) {
          return res.status(404).json({
            error: 'SurveyId does not match expert details',
            success: false,
          });
        } else if (
          expert.status === EXPERT_STATUS.WITHDRAWN ||
          expert.status === EXPERT_STATUS.DELETED ||
          expert.status === EXPERT_STATUS.ARCHIVED
        ) {
          return res
            .status(404)
            .json({
              error:
                'Expert not found. They may have withdrawn or been removed from the survey.',
              success: false,
            });
        } else if (expert.status === EXPERT_STATUS.SUBMITTED) {
          if (expert.survey.config?.allowPostSubmissionView) {
            expert.survey.agenda = [
              expert.survey.lockedScreen,
              ...expert.survey.agenda.slice(0, -1),
            ];
          } else {
            expert.survey.agenda = [expert.survey.lockedScreen];
          }
          res.json({ expert: expert, success: true });
        } else if (
          expert.survey.status === SURVEY_STATUS.ARCHIVED ||
          expert.survey.status === SURVEY_STATUS.DELETED
        ) {
          res.status(404).json({
            error: 'Survey is archived or deleted',
            success: false,
          });
        } else {
          try {
            const eligibleStatuses = [
              EXPERT_STATUS.NOT_CONTACTED,
              EXPERT_STATUS.CONTACTED,
              EXPERT_STATUS.CONSENT_OBTAINED,
              EXPERT_STATUS.SURVEY_INVITATION_SENT,
            ];
            if (eligibleStatuses.includes(expert.status)) {
              expert.status = EXPERT_STATUS.ONGOING;
              await expert.save();
            }
          } catch (e) {
            console.log('Error updating expert status', e);
          }

          // remove surveyquestions from agenda that are being ignored
          expert.survey.agenda = expert.survey.agenda.filter(
            (q) => !expert.ignoreQuestions.includes(q._id)
          );
          res.json({ expert: expert, success: true });
        }
      } catch (e) {
        res.status(500).json({
          error: e,
          success: false,
          message: `No Expert with ID ${req?.params?.expertId} found for Survey ${req?.params?.tenantId}-${req?.params?.surveyId}`,
        });
      }
    }
  );

  // update expert details
  app.patch(
    '/tenants/:tenantId/surveys/:surveyId/experts/:expertId',
    verifyToken,
    async (req, res) => {
      Object.keys(req.body).map((key) => {
        if (typeof req.body[key] === 'string')
          req.body[key] = trimWhitespace(req.body[key]);
      });

      if (req.body.status) {
        const lockedStatuses = [
          EXPERT_STATUS.SUBMITTED,
          EXPERT_STATUS.ARCHIVED,
          EXPERT_STATUS.WITHDRAWN,
          EXPERT_STATUS.DELETED,
        ];
        if (lockedStatuses.includes(req.body.status)) req.body.locked = true;
        else req.body.locked = false;
      }

      try {
        let expert = await Expert.findOneAndUpdate(
          {
            _id: req.params.expertId,
            tenantId: req.tenantId,
          },
          req.body,
          { runValidators: true, new: true }
        );

        if (!expert)
          return res
            .status(404)
            .json({ error: 'Expert not found', success: false });

        res.json({ expert: expert, success: true });
      } catch (e) {
        res.status(500).json({ error: e, success: false });
      }
    }
  );

  // lock an expert's survey (public, no more responses allowed)
  app.post(
    '/tenants/:tenantId/surveys/:surveyId/experts/:expertId/lock',
    async (req, res) => {
      try {
        if (req.params.expertId === 'test') {
          return res.json({
            error: 'Data not saved for test user',
            success: false,
          });
        }

        // no body required
        let expert = await Expert.findOneAndUpdate(
          {
            _id: req.params.expertId,
            surveyId: req.params.surveyId,
          },
          {
            locked: true,
            lastVisitedPageIndex: 0,
            status: EXPERT_STATUS.SUBMITTED,
          },
          { new: true }
        );
        if (!expert)
          return res.json({ error: 'Expert not found', success: false });

        res.json({ _id: expert._id, locked: expert.locked, success: true });
      } catch (e) {
        res.status(500).json({ error: e, success: false });
      }
    }
  );

  // unlock, only admin can unlock
  app.post(
    '/tenants/:tenantId/surveys/:surveyId/experts/:expertId/unlock',
    verifyToken,
    async (req, res) => {
      try {
        let expert = await Expert.findOne({
          _id: req.params.expertId,
        });
        if (!expert)
          return res
            .status(404)
            .json({ error: 'Expert not found', success: false });
        if (expert.tenantId !== req.tenantId)
          return res
            .status(401)
            .json({ error: 'Not authorised', success: false });
        expert.locked = false;
        expert.status = EXPERT_STATUS.ONGOING;
        await expert.save();
        res.json({ _id: expert._id, locked: expert.locked, success: true });
      } catch (e) {
        res.status(500).json({ error: e, success: false });
      }
    }
  );

  // create a new expert for a survey
  app.post(
    '/tenants/:tenantId/surveys/:surveyId/experts',
    verifyToken,
    async (req, res) => {
      let session;
      try {
        if (!req.tenantId || req.tenantId !== req.params.tenantId)
          return res.status(401).json({ error: 'Not authorised', status: 401 });
        let survey = await Survey.findOne({
          id: req.params.surveyId,
          tenantId: req.params.tenantId,
        });
        if (!survey)
          return res
            .status(404)
            .json({ error: 'Survey not found', success: false });

        const newData = {
          ...req.body,
          surveyId: req.params.surveyId,
          tenantId: req.params.tenantId,
          survey: survey._id,
          compositeKey: `${req.params.tenantId}${req.params.surveyId}${req.body.name}`,
        };

        session = await mongoose.startSession();
        session.startTransaction();

        let expert;
        expert = await Expert.create([newData], { session: session });
        if (!survey.experts.includes(expert[0]._id)) {
          survey.experts.push(expert[0]._id);
          await survey.save({ session: session });
        }
        await session.commitTransaction();
        session.endSession();
        res.json({ expert: expert, success: true });
      } catch (e) {
        if (session && !session.hasEnded) {
          await session.abortTransaction();
          session.endSession();
        }
        res.status(500).json({ error: e, success: false });
      }
    }
  );

  // send an email to an expert
  app.post(
    '/tenants/:tenantId/surveys/:surveyId/experts/:expertId/invitation',
    verifyToken,
    async (req, res) => {
      if (!req.body.email || !req.body.emailBody || !req.body.subject) {
        return res.status(400).json({
          error: 'Missing required fields: email, emailBody, subject',
          success: false,
        });
      }
      if (!req.tenantId || req.tenantId !== req.params.tenantId) {
        return res.status(401).json({ error: 'Not authorised', status: 401 });
      }

      let expert;
      try {
        expert = await Expert.findOne({
          _id: req.params.expertId,
          tenantId: req.params.tenantId,
        });
        if (!expert)
          return res
            .status(404)
            .json({ error: 'Expert not found', success: false });
      } catch (e) {
        res.status(500).json({ error: e, success: false });
      }

      try {
        const sendEmailCommand = createSendEmailCommand(
          req.body.email,
          'support@darkpeakanalytics.com',
          req.body.emailBody,
          req.body.subject
        );
        const response = await sesClient.send(sendEmailCommand);

        const eligibleStatuses = [
          EXPERT_STATUS.NOT_CONTACTED,
          EXPERT_STATUS.CONTACTED,
          EXPERT_STATUS.CONSENT_OBTAINED,
        ];
        if (eligibleStatuses.includes(expert.status)) {
          expert.status = EXPERT_STATUS.SURVEY_INVITATION_SENT;
          await expert.save();
        }

        res.json({ response, success: true });
      } catch (caught) {
        if (caught instanceof Error && caught.name === 'MessageRejected') {
          /** @type { import('@aws-sdk/client-ses').MessageRejected} */
          const messageRejectedError = caught;
          return res
            .status(500)
            .json({ error: messageRejectedError, success: false });
        }
      }
    }
  );
};

module.exports = { expertsApi };
