const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const table_user = require('../config/tables').users;
const apiMiddleware = require('../middlewares/api');
const crypto = require('../api/crypto');
const lzstring = require('lz-string');

router.use(apiMiddleware);

router.get([`/`, `/:id`], async (req, res) => {

    let { id, email } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    try {

        let filter = '';

        if (!email) {
            filter = 'ID= ?';
        } else {
            filter = 'Email= ?';
            id = email;
        }

        mysql.getInTable('SecurityAPP', 'users', filter, [id])
            .then(({ sql, query }) => {
                query.results = query.results.map(result => {
                    result['Password'] = undefined;
                    return result;
                });
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

        encoded_password = lzstring.compressToBase64(Buffer.from(JSON.stringify(encoded_password)).toString('binary'));

        mysql.insertInTable('SecurityAPP', 'users', '(Nome, Email, Password)', [
            [
                name.substring(0, table_user.varchar.limits.nome),
                email.substring(0, table_user.varchar.limits.email),
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

        let encoded_password = crypto.encrypt(password);

        encoded_password = lzstring.compressToBase64(Buffer.from(JSON.stringify(encoded_password)).toString('binary'));

        mysql.updateInTable('SecurityAPP', 'users',
            `Nome='${name.substring(0, table_user.varchar.limits.nome)}',` +
            `Email='${email.substring(0, table_user.varchar.limits.email)}',` +
            `Password='${encoded_password}'`,
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

module.exports = (app) => {
    /**
     * Set Router
     */

    app.use('/users', router);

    /**
     * Create DATABASE and TABLE
     */

    mysql.createDatabase('SecurityAPP', 'utf8mb4')
        .then(({ sql, query }) => {

            const database = "SecurityAPP", table = "users";

            mysql.createTable(database, table)
                .then(({ sql, query }) => {

                    mysql.modifyTable(database, table, [
                        [
                            'Nome',
                            `COLUMN %COLUMN_NAME varchar(${table_user.varchar.limits.nome})`,
                            ['NOT NULL']
                        ],
                        [
                            'Email',
                            `COLUMN %COLUMN_NAME varchar(${table_user.varchar.limits.email})`,
                            ['NOT NULL', 'UNIQUE']
                        ],
                        [
                            'Password',
                            `COLUMN %COLUMN_NAME LONGTEXT`,
                            ['NOT NULL']
                        ],
                        [
                            'Password_Reset',
                            'COLUMN %COLUMN_NAME LONGTEXT',
                            []
                        ],
                        [
                            'DateAt',
                            `COLUMN %COLUMN_NAME TIMESTAMP`,
                            ['DEFAULT', 'CURRENT_TIMESTAMP()']
                        ]
                    ]
                    )
                        .then(({ sql, query }) => {

                            mysql.setPositionColumnsInTable(database, table, [
                                [
                                    'Nome',
                                    `varchar(${table_user.varchar.limits.nome}) NOT NULL FIRST`
                                ],
                                [
                                    'Email',
                                    `varchar(${table_user.varchar.limits.email}) NOT NULL UNIQUE AFTER Nome`
                                ],
                                [
                                    'Password',
                                    `LONGTEXT NOT NULL AFTER Email`
                                ],
                                [
                                    'Password_Reset AFTER Password',
                                    `LONGTEXT`
                                ],
                                [
                                    'DateAt',
                                    `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER Password_Reset`
                                ]
                            ])
                                .catch(({ err, details }) => {
                                    if (err) return console.error({ error: err, details });
                                })

                        })
                        .catch(({ err, details }) => {
                            if (err) return console.error({ error: err, details });
                        })

                })
                .catch(({ err, details }) => {
                    if (err) return console.error({ error: err, details });
                })

        }).catch(({ err, details }) => {
            if (err) return console.error({ error: err, details });
        })

}