const mongoose = require('mongoose')
const { Schema } = mongoose

const host = process.env.CLIENT_HOST
  
const responseSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      default: null,
    },
    timeTaken: {
      type: Number,
      required: false,
    },
    timesViewed: {
      type: Number,
      required: false,
    },
  },
  { strict: false }
)

const expertSchema = new Schema(
  {
    compositeKey: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          // If email is provided, validate it; otherwise, allow null
          return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      },
      // Allow null or undefined values
      default: null,
    },
    organisation: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
      default: 'notContacted',
    },
    surveyId: {
      type: String,
      required: true,
    },
    survey: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
    },
    tenantId: {
      type: String,
      required: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
    },
    lastVisitedPageIndex: {
      type: Number,
      required: false,
      default: 0,
    },
    selfCreated: {
      type: Boolean,
      required: false,
      default: false,
    },
    responses: [responseSchema],
    ignoreQuestions: [Schema.Types.ObjectId],
    questionCount: {
      type: Number,
      required: false,
      default: 0,
    },
    completedCount: {
      type: Number,
      required: false,
      default: 0,
    },
    locked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    virtuals: {
      surveyUrl: {
        get() {
          return `${host}/${this.tenantId}-${this.surveyId}?id=${this._id}`
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
)

expertSchema.index({ tenantId: 1, surveyId: 1, name: 1 }, { unique: true })

const Expert = mongoose.model('Expert', expertSchema)

module.exports = { Expert }
