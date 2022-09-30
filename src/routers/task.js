import express from 'express'

import { Task } from '../models/task.js'
import { auth }  from '../middleware/auth.js'

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return task.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks', auth, async (req, res) => {
    const return_limit = parseInt(req.query.limit)
    const skip_num = parseInt(req.query.skip)
    const query = req.query.completed === 'true'
    const sort = {}

    if (req.query.sortBy) {
        const input = req.query.sortBy.split(':')
        sort[input[0]] = input[1] === 'desc' ? -1 : 1
    }

    try {
        const task = await Task.find({ 
            owner: req.user._id, 
            completed: query 
        }).setOptions({ 
            limit: return_limit, 
            skip: skip_num ,
            sort
        })

        if (!task) {
            return task.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['description', 'completed']
    const isAllowed = updates.every((update) => allowed.includes(update) )

    if (!isAllowed) {
        return res.status(400).send({ error: 'Invalid update!'})
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

export { router }