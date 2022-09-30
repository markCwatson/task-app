import mongoose from 'mongoose'

// Connect to database
mongoose.connect(process.env.MONGODB_URL)