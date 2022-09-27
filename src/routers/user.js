import express from 'express'

import { User } from '../models/user.js'

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()

        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
    const __id = req.params.id

    try {
        const user = await User.findById(__id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['name', 'email', 'password', 'age']
    const isAllowed = updates.every((update) => allowed.includes(update) )

    if (!isAllowed) {
        return res.status(400).send({ error: 'Invalid update!'})
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true
        })

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

export { router }