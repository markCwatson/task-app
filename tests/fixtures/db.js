import jwt from 'jsonwebtoken'
import mongoose, { Mongoose } from 'mongoose'

import { User } from '../../src/models/user.js'
import { Task } from '../../src/models/task.js'

const firstUserId = new mongoose.Types.ObjectId()
const firstUser = {
    _id: firstUserId,
    name: 'firstUser',
    email: 'firstUser@example.com',
    password: 'firstUser',
    tokens: [{
        token: jwt.sign({ _id: firstUserId }, process.env.JWT_SECRET)
    }]
}

const secondUserId = new mongoose.Types.ObjectId()
const secondUser = {
    _id: secondUserId,
    name: 'secondUser',
    email: 'secondUser@example.com',
    password: 'secondUser',
    tokens: [{
        token: jwt.sign({ _id: secondUserId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task one',
    completed: false,
    owner: firstUser._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task two',
    completed: false,
    owner: firstUser._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task three',
    completed: false,
    owner: secondUser._id
}

const dbConfig = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(firstUser).save()
    await new User(secondUser).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = { 
    firstUserId,
    firstUser,
    secondUser,
    secondUserId,
    taskOne,
    taskTwo,
    taskThree,
    dbConfig
}