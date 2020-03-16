const express = require('express');
const router = express.Router({ strict: true, caseSensitive: true });
const mysql = require('../modules/mysql');
const table_levelaccess = require('../config/tables').nivel_acesso;
const databaseWebToken = require('../mysql/databaseWebToken');
const webTokenInvite = require('../mysql/inviteWebToken');
const apiMiddleware = require('../middlewares/api');
const getReqProps = require('../modules/getReqProps');
const LZString = require('lz-string');

/**
 * LEVEL ACCESS
 */

router.get(['/sign/levelaccess', '/sign/levelaccess/:codigo'], apiMiddleware, async (req, res) => {
    let { codigo, webtoken } = getReqProps(req, ['codigo', 'webtoken']);

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
                            if (query.results.length <= 0) return res.status(400).send({ error: 'There are no registered level access!' });

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

router.post('/sign/levelaccess', apiMiddleware, async (req, res) => {
    let { codigo, webtoken, nome, menu } = getReqProps(req, ['codigo', 'webtoken', 'nome', 'menu']);

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

router.put(['/sign/levelaccess/update', '/sign/levelaccess/update/:codigo'], apiMiddleware, async (req, res) => {
    let { codigo, webtoken, nome, menu } = getReqProps(req, ['codigo', 'webtoken', 'nome', 'menu']);

    if (!webtoken || !codigo || !nome || !menu)
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
                            if (query.results.length <= 0) return res.status(400).send({ error: 'The code for Level Access not registered!' });

                            query.results = query.results.map(levelaccess => {
                                levelaccess['nome'] = String(nome.substring(0, table_levelaccess.varchar.limits.nome));
                                levelaccess['menu'] = LZString.compressToBase64(JSON.stringify(menu));

                                if (!codigo || codigo && codigo === String(levelaccess['ID']))
                                    mysql.updateInTable(database, 'nivel_acesso',
                                        `nome='${levelaccess['nome']}',` +
                                        `menu='${levelaccess['menu']}'`,
                                        levelaccess['ID'])
                                        .then(({ sql, query }) => {
                                            return res.status(200).send({ success: 'Update in table is success', sql: sql, query: query });
                                        })
                                        .catch(({ err, details }) => {
                                            if (err) return res.status(400).send({ error: err, details });
                                        })
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

router.delete(['/sign/levelaccess/remove', '/sign/levelaccess/remove/:id'], apiMiddleware, async (req, res) => {
    let { id, webtoken } = getReqProps(req, ['id', 'webtoken']);

    if (!webtoken)
        return res.status(401).send({
            error: 'Body content is not valid!'
        });

    try {

        databaseWebToken.verify(String(webtoken))
            .then((database) => {
                try {

                    if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

                    mysql.dropInTable(String(database), 'nivel_acesso', id)
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
        return res.status(400).send({
            error: 'Auth Failed',
            details: err
        });
    }
})

/**
 * WEB TOKEN INVITE
 */

router.post('/sign/webtokeninvite', apiMiddleware, async (req, res) => {
    let { webtoken, invite, levelaccess } = getReqProps(req, ['webtoken', 'invite', 'levelaccess']);

    if (!webtoken || !invite)
        return res.status(401).send({
            error: 'Body content is not valid!'
        });

        console.log()

    databaseWebToken.verify(String(webtoken))
        .then(() => {
            mysql.getInTable(database, 'nivel_acesso', 'codigo= ?', [codigo])
                .then(async ({
                    sql,
                    query
                }) => {
                    if (query.results.length <= 0) return res.status(400).send({ error: 'The code for Level Access not registered!' });

                    query.results = query.results.map(levelaccess => {
                        levelaccess['nome'] = String(nome.substring(0, table_levelaccess.varchar.limits.nome));
                        levelaccess['menu'] = LZString.compressToBase64(JSON.stringify(menu));

                        if (!codigo || codigo && codigo === String(levelaccess['ID']))
                            mysql.updateInTable(database, 'nivel_acesso',
                                `nome='${levelaccess['nome']}',` +
                                `menu='${levelaccess['menu']}'`,
                                levelaccess['ID'])
                                .then(({ sql, query }) => {
                                    return res.status(200).send({ success: 'Update in table is success', sql: sql, query: query });
                                })
                                .catch(({ err, details }) => {
                                    if (err) return res.status(400).send({ error: err, details });
                                })
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

module.exports = (app) => app.use('/api/adm', router);