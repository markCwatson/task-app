import express from 'express'

import { Task } from '../models/task.js'

const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', async (req, res) => {

    try {
        const task = await Task.find({})
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['description', 'completed']
    const isAllowed = updates.every((update) => allowed.includes(update) )

    if (!isAllowed) {
        return res.status(400).send({ error: 'Invalid update!'})
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true
        })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

export { router }