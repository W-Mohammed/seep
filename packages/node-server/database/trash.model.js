const mongoose = require('mongoose')
const { Schema } = mongoose

const trashSchema = new Schema(
    {
        tenantId: {
            type: String,
            required: true,
        },
        surveyId: {
            type: String,
            required: true,
        },
        documentType: {
            type: String,
            required: true,
        },
        documentId: {
            type: String,
            required: true,
        },
        document: {
            type: Object,
            required: true,
        },
        user: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Trash = mongoose.model('Trash', trashSchema)

module.exports = { Trash }
