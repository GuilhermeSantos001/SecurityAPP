const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const authMiddleware = require('../middlewares/auth');
const crypto = require('../api/crypto');
const cryptoNodeJs = require('crypto');
const mailer = require('../modules/mailer');
const lzstring = require('lz-string');
const path = require('path');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400 // 1 Day
    });
}

router.post(`/sign`, async (req, res) => {
    const { email, password } = req.body;

    try {

        mysql.getInTable('SecurityAPP', 'users', 'Email= ?', [email])
            .then(({ sql, query }) => {
                if (query.results.length > 0) {
                    let user = query.results[0];

                    let decoded_pass = JSON.parse(lzstring.decompressFromBase64(user['Password']));

                    decoded_pass.tag = Buffer.from(decoded_pass.tag);

                    decoded_pass = crypto.decrypt(decoded_pass, password);

                    if (decoded_pass !== password)
                        return res.status(400).send({ error: 'Invalid password' });

                    user['Password'] = undefined;

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
    } catch (err) {
        return res.status(400).send({ error: 'Auth Failed', details: err });
    }
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {

        const database = 'SecurityAPP', table = 'users';

        mysql.getInTable(database, table, 'Email= ?', [email])
            .then(async ({ sql, query }) => {
                if (query.results.length > 0) {
                    let user = query.results[0];

                    const Password_Reset = JSON.parse(lzstring.decompressFromBase64(user['Password_Reset'])),
                        now = new Date();

                    if (token !== Password_Reset['passwordResetToken'])
                        return res.status(400).send({ error: 'Token invalid' });

                    if (now > Password_Reset['passwordResetExpires'])
                        return res.status(400).send({ error: 'Token expired, generate a new one' });

                    let encoded_password = crypto.encrypt(password);

                    encoded_password = lzstring.compressToBase64(Buffer.from(JSON.stringify(encoded_password)).toString('binary'));

                    await mysql.updateInTable(database, table,
                        `Password='${encoded_password}',` +
                        `Password_Reset='${null}'`,
                        user['ID'])
                        .then(({ sql, query }) => {

                            return res.status(200).send({
                                success: 'Reset password user is success', sql: sql, query: {
                                    results: {
                                        user,
                                        token: generateToken({ id: user['ID'] })
                                    }
                                }
                            });

                        })
                        .catch(({ err, details }) => {
                            if (err) return res.status(400).send({ error: err, details });
                        })

                } else {
                    return res.status(400).send({ error: 'User not exist' });
                }
            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Cannot reset password, try again' });
    }
})

router.use(authMiddleware);

router.post(`/forgot_password`, async (req, res) => {
    const { email } = req.body;

    try {

        const database = 'SecurityAPP', table = 'users';

        mysql.getInTable(database, table, 'Email= ?', [email])
            .then(async ({ sql, query }) => {
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

                    await mysql.updateInTable(database, table, `Password_Reset='${Password_Reset}'`, user['ID'])
                        .then(({ sql, query }) => {

                            mailer.sendMail({
                                from: 'suporte@grupomave.com.br',
                                to: email,
                                subject: "SecurityAPP - Codigo para redefinir a senha",
                                template: 'auth/forgot_password',
                                context: {
                                    name, token, expires: {
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
                                    return res.status(400).send({ error: 'Cannot send forgot password for address email' });
                            })

                            return res.status(200).send({
                                success: 'Get user in table from Email with token autorization is success', sql: sql, query: {
                                    results: {
                                        user
                                    }
                                }
                            });

                        })
                        .catch(({ err, details }) => {
                            if (err) return res.status(400).send({ error: err, details });
                        })

                } else {
                    return res.status(400).send({ error: 'User not exist' });
                }
            })
            .catch(({ err, details }) => {
                if (err) return res.status(400).send({ error: err, details });
            })

    } catch (err) {
        return res.status(400).send({ error: 'Error on forgot password, try again' });
    }
})

module.exports = (app) => app.use('/auth', router);