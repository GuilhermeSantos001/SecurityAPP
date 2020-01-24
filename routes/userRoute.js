const express = require('express');
const router = express.Router();
const mysql = require('../modules/mysql');
const table_user = require('../config/tables').users;
const apiMiddleware = require('../middlewares/api');
const crypto = require('../api/crypto');
const lzstring = require('lz-string');

router.use(apiMiddleware);

router.get([`/`, `/:id`], async (req, res) => {

    const { id } = req.params;

    try {

        mysql.getInTable('SecurityAPP', 'users', 'ID= ?', [id])
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
        mysql.updateInTable('SecurityAPP', 'users',
            `Nome='${name.substring(0, table_user.varchar.limits.nome)}',` +
            `Email='${email.substring(0, table_user.varchar.limits.email)}',` +
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

            let definitions = "(\n" +
                "ID int NOT NULL AUTO_INCREMENT,\n" +
                `Nome varchar(${table_user.varchar.limits.nome}) NOT NULL,\n` +
                `Email varchar(${table_user.varchar.limits.email}) NOT NULL UNIQUE,\n` +
                `Password LONGTEXT NOT NULL,\n` +
                `Password_Reset LONGTEXT,\n` +
                "DateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),\n" +
                "PRIMARY KEY (ID)\n" +
                ");"

            mysql.createTable(database, table, definitions)
                .then(({ sql, query }) => {

                    if (query.code === 1062) {

                        let columns = [],
                            i = 0,
                            l = definitions.length,
                            str = '';

                        for (; i < l; i++) {
                            let letter = definitions[i]
                            if (letter === ',') {
                                columns.push(str);
                                str = '';
                            }
                            if (letter != '\n' && letter != ',') {
                                if (letter === '(' && i <= 0)
                                    letter = '';
                                str += letter;
                            }
                        }

                        console.log(columns)

                        // mysql.modifyTable(database, table, definitions)
                        //     .then(({ sql, query }) => {

                        //     })
                    }

                    // return console.log({ sql, query: query.results, code: query.code });
                })
                .catch(({ err, details }) => {
                    if (err) return console.error({ error: err, details });
                })

        }).catch(({ err, details }) => {
            if (err) return console.error({ error: err, details });
        })

}