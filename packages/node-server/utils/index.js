function trimWhitespace(str) {
  return str.trim()
}

const SURVEY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  CLOSED: 'closed',
  DELETED: 'deleted',
}

const SURVEY_TYPE = {
  SURVEY: 'survey',
  WORKSHOP: 'workshop',
}

const EXPERT_STATUS = {
  NOT_CONTACTED: 'notContacted',
  CONTACTED: 'contacted',
  CONSENT_OBTAINED: 'consentObtained',
  SURVEY_INVITATION_SENT: 'surveyInvitationSent',
  ONGOING: 'ongoing',
  SUBMITTED: 'submitted',
  ARCHIVED: 'archived',
  WITHDRAWN: 'withdrawn',
  DELETED: 'deleted',
}

module.exports = { trimWhitespace, SURVEY_STATUS, EXPERT_STATUS, SURVEY_TYPE }
