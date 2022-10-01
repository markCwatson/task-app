import { app } from './app.js'

const port = process.env.PORT

// Express server bind and listen to port
app.listen(port, () => {
    console.log('Listening on port ' + port)
})