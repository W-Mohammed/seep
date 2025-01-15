const { verifyToken } = require('../auth/authMiddleware')
const { Survey } = require('../database/survey.model')
const { Expert } = require('../database/expert.model')
const {Trash} = require('../database/trash.model')
const { validateSuvey } = require('../services/survey.service')
const { SURVEY_STATUS } = require('../utils')
const { Tenant } = require('../database/tenant.model')
const mongoose = require('mongoose');

const surveysApi = function (app) {
 
  //////////////////// ALL SURVEYS (GENERIC) ////////////////////

  // get all surveys for a tenant, get tenantId from token
  // use for admin dashboard first 'select survey' page
  app.get('/tenants/:tenantId/surveys', verifyToken, async (req, res) => {
    try {
      if (!req.tenantId) return res.json({ error: 'Not authorised', status: 401 })
        let tenantId = req.tenantId
        if(req.superadmin) tenantId = req.params.tenantId
        if (tenantId !== req.params.tenantId)
          return res.json({ error: 'Not authorised', status: 401 })
    
        let allSurveys = await Survey.find({ tenantId: tenantId }).select(
          'id status updatedAt createdAt config name description experts type'
        )
    
        if (!allSurveys)
          return res.json({ error: 'Not found', status: 404 })
        
        try {
          if (req.tenantId == req.params.tenantId) {
            // only count for the actual user logins. Not for superadmin logins for other tenants
            const tenant = await Tenant.findOne({ id: tenantId })
            const user = tenant.users.filter((user) => user.username === req.username)[0]
            const actionTimestamps = user.actionTimestamps
            const lastActionTimestamp = actionTimestamps.length > 0 ? actionTimestamps[actionTimestamps.length - 1] : undefined; 
            const currentDate = new Date();
            const isSameDate = lastActionTimestamp && lastActionTimestamp.toDateString() === currentDate.toDateString();

            if (!isSameDate) {
              actionTimestamps.push(currentDate);

              await Tenant.updateOne(
                { id: tenantId, 'users.username': user.username },
                { $set: { 'users.$.actionTimestamps': actionTimestamps } }
              );
            }
          }
        } catch (e) {
          // error should not stop the main flow
          console.error('Error updating user action timestamps:', e);
        }
        
        return res.json({ surveys: allSurveys.filter((survey) => survey.status != SURVEY_STATUS.DRAFT ), drafts: allSurveys.filter((survey) => survey.status == SURVEY_STATUS.DRAFT ), status: 200 })
    } catch (e) {
      console.error('Error updating survey status:', e);
      return res.status(500).json({ error: 'Internal server error', success: false });
    }
  })

  // update a survey's status
  app.put('/tenants/:tenantId/surveys/:surveyId/status', verifyToken, async (req, res) => {
    try {
      const { tenantId, surveyId } = req.params;
      const { status } = req.body;
  
      if (!status || Object.values(SURVEY_STATUS).indexOf(status) === -1) {
        return res.status(400).json({ error: 'No correct status provided', success: false });
      }
  
      const survey = await Survey.findOneAndUpdate(
        { id: surveyId, tenantId }, 
        { status }, 
        { new: true, runValidators: true, select: 'id tenantId status' }
      );
  
      if (!survey) {
        return res.status(404).json({ error: 'Survey not found', success: false });
      }
  
      if (survey.tenantId !== tenantId) {
        return res.status(403).json({ error: 'Not authorized', success: false });
      }
  
      return res.json({ surveyId: survey.id, newSurveyStatus: survey.status, success: true });
    } catch (e) {
      console.error('Error updating survey status:', e);
      return res.status(500).json({ error: 'Internal server error', success: false });
    }
  });

  //////////////////// DRAFT SURVEYS ////////////////////

  // create a draft survey
  app.post('/tenants/:tenantId/draftsurveys', verifyToken, async (req, res) => {
    let tenantId = req.params.tenantId
    if (!tenantId) return res.json({ error: 'Not authorised', status: 401 })
    let isSuperAdmin = req.superadmin
    // only superadmins can create surveys for other tenants
    if (!isSuperAdmin && req.tenantId !== tenantId)
      return res.json({ error: 'Not authorised', status: 401 })
    
    try {
      const id = req.body.id || Math.random().toString(36).substring(2)

      const draftSurvey = {
        id: id,
        name: req.body.name,
        description: req.body.description,
        tenantId: tenantId,
        compositeKey: `${tenantId}${id}`,
        studyContact: req.body.studyContact,
        agenda: req.body.agenda,
        type: req.body.type,
        lockedScreen: req.body.lockedScreen,
        status: SURVEY_STATUS.DRAFT,
        config: req.body.config,
      }

      const survey = new Survey(draftSurvey);
      const draftSaved = await survey.save();
      
      res.json({ survey: draftSaved, success: true })
    } catch (e) {
      console.error('Error creating a draft', e);
      return res.status(500).json({ error: 'Internal server error', success: false });
    }
  })


  // update a draft survey
  app.put('/tenants/:tenantId/draftsurveys', verifyToken, async (req, res) => {
    let tenantId = req.params.tenantId
    if (!tenantId) return res.json({ error: 'Not authorised', status: 401 })
    let isSuperAdmin = req.superadmin
    // only superadmins can create surveys for other tenants
    if (!isSuperAdmin && req.tenantId !== tenantId)
      return res.json({ error: 'Not authorised', status: 401 })
    
    try {
      const draftSurvey = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        tenantId: tenantId,
        compositeKey: `${tenantId}${req.body.id}`,
        studyContact: req.body.studyContact,
        agenda: req.body.agenda,
        type: req.body.type,
        lockedScreen: req.body.lockedScreen,
        status: SURVEY_STATUS.DRAFT,
        config: req.body.config,
      }

      //only if it exists => use only for updates not for creating new
      const draftSaved = await Survey.findOneAndUpdate(
        { compositeKey: draftSurvey.compositeKey, status: SURVEY_STATUS.DRAFT },
        draftSurvey,
        { new: true, runValidators: true }
      )
      if(!draftSaved) return res.json({ error: 'Survey does not exist or is not a draft', success: false })
      res.json({ survey: draftSaved, success: true })
    } catch (e) {
      console.error('Error updating a draft', e);
      return res.status(500).json({ error: 'Internal server error', success: false });
    }
  })

  // delete a draft survey by compositeKey
  app.delete(
    '/tenants/:tenantId/draftsurveys/:draftSurveyId',
    verifyToken,
    async (req, res) => {
      let tenantId = req.tenantId
      if (!tenantId) return res.json({ error: 'Not authorised', status: 401 })
      let isSuperAdmin = req.superadmin
      // only superadmins can delete surveys for other tenants
      if (!isSuperAdmin && req.tenantId !== tenantId)
        return res.json({ error: 'Not authorised', status: 401 })

      try {
        const report = await Survey.deleteOne({
          compositeKey: `${req.tenantId}${req.params.draftSurveyId}`,
          status: SURVEY_STATUS.DRAFT,
        })
        res.json({ ...report, success: true })
      } catch (e) {
        console.error('Error deleting a draft', e);
        return res.status(500).json({ error: 'Internal server error', success: false });
      }
    }
  )

  // get a draft survey by composite key for testing
  app.get(
    '/tenants/:tenantId/draftsurveys/:surveyId',
    async (req, res) => {
      try {
        let draftSurvey = await Survey.findOne({
          compositeKey: `${req.params.tenantId}${req.params.surveyId}`,
          status: SURVEY_STATUS.DRAFT,
        })
        if (!draftSurvey) return res.json({ error: 'Not found', success: false })
        res.json({ survey: draftSurvey, success: true })
      } catch (e) {
        console.error('Error getting a draft', e);
        return res.status(500).json({ error: 'Internal server error', success: false });
      }
  });

  // get a draft survey by id for a tenant/admin
  app.get(
    '/tenants/:tenantId/draftsurveys/:draftSurveyId',
    verifyToken,
    async (req, res) => {
      try {
        let draftSurvey = await Survey.findOne({
          id: req.params.draftSurveyId,
          tenantId: req.params.tenantId,
          status: SURVEY_STATUS.DRAFT,
        })
        if (!draftSurvey) return res.json({ error: 'Not found', success: false })
        if (draftSurvey.tenantId !== req.tenantId)
          return res.json({ error: 'Restricted', success: false })
        res.json({ survey: draftSurvey, success: true })
      } catch (e) {
        console.error('Error getting a draft', e);
        return res.status(500).json({ error: 'Internal server error', success: false });
      }
    }
  )

  //////////////////// SURVEYS ////////////////////

  // initialise a new survey
  // not needed unless some survey is created directly by superadmin
  app.post('/tenants/:tenantId/surveys', verifyToken, async (req, res) => {
    let tenantId = req.params.tenantId
    if (!tenantId) return res.json({ error: 'Not authorised', status: 401 })
    let isSuperAdmin = req.superadmin
    // only superadmins can create surveys for other tenants
    if (!isSuperAdmin && req.tenantId !== tenantId)
      return res.json({ error: 'Not authorised', status: 401 })
    if (isSuperAdmin) tenantId = req.body.tenantId || req.tenantId

    const validationError = validateSuvey(req.body)
    if (validationError) return res.json({ error: validationError, success: false })
    
    try {
      const surveyBody = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        tenantId: tenantId,
        compositeKey: `${tenantId}${req.body.id}`,
        studyContact: req.body.studyContact,
        agenda: req.body.agenda,
        type: req.body.type,
        lockedScreen: req.body.lockedScreen,
        status: SURVEY_STATUS.PUBLISHED,
        config: req.body.config,
      }
      const survey = new Survey(surveyBody);
      const surveySaved = await survey.save();

      res.json({ survey: surveySaved, success: true})
    } catch (e) {
      console.error('Error creating a survey', e);
      return res.status(500).json({ error: 'Internal server error', success: false });
    }
  })

  // get a survey by id for a tenant/admin
  app.get('/tenants/:tenantId/surveys/:surveyId', verifyToken, async (req, res) => {
    try {
      let survey = await Survey.findOne({
        id: req.params.surveyId,
        tenantId: req.params.tenantId,
      }).populate({
        path: 'experts',
        select:
          'name email status updatedAt surveyUrl surveyId tenantId responses ignoreQuestions questionCount completedCount locked',
      })

      survey.experts?.forEach((expert, i) => {
        survey.experts[i].questionCount = survey?.agenda?.filter(
          (q) => (q.pageType == 'question') && !expert.ignoreQuestions.includes(q._id)
        )?.length
        let completedCount = 0
        expert?.responses?.forEach((response) => {
          if (Array.isArray(response.value)) {
            let allCompleted = response.value.every((r) => r.completed);
            if (allCompleted) completedCount++;
          }
          if (expert.ignoreQuestions.includes(response.questionId)) return
          if (response.value?.completed) completedCount++
        })
        survey.experts[i].completedCount = completedCount
      })

      if (!survey) return res.json({ error: 'Not found', success: false })
      if (survey?.config?.public) return res.json({ survey: survey, success: true })
      if (survey.tenantId !== req.tenantId)
        return res.json({ error: 'Restricted', success: false })
      res.json({ survey: survey, success: true })
    } catch (e) {
      console.error('Error getting a survey', e);
      return res.status(500).json({ error: 'Internal server error', success: false });
    }
  })


  // delete a survey by id
  app.delete(
    '/tenants/:tenantId/surveys/:surveyId',
    verifyToken,
    async (req, res) => {
      let session;
      let tenantId = req.tenantId
      if (!tenantId) return res.json({ error: 'Not authorised', status: 401 })
      let isSuperAdmin = req.superadmin
      // only superadmins can delete surveys for other tenants
      if (!isSuperAdmin && req.tenantId !== tenantId)
        return res.json({ error: 'Not authorised', status: 401, success: false })

      try {
        const survey = await Survey.findOne({
          compositeKey: `${req.params.tenantId}${req.params.surveyId}`,
        }).populate('experts')
        if (!survey) return res.json({ error: 'Not found', success: false })
        
        session = await mongoose.startSession();
        session.startTransaction();
        
        // save all data in trash collection
        const trash = new Trash({
          tenantId: survey.tenantId,
          surveyId: survey.id,
          documentType: 'survey',
          documentId: survey._id,
          document: survey,
          user: req.username,
        })
        await trash.save({ session });

        const report = await Survey.deleteOne({
          id: req.params.surveyId,
          tenantId: req.params.tenantId,
        }).session(session) 

        const experts = survey.experts
        let expertsDeleted = 0
        // must be for loop bc of transaction
        for (let expert of experts) {
          const expertData = await Expert.findOne({ _id: expert._id })
          const expertTrash = new Trash({
            tenantId: expert.tenantId,
            surveyId: expert.surveyId,
            documentType: 'expert',
            documentId: expert._id,
            document: expertData,
            user: req.username,
          })
          await expertTrash.save({ session });
          await Expert.deleteOne({ _id: expert._id }).session(session)
          expertsDeleted++
        }
        await session.commitTransaction();
        session.endSession();
        res.json({ ...report, success: true, expertsDeleted })
      } catch (e) {
        console.error('Error deleting a survey', e);
        try {
          if (session && !session.hasEnded) { 
            await session.abortTransaction();
            session.endSession();
          }
        } catch (e) {
          console.error('Error aborting transaction', e);
        }
        return res.status(500).json({ error: e || 'Internal server error', success: false });
      }
    }
  )
}

module.exports = { surveysApi }
