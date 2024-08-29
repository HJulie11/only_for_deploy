import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    adminname: {
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
    mobilenumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    position: {
        type: String
    },
    registerDate:{
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: true
    },
    group: {
        type: String,
        // required: true
    },
    studentlist: {
        type: Array,
        required: false
    },
    studentnumber: {
        type: Number,
        default: 0
    },
    groupadmin: {
        type: Array,
        required: false
    },
}, {minimize: false}, {timestamps: true});

const adminmodel = mongoose.models.admin || mongoose.model('admin', adminSchema);

export default adminmodel;