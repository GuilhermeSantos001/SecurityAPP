const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const table_levelaccess = require('../config/tables').nivel_acesso;
const databaseWebToken = require('../mysql/databaseWebToken');
const webTokenInvite = require('../mysql/inviteWebToken');
const generateToken = require('../modules/generateToken');
const apiMiddleware = require('../middlewares/api');
const authMiddleware = require('../middlewares/auth');
const crypto = require('../api/crypto');
const cryptoNodeJs = require('crypto');
const mailer = require('../modules/mailer');
const LZString = require('lz-string');

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

router.post('/sign/webtokeninvite', apiMiddleware, async (req, res) => {
    const { webtoken, invite, levelaccess } = req.body;

    if (!webtoken || !invite)
        return res.status(401).send({
            error: 'Body content is not valid!'
        });

    databaseWebToken.verify(String(webtoken))
        .then(() => {
            webTokenInvite.sign(invite, levelaccess, webtoken)
                .then((token) => {
                    return res.status(200).send({
                        success: 'Create a webtoken invite is success',
                        invite: token
                    })
                })
                .catch((error) => {
                    return res.status(400).send({
                        error: 'Create a Webtoken invite is failed!',
                        details: error
                    });
                })
        })
        .catch(() => {
            return res.status(400).send({
                error: 'Webtoken is invalid!'
            });
        })
})

router.post('/sign/levelaccess', apiMiddleware, async (req, res) => {
    const { webtoken, codigo, nome, menu } = req.body;

    if (!webtoken || !codigo || !nome || !menu || menu && typeof menu != 'object')
        return res.status(401).send({
            error: 'Body content is not valid!'
        });

    try {

        databaseWebToken.verify(String(webtoken))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'nivel_acesso', 'codigo= ?', [codigo])
                        .then(async ({
                            sql,
                            query
                        }) => {
                            if (query.results.length > 0) return res.status(400).send({ error: 'The code for Level Access already registered!' });

                            mysql.insertInTable(database, 'nivel_acesso', '(codigo, nome, menu)', [
                                [
                                    Number(codigo),
                                    String(nome.substring(0, table_levelaccess.varchar.limits.nome)),
                                    LZString.compressToBase64(JSON.stringify(menu))
                                ]
                            ])
                                .then(({ sql, query }) => {
                                    mysql.getInTable(database, 'nivel_acesso', 'codigo= ?', [codigo])
                                        .then(async ({ sql, query }) => {
                                            if (query.results.length > 0) {
                                                let levelaccess = query.results[0];

                                                levelaccess['menu'] = JSON.parse(LZString.decompressFromBase64(levelaccess['menu']));

                                                return res.status(200).send({
                                                    success: 'Get all in table is success',
                                                    sql: sql,
                                                    query: { results: levelaccess }
                                                })

                                            } else {
                                                return res.status(400).send({ error: 'Level Access not exist' });
                                            }
                                        })
                                        .catch(({ err, details }) => {
                                            if (err) return res.status(400).send({ error: err, details });
                                        })
                                })
                                .catch(({ err, details }) => {
                                    if (err) return res.status(400).send({ error: err, details });
                                })
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

router.get(['/sign/levelaccess', '/sign/levelaccess/:codigo'], apiMiddleware, async (req, res) => {
    let { codigo } = Object.keys(req.params).filter(param => req.params[param] !== undefined).length > 0 ?
        req.params : Object.keys(req.query).filter(param => req.query[param] !== undefined).length > 0 ? req.query : req.body;

    const { webtoken } = req.body;

    if (!webtoken)
        return res.status(401).send({
            error: 'Body content is not valid!'
        });

    try {

        databaseWebToken.verify(String(webtoken))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.getInTable(database, 'nivel_acesso', 'codigo= ?', [codigo])
                        .then(async ({
                            sql,
                            query
                        }) => {
                            if (query.results.length <= 0) return res.status(400).send({ error: 'The code for Level Access already registered!' });

                            query.results = query.results.map(levelaccess => {
                                levelaccess['menu'] = JSON.parse(LZString.decompressFromBase64(levelaccess['menu']));
                                if (codigo) {
                                    if (Number(levelaccess['codigo']) === Number(codigo)) return levelaccess;
                                } else {
                                    return levelaccess;
                                }
                            });

                            return res.status(200).send({ success: 'Get all in table is success', sql: sql, query: { results: query.results } });
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

module.exports = (app) => app.use('/api/adm', router);