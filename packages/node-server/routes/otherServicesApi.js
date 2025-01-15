const { verifyToken } = require('../auth/authMiddleware.js')
const { createCompliancePDF } = require('../services/survey.service.js')
const { Tenant } = require('../database/tenant.model.js')
const { isAuthorised } = require('../utils/authUtils.js')
const { prettyHealthCheck } = require('../utils/prettyHealthCheck.js')
const axios = require('axios')
const RServerHost = process.env.R_SERVER_HOST
const clientHost = process.env.CLIENT_HOST

const otherServicesApi = function (app) {

  //health check of node, mongo and r servers
  app.get('/health', async (req, res) => {
    const response = {
      node: 'OK',
      mongo: 'ERROR',
      r: 'ERROR',
      webapp: 'ERROR',
      success: true,
      status: 200
    }
    try {
      
      const startMongo = Date.now();
      await Tenant.findOne().then((data) => {
        response.mongo = {
          status: 'OK',
          delay: Date.now() - startMongo + 'ms'
        }
      }).catch((err) => {
        response.mongo = {
          status: 'ERROR',
          error: err,
          delay: Date.now() - startMongo + 'ms'
        }
      });

      const startR = Date.now();
      await axios.get(RServerHost + '/').then((rResponse) => {
        if (rResponse.status === 200) {
          response.r = {
            status: 'OK',
            delay: Date.now() - startR + 'ms'
          }
        } else {
          response.r = {
            status: 'ERROR',
            error: rResponse.message || rResponse.statusText,
            delay: Date.now() - startR + 'ms'
          }
        }
      }).catch((err) => {
        response.r = {
          status: 'ERROR',
          error: err,
          delay: Date.now() - startR + 'ms'
        }
      });


      const startWebapp = Date.now();
      await axios.get(clientHost).then((webappResponse) => {
        if (webappResponse.status === 200) {
          response.webapp = {
            status: 'OK',
            delay: Date.now() - startWebapp + 'ms'
          }
        }
      }).catch((err) => {
        response.webapp = {
          status: 'ERROR',
          error: err,
          delay: Date.now() - startWebapp + 'ms'
        }
      });


      const html = prettyHealthCheck(response)
      return res.send(html)

    } catch (err) {
      console.error('Error in health check', err)
      return res.json({ error: err, success: false, data: response })
    }
  })


  // get a survey documentation PDF for compliance
  app.get(
    '/tenants/:tenantId/surveys/:surveyId/compliancepdf',
    verifyToken,
    async (req, res) => {
          
      if (!isAuthorised(req)) return res.json({ error: 'Not authorised', status: 401 })
        
      try {
        const pdf = await createCompliancePDF(
          req.params.tenantId,
          req.params.surveyId
        )
        if (!pdf) return res.status(404).json({ error: 'Survey not found', success: false })
        if (pdf.error) return res.status(404).json({ error: pdf.error, success: false })
          
        return res.status(200).json({ success: true, data: pdf })
      } catch (e) {
        console.error('Error creating compliance PDF', e)
        return res
          .status(500)
          .json({ error: e.message || e, success: false })
      }
    }
  )


}

module.exports = { otherServicesApi }
