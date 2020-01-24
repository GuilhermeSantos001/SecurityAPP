const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const apiMiddleware = require('../middlewares/api');
const crypto = require('../api/crypto');
const lzstring = require('lz-string');

/**
 * Create DATABASE and TABLE
 */

const table = {
    'users': {
        'varchar': {
            'limits': {
                'nome': 120,
                'email': 320
            }
        }
    }
}

mysql.createDatabase('SecurityAPP', 'utf8mb4')
    .then(({ sql, query }) => {

        mysql.createTable('SecurityAPP', 'users', "(\n" +
            "ID int NOT NULL AUTO_INCREMENT,\n" +
            `Nome varchar(${table.users.varchar.limits.nome}) NOT NULL,\n` +
            `Email varchar(${table.users.varchar.limits.email}) NOT NULL UNIQUE,\n` +
            `Password LONGTEXT NOT NULL,\n` +
            "DateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),\n" +
            "PRIMARY KEY (ID)\n" +
            ");")
            .catch(({ err, details }) => {
                if (err) return console.error({ error: err, details });
            })

    }).catch(({ err, details }) => {
        if (err) return console.error({ error: err, details });
    })

router.use(apiMiddleware);

router.get([`/`, `/:id`], async (req, res) => {

    const { id } = req.params;

    try {

        mysql.getInTable('SecurityAPP', 'users', id)
            .then(({ sql, query }) => {
                return res.status(200).send({ success: 'Get all in table is success', sql: sql, query: { results: query.results } });
            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Get users failed', details: err });
    }
});

router.post(`/register`, async (req, res) => {
    const { name, email, password } = req.body;

    try {

        let encoded_password = crypto.encrypt(password);

        encoded_password.tag = encoded_password.tag.toString('binary');

        encoded_password = lzstring.compressToBase64(JSON.stringify(encoded_password));

        // let decoded_pass = JSON.parse(lzstring.decompressFromBase64(encoded_password));

        // decoded_pass.tag = Buffer.from(decoded_pass.tag, 'binary');

        // decoded_pass = crypto.decrypt(decoded_pass);

        mysql.insertInTable('SecurityAPP', 'users', '(Nome, Email, Password)', [
            [
                name.substring(0, table.users.varchar.limits.nome),
                email.substring(0, table.users.varchar.limits.email),
                encoded_password,
            ]
        ])
            .then(({ sql, query }) => {
                return res.status(200).send({ success: 'Insertion in table is success', sql: sql, query: query });
            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Registration Failed', details: err });
    }
})

router.put([`/update`, `/update/:id`], async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        mysql.updateInTable('SecurityAPP', 'users',
            `Nome='${name.substring(0, table.users.varchar.limits.nome)}',` +
            `Email='${email.substring(0, table.users.varchar.limits.email)}',` +
            `Password='${password}'`,
            id)
            .then(({ sql, query }) => {
                return res.status(200).send({ success: 'Update in table is success', sql: sql, query: query });
            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Update user failed', details: err });
    }
});

router.delete([`/remove`, `/remove/:id`], async (req, res) => {
    const { id } = req.params;

    try {

        mysql.dropInTable('SecurityAPP', 'users', id)
            .then(({ sql, query }) => {
                return res.status(200).send({ success: 'Drop in table is success', sql: sql, query: query });
            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Remove user failed', details: err });
    }
})

module.exports = (app) => app.use('/users', router);