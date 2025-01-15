import { SURVEY_STATUS } from '@/lib/utils';
import { AgendaItemFactory } from '@/models/AgendaItemFactory';

export const getAgendaItemTypes = (surveyType) => {
  if (surveyType === 'survey') return surveyAgendaItemTypes;
  else if (surveyType === 'workshop') return workshopAgendaItemTypes;
  else if (surveyType === 'all')
    return surveyAgendaItemTypes
      .concat(workshopAgendaItemTypes)
      .filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.value === item.value)
      );
  else return [];
};

export const surveyAgendaItemTypes = [
  { section: 'Expert Elicitation' },
  {
    value: 'minMaxBest',
    text: 'Low-High-Best Estimate',
    viewId: 'QuestionMinMaxBest',
    pageType: 'question',
  },
  {
    value: 'matrix',
    text: 'Validation Matrix',
    viewId: 'QuestionMatrix',
    pageType: 'question',
  },
  // {
  //   value: 'table',
  //   text: 'Tabular Question',
  //   viewId: 'QuestionTable',
  //   pageType: 'question',
  // },
  {
    value: 'roulette',
    text: 'Roulette/Chips-N-Bins',
    viewId: 'QuestionRoulette',
    pageType: 'question',
  },
  // {
  //   value: 'probability',
  //   text: 'Probability Method',
  //   viewId: 'WorkshopProbability',
  //   pageType: 'question'
  // },
  //   {
  //   value: 'validation',
  //   text: 'Roullette Validation',
  //   viewId: 'ValidateRouletteConditional',
  //   pageType: 'validation'
  // },
  { section: 'Regular Questions' },
  {
    value: 'backgroundPage',
    text: 'Info Page',
    viewId: 'BackgroundPage',
    pageType: 'static',
  },
  {
    value: 'text',
    text: 'Free Text',
    viewId: 'QuestionFormKit',
    pageType: 'question',
  },
  {
    value: 'textarea',
    text: 'Free Text (Long)',
    viewId: 'QuestionFormKit',
    pageType: 'question',
  },
  {
    value: 'checkbox',
    text: 'Multiple Select',
    viewId: 'QuestionCheckbox',
    pageType: 'question',
  },
  {
    value: 'radio',
    text: 'Single Choice',
    viewId: 'QuestionFormKit',
    pageType: 'question',
  },
  {
    value: 'radiorich',
    text: 'Extended Single Choice',
    viewId: 'QuestionRadioRich',
    pageType: 'question',
  },
  {
    value: 'radiolikert',
    text: 'Radio Likert',
    viewId: 'QuestionRadioLikert',
    pageType: 'question',
  },
  {
    value: 'number',
    text: 'Number',
    viewId: 'QuestionFormKit',
    pageType: 'question',
  },
  // {
  //   value: 'section',
  //   text: 'Section',
  //   viewId: 'Section',
  //   section: true,
  //   pageType: 'section'
  // },
];

export const workshopAgendaItemTypes = [
  {
    value: 'backgroundPage',
    text: 'Info Page',
    viewId: 'BackgroundPage',
    pageType: 'static',
  },
  {
    value: 'workshopprobability',
    text: 'Probability Method',
    viewId: 'WorkshopProbability',
    pageType: 'question',
  },
];

export const initEmptyAgenda = () => {
  return [];
};

export const extractIntoOutro = (agenda)  => {
  if(!agenda || !agenda.length) return
  let newAgenda = agenda
  let introPage = newAgenda[0]
  let submitPage = newAgenda[newAgenda.length - 1]
  newAgenda.shift()
  newAgenda.pop()
  return { introPage, submitPage, newAgenda }
}

export const setPageId = (prevId) => {
  if (prevId != null) return prevId;
  return Math.random().toString(36).substring(2);
};

export const initDraftSurvey = async (surveyDraft) => {

  let contactName, contactEmail, contactOrganisation
  
  const {email, name, organisation} = surveyDraft.studyContact

  const configDefault = {
      allowPostSubmissionView: surveyDraft?.type === 'workshop' ? false : true,
      allowExpertSelfCreation: false,
      disableComments: false,
  };
    
  const hasLockedPage = surveyDraft?.lockedScreen?.title || surveyDraft?.lockedScreen?.body

  let newAgenda = surveyDraft.agenda || initEmptyAgenda();

  if (newAgenda[0]?.viewId !== 'WelcomePage' && newAgenda[0]?.viewId !== 'WorkshopWelcome') {
    newAgenda = [AgendaItemFactory.createAgendaItem('welcome', {}, surveyDraft?.type), ...newAgenda];
  } 
  
  if (newAgenda[newAgenda.length - 1]?.viewId !== 'SubmitPage') {
    newAgenda = [...newAgenda, AgendaItemFactory.createAgendaItem('submit', {}, surveyDraft?.type)];
  }

  let data = {
      ...surveyDraft,
      id: surveyDraft.id || Math.random().toString(36).substring(2, 7),
      tenantId: surveyDraft.tenantId || '',
      name: surveyDraft.name || '',
      description: surveyDraft.description || '',
      status: surveyDraft.status || SURVEY_STATUS.DRAFT, //in the future, we can use this to determine if the survey is a draft or published
      type: surveyDraft.type || 'survey',
      studyContact: {
        name,
        email,
        organisation,
      },
      agenda: newAgenda,
      lockedScreen: hasLockedPage ? surveyDraft.lockedScreen : AgendaItemFactory.createAgendaItem('locked', { name, email, organisation}, surveyDraft?.type),
      config: surveyDraft.config || configDefault,
    };
    return data;
};

export const initAgendaItem = (type, item, props = {}) => {
  return AgendaItemFactory.createAgendaItem(type, item, props);
};
