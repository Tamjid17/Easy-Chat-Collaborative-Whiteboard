import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
    },
    fullname: {
        type: String,
        require: true,
    },
    profilePicture: {
        type: String,
        default: ''
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    blockedUsers: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } ]
})

module.exports = mongoose.model('User', userSchema);