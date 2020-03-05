const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const databaseWebToken = require('../mysql/databaseWebToken');
const generateToken = require('../modules/generateToken');
const apiMiddleware = require('../middlewares/api');
const crypto = require('../api/crypto');
const cryptoNodeJs = require('crypto');
const mailer = require('../modules/mailer');
const lzstring = require('lz-string');

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
    res.header("Access-Control-Allow-Headers", "Origin, Content-type, api_key");
    return res.sendStatus(200);
});

router.use(cors(corsOptions));

router.post(`/sign`, apiMiddleware, async (req, res) => {

    const {
        webtoken,
        email,
        password
    } = req.body;

    if (!webtoken || !email || !password)
        return res.status(401).send({
            error: 'Body content is not valid!'
        });

    try {

        databaseWebToken.verify(String(webtoken))
            .then((database) => {
                try {
                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'usuario', 'email= ?', [email])
                        .then(async ({
                            sql,
                            query
                        }) => {
                            if (query.results.length > 0) {
                                let user = query.results[0];

                                if (user['database_token'] != String(webtoken)) {
                                    return res.status(400).send({
                                        error: 'User not exist',
                                        code: 3
                                    });
                                }

                                let decoded_pass = JSON.parse(lzstring.decompressFromBase64(user['password']));

                                decoded_pass.tag = Buffer.from(decoded_pass.tag);

                                decoded_pass = await crypto.decrypt(decoded_pass, password);

                                if (decoded_pass !== password)
                                    return res.status(400).send({
                                        error: 'Invalid password',
                                        code: 2
                                    });

                                /** Removing keys from response requested */
                                delete user['database_token'];
                                delete user['nivel_acesso_id'];
                                delete user['password'];
                                delete user['password_reset'];
                                delete user['messages'];

                                return res.status(200).send({
                                    success: 'Get user in table from Email and Password values is success',
                                    sql: sql,
                                    query: {
                                        results: {
                                            user,
                                            token: generateToken({
                                                id: user['ID']
                                            })
                                        }
                                    }
                                });
                            }
                            return res.status(400).send({
                                error: 'User not exist',
                                code: 3
                            });
                        })
                        .catch(({
                            err,
                            details
                        }) => {
                            if (err) return res.status(400).send({
                                error: err,
                                details
                            });
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
        return res.status(400).send({
            error: 'Auth Failed',
            details: err
        });
    }
})

router.post(`/forgot_password`, apiMiddleware, async (req, res) => {
    const {
        webtoken,
        email
    } = req.body;

    if (!email || !webtoken)
        return res.status(401).send({
            error: 'Body content is not valid!'
        });

    try {

        databaseWebToken.verify(String(webtoken))
            .then((database) => {
                try {
                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'usuario', 'email= ?', [email])
                        .then(async ({
                            sql,
                            query
                        }) => {
                            if (query.results.length > 0) {
                                let user = query.results[0];

                                const token = cryptoNodeJs.randomBytes(20).toString('hex');

                                const now = new Date();
                                now.setHours(now.getHours() + 1);

                                const Password_Reset = lzstring.compressToBase64(JSON.stringify({
                                    passwordResetToken: token,
                                    passwordResetExpires: now
                                }))

                                const name = user['Nome'];

                                await mysql.updateInTable(database, 'usuario', `password_reset='${Password_Reset}'`, user['ID'])
                                    .then(({
                                        sql,
                                        query
                                    }) => {

                                        mailer.sendMail({
                                            from: 'suporte@grupomave.com.br',
                                            to: email,
                                            subject: "SecurityAPP - Codigo para redefinir a senha",
                                            template: 'auth/forgot_password',
                                            context: {
                                                name,
                                                token,
                                                expires: {
                                                    fullHours: `${("0" + now.getHours()).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}:${("0" + now.getSeconds()).slice(-2)}`,
                                                    day: [
                                                        'Domingo',
                                                        'Segunda-Feira',
                                                        'Terça-Feira',
                                                        'Quarta-Feira',
                                                        'Quinta-Feira',
                                                        'Sexta-Feira',
                                                        'Sabado'
                                                    ][now.getDay()],
                                                    dayMonth: now.getDate(),
                                                    year: now.getFullYear(),
                                                    month: [
                                                        'Janeiro',
                                                        'Fevereiro',
                                                        'Março',
                                                        'Abril',
                                                        'Maio',
                                                        'Junho',
                                                        'Julho',
                                                        'Agosto',
                                                        'Setembro',
                                                        'Outubro',
                                                        'Novembro',
                                                        'Dezembro'
                                                    ][now.getMonth()]
                                                }
                                            }
                                        }, (err) => {
                                            if (err)
                                                return res.status(400).send({
                                                    error: 'Cannot send forgot password for address email'
                                                });
                                        })

                                        /** Removing keys from response requested */
                                        delete user['database_token'];
                                        delete user['nivel_acesso_id'];
                                        delete user['password'];
                                        delete user['password_reset'];
                                        delete user['messages'];

                                        return res.status(200).send({
                                            success: 'Get user in table from Email with token autorization is success',
                                            sql: sql,
                                            query: {
                                                results: {
                                                    user
                                                }
                                            }
                                        });

                                    })
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return res.status(400).send({
                                            error: err,
                                            details
                                        });
                                    })

                            } else {
                                return res.status(400).send({
                                    error: 'User not exist'
                                });
                            }
                        })
                        .catch(({
                            err,
                            details
                        }) => {
                            if (err) return res.status(400).send({
                                error: err,
                                details
                            });
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
        return res.status(400).send({
            error: 'Error on forgot password, try again',
            details: err
        });
    }
})

router.post('/reset_password', apiMiddleware, async (req, res) => {
    const {
        webtoken,
        email,
        token,
        password
    } = req.body;

    if (!webtoken || !email || !token || !password)
        return res.status(401).send({
            error: 'Body content is not valid!'
        });

    try {

        databaseWebToken.verify(String(webtoken))
            .then((database) => {
                try {
                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'usuario', 'email= ?', [email])
                        .then(async ({
                            sql,
                            query
                        }) => {
                            if (query.results.length > 0) {
                                let user = query.results[0];

                                if (!user['password_reset'])
                                    return res.status(400).send({
                                        error: 'Token not found',
                                        code: 1
                                    });

                                const Password_Reset = JSON.parse(lzstring.decompressFromBase64(user['password_reset'])),
                                    now = new Date();

                                if (token !== Password_Reset['passwordResetToken'])
                                    return res.status(400).send({
                                        error: 'Token invalid',
                                        code: 2
                                    });

                                if (now > Password_Reset['passwordResetExpires'])
                                    return res.status(400).send({
                                        error: 'Token expired, generate a new one',
                                        code: 3
                                    });

                                let encoded_password = await crypto.encrypt(password);

                                encoded_password = lzstring.compressToBase64(Buffer.from(JSON.stringify(encoded_password)).toString('binary'));

                                await mysql.updateInTable(database, 'usuario',
                                    `password='${encoded_password}',` +
                                    `password_reset=${null}`,
                                    user['ID'])
                                    .then(({
                                        sql,
                                        query
                                    }) => {

                                        /** Removing keys from response requested */
                                        delete user['database_token'];
                                        delete user['nivel_acesso_id'];
                                        delete user['password'];
                                        delete user['password_reset'];
                                        delete user['messages'];

                                        return res.status(200).send({
                                            success: 'Reset password user is success',
                                            sql: sql,
                                            query: {
                                                results: {
                                                    user
                                                }
                                            }
                                        });

                                    })
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return res.status(400).send({
                                            error: err,
                                            details
                                        });
                                    })

                            } else {
                                return res.status(400).send({
                                    error: 'User not exist'
                                });
                            }
                        })
                        .catch(({
                            err,
                            details
                        }) => {
                            if (err) return res.status(400).send({
                                error: err,
                                details
                            });
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
        return res.status(400).send({
            error: 'Cannot reset password, try again',
            details: err
        });
    }
})

module.exports = (app) => app.use('/api/auth', router);