const { Survey } = require('../database/survey.model')
const { Tenant } = require('../database/tenant.model')
const { mdToPdf } = require('md-to-pdf')
const {
  yamlHeader,
  makePageBreak,
  makeTitlePage,
  makeIntro,
  makeGeneralInfo,
  makeRouletteInfo,
  makeMinMaxBestInfo,
  cssStyle,
} = require('../assets/compliancePdfContents')

function niceQuestionName(questionType) {
  switch (questionType) {
    case 'roulette':
      return 'Roulette Question'
    case 'workshopprobability':
      return 'Probability Method Question'
    case 'matrix':
      return 'Matrix Question'
    case 'radiolikert':
      return 'Radio Likert Question'
    case 'radio':
      return 'Radio Question'
    case 'checkbox':
      return 'Checkbox Question'
    case 'text':
      return 'Short Text Question'
    case 'textarea':
      return 'Long Text Question'
    case 'number':
      return 'Number Question'
    case 'minMaxBest':
      return 'Min-Max-Best Question'
    case 'radiorich':
      return 'Single Extended Choice Question'
    case 'table':
      return 'Question Table'
    default:
      return 'Other Question'
  }
}

function nicePageName(viewId) {
  switch (viewId) {
    case 'WelcomePage':
      return 'Welcome Page'
    case 'BackgroundPage':
      return 'Intro Page'
    case 'SubmitPage':
      return 'Submit Page'
    case 'ValidateRouletteConditional':
      return 'Validation Page'
    case 'ValidateMinMaxBest':
      return 'Validation Page'
    case 'ValidateProbabilityMethod':
      return 'Validation Page'
    case 'LockedPage':
      return 'Outro Page'
    default:
      return 'Other Page'
  }
}

function niceItemName(item) {
  if (item.pageType === 'question') {
    return niceQuestionName(item.content.questionType)
  } else {
    return nicePageName(item.viewId)
  }
}

function processItems(items, markdownContent) {
  items.forEach((item, index) => {
    const c_ = item.content
    const itemTitle = index + 1 + ' ' + niceItemName(item)
    markdownContent += `<div class="agendaItem-container">`
    markdownContent += `<div class="agendaItem-title">${itemTitle}</div>`
    markdownContent += `<div class="agendaItem">`
    if (c_.title) markdownContent += `<h3>${c_.title}</h3>\n\n`
    if (c_.body) markdownContent += `${c_.body}\n\n`
    if (c_.abovePdf?.title) markdownContent += `<h3>${c_.abovePdf.title}</h3>\n\n`
    if (c_.abovePdf?.body) markdownContent += `${c_.abovePdf.body}\n\n`
    if (c_.belowPdf?.title) markdownContent += `<h3>${c_.belowPdf.title}</h3>\n\n`
    if (c_.belowPdf?.body) markdownContent += `${c_.belowPdf.body}\n\n`
    if (c_.note) markdownContent += `${c_.note}\n\n`
    if (c_.questionTitle) markdownContent += `<h4>${c_.questionTitle}</h4>`
    if (c_.description) markdownContent += `${c_.description}\n\n`


    if (c_.picot) {
      markdownContent += `<h4>PICOT Information:</h4>\n`
      markdownContent += `<ul>\n`
      if (c_.picot.populationDescription) markdownContent += `<li>Population: ${c_.picot.populationDescription}</li>\n`
      if (c_.picot.interventionDescription) markdownContent += `<li>Intervention: ${c_.picot.interventionDescription}</li>\n`
      if (c_.picot.comparisonDescription) markdownContent += `<li>Comparison: ${c_.picot.comparisonDescription}</li>\n`
      if (c_.picot.outcomeDescription) markdownContent += `<li>Outcome: ${c_.picot.outcomeDescription}</li>\n`
      if (c_.picot.timeDescription) markdownContent += `<li>Time: ${c_.picot.timeDescription}</li>\n`
      markdownContent += `</ul>\n`
    }

    if (c_.options) {
      markdownContent += `<ul>\n`
      c_.options.forEach((option) => {
        if (c_.questionType === 'radiolikert' || c_.questionType === 'radiorich') {
          if (option.description) {
            markdownContent += `<li><b>${option.title}</b>: ${option.description}</li>\n`
          } else {
            markdownContent += `<li><b>${option.title}</b></li>\n`
          }
        } else {
          markdownContent += `<li>${option.text}</li>\n`
        }
      })
      if (c_.other) markdownContent += `<li>Other: ${c_.otherLabel}</li>\n`
      markdownContent += `</ul>\n`
    }
    if (c_.min != undefined || c_.xMinLimit != undefined)
      markdownContent += `<span class="bold">Min:</span> ${c_.min != undefined ? c_.min : c_.xMinLimit}\n`
    if (c_.max != undefined || c_.xMaxLimit != undefined)
      markdownContent += `<span class="bold">Max:</span> ${c_.max != undefined ? c_.max : c_.xMaxLimit}\n`


    if (c_.questionType === 'matrix') {
      markdownContent += `<br>\n`
      markdownContent += `<br>\n`

      markdownContent += `<table class="matrix-table">\n`
      
      markdownContent += `<tr>\n`
      markdownContent += `<th>Statement</th>\n`
      c_.columns.forEach((column) => {
        markdownContent += `<th>${column}</th>\n`
      })
      markdownContent += `</tr>\n`
    
      c_.rows.forEach((row) => {
        markdownContent += `<tr>\n`
        markdownContent += `<td>${row}</td>\n`
        
        c_.columns.forEach(() => {
          markdownContent += `<td></td>\n`
        })
    
        markdownContent += `</tr>\n`
      })
    
      markdownContent += `</table>\n`
    }

    markdownContent += `</div></div>`
  })
  // prevent unintention code chunk rendering
  markdownContent = markdownContent.replace(/\n\s{20,}/g, '\n')
  return markdownContent
}


const processLockedPage = (outro, markdownContent) => {
  
  if (outro && outro.content) {
    markdownContent += `<div class="agendaItem-container">`
    markdownContent += `<div class="agendaItem-title">Submission / Survey locked Page</div>\n`
    markdownContent += `<div class="agendaItem">`
    if (outro.content.title) markdownContent += `<h4>${outro.content.title}</h4>\n`
    if (outro.content.body) markdownContent += `${outro.content.body}\n`
    if (outro.content.subtitle) markdownContent += `<div>${outro.content.subtitle}</div>\n`
    if (outro.content.contactNote) markdownContent += `<div class="text-gray mt-2">${outro.content.contactNote}</div>\n`
    markdownContent += `<ul>\n`
    if (outro.content.contactPerson) markdownContent += `<li><span class="bold">Name:</span> ${outro.content.contactPerson}</li>\n`
    if (outro.content.contactOrganisation) markdownContent += `<li><span class="bold">Organisation:</span> ${outro.content.contactOrganisation}</li>\n`
    if (outro.content.contactEmail) markdownContent += `<li><span class="bold">Email:</span> ${outro.content.contactEmail}</li>\n`
    markdownContent += `</ul>\n`
    markdownContent += `</div></div>`
  }

  return markdownContent
}
  
  


async function createCompliancePDF(tenantId, surveyId) {
  try {
    const survey = await Survey.findOne({ id: surveyId, tenantId })
    if (!survey) return { error: 'Survey not found', success: false }

    const tenant = await Tenant.findOne({ id: tenantId })
    if (!tenant) return { error: 'Tenant not found', success: false }

    const data = {
      surveyID: survey.id,
      tenantName: tenant.name,
      userName: survey.studyContact.name,
      surveyTitle: survey.name,
      lastUpdated: survey.updatedAt.toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
    }

    let content = yamlHeader
    content += cssStyle
    content += makeTitlePage(data)
    content += makePageBreak()
    content += makeIntro(data)
    content += makeGeneralInfo(data)

    const anyRoulette = survey.agenda.some(
      (item) => item.viewId === 'QuestionRoulette'
    )
    if (anyRoulette) {
      content += makePageBreak()
      content += makeRouletteInfo(data)
    }

    const anyMinMaxBest = survey.agenda.some(
      (item) => item.viewId === 'QuestionMinMaxBest'
    )
    if (anyMinMaxBest) {
      content += makePageBreak()
      content += makeMinMaxBestInfo(data)

    }

    content += makePageBreak()
    content += `<h1>B) Survey Content</h1>`
    content = processItems(survey.agenda, content)
    content = processLockedPage(survey.lockedScreen, content)

    // PS: LAUNCH OPTIONS ARE USED TO MAKE PUPPETEER WORK ON UBUNTU EC2, NEED TO REVIEW THIS IN THE FUTURE, BECAUSE IT MAY CAUSE SECURITY ISSUES TO NOT USE SANDBOX
    const config = {
      launch_options: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    }
    const pdf = await mdToPdf({ content }, config)
    return pdf
  } catch (err) {
    return { error: err.message || err, success: false }
  }
}

function validateSuvey(survey) {
  // PS: TO BE EXTENDED
  if (!survey.id) return 'No id provided'
  if (!survey.name) return 'No name provided'
  if (!survey.name.length) return 'No name provided'
  if (!survey.studyContact) return 'No studyContact provided'
  if (!survey.studyContact.name) return 'No studyContact name provided'
  if (!survey.studyContact.name.trim().length) return 'No studyContact name provided'
  if (!survey.studyContact.email) return 'No studyContact email provided'
  if (!survey.agenda) return 'No agenda provided'

  if (survey.agenda.length > 2) {
    // checks each agenda item has viewId and unique pageId
    let pageIds = []
    for (let i = 0; i < survey.agenda.length; i++) {
      if (!survey.agenda[i].viewId) return `No viewId provided for agenda item ${i}`
      if (!survey.agenda[i].pageId) return `No pageId provided for agenda item ${i}`
      if (pageIds.includes(survey.agenda[i].pageId))
        return `Duplicate pageId ${survey.agenda[i].pageId} found`
      pageIds.push(survey.agenda[i].pageId)
    }
  } else
    return 'Agenda must have at least 3 items: an introduction, a submission page and at least one question or task.'

  return null
}

module.exports = {
  createCompliancePDF,
  validateSuvey,
}
