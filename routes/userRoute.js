const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const databaseWebToken = require('../mysql/databaseWebToken');
const inviteWebToken = require('../mysql/inviteWebToken');
const table_user = require('../config/tables').usuario;
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
    "origin": function (origin, callback) {
        if (['http://reactappstudy.ddns.net:3000', 'http://localhost:3000', undefined].indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    "methods": "GET, POST, PUT, DELETE, OPTIONS"
}

router.options('*', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, Content-type, authorization, api_key");
    return res.sendStatus(200);
});

router.use(cors(corsOptions));

/**
 * Features Routers
 */

/**
 * Messages
 */

router.get([`/messages`, `/messages/:id`], apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { filial } = req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!filial)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        const database = filial;

        mysql.getInTable(database, 'users', 'ID= ?', [userId])
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

router.post(`/messages/send`, apiMiddleware, authMiddleware, async (req, res) => {
    let { userId } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { filial, author, emitter, receiver, copied, subject, message } = req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' });

    if (!filial || !author || !emitter || !receiver || !subject || !message)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        const database = filial;

        mysql.getInTable(database, 'users', 'Email= ?', [receiver])
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

                mysql.updateInTable(database, 'users',
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

router.put([`/messages/update`, `/messages/update/:id`], apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    let { filial, author, emitter, receiver, copied, subject, message } = req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!filial || !author || !emitter || !receiver || !subject || !message)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        const database = filial;

        mysql.getInTable(database, 'users', 'ID= ?', [userId])
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

                mysql.updateInTable(database, 'users',
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
        return res.status(400).send({ error: 'Update user failed', details: err });
    }
})

router.delete([`/messages/remove`, `/messages/remove/:id`], apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { filial } = req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!filial)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        const database = filial;

        mysql.getInTable(database, 'users', 'ID= ?', [userId])
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

                mysql.updateInTable(database, 'users',
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
 * Level Access
 */

router.get([`/levelaccess`], apiMiddleware, authMiddleware, async (req, res) => {
    let { userId } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { filial } = req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!filial)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        const database = filial;

        mysql.getInTable(database, 'users', 'ID= ?', [userId])
            .then(({ sql, query }) => {

                if (query.results.length <= 0)
                    return res.status(401).send({ error: 'User not found!' });

                query.results = query.results.map(result => {
                    return result['Level_Access'];
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

router.put([`/levelaccess/update`, `/levelaccess/update/:id`], apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { filial } = req.body;

    let { level } = String(id) !== 'undefined' ? { level: String(id) } : req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!filial || !level)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        const database = filial;

        mysql.getInTable(database, 'users', 'ID= ?', [userId])
            .then(({ sql, query }) => {

                if (query.results.length <= 0)
                    return res.status(401).send({ error: 'User not found!' });

                query.results = query.results.map(result => {
                    return { id: result['ID'] };
                });

                if (query.results[0].id !== userId) return res.status(401).send({ error: 'Token for user is invalid. The token is valid, but has a other owner user!' });

                mysql.updateInTable(database, 'users',
                    `Level_Access='${level.substring(0, table_user.varchar.limits.level_access)}'`,
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
        return res.status(400).send({ error: 'Update level of user for access is failed', details: err });
    }
})


/**
 * Pattern Routers
 */

/**
 * Level Access
 */

router.get([`/levelsaccess`, `/levelsaccess/:level`], apiMiddleware, async (req, res) => {
    let { level } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    try {
        switch (String(level).toLocaleLowerCase()) {
            case 'administrator':
                return res.status(200).send({
                    success: 'Get level of user for access is success', query: {
                        results: {
                            'dashboard': true,
                            'messages': true,
                            'comercial': true,
                            'dp_rh': true,
                            'operacional': true,
                            'financeiro': true
                        }
                    }
                });
            case 'comercial':
                return res.status(200).send({
                    success: 'Get level of user for access is success', query: {
                        results: {
                            'dashboard': true,
                            'messages': true,
                            'comercial': true,
                            'dp_rh': false,
                            'operacional': false,
                            'financeiro': false
                        }
                    }
                });
            case 'dp/rh':
            case 'dp_rh':
            case 'dp':
            case 'rh':
                return res.status(200).send({
                    success: 'Get level of user for access is success', query: {
                        results: {
                            'dashboard': true,
                            'messages': true,
                            'comercial': false,
                            'dp_rh': true,
                            'operacional': false,
                            'financeiro': false
                        }
                    }
                });
            case 'operacional':
                return res.status(200).send({
                    success: 'Get level of user for access is success', query: {
                        results: {
                            'dashboard': true,
                            'messages': true,
                            'comercial': false,
                            'dp_rh': false,
                            'operacional': true,
                            'financeiro': false
                        }
                    }
                });
            case 'financeiro':
                return res.status(200).send({
                    success: 'Get level of user for access is success', query: {
                        results: {
                            'dashboard': true,
                            'messages': true,
                            'comercial': false,
                            'dp_rh': false,
                            'operacional': false,
                            'financeiro': true
                        }
                    }
                });
            default:
                return res.status(200).send({
                    success: 'Get level of user for access is success', query: {
                        results: {
                            'dashboard': true,
                            'messages': true,
                            'comercial': false,
                            'dp_rh': false,
                            'operacional': false,
                            'financeiro': false
                        }
                    }
                });
        }

    } catch (err) {
        return res.status(400).send({ error: 'Get level of user for access is failed', details: err });
    }
});

/**
 * User
 */

router.get([`/`, `/:id`], apiMiddleware, async (req, res) => {
    let { id, email } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { filial } = req.body;

    if (!filial)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        let filter = '';

        if (!email) {
            filter = 'ID= ?';
        } else {
            filter = 'Email= ?';
            id = email;
        }

        const database = filial;

        mysql.getInTable(database, 'users', filter, [id])
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

router.post(`/register`, apiMiddleware, async (req, res) => {
    const { invitewebtoken, webtoken, name, email, password } = req.body;

    if (!invitewebtoken || !webtoken || !name || !email || !password)
        return res.status(401).send({ error: 'Body content is not valid!' });

    databaseWebToken.verify(String(webtoken))
        .then((database) => {

            inviteWebToken.verify(String(invitewebtoken), String(webtoken))
                .then((invite) => {

                    const
                        now = new Date(),
                        expiresIn = new Date(invite['expiresIn']);

                    if (now > expiresIn) {
                        inviteWebToken.destroy(String(invitewebtoken))
                            .then(() => {
                                return res.status(401).send({
                                    error: 'Webtoken invite expired, request new other!'
                                });
                            })
                            .catch(() => {
                                return res.status(400).send({
                                    error: 'Webtoken invite expired, not possible destroy it. Request new other!'
                                });
                            })
                    } else {
                        try {

                            let encoded_password = crypto.encrypt(password);

                            encoded_password = lzstring.compressToBase64(Buffer.from(JSON.stringify(encoded_password)).toString('binary'));

                            mysql.insertInTable(database, 'usuario', '(nome, email, password)', [
                                [
                                    String(name.substring(0, table_user.varchar.limits.nome)),
                                    String(email.substring(0, table_user.varchar.limits.email)),
                                    String(encoded_password),
                                ]
                            ])
                                .then(({ sql, query }) => {
                                    mysql.getInTable(database, 'usuario', 'email= ?', [email])
                                        .then(async ({ sql, query }) => {
                                            if (query.results.length > 0) {
                                                let user = query.results[0];

                                                let decoded_pass = JSON.parse(lzstring.decompressFromBase64(user['password']));

                                                decoded_pass.tag = Buffer.from(decoded_pass.tag);

                                                decoded_pass = await crypto.decrypt(decoded_pass, password);

                                                if (decoded_pass !== password)
                                                    return res.status(400).send({ error: 'Invalid password' });

                                                /** Removing keys from response requested */
                                                delete user['password'];
                                                delete user['password_reset'];
                                                delete user['messages'];
                                                delete user['dateat'];

                                                inviteWebToken.destroy(String(invitewebtoken))
                                                    .then(() => {
                                                        return res.status(200).send({
                                                            success: 'Get user in table from Email and Password values is success', sql: sql, query: {
                                                                results: {
                                                                    user,
                                                                    token: generateToken({ id: user['ID'] })
                                                                }
                                                            }
                                                        });
                                                    })
                                                    .catch(() => {
                                                        return res.status(400).send({
                                                            error: 'Webtoken invite used, but not possible destroy it.'
                                                        });
                                                    })

                                            } else {
                                                return res.status(400).send({ error: 'User not exist' });
                                            }
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
                    }

                })
                .catch(() => {
                    return res.status(400).send({
                        error: 'Webtoken invite is invalid!'
                    });
                })

        })
        .catch(() => {
            return res.status(400).send({
                error: 'Webtoken is invalid!'
            });
        })
})

router.put([`/update`, `/update/:id`], apiMiddleware, async (req, res) => {
    let { id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { filial, name, email, password } = req.body;

    if (!filial || !name || !email || !password)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        const database = filial;

        let encoded_password = crypto.encrypt(password);

        encoded_password = lzstring.compressToBase64(Buffer.from(JSON.stringify(encoded_password)).toString('binary'));

        mysql.updateInTable(database, 'users',
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

router.delete([`/remove`, `/remove/:id`], apiMiddleware, async (req, res) => {
    let { id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { filial } = req.body;

    try {

        const database = filial;

        mysql.dropInTable(database, 'users', id)
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

module.exports = (app) => app.use('/api/users', router);