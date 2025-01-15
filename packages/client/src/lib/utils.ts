import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from 'vue-sonner'
import { viridis } from '@/lib/colors'

import { onMounted } from 'vue'

import { getAgendaItemTypes } from '@/lib/addAgendaItemUtils'


const agendaItemTypes = getAgendaItemTypes('all')

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function decomposeRoute(route, queryId, token?) {
  if (!route) return null

  const matchedPath = typeof route === 'string' ? route : route[0]
  const tenantId = matchedPath.split('-')[0] ?? ''
  const surveyId = matchedPath.split('-')[1] ?? ''
  const expertId = typeof queryId === 'string' ? queryId : queryId?.[0] ?? ''

  return { tenantId, surveyId, expertId, token }
}

export const sharedProps = {
  viewId: null,
  pageId: null,
  questionId: null,
  options: {},
  content: {},
}


export const sharedPropsJs = {
  viewId: null,
  pageId: null,
  questionId: null,
  options: {},
  content: {},
}


export function copyToClipboard(text) {
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export async function copyToClipboardWithToast(text) {
  if (!text) throw new Error('Nothing to copy to clipboard.')

  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  } catch (error) {
    toast.error('Error copying to clipboard', {
      description: 'There was an error copying to clipboard. Please try again.',
      style: { background: '#fda4af' }
    })
  }
}

export const expertStates = {
  notContacted: 'Not Contacted',
  contacted: 'Invited',
  // consentObtained: 'Consent Obtained',
  // consentDeclined: 'Consent Declined',
  surveyInvitationSent: 'Invited',
  ongoing: 'Ongoing',
  submitted: 'Submitted',
  withdrawn: 'Withdrawn',
  archived: 'Archived'
}

export const SURVEY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  CLOSED: 'closed',
  DELETED: 'deleted',
}

export const MESSAGE_CODES = {
  PASSWORD_RESET_REQUIRED: 'PASSWORD_RESET_REQUIRED'
}

export function statusBadgeMapper(status) {
  if (!status) return 'bg-gray-500'
  const statusMap = {
    // survey AND expert states

    notContacted: 'bg-slate-50 text-slate-600 border border-slate-400',

    contacted: 'bg-yellow-50 text-yellow-600 border-yellow-400',

    consentObtained: 'bg-blue-100 text-black',
    surveyInvitationSent: 'bg-blue-100 text-black border border-blue-500',

    ongoing: 'bg-teal-50 text-teal-600 border-teal-300',

    active: 'bg-green-100 text-black border border-green-500',

    completed: 'bg-emerald-100 text-green-700 border-green-600',
    Completed: 'bg-emerald-100 text-green-700 border-green-600',
    Submitted: 'bg-emerald-100 text-green-700 border-green-600',
    submitted: 'bg-emerald-100 text-green-700 border-green-600',

    Published: 'bg-emerald-50 text-green-800 border-green-500',
    published: 'bg-emerald-50 text-green-800 border-green-500',

    withdrawn: 'bg-gray-500 text-slate-100 border-gray-900',
    archived: 'bg-gray-500  text-slate-100 border-gray-900',
    Archived: 'bg-gray-500  text-slate-100 border-gray-900',
    // additional survey status
    // draft: 'bg-gray-600 text-white'
  }

  return statusMap[status] || 'bg-gray-500'
}

export function formatDateTime(date) {
  if (!date) return ''
  if (typeof date === 'string') date = new Date(date)
  else if (typeof date === 'number') date = new Date(date)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export function expertToLineStyleMapper(expertNames) {
  if (expertNames.length === 0) return {}
  const themeColors = viridis(expertNames.length < 20 ? expertNames.length : 20)

  let expertColors = expertNames.reduce((acc, expert, index) => {
    const color = themeColors[index % themeColors.length]
    return { ...acc, [expert]: { color, width: 0.5 } }
  }, {})

  expertColors = { ...expertColors, linearPool: { color: '#000000', width: 2 } }

  return expertColors
}

export const downloadTableAsCsv = (tableData) => {
  let csvContent = 'data:text/csv;charset=utf-8,'
  tableData.forEach((rowArray) => {
    // escape commas
    rowArray = rowArray.map((cell) => {
      if (typeof cell === 'string' && cell.includes(',')) {
        return `"${cell}"`
      }
      return cell
    })
    const row = rowArray.join(',')
    csvContent += row + '\r\n'
  })
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'summaryStats.csv')
  document.body.appendChild(link)
  link.click()
}

export function valueUpdater(updaterOrValue, ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}



export const isQuestion = (agendaItem) => {
  if (agendaItem.isQuestion == false) return false
  if (agendaItem.isQuestion == true) return true
  if (agendaItem.pageType === 'question') return true
  return agendaItem?.type === 'question' || agendaItem?.isQuestion || agendaItem?.pageType === 'question'
}

export const isValidation = (agendaItem) => {
  if (agendaItem?.viewId === 'ValidateMinMaxBest') return true
  if (agendaItem?.viewId === 'ValidateProbabilityMethod') return true
  if (agendaItem?.viewId === 'ValidateProbabilityMethodConditional') return true
  else return false
}



export const makeStep = (min, max) => {
  if (min === undefined || max === undefined) return 1
  if (max - min <= 1) return 0.01
  if (max - min <= 10) return 0.1
  if (max - min <= 100) return 1
  if (max - min <= 1000) return 10
  if (max - min <= 10000) return 100
  if (max - min <= 100000) return 1000
  return 1
}


export const textAreaAdjust = (e) => {
  e.target.style.height = '1px'
  e.target.style.height = 2 + e.target.scrollHeight + 'px'
}
export const textAreaAdjustOnStart = async (elementRef) => {
  setTimeout(() => {
    if (Array.isArray(elementRef)) {
      elementRef.forEach((ref) => {
        if (ref.value) ref = ref.value
        if (!ref || !ref.style) return
        ref.style.height = '1px'
        ref.style.height = 2 + ref.scrollHeight + 'px'
      })
      return
    } else {
      if (elementRef.value) elementRef = elementRef.value
      if (!elementRef || !elementRef.style) return
      elementRef.style.height = '1px'
      elementRef.style.height = 2 + elementRef.scrollHeight + 'px'
    }
  }, 50)
}

export const allTextAreaAdjustOnStart = async () => {
  let killSwitch = false
  onMounted(() => {
    setTimeout(() => {
      if (killSwitch) return
      killSwitch = true
      try {
        const textAreas = document.querySelectorAll('textarea')
        textAreas.forEach((textArea) => {
          textArea.style.height = '1px'
          textArea.style.height = 2 + textArea.scrollHeight + 'px'
        })
      } catch (e) {
        console.log('error in textAreaAdjustOnStart', e)
      }
    }, 50)
  })
}

export const labelMapperForAgendaItems = (item, returnQuestionText) => {

  //  function can return the question text or the question type as label

  if (returnQuestionText) {
    if (item.content?.questionText) return item.content.questionText
    else if (item.content?.questionTitle) return item.content.questionTitle
    else if (item.content?.title) return item.content.title
    else if (item.content?.abovePdf?.title) return item.content?.abovePdf?.title
    else return null
  }

  let label
  label = agendaItemTypes.find((itemType) => {
    // PS: QuestionFormKit uses different system <- NEED TO BE FIXED!
    if (item.viewId === 'QuestionFormKit') {
      if (item.content?.questionType === itemType.value) return true
    } else {
      if (itemType.viewId === item.viewId) return true
    }
  })
  if (label) return label.text
  else if (item.viewId === 'WelcomePage') return 'Welcome'
  else if (item.viewId === 'WorkshopWelcome') return 'Welcome'
  else if (item.viewId === 'SubmitPage') return 'Last Page'
  else if (item.viewId === 'LockedPage') return 'Completion Note'
  else if (item.viewId === 'ValidateRoulette') return 'Validate Roulette'
  else if (item.viewId === 'ValidateRouletteConditional') return 'Validate Roulette'
  else if (item.viewId === 'ValidateMinMaxBest') return 'Validate Low-High-Best'
  else if (item.viewId === 'ValidateProbabilityMethod') return 'Validate Probability Method'
  else if (item.viewId === 'ValidateProbabilityMethodConditional') return 'Validate Probability Method'
  else if (item.viewId === 'QuestionTable') return 'Question Table'
  else return 'Other Page'
}


export const agendaItemsLabeller = (agenda) => {
  if (!agenda) return []

  return agenda.map((item, index) => {
    let qType = labelMapperForAgendaItems(item)
    let pageOrQuestion = isQuestion(item) ? 'Question' : 'Page'
    let label = (index + 1) + ' ' + qType
    let labelAlt1 = (index + 1) + ' ' + qType
    let labelAlt2 = labelMapperForAgendaItems(item, true) || ''
    let out = {
      label,
      labelAlt1,
      labelAlt2,
      index,
      isQuestion: isQuestion(item),
      isValidation: isValidation(item),
      isTutorial: qType === 'Tutorial' || qType === 'tutorial',
      qType
    }
    return out
  })
}


export const mergeSections = (agenda) => {
  const newAgenda = []
  agenda.forEach((item, i) => {
    item = JSON.parse(JSON.stringify(item))
    if (item.children && item.children.length) {
      item.children.forEach((child) => {
        child.content.sectionTitle = item.content?.sectionTitle
        child.content.sectionDescription = item.content?.sectionDescription
        child.parent = item
        child.parent.children = []
        child.isChild = true
        newAgenda.push(child)
      })
    } else {
      item.isChild = false
      item.parent = null
      newAgenda.push(item)
    }
  })
  return newAgenda
}

export const unMergeSections = (agenda) => {
  let newAgenda = []
  let currentSection = null
  agenda.forEach((item) => {
    if (item.parent && item.parent.pageId) {
      if (item.parent.pageId !== currentSection) {

        currentSection = item.parent.pageId
        newAgenda.push(item.parent)
        newAgenda[newAgenda.length - 1].children = []
      }
      item.parent = null
      newAgenda[newAgenda.length - 1].children.push(item)
    } else {
      newAgenda.push(item)
    }
  })
  return newAgenda
}

export const tidyAgenda = (surveyData) => {
  if (!surveyData || !surveyData.agenda) return []
  let agenda = unMergeSections(surveyData.agenda)
  let agendaItemLabels = agendaItemsLabeller(agenda)
  return agenda.map((item, index) => {
    const adminLabel = agendaItemLabels[index].label
    const qType = labelMapperForAgendaItems(item)
    const pageOrQuestion = isQuestion(item) ? 'Question' : 'Page'
    const label = (index + 1) + ' ' + qType
    const labelAlt1 = (index + 1) + ' ' + qType
    const labelAlt2 = labelMapperForAgendaItems(item, true) || ''
    return {
      pageId: item.pageId,
      _id: item._id,
      adminLabel: adminLabel,
      labelAlt1: labelAlt1,
      labelAlt2: labelAlt2,
      isQuestion: item.isQuestion === true || item.pageType === 'question',
      isValidation: isValidation(item),
      questionType: item.questionType || item.content?.questionType,
      mandatory:
        index === 0 || item.mandatory || index === agenda.length - 1
    }
  })
}


export const tidyQuestions = (surveyData) => {
  if (!surveyData || !surveyData.agenda) return []
  const agendaItemLabels = agendaItemsLabeller(surveyData.agenda)
  let x = surveyData.agenda.map((item, index) => {
    return { ...item, adminLabel: agendaItemLabels[index].label }
  }).filter((item) => item.isQuestion || item.pageType === 'question' || isValidation(item))
  return x
}

export const interpolateForProbabilityMethod = (points, query) => {
  const data = [
    [points.min, 0],
    [points.val25, points.prob25],
    [points.val50, points.prob50],
    [points.val75, 100 - points.prob75],
    [points.max, 100]
  ]

  return query.map(y => findXForY(y, data));
}

function findXForY(y, data) {
  for (let i = 0; i < data.length - 1; i++) {
    const [x1, y1] = data[i]
    const [x2, y2] = data[i + 1]

    if (y >= y1 && y <= y2) {
      const x = x1 + (y - y1) * ((x2 - x1) / (y2 - y1))
      return x.toFixed(2)
    }
  }
  return null
}

export const drawErrorBardsForMinMaxBest = (i, res, col) => {
  return function (params, api) {
    const xValue = api.value(0)
    const highPoint = api.coord([xValue, i])
    const lowPoint = api.coord([res.value.min, i])
    const halfWidth = 5
    const style = api.style({
      stroke: col,
      fill: col,
      lineWidth: 2,
    })
    return {
      type: 'group',
      children: [
        {
          type: 'line',
          shape: {
            x1: highPoint[0],
            y1: highPoint[1] - halfWidth,
            x2: highPoint[0],
            y2: highPoint[1] + halfWidth
          },
          style: style,
        },

        {
          type: 'line',
          shape: {
            x1: lowPoint[0],
            y1: lowPoint[1] - halfWidth,
            x2: lowPoint[0],
            y2: lowPoint[1] + halfWidth
          },
          style: style
        }
      ]
    }
  }
}



export const rouletteFieldMissingWarning = (currentValue) => {

  if (typeof currentValue.xMin !== 'number' || typeof currentValue.xMax !== 'number') {
    return 'Plausible range.';
  }
  let secondStepWarning = '';
  const totalChipsValue = currentValue.chips.reduce((acc, chip) => acc + chip, 0);
  const requiredTotal = 20;
  if (totalChipsValue !== requiredTotal) {
    const difference = requiredTotal - totalChipsValue;
    secondStepWarning = secondStepWarning + '' + `Not all chips allocated (${totalChipsValue}/${requiredTotal})`
  }
  if (currentValue.rationaleRequired) {
    if (totalChipsValue !== requiredTotal && currentValue.rationale === '') {
      secondStepWarning = secondStepWarning + ' and rationale is missing.';
    } else if (currentValue.rationale === '') {
      secondStepWarning = secondStepWarning + 'Rationale is missing.';
    }
  }
  return secondStepWarning;
}


export const minMaxBestMissingWarning = (currentValue) => {
  let missingFields = '';

  // min/max provided? if so, best provided?
  if (typeof currentValue.min !== 'number' || typeof currentValue.max !== 'number') {
    missingFields += 'lowest and/or highest values';
  } else if (typeof currentValue.bestEstimate !== 'number') {
    missingFields += 'best value';
  }

  if (currentValue?.rationaleRequired) {
    if (!currentValue.rationale || currentValue.rationale.trim() === '') {
      if (missingFields !== '') missingFields += ', '
      missingFields += 'rationale';
    }
  }

  if (missingFields !== '') missingFields += '.'


  return missingFields;
}



export const timeSinceUpdate = (timeOfLastUpdate) => {
  if (!timeOfLastUpdate) return 'Never';
  timeOfLastUpdate = new Date(timeOfLastUpdate);
  const now = new Date();
  const timeDiff = now - timeOfLastUpdate;
  const minutes = Math.floor(timeDiff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;
  if (minutes < 120) return '1 hour ago';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days === 7) return '1 week ago';
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  return `${weeks} weeks ago`;
};