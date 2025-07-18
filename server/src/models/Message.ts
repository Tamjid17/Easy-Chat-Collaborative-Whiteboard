import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String
    },
    image: {
        type: String,
        default: ''
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    sentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', messageSchema);