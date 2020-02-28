const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const table_user = require('../config/tables').users;
const apiMiddleware = require('../middlewares/api');
const authMiddleware = require('../middlewares/auth');
const crypto = require('../api/crypto');
const lzstring = require('lz-string');
const generateToken = require('../modules/generateToken');

/**
 * Cors configuration
 */
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization', 'api_key'],
    optionsSuccessStatus: 200
}

router.options('*', cors(corsOptions));

/**
 * Features Routers
 */

/**
 * Messages
 */

router.get([`/messages`, `/messages/:id`], cors(corsOptions), apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    try {

        mysql.getInTable('SecurityAPP', 'users', 'ID= ?', [userId])
            .then(({ sql, query }) => {

                if (query.results.length <= 0)
                    return res.status(401).send({ error: 'User not found!' });

                query.results = query.results.map(result => {

                    if (id) {
                        if (typeof result['Messages'] === 'string') {
                            let messages = JSON.parse(lzstring.decompressFromBase64(result['Messages']));
                            if (messages instanceof Array)
                                return messages[(id - 1 < 0 ? 0 : --id)];
                        }
                    }

                    if (typeof result['Messages'] === 'string')
                        return JSON.parse(lzstring.decompressFromBase64(result['Messages']));
                    else return [];

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

router.post(`/messages/send`, cors(corsOptions), apiMiddleware, authMiddleware, async (req, res) => {
    let { userId } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { author, emitter, receiver, copied, subject, message } = req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' });

    if (!author || !emitter || !receiver || !subject || !message)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        mysql.getInTable('SecurityAPP', 'users', 'Email= ?', [receiver])
            .then(({ sql, query }) => {

                if (query.results.length <= 0)
                    return res.status(401).send({ error: 'Receiver not found!' });

                query.results = query.results.map(result => {

                    let messages = typeof result['Messages'] === 'string' ? JSON.parse(lzstring.decompressFromBase64(result['Messages'])) : [];

                    if (messages instanceof Array === false) messages = [];

                    messages.push({
                        id: ((l, i = 0, value = 1) => {
                            for (; i < l; i++) {
                                if (messages[i]['id'] === value) value++;
                            }
                            return value;
                        })(messages.length),
                        author: author,
                        emitter: emitter,
                        receiver: receiver,
                        copied: copied,
                        subject: subject,
                        message: message,
                        new: true,
                        dateAt: new Date().toString(),
                    })

                    return { messages: messages, id: result['ID'] };

                });

                if (query.results[0].id !== userId) return res.status(401).send({ error: 'Token for user is invalid. The token is valid, but has a other owner user!' });

                mysql.updateInTable('SecurityAPP', 'users',
                    `Messages='${lzstring.compressToBase64(Buffer.from(JSON.stringify(query.results[0].messages)).toString('utf8'))}'`,
                    query.results[0].id)
                    .then(({ sql, query }) => {
                        return res.status(200).send({ success: 'Update in table is success', sql: sql, query: { results: query.results[0] } });
                    })
                    .catch(({ err, details }) => {
                        if (err) return res.status(400).send({ error: err, details });
                    })

            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Registration Failed', details: err });
    }
})

router.put([`/messages/update`, `/messages/update/:id`], cors(corsOptions), apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    let { author, emitter, receiver, copied, subject, message } = req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!author || !emitter || !receiver || !subject || !message)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        mysql.getInTable('SecurityAPP', 'users', 'ID= ?', [userId])
            .then(({ sql, query }) => {

                if (query.results.length <= 0)
                    return res.status(401).send({ error: 'User not found!' });

                query.results = query.results.map(result => {

                    let messages = typeof result['Messages'] === 'string' ? JSON.parse(lzstring.decompressFromBase64(result['Messages'])) : '';

                    if (messages instanceof Array === true) {
                        if (id) {
                            let selected = messages.filter(message => { return String(message['id']) === String(id) })[0];
                            if (selected) {
                                messages[messages.indexOf(selected)]['author'] = author;
                                messages[messages.indexOf(selected)]['emitter'] = emitter;
                                messages[messages.indexOf(selected)]['receiver'] = receiver;
                                messages[messages.indexOf(selected)]['copied'] = copied;
                                messages[messages.indexOf(selected)]['subject'] = subject;
                                messages[messages.indexOf(selected)]['message'] = message;
                            }
                        } else {
                            messages = messages.map(msg => {
                                msg['author'] = author;
                                msg['emitter'] = emitter;
                                msg['receiver'] = receiver;
                                msg['copied'] = copied;
                                msg['subject'] = subject;
                                msg['message'] = message;
                                return msg;
                            })
                        }
                    }

                    return { messages: messages, id: result['ID'] };

                });

                if (query.results[0].id !== userId) return res.status(401).send({ error: 'Token for user is invalid. The token is valid, but has a other owner user!' });

                mysql.updateInTable('SecurityAPP', 'users',
                    `Messages='${lzstring.compressToBase64(Buffer.from(JSON.stringify(query.results[0].messages)).toString('utf8'))}'`,
                    query.results[0].id)
                    .then(({ sql, query }) => {
                        return res.status(200).send({ success: 'Drop in table is success', sql: sql, query: { results: query.results[0] } });
                    })
                    .catch(({ err, details }) => {
                        if (err) return res.status(400).send({ error: err, details });
                    })

            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Remove user failed', details: err });
    }
})

router.delete([`/messages/remove`, `/messages/remove/:id`], cors(corsOptions), apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    try {

        mysql.getInTable('SecurityAPP', 'users', 'ID= ?', [userId])
            .then(({ sql, query }) => {

                if (query.results.length <= 0)
                    return res.status(401).send({ error: 'User not found!' });

                query.results = query.results.map(result => {

                    let messages = typeof result['Messages'] === 'string' ? JSON.parse(lzstring.decompressFromBase64(result['Messages'])) : '';

                    if (messages instanceof Array === true) {
                        if (id) {
                            let selected = messages.filter(message => { return String(message['id']) === String(id) })[0];
                            if (selected) messages.splice(messages.indexOf(selected), 1);
                        }
                        else messages.splice(0, messages.length);
                    }

                    return { messages: messages, id: result['ID'] };

                });

                if (query.results[0].id !== userId) return res.status(401).send({ error: 'Token for user is invalid. The token is valid, but has a other owner user!' });

                mysql.updateInTable('SecurityAPP', 'users',
                    `Messages='${lzstring.compressToBase64(Buffer.from(JSON.stringify(query.results[0].messages)).toString('utf8'))}'`,
                    query.results[0].id)
                    .then(({ sql, query }) => {
                        return res.status(200).send({ success: 'Drop in table is success', sql: sql, query: { results: query.results[0] } });
                    })
                    .catch(({ err, details }) => {
                        if (err) return res.status(400).send({ error: err, details });
                    })

            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Remove user failed', details: err });
    }
})

/**
 * Pattern Routers
 */

router.get([`/`, `/:id`], cors(corsOptions), apiMiddleware, async (req, res) => {
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

                query.results = query.results.map(user => {
                    /** Removing keys from response requested */
                    delete user['Password'];
                    delete user['Password_Reset'];
                    delete user['Messages'];

                    return user;
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

router.post(`/register`, cors(corsOptions), apiMiddleware, async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(401).send({ error: 'Body content is not valid!' });

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
                mysql.getInTable('SecurityAPP', 'users', 'Email= ?', [email])
                    .then(async ({ sql, query }) => {
                        if (query.results.length > 0) {
                            let user = query.results[0];

                            let decoded_pass = JSON.parse(lzstring.decompressFromBase64(user['Password']));

                            decoded_pass.tag = Buffer.from(decoded_pass.tag);

                            decoded_pass = await crypto.decrypt(decoded_pass, password);

                            if (decoded_pass !== password)
                                return res.status(400).send({ error: 'Invalid password' });

                            /** Removing keys from response requested */
                            delete user['Password'];
                            delete user['Password_Reset'];
                            delete user['Messages'];
                            delete user['DateAt'];

                            return res.status(200).send({
                                success: 'Get user in table from Email and Password values is success', sql: sql, query: {
                                    results: {
                                        user,
                                        token: generateToken({ id: user['ID'] })
                                    }
                                }
                            });
                        }
                        return res.status(400).send({ error: 'User not exist' });
                    })
                    .catch(({ err, details }) => {
                        if (err) return res.status(400).send({ error: err, details });
                    })
            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Registration Failed', details: err });
    }
})

router.put([`/update`, `/update/:id`], cors(corsOptions), apiMiddleware, async (req, res) => {
    let { id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(401).send({ error: 'Body content is not valid!' });

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

router.delete([`/remove`, `/remove/:id`], cors(corsOptions), apiMiddleware, async (req, res) => {
    let { id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

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

    app.use('/api/users', router);

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
                        ],
                        [
                            'Messages',
                            `COLUMN %COLUMN_NAME LONGTEXT`,
                            []
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
                                ],
                                [
                                    'Messages',
                                    `LONGTEXT AFTER DateAt`
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