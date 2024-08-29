import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: String,
        required: true
    },
    mobilenumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: false
    },
    group: {
        type: String,
        required: false
    },
    image: {
        type: String
    },
    audioList: [{ 
        fileDisplayName: String,
        fileStorageName: String,
        transcript: String,
    }]
}, {minimize: false});

const usermodel = mongoose.models.user || mongoose.model('user', userSchema);

export default usermodel;