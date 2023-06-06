const mongoose = require('mongoose')
const itemSchema = new mongoose.Schema({

    itemName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Item', itemSchema)
