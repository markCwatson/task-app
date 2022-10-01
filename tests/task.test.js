import request from 'supertest'

import { app } from '../src/app.js'
import { Task } from '../src/models/task.js'

import { 
    firstUserId, 
    firstUser, 
    dbConfig, 
    secondUser, 
    secondUserId,  
    taskOne,
    taskTwo,
    taskThree
} from './fixtures/db.js'

beforeEach(dbConfig)

test('T1 Should create task for user.', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send({
            description: 'A task trom test'
        })
        .expect(201)

    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('T2 Should fetch task.', async () => {
    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.length).toBe(2)
})

test('T3 Should not fetch task.', async () => {
    const res = await request(app)
        .get('/tasks')
        .send()
        .expect(401)
})

test('T4 Should not delete task.', async () => {
    const res = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${secondUser.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('T5 Should not delete task.', async () => {
    const res = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
})

test('T6 Should not create task.', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${secondUser.tokens[0].token}`)
        .send({
            description: undefined
        })
        .expect(400)
})

test('T7 Should not create task.', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${secondUser.tokens[0].token}`)
        .send({
            dog: 'cat'
        })
        .expect(400)
})

test('T8 Should fetch one task.', async () => {
    const findOptions = {
        limit: 1
     }

    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .query(findOptions)
        .send()    
        .expect(200)

    expect(res.body.length).toBe(findOptions.limit)
})

test('T9 Should fetch two tasks.', async () => {
    const findOptions = {
        limit: 2
     }

    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .query(findOptions)
        .send()    
        .expect(200)

    expect(res.body.length).toBe(findOptions.limit)
})