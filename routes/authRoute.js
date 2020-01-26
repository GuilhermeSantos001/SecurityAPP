const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const authMiddleware = require('../middlewares/auth');
const crypto = require('../api/crypto');
const mailer = require('../modules/mailer');
const lzstring = require('lz-string');

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
                            },
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

        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');
        if (!user)
            return res.status(400).send({ error: 'User not found' });

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' });

        const now = new Date();

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new one' });

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        return res.status(202).send({ user });

    } catch (err) {
        return res.status(400).send({ error: 'Cannot reset password, try again' });
    }
})

router.use(authMiddleware);

router.post(`/forgot_password`, async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).send({ error: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        mailer.sendMail({
            to: email,
            from: 'suporte@grupomave.com.br',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Cannot send forgot password email' });
        })

        return res.status(202).send({ user });
    } catch (err) {
        return res.status(400).send({ error: 'Error on forgot password, try again' });
    }
})

module.exports = (app) => app.use('/auth', router);