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
    let { userId, database, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!database)
        return res.status(401).send({ error: 'Database not found!' })

    try {

        databaseWebToken.verify(String(database))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'usuario', 'ID= ?', [userId])
                        .then(({ sql, query }) => {

                            if (query.results.length <= 0)
                                return res.status(401).send({ error: 'User not found!' });

                            query.results = query.results.map(result => {

                                if (id) {
                                    if (typeof result['messages'] === 'string') {
                                        let messages = JSON.parse(lzstring.decompressFromBase64(result['messages']));
                                        if (messages instanceof Array)
                                            return messages[(id - 1 < 0 ? 0 : --id)];
                                    }
                                }

                                if (typeof result['messages'] === 'string')
                                    return JSON.parse(lzstring.decompressFromBase64(result['messages']));
                                else return [];

                            });

                            return res.status(200).send({ success: 'Get all in table is success', sql: sql, query: { results: query.results } });
                        })
                        .catch(({ err, details }) => {
                            if (err) return res.status(400).send({ error: err, details });
                        })

                } catch (error) {
                    return console.error({
                        message: `Não foi possivel se conectar ao banco de dados ${database}`,
                        error: error
                    });
                }
            })
            .catch(() => {
                return res.status(400).send({
                    error: 'Webtoken is invalid!',
                    code: 1
                });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Get messages of user is failed', details: err });
    }
});

router.post(`/messages/send`, apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, database } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { author, emitter, receiver, copied, subject, message } = req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' });

    if (!database)
        return res.status(401).send({ error: 'Database not found!' })

    if (!author || !emitter || !receiver || !subject || !message)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        databaseWebToken.verify(String(database))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'usuario', 'email= ?', [receiver])
                        .then(({ sql, query }) => {

                            if (query.results.length <= 0)
                                return res.status(401).send({ error: 'Receiver not found!' });

                            query.results = query.results.map(result => {

                                let messages = typeof result['messages'] === 'string' ? JSON.parse(lzstring.decompressFromBase64(result['messages'])) : [];

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

                            mysql.updateInTable(database, 'usuario',
                                `messages='${lzstring.compressToBase64(Buffer.from(JSON.stringify(query.results[0].messages)).toString('utf8'))}'`,
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

                } catch (error) {
                    return console.error({
                        message: `Não foi possivel se conectar ao banco de dados ${database}`,
                        error: error
                    });
                }
            })
            .catch(() => {
                return res.status(400).send({
                    error: 'Webtoken is invalid!',
                    code: 1
                });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Registration message of user is Failed', details: err });
    }
})

router.put([`/messages/update`, `/messages/update/:id`], apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, database, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    let { author, emitter, receiver, copied, subject, message } = req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!database)
        return res.status(401).send({ error: 'Database not found!' })

    if (!author || !emitter || !receiver || !subject || !message)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        databaseWebToken.verify(String(database))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'usuario', 'ID= ?', [userId])
                        .then(({ sql, query }) => {

                            if (query.results.length <= 0)
                                return res.status(401).send({ error: 'User not found!' });

                            query.results = query.results.map(result => {

                                let messages = typeof result['messages'] === 'string' ? JSON.parse(lzstring.decompressFromBase64(result['messages'])) : '';

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

                            mysql.updateInTable(database, 'usuario',
                                `messages='${lzstring.compressToBase64(Buffer.from(JSON.stringify(query.results[0].messages)).toString('utf8'))}'`,
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

                } catch (error) {
                    return console.error({
                        message: `Não foi possivel se conectar ao banco de dados ${database}`,
                        error: error
                    });
                }
            })
            .catch(() => {
                return res.status(400).send({
                    error: 'Webtoken is invalid!',
                    code: 1
                });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Update message of user is failed', details: err });
    }
})

router.delete([`/messages/remove`, `/messages/remove/:id`], apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, database, id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!database)
        return res.status(401).send({ error: 'Database not found!' })

    try {

        databaseWebToken.verify(String(database))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'usuario', 'ID= ?', [userId])
                        .then(({ sql, query }) => {

                            if (query.results.length <= 0)
                                return res.status(401).send({ error: 'User not found!' });

                            query.results = query.results.map(result => {

                                let messages = typeof result['messages'] === 'string' ? JSON.parse(lzstring.decompressFromBase64(result['messages'])) : '';

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

                            mysql.updateInTable(database, 'usuario',
                                `messages='${lzstring.compressToBase64(Buffer.from(JSON.stringify(query.results[0].messages)).toString('utf8'))}'`,
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

                } catch (error) {
                    return console.error({
                        message: `Não foi possivel se conectar ao banco de dados ${database}`,
                        error: error
                    });
                }
            })
            .catch(() => {
                return res.status(400).send({
                    error: 'Webtoken is invalid!',
                    code: 1
                });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Remove message of user is failed', details: err });
    }
})

/**
 * Level Access
 */

router.get(`/levelaccess`, apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, database } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!database)
        return res.status(401).send({ error: 'Database not found!' })

    try {

        databaseWebToken.verify(String(database))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'usuario', 'ID= ?', [userId])
                        .then(({ sql, query }) => {

                            if (query.results.length <= 0)
                                return res.status(401).send({ error: 'User not found!' });

                            query.results = query.results.map(result => {
                                return { id: result['ID'], levelaccessId: result['nivel_acesso_id'] };
                            });

                            if (query.results[0].id !== userId) return res.status(401).send({ error: 'Token for user is invalid. The token is valid, but has a other owner user!' });

                            mysql.getReferenceInTable(database, ['usuario', 'nivel_acesso_id'], ['nivel_acesso', 'codigo'], '')
                                .then(({ sql, query }) => {

                                    const data = query.results[0];

                                    if (!data) return res.status(401).send({ error: 'Date not ready, try again!' });

                                    let levelaccess = JSON.parse(lzstring.decompressFromBase64(data['menu']));

                                    return res.status(200).send({ success: 'Get all in table is success', sql: sql, query: { results: levelaccess } });

                                })
                                .catch(({ err, details }) => {
                                    if (err) return res.status(400).send({ error: err, details });
                                })

                        })
                        .catch(({ err, details }) => {
                            if (err) return res.status(400).send({ error: err, details });
                        })

                } catch (error) {
                    return console.error({
                        message: `Não foi possivel se conectar ao banco de dados ${database}`,
                        error: error
                    });
                }
            })
            .catch(() => {
                return res.status(400).send({
                    error: 'Webtoken is invalid!',
                    code: 1
                });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Get level access of user failed', details: err });
    }
});

router.post([`/levelaccess`, `/levelaccess/:codigo`], apiMiddleware, authMiddleware, async (req, res) => {
    let { userId, database, codigo } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    if (!codigo) codigo = req.body['codigo'];

    if (!userId)
        return res.status(401).send({ error: 'User not found!' })

    if (!database)
        return res.status(401).send({ error: 'Database not found!' })

    if (!codigo)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        databaseWebToken.verify(String(database))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'usuario', 'ID= ?', [userId])
                        .then(({ sql, query }) => {

                            if (query.results.length <= 0)
                                return res.status(401).send({ error: 'User not found!' });

                            query.results = query.results.map(result => {
                                return { id: result['ID'] };
                            });

                            if (query.results[0].id !== userId) return res.status(401).send({ error: 'Token for user is invalid. The token is valid, but has a other owner user!' });

                            mysql.updateInTable(database, 'usuario',
                                `nivel_acesso_id='${Number(codigo)}'`,
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

                } catch (error) {
                    return console.error({
                        message: `Não foi possivel se conectar ao banco de dados ${database}`,
                        error: error
                    });
                }
            })
            .catch(() => {
                return res.status(400).send({
                    error: 'Webtoken is invalid!',
                    code: 1
                });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Set level access for user failed', details: err });
    }
});

/**
 * Pattern Routers
 */

/**
 * User
 */

router.get([`/`, `/:id`], apiMiddleware, async (req, res) => {
    let { id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { email, webtoken } = req.body;

    if (!webtoken)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        databaseWebToken.verify(String(webtoken))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    let filter = '';

                    if (!email) {
                        filter = 'ID= ?';
                    } else {
                        filter = 'email= ?';
                        id = email;
                    }

                    mysql.getInTable(database, 'usuario', filter, [id])
                        .then(({ sql, query }) => {

                            query.results = query.results.map(user => {
                                /** Removing keys from response requested */
                                delete user['database_token'];
                                delete user['nivel_acesso_id'];
                                delete user['password'];
                                delete user['password_reset'];
                                delete user['messages'];

                                return user;
                            });

                            return res.status(200).send({ success: 'Get all in table is success', sql: sql, query: { results: query.results } });
                        })
                        .catch(({ err, details }) => {
                            if (err) return res.status(400).send({ error: err, details });
                        })

                } catch (error) {
                    return console.error({
                        message: `Não foi possivel se conectar ao banco de dados ${database}`,
                        error: error
                    });
                }
            })
            .catch(() => {
                return res.status(400).send({
                    error: 'Webtoken is invalid!',
                    code: 1
                });
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
                        expiresIn = new Date(invite['expiresIn']),
                        levelaccess = invite['levelaccess'];

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

                            mysql.insertInTable(database, 'usuario', '(nivel_acesso_id, nome, email, password)', [
                                [
                                    Number(levelaccess),
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
                                                                    token: generateToken({ id: user['ID'], database: user['database_token'] })
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

    const { webtoken, name, email, password } = req.body;

    if (!webtoken || !name || !email || !password)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        databaseWebToken.verify(String(webtoken))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    let encoded_password = crypto.encrypt(password);

                    encoded_password = lzstring.compressToBase64(Buffer.from(JSON.stringify(encoded_password)).toString('binary'));

                    mysql.updateInTable(database, 'usuario',
                        `nome='${name.substring(0, table_user.varchar.limits.nome)}',` +
                        `email='${email.substring(0, table_user.varchar.limits.email)}',` +
                        `password='${encoded_password}'`,
                        id)
                        .then(({ sql, query }) => {
                            return res.status(200).send({ success: 'Update in table is success', sql: sql, query: query });
                        })
                        .catch(({ err, details }) => {
                            if (err) return res.status(400).send({ error: err, details });
                        })

                } catch (error) {
                    return console.error({
                        message: `Não foi possivel se conectar ao banco de dados ${database}`,
                        error: error
                    });
                }
            })
            .catch(() => {
                return res.status(400).send({
                    error: 'Webtoken is invalid!',
                    code: 1
                });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Update user failed', details: err });
    }
});

router.delete([`/remove`, `/remove/:id`], apiMiddleware, async (req, res) => {
    let { id } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { webtoken } = req.body;

    if (!webtoken)
        return res.status(401).send({ error: 'Body content is not valid!' });

    try {

        databaseWebToken.verify(String(webtoken))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.dropInTable(database, 'usuario', id)
                        .then(({ sql, query }) => {
                            return res.status(200).send({ success: 'Drop in table is success', sql: sql, query: query });
                        })
                        .catch(({ err, details }) => {
                            if (err) return res.status(400).send({ error: err, details });
                        })

                } catch (error) {
                    return console.error({
                        message: `Não foi possivel se conectar ao banco de dados ${database}`,
                        error: error
                    });
                }
            })
            .catch(() => {
                return res.status(400).send({
                    error: 'Webtoken is invalid!',
                    code: 1
                });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Remove user failed', details: err });
    }
})

module.exports = (app) => app.use('/api/users', router);