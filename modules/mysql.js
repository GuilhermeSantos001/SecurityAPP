const mysql = require('mysql');
const mysqlConfig = require('../config/mysql');

module.exports = {
    createDatabase: (database, characterset) => {
        return new Promise(async (resolve, reject) => {
            const connection = await mysql.createConnection(mysqlConfig);

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                const sql = `CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET ${characterset}`;

                connection.query(sql, (err, results, fields) => {
                    if (err) {
                        reject({ err: 'Creation of database is failed', details: err });
                        return connection.destroy();
                    }

                    resolve({ sql, query: { results, fields } });

                    return connection.end();
                });
            });
        })
    },
    createTable: (database, table, definitions) => {
        return new Promise(async (resolve, reject) => {

            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                const sql = `CREATE TABLE IF NOT EXISTS ${table} ${definitions}`;

                connection.query(sql, (err, results, fields) => {
                    if (err) {
                        reject({ err: 'Creation of table is failed', details: err });
                        return connection.destroy();
                    }

                    resolve({ sql, query: { results, fields } });

                    return connection.end();
                });
            });
        })
    },
    getInTable: (database, table, filter = '') => {
        return new Promise(async (resolve, reject) => {
            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                if (filter.length > 0) {
                    const sql = `SELECT * FROM ${table} WHERE ID= ?`;
                    connection.query(sql, [filter], (err, results, fields) => {
                        if (err) {
                            reject({ err: 'Get in table is failed', details: err });
                            return connection.destroy();
                        }

                        resolve({ sql, query: { results, fields } });

                        return connection.end();
                    });

                } else {
                    const sql = `SELECT * FROM ${table}`;
                    connection.query(sql, (err, results, fields) => {
                        if (err) {
                            reject({ err: 'Get all in table is failed', details: err });
                            return connection.destroy();
                        }

                        resolve({ sql, query: { results, fields } });

                        return connection.end();
                    });
                }
            });
        })
    },
    insertInTable: (database, table, definitions, values) => {
        return new Promise(async (resolve, reject) => {

            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                const sql = `INSERT INTO ${table}${definitions} VALUES ?`;

                connection.query(sql, [values], (err, results, fields) => {
                    if (err) {
                        reject({ err: 'Insertion in table is failed', details: err });
                        return connection.destroy();
                    }

                    resolve({ sql, query: { results, fields } });

                    return connection.end();
                });
            });
        })
    },
    updateInTable: (database, table, values, filter = '') => {
        return new Promise(async (resolve, reject) => {

            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                if (filter.length > 0) {
                    const sql = `UPDATE ${table} SET ${values} WHERE ID= ?`;
                    connection.query(sql, [filter], (err, results, fields) => {
                        if (err) {
                            reject({ err: 'Update in table is failed', details: err });
                            return connection.destroy();
                        }

                        resolve({ sql, query: { results, fields } });

                        return connection.end();
                    });
                } else {
                    const sql = `UPDATE ${table} SET ${values}`;
                    connection.query(sql, (err, results, fields) => {
                        if (err) {
                            reject({ err: 'Update in table is failed', details: err });
                            return connection.destroy();
                        }

                        resolve({ sql, query: { results, fields } });

                        return connection.end();
                    });
                }

            });
        })
    },
    dropInTable: (database, table, filter = '') => {
        return new Promise(async (resolve, reject) => {

            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                if (filter.length > 0) filter = `WHERE ID=${filter}`;
                const sql = `DELETE FROM ${table} ${filter}`;

                connection.query(sql, (err, results, fields) => {
                    if (err) {
                        reject({ err: 'Delete in table is failed', details: err });
                        return connection.destroy();
                    }

                    resolve({ sql, query: { results, fields } });

                    return connection.end();
                });
            });
        })
    }
}