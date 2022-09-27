import mongoose from 'mongoose'
import validator from 'validator'

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(val) {
            if (val < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(val) {
            if (val.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word "password"!')
            }
        }
    }
})

export { User }