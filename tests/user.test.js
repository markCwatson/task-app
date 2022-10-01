import request from 'supertest'

import { app } from '../src/app.js'
import { User } from '../src/models/user.js'
import { firstUserId, firstUser, dbConfig } from './fixtures/db.js'

beforeEach(dbConfig)

test('U1 Login existing user.', async () => {
    const res = await request(app).post('/users/login').send({
        email: firstUser.email,
        password: firstUser.password
    }).expect(200)

    expect(res.body.user._id).toBe(firstUserId.toString())
    const user = await User.findById(firstUserId)
    expect(user).not.toBeNull()
    expect(res.body.token).toBe(user.tokens[1].token)
})

test('U2 Should not login non-existent user.', async () => {
    await request(app).post('/users/login').send({
        email: 'noName@emample.com',
        password: 'somepassword'
    }).expect(400)
})

test('U3 Signup new user.', async () => {
    const res = await request(app).post('/users').send({
        name: 'Markus',
        email: 'markus.c.watson@gmail.com',
        password: 'emerald'
    }).expect(201)

    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()
    expect(res.body).toMatchObject({
        user: {
            name: 'Markus',
            email: 'markus.c.watson@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('emerald')
})

test('U4 Should not signup with duplicate email.', async () => {
    await request(app).post('/users/login').send({
        name: 'Markus',
        email: 'markus.c.watson@gmail.com',
        password: 'emerald'
    }).expect(400)
})

test('U5 Get user profile.', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('U6 Should not get user profile if not authenticated.', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('U7 Should delete user.', async () => {
    const res = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(firstUserId)
    expect(user).toBeNull()
})

test('U8 Should not delete user.', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test ('U9 Should upload avatar image.', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/pic.jpg')
        .expect(200)

    const user = await User.findById(firstUserId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('U10 Should update valid user fields.', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send({
            name: 'CommonMike'
        })
        .expect(200)

    const user = await User.findById(firstUserId)
    expect(user.name).toBe('CommonMike')
})

test('U11 Should not update invalid user fields.', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send({
            dog: 'cat'
        })
        .expect(400)
})