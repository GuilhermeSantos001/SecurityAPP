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

                let sql = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA= ? `;

                connection.query(sql, [database], (err, results, fields) => {
                    if (err) {
                        reject({ err: 'Select of databae is failed', details: err });
                        return connection.destroy();
                    }

                    if (results.length <= 0) {
                        sql = `CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET ${characterset}`;

                        connection.query(sql, (err, results, fields) => {
                            if (err) {
                                reject({ err: 'Creation of database is failed', details: err });
                                return connection.destroy();
                            }

                            resolve({ sql, query: { results, fields } });

                            return connection.end();
                        });
                    } else {
                        resolve({ sql, query: { results, fields } });
                        return connection.end();
                    }

                });
            })
        })
    },
    createTable: (database, table) => {
        return new Promise(async (resolve, reject) => {

            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                let sql = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA= ? AND TABLE_NAME= ? `;

                connection.query(sql, [database, table], (err, results, fields) => {
                    if (err) {
                        reject({ err: 'Select of table is failed', details: err });
                        return connection.destroy();
                    }

                    if (results.length <= 0) {
                        sql = `CREATE TABLE IF NOT EXISTS ${table} ${"(\n" +
                            "ID int NOT NULL AUTO_INCREMENT,\n" +
                            "DateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),\n" +
                            "PRIMARY KEY (ID)\n" +
                            ")"}`;

                        connection.query(sql, (err, results, fields) => {
                            if (err) {
                                reject({ err: 'Creation of table is failed', details: err });
                                return connection.destroy();
                            }

                            resolve({ sql, query: { results, fields } });

                            return connection.end();
                        });
                    } else {
                        resolve({ sql, query: { results, fields } });
                        return connection.end();
                    }

                });

            });
        })
    },
    modifyTable: (database, table, definitions = []) => {
        return new Promise(async (resolve, reject) => {

            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                let sql = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA= ? AND TABLE_NAME= ? `;

                connection.query(sql, [database, table], async (err, results, fields) => {

                    if (err) {
                        reject({ err: 'Select of table is failed', details: err });
                        return connection.destroy();
                    }

                    if (results.length > 0 && definitions.length > 0) {

                        definitions.map(async (definition, i) => {
                            const finish = await new Promise(resolve => {
                                let data = { column: definition[0], command: definition[1], props: definition[2] };

                                sql = `SELECT ${data['column']} FROM ${table}`;

                                connection.query(sql, async err => {

                                    const
                                        add = async (table, command, props) => {
                                            sql = `ALTER TABLE ${table} ADD ${command} ${Array(props).join().replace(',', ' ')}`;
                                            connection.query(sql, err => {
                                                return resolve(i);
                                            })
                                        },
                                        modify = async (table, command, props) => {
                                            const unique = await new Promise(resolve => {
                                                sql = `SELECT COLUMN_NAME, COLUMN_KEY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME= ? AND COLUMN_NAME= ?`;
                                                connection.query(sql, [table, data['column']], async (err, results) => {
                                                    if (err) return resolve(false);

                                                    const [column, key] = [
                                                        JSON.parse(JSON.stringify(results))[0].COLUMN_NAME,
                                                        JSON.parse(JSON.stringify(results))[0].COLUMN_KEY
                                                    ];

                                                    const sqls = {
                                                        values: [],
                                                        func: async () => {

                                                            const value = await new Promise(resolve => {

                                                                sql = `SELECT ID, ${column} FROM ${table}`;
                                                                connection.query(sql, (err, results) => {
                                                                    if (err) return resolve('');
                                                                    if (JSON.parse(JSON.stringify(results))[0]) {
                                                                        return resolve({
                                                                            id: JSON.parse(JSON.stringify(results))[0]['ID'],
                                                                            backup: JSON.parse(JSON.stringify(results))[0][column]
                                                                        });
                                                                    } else {
                                                                        return resolve('');
                                                                    }
                                                                })

                                                            })

                                                            sqls.values = [
                                                                `ALTER TABLE ${table} DROP COLUMN ${column}`,
                                                                `ALTER TABLE ${table} ADD ${command} ${Array(props).join().replace(',', ' ')}`
                                                            ];

                                                            if (value['backup'] && value['backup'].length > 0)
                                                                sqls.values.push(`UPDATE ${table} SET ${`${column}='${value['backup']}'`} WHERE ID= '${value['id']}'`);

                                                            sqls.values.map(sql => {
                                                                connection.query(sql);
                                                            });
                                                        }
                                                    }

                                                    if (props.filter(prop => prop === 'UNIQUE').length > 0) {
                                                        /** Key's UNIQUE in PROPS, but not has UNIQUE in DATABASE */
                                                        if (key !== 'UNI') {
                                                            await sqls.func();
                                                            return resolve(true);
                                                        }
                                                    } else {
                                                        /** Key's UNIQUE in DATABASE, but not has UNIQUE in PROPS */
                                                        if (key === 'UNI') {
                                                            await sqls.func();
                                                            return resolve(true);
                                                        }
                                                    }

                                                    return resolve(false);

                                                })
                                            })

                                            if (unique)
                                                return resolve(i);

                                            sql = `ALTER TABLE ${table} MODIFY ${command} ${Array(props).join().replace(',', ' ')}`;
                                            connection.query(sql, err => {
                                                return resolve(i);
                                            })

                                        }
                                    /** ADD COLUMN IF NOT EXIST */
                                    if (err) {
                                        return add(table, data['command'], data['props']);
                                    }
                                    /** MODIFY COLUMN IF EXIST */
                                    else {
                                        return modify(table, data['command'], data['props']);
                                    }
                                })
                            });

                            if (finish >= definitions.length - 1) {
                                resolve({ sql, query: { results, fields } });
                                return connection.end();
                            }
                        })

                    } else {
                        resolve({ sql, query: { results, fields } });
                        return connection.end();
                    }

                });

            });
        })
    },
    setPositionColumnsInTable: (database, table, definitions = []) => {
        return new Promise(async (resolve, reject) => {
            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                if (definitions.length > 0) {
                    definitions.map(async (definition, i) => {
                        const finish = await new Promise(resolve => {

                            const data = { column: definition[0], command: definition[1] };

                            sql = `ALTER TABLE ${table} CHANGE COLUMN ${data['column']} ${data['column']} ${data['command']}`;
                            connection.query(sql, (err) => {
                                return resolve(i);
                            })

                        });

                        if (finish >= definitions.length - 1) {
                            resolve({ sql, query: 'success' });
                            return connection.end();
                        }
                    })
                } else {
                    reject({ err: 'Parameter of Definitions(Array) is not more than 0' });
                    return connection.end();
                }

            })
        })

    },
    getInTable: (database, table, conditions = '', filters = []) => {
        return new Promise(async (resolve, reject) => {
            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                if (filters.filter(filter => { return filter }).length > 0) {
                    const sql = `SELECT * FROM ${table} WHERE ${conditions}`;
                    connection.query(sql, [...filters], (err, results, fields) => {
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
    removeInTable: (database, table, definitions = []) => {
        return new Promise(async (resolve, reject) => {

            const connection = await mysql.createConnection(Object.assign({ database: database }, mysqlConfig));

            connection.connect((err) => {
                if (err) {
                    reject({ err: 'Connection with database failed', details: err });
                    return connection.destroy();
                }

                let sql = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA= ? AND TABLE_NAME= ? `;

                connection.query(sql, [database, table], async (err, results, fields) => {

                    if (err) {
                        reject({ err: 'Select of table is failed', details: err });
                        return connection.destroy();
                    }

                    if (results.length > 0 && definitions.length > 0) {

                        definitions.map(async (definition, i) => {
                            const finish = await new Promise(resolve => {
                                let data = { column: definition[0], command: definition[1] };

                                sql = `SELECT ${data['column']} FROM ${table}`;

                                connection.query(sql, err => {
                                    if (err) {
                                        resolve({
                                            length: i,
                                            query: {
                                                type: 'reject',
                                                value: { err: 'Select Column in table is failed', details: err }
                                            }
                                        })
                                    }
                                    /** DROP COLUMN IF EXIST */
                                    else {
                                        sql = `ALTER TABLE ${table} DROP ${data['command']}`;
                                        connection.query(sql, err => {
                                            resolve({
                                                length: i,
                                                query: {
                                                    type: 'resolve',
                                                    value: { sql, query: { results, fields } }
                                                }
                                            })
                                        })
                                    }
                                })
                            });
                            if (finish.length >= definitions.length - 1) {
                                if (finish.query.type === 'reject')
                                    reject(finish.query.value);
                                else if (finish.query.type === 'resolve')
                                    resolve(finish.query.value);
                                return connection.end();
                            }
                        })

                    } else {
                        resolve({ sql, query: { results, fields } });
                        return connection.end();
                    }

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