import express from 'express'

import './db/mongoose.js'
import { router as userRouter }  from './routers/user.js'
import { router as taskRouter }  from './routers/task.js'

const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// Express server bind and listen to port
app.listen(port, () => {
    console.log('Listening on port ' + port)
})