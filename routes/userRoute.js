const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

router.get(`/`, async (req, res) => {
    try {
        mysql.createDatabase('SecurityAPP', 'utf8mb4')
            .then(({ sql, query }) => {
                mysql.createTable('SecurityAPP', 'users', "(\n" +
                    "ID int NOT NULL AUTO_INCREMENT,\n" +
                    "Nome varchar(150) NOT NULL,\n" +
                    "Email varchar(320) NOT NULL UNIQUE,\n" +
                    "DateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),\n" +
                    "PRIMARY KEY (ID)\n" +
                    ");")
                    .then(({ sql, query }) => {
                        mysql.insertInTable('SecurityAPP', 'users', '(Nome, Email)', [
                            ['Guilherme', 'suporte@grupomave.com.br'],
                            ['Jefferson', 'ti@grupomave.com.br'],
                        ])
                            .then(({ sql, query }) => {
                                return res.status(200).send({ success: 'Insertion in table is success', sql: sql, query: query });
                            })
                            .catch(({ err, details }) => {
                                if (err) return res.status(400).send({ error: err, details });
                            })
                    })
                    .catch(({ err, details }) => {
                        if (err) return res.status(400).send({ error: err, details });
                    })
            }).catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })
    } catch (err) {
        return res.status(400).send({ error: 'Get users failed', details: err });
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