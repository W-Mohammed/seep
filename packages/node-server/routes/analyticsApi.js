const { verifyToken } = require('../auth/authMiddleware')
const axios = require('axios')
const { Survey } = require('../database/survey.model')
const { extractExpertDataForTable } = require('../utils/dataFormatters')
const analyticsApi = function (app) {


  app.get('/analytics/probabilityfit', async (req, res) => {
    
    let { values, probabilities, xMin, xMax, nx } = req.query;
    if (!values || !probabilities) {
      return res.json({ error: 'Values and probabilities are required', success: false })
    }
    values = values.split(',').map(Number)
    probabilities = probabilities.split(',').map(Number)
    if (xMin != null) xMin = parseFloat(xMin)
    if (xMax != null) xMax = parseFloat(xMax)
    if (nx != null) nx = parseInt(nx)
      
  try {
    const out = await axios.post(process.env.R_SERVER_HOST + '/shelf/probabilityfit', {
      values,
      probabilities,
      xMin,
      xMax,
      nx,
    })
      if (!out.data) {
        return res.json({ error: 'No response from R', success: false })
      }
      const response = JSON.parse(out.data)
      return res.json({ data: response, success: response.success })
  } catch (e) {
      res.json({ error: 'An error occurred', success: false, e })
    }
});


  // get chips and bins analytics for a question
  app.get(
    '/tenants/:tenantId/surveys/:surveyId/experts/:expertId/responses/:questionId/analytics/chipsandbins',
    verifyToken,
    async (req, res) => {
      // get query params
      const { tenantId, surveyId, expertId, questionId } = req.params
      const excludeExperts = req.query.excludeExperts || []
      const model = req.query.model !== undefined ? req.query.model : 'best'
      const nx = req.query.nx || 100

      // check if expertId is pooled
      if (expertId !== 'pooled')
        res.json({
          error: 'Option deprecated - use expertId=pooled',
          success: false,
        })

      // retrieve experts and their responses from the db
      const surveyExperts = await Survey.findOne({
        tenantId: tenantId,
        id: surveyId,
      })
        .select('experts agenda')
        .populate({
          path: 'experts',
          select: 'name status responses ignoreQuestions',
        })
        .lean()
      
      
      const question = surveyExperts.agenda.find(
        (question) => question._id.toString() === questionId
      )
      
      if (!question || question.viewId !== 'QuestionRoulette')
        return res.json({
      error: 'This is not a Roulette / Chips-and-Bins question.',
      success: false,
      })
      
      const xMinLimit = question?.content?.xMinLimit
      const xMaxLimit = question?.content?.xMaxLimit
      
      // exclude archived, deleted and manually excluded experts
      let experts = surveyExperts?.experts
      experts = experts?.filter(
        (expert) =>
          expert.status !== 'archived' &&
          expert.status !== 'deleted' &&
          !expert.ignoreQuestions?.map((q) => q.toString())?.includes(questionId) &&
          !excludeExperts.includes(expert._id.toString())
      )

      if (!experts || experts.length === 0)
        return res.json({ error: 'No experts found', success: false })

      // create rich expertData obj
      const expertData = {}
      experts.forEach((expert) => {
        let expertResponse = expert.responses.find(
          (response) => response.questionId.toString() === questionId
        )?.value
        if (expertResponse) {
          expertData[expert._id] = expertResponse
          expertData[expert._id].name = expert.name
        }
      })
      

      if (Object.keys(expertData).length === 0) {
        return res.json({
          error: 'No expert responses found for this question',
          success: false,
        })
      }

      // remove experts without chips from the expertData obj
      Object.keys(expertData).forEach((expertId) => {
        if (expertData[expertId]?.chips?.length === 0) {
          delete expertData[expertId]
        } else if (expertData[expertId]?.chips?.reduce((a, b) => a + b, 0) === 0) {
          delete expertData[expertId]
        }
      })

      if (Object.keys(expertData).length === 0) {
        return res.json({
          error: 'No expert responses found for this question',
          success: false,
        })
      }
   
      const RServerHost = process.env.R_SERVER_HOST
      try {
        let response = await axios.post(RServerHost + '/shelf/chipsandbins', {
          expertData,
          model,
          nx,
          xMinLimit,
          xMaxLimit,
        })
        response = JSON.parse(response?.data)
        if (!response?.data || response.success === false) {
          return res.json({
            error: response?.error || 'An error occurred',
            success: false,
          })
        }
        Object.keys(response?.data)?.forEach((expertId) => {
          if (!expertData[expertId]) return
          response.data[expertId].rationale = expertData[expertId].rationale
          response.data[expertId].comment = expertData[expertId].comment
        })

        return res.json(response)
      } catch (e) {
        try {
          console.log('Error:', e.error || e)
          return res.json({ error: 'An error occurred (1)', success: false, e })
        } catch (e2) {
          return res.json({ error: 'An error occurred (2)', success: false, e2 })
        }
      }
    }
  )

  // get 1,000-10,000 PSA samples from the linear pool
  // get chips and bins analytics for a question
  app.get(
    '/tenants/:tenantId/surveys/:surveyId/experts/pooled/responses/:questionId/analytics/chipsandbins/psa',
    verifyToken,
    async (req, res) => {
      // get query params
      const { tenantId, surveyId, questionId } = req.params
      const excludeExperts = req.query.excludeExperts || []
      const psaSamples = req.query.psaSamples || 1000
      const model = req.query.model !== undefined ? req.query.model : 'best'

      // retrieve experts and their responses from the db
      const surveyExperts = await Survey.findOne({
        tenantId: tenantId,
        id: surveyId,
      })
        .select('experts agenda')
        .populate({
          path: 'experts',
          select: 'name status responses ignoreQuestions',
        })
        .lean()
      
      
        const question = surveyExperts.agenda.find(
          (question) => question._id.toString() === questionId
        )
        const xMinLimit = question?.content?.xMinLimit
        const xMaxLimit = question?.content?.xMaxLimit

      // exclude archived, deleted and manually excluded experts
      let experts = surveyExperts?.experts
      experts = experts?.filter(
        (expert) =>
          expert.status !== 'archived' &&
          expert.status !== 'deleted' &&
          !expert.ignoreQuestions?.map((q) => q.toString())?.includes(questionId) &&
          !excludeExperts.includes(expert._id.toString())
      )

      if (!experts || experts.length === 0)
        return res.json({ error: 'No experts found', success: false })

      // create rich expertData obj
      const expertData = {}
      experts.forEach((expert) => {
        let expertResponse = expert.responses.find(
          (response) => response.questionId.toString() === questionId
        )?.value
        if (expertResponse) {
          expertData[expert._id] = expertResponse
          expertData[expert._id].name = expert.name
        }
      })

      if (Object.keys(expertData).length === 0) {
        return res.json({
          error: 'No expert responses found for this question',
          success: false,
        })
      }

      // remove experts without chips from the expertData obj
      Object.keys(expertData).forEach((expertId) => {
        if (expertData[expertId]?.chips?.length === 0) {
          delete expertData[expertId]
        } else if (expertData[expertId]?.chips?.reduce((a, b) => a + b, 0) === 0) {
          delete expertData[expertId]
        }
      })

      if (Object.keys(expertData).length === 0) {
        return res.json({
          error: 'No expert responses found for this question',
          success: false,
        })
      }


      

      try {
        const RServerHost = process.env.R_SERVER_HOST
        let response = await axios.post(RServerHost + '/shelf/chipsandbinspsa', {
          expertData,
          model,
          psaSamples,
          xMinLimit,
          xMaxLimit,
        })
        response = JSON.parse(response.data)
        if (!response?.data || response.success === false) {
          return res.json({
            error: response.error || 'An error occurred',
            success: false,
          })
        }
        return res.json(response)
      } catch (e) {
        try {
          return res.json({ error: 'An error occurred (1)', success: false, message: e.message || e.error || 'e'})
        } catch (e2) {
          return res.json({ error: 'An error occurred (2)', success: false, e2 })
        }
      }
    }
  )


  // get raw data dump for a survey
  app.get(
    '/tenants/:tenantId/surveys/:surveyId/rawdatadump',
    verifyToken,
    async (req, res) => {
      const { tenantId, surveyId } = req.params

      try {
        const surveyAndExperts = await Survey.findOne({
          tenantId: tenantId,
          id: surveyId,
        })
          .populate({
            path: 'experts',
            select: 'name status responses',
          })
          .lean()

        
        const agenda = surveyAndExperts?.agenda
        if (!agenda || agenda.length === 0)
          return res.json({ error: 'No questions found', success: false })

        const experts = surveyAndExperts?.experts
        if (!experts || experts.length === 0)
          return res.json({ error: 'No experts found', success: false })


        const dataDump = experts.map((expert) => {
          const rawData = [
            {
              _columnName: '_',
              expertId: expert._id,
              expertName: expert.name,
              status: expert.status,
              email: expert.email,
            }
          ]
          agenda.forEach((item, index) => {
            if (item.pageType === 'question') {
              const response = expert.responses?.find((resp) => {
                return resp.questionId.toString() === item._id.toString()
              })
              const expertData = extractExpertDataForTable(item, response?.value)



              const resp = {
                _columnName: 'q' + (index + 1),
                type: item.content?.questionType,
                question: item.content?.questionTitle,
                ...expertData
              }

              rawData.push(resp)
            }
          })
          return rawData
        })
        return res.json({ data: dataDump, success: true })
      } catch (e) {
        console.log('Error:', e.error || e)
        return res.json({ error: 'An error occurred', success: false, e })
      }
    }
  )
}

module.exports = { analyticsApi }
