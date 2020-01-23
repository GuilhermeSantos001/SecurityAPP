const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const User = mongoose.model('users');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

router.get(`/`, async (req, res) => {
    try {
        let users = await User.find();

        if (users.length <= 0)
            return res.status(400).send({ error: 'Not has registered users in database' });

        return res.status(200).send(users);

    } catch (err) {
        return res.status(400).send({ error: 'Get users failed' });
    }
});

router.post(`/register`, async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exist' });

        let user = await User.create(req.body);

        user.password = undefined;

        return res.status(201).send({
            user,
            token: generateToken({ id: user.id })
        });
    } catch (err) {
        return res.status(400).send({ error: 'Registration Failed' });
    }
})

router.put(`/update/:id`, async (req, res) => {
    const { id } = req.params;

    try {
        if (!await User.findOne({ _id: id }))
            return res.status(400).send({ error: 'User not exist' });

        let user = await User.findOneAndUpdate(id, req.body);

        return res.status(202).send({ user });
    } catch (err) {
        return res.status(400).send({ error: 'Update user failed' });
    }
});

router.delete(`/remove/:id`, async (req, res) => {
    const { id } = req.params;

    try {
        if (!await User.findOne({ _id: id }))
            return res.status(400).send({ error: 'User not exist' });

        let user = await User.findByIdAndDelete(id);

        return res.status(202).send({ user });
    } catch (err) {
        return res.status(400).send({ error: 'Remove user failed' });
    }
})

module.exports = (app) => app.use('/users', router);