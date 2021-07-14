const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('users', {
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    age: {
        type: Number,
        trim: true
    },
    school: {
        type : String,
        trim: true
    },
    city: {
        type : String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    about: {
        type: String,
        trim: true
    },
    projects: {
        type: String,
        trim: true, 
    },
    skills: {
        type: String,
        trim: true, 
    },
    image: {
        type: String,
    },
    theme: {
        type: String
    },
    resume: {
        type: String
    }
})


module.exports = User