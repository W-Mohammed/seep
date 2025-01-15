const { Expert } = require("../database/expert.model");

const responsesApi = function (app) {
  // create/update a question response for an expert
  app.post(
    "/tenants/:tenantId/surveys/:surveyId/experts/:expertId/responses",
    async (req, res) => {

      if (req.params.expertId === 'test') {
        return res.json({ error: "Data not saved for test user", success: false });
      }
      try {
        let expert = await Expert.findOne({
          _id: req.params.expertId,
        });
        if (!expert) {
          return res.json({ error: "Expert not found", success: false });
        }
        if (expert.locked) {
          return res.json({
            error: "Expert's survey is locked, changes are not allowed",
            success: false,
          });
        }

        const { _id, response, lastVisitedPageIndex } = req.body;

        if (
          (!_id || response === undefined) &&
          lastVisitedPageIndex === undefined
        ) {
          return res.json({
            error:
              "(response) _id and response or lastVisitedPageIndex are required",
            success: false,
          });
        }
        let responseIndex;
        if (_id && response !== undefined) {
          responseIndex = expert.responses.findIndex(
            (resp) => resp.questionId.toString() === _id
          );
          if (responseIndex > -1) {
            expert.responses[responseIndex].value = response;
          } else {
            expert.responses.push({
              questionId: _id,
              value: response,
            });
            responseIndex = expert.responses.length - 1;
          }
        }
        if (typeof lastVisitedPageIndex === "number") {
          expert.lastVisitedPageIndex = lastVisitedPageIndex;
        }
        await expert.save();

        return res.json({
          success: true,
        });
      } catch (e) {
        res.json({ error: e, success: false });
      }
    }
  );

  // get all responses for an expert
  app.get(
    "/tenants/:tenantId/surveys/:surveyId/experts/:expertId/responses",
    async (req, res) => {
      try {
        let expert = await Expert.findOne({
          _id: req.params.expertId,
        });
        if (!expert)
          return res.json({ error: "Expert not found", success: false });
        res.json({ responses: expert.responses, success: true });
      } catch (e) {
        res.json({ error: e, success: false });
      }
    }
  );


  // get a specific response for an expert
  app.get(
    "/tenants/:tenantId/surveys/:surveyId/experts/:expertId/responses/:questionId",
    async (req, res) => {
      try {
        let expert = await Expert.findOne({
          _id: req.params.expertId,
        });
        if (!expert)
          return res.json({ error: "Expert not found", success: false });
        let response = expert.responses.find(
          (resp) => resp.questionId.toString() === req.params.questionId
        );
        if (!response)
          return res.json({ error: "Response not found", success: false });
        res.json({ response, success: true });
      } catch (e) {
        res.json({ error: e, success: false });
      }
    }
  );

};

module.exports = { responsesApi };
