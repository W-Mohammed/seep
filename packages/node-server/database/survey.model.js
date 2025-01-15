const mongoose = require('mongoose')
const { Schema } = mongoose
const { SURVEY_STATUS, SURVEY_TYPE } = require('../utils')

const agendaItemSchema = new Schema(
  {
    viewId: {
      type: String,
      required: true,
    },
    pageId: {
      type: String,
      required: false,
      index: true,
      default: () => Math.random().toString(36).substring(2, 15),
    },
    pageType: {
      // enum
      type: String,
      enum: ['question', 'tutorial', 'validation', 'static', 'section', 'other'],  
      required: true,
    },
    content: {
      type: Object,
      required: false,
    },
    parent: {
      type: Object,
      required: false,
    },
    options: {
      type: Object,
      required: false,
    },
    order: {
      type: Number,
      required: false,
    },
  },
  { _id: true, strict: false }
)

const surveySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      default: () => Math.random().toString(36).substring(2, 7),
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9]{2,}$/.test(v)
        },
        message:
          'Survey ID must be alphanumeric and at least 2 characters long - or leave blank for auto-generation',
      },
    },
    tenantId: {
      type: String,
      required: true,
    },
    studyContact: {
      name: {
        type: String,
        required: false,
      },
      organisation: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
    },
    compositeKey: {
      type: String,
      required: true,
      unique: true,
    },
    agenda: {
      type: [agendaItemSchema],
    },
    lockedScreen: {
      type: agendaItemSchema,
      required: false,
      default: {
        viewId: 'LockedPage',
        pageId: 'locked',
        pageType: 'static',
        content: {
          contactNote: 'If you have any questions, please contact:',
          contactEmail: 'support@vpriorb.com',
        },
      },
    },
    status: {
      type: String,
      default: SURVEY_STATUS.PUBLISHED,
      enum: Object.values(SURVEY_STATUS),
    },
    type: {
      type: String,
      required: false,
      default: SURVEY_TYPE.SURVEY,
      enum: Object.values(SURVEY_TYPE),
    },
    experts: {
      type: [Schema.Types.ObjectId],
      ref: 'Expert',
    },
    config: {
      public: {
        type: Boolean,
        default: false,
      },
      allowPostSubmissionView: {
        type: Boolean,
        default: true,
      },
      allowExpertSelfCreation: {
        type: Boolean,
        default: false,
      },
      disableComments: {
        type: Boolean,
        default: false,
      },
    },
    draft: {}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

const Question = mongoose.model('Question', agendaItemSchema)
const Survey = mongoose.model('Survey', surveySchema)

module.exports = { Survey, Question }
