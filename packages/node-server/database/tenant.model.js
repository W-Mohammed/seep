const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      // username must be an email address
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]+$/.test(v)
        },
        message: 'Username must be a valid email address',
      },
      set: (v) => v.toLowerCase(),
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    superadmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 60
        },
        message: 'Password does not appear to be hashed',
      },
    },
    forcePasswordReset: {
      type: Boolean,
      default: true,
    },
    lastLoggedIn: {
      type: Date,
    },
    actionTimestamps: {
      type: [Date], 
      default: [], // Meant to be temporary
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

const tenantSchema = new Schema(
  {
    id: {
      type: String,
      // 7 random characters
      default: () => {
        const s = 'abcdefghijklmnopqrstuvwxyz'
        return Array.from(
          { length: 7 },
          () => s[Math.floor(Math.random() * s.length)]
        ).join('')
      },
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    surveys: [{ type: Schema.Types.ObjectId, ref: 'Surveys' }],
    users: {
      type: [userSchema],
      required: true,
      // must have at least one user
      // validate: {
      //   validator: function (v) {
      //     return v.length > 0
      //   },
      //   message: 'Tenant must have at least one user',
      // },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

tenantSchema.index({ 'users.username': 1 });
const Tenant = mongoose.model('Tenant', tenantSchema)

module.exports = { Tenant }
