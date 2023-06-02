const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    real_name: {
        type: String,
        required: true
    },
    limit: {
        type: Number,
        default: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now()
    },
    extension: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Link', linkSchema);
