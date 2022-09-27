import express from 'express'

import './db/mongoose.js'
import { router as user_router }  from './routers/user.js'
import { router as task_router }  from './routers/task.js'

const app = express()

app.use(express.json())
app.use(user_router)
app.use(task_router)

const port = process.env.PORT || 3000

// Express server bind and listen to port
app.listen(port, () => {
    console.log('Listening on port ' + port)
})