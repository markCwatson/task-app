import mongoose from 'mongoose'

import { User } from '../models/user.js'
import { Task } from '../models/task.js'

// Connect to database
mongoose.connect('mongodb://127.0.0.1:27017/task-app-api')