import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { Task } from './task.js'

const user_schema = new mongoose.Schema({
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
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

user_schema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

user_schema.methods.toJSON = function () {
    const user_object = this.toObject()

    delete user_object.password
    delete user_object.tokens

    return user_object
}

// Genrate JSON Web Token
user_schema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString()}, 'thisisasecrete')
    this.tokens = this.tokens.concat({ token })

    await this.save()

    return token
}

user_schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login!')
    }

    return user
}


// Hash password
user_schema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

// Delete user tasks when user is removed
user_schema.pre('remove', async function (next) {
    await Task.deleteMany({ owner: this._id })

    next()
})

const User = mongoose.model('User', user_schema)

export { User }