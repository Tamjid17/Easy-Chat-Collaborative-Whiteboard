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
    fullName: {
        type: String,
        require: true,
    },
    profilePicture: {
        type: String,
        default: ''
    },
    profilePicturePublicId: {
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

const User = mongoose.model('User', userSchema);
export default User;