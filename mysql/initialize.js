const mysql = require('../modules/mysql');
const databases = require('../config/databases');
const tables = require('../config/tables');
const databaseWebToken = require('./databaseWebToken');

if (databases instanceof Array && databases.length > 0) {
    databases.map(database => {
       if (String(database).length <= 0) return res.status(400).send({ error: 'Database is not defined!' });

        const token = {
            value: '',
            set: function (token) {
                this.value = token;
            }
        }

        /**
         * Cria o webtoken para referencia a database
         */
        databaseWebToken.sign(database)
            .then((_token_) => {
                token.value = _token_;
            })
            .catch((error) => {
                return console.error({
                    message: `Não foi possivel criar o webtoken para a database ${database}`,
                    error
                })
            })

        /**
         * Cria o banco de dados
         */
        mysql.createDatabase(database, 'utf8mb4')
            .then(({
                sql,
                query
            }) => {
                /**
                 * Cria a tabela 'empresa'
                 */
                mysql.createTable(database, 'empresa')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'empresa', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'razao_social',
                                `COLUMN %COLUMN_NAME varchar(${tables.empresa.varchar.limits.razao_social})`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'fantasia',
                                `COLUMN %COLUMN_NAME varchar(${tables.empresa.varchar.limits.fantasia})`,
                                ['NOT NULL']
                            ],
                            [
                                'telefone',
                                `COLUMN %COLUMN_NAME varchar(${tables.empresa.varchar.limits.telefone})`,
                                ['NOT NULL']
                            ],
                            [
                                'endereco',
                                `COLUMN %COLUMN_NAME varchar(${tables.empresa.varchar.limits.endereco})`,
                                ['NOT NULL']
                            ],
                            [
                                'site',
                                `COLUMN %COLUMN_NAME varchar(${tables.empresa.varchar.limits.site})`,
                                ['NOT NULL']
                            ],
                            [
                                'email',
                                `COLUMN %COLUMN_NAME varchar(${tables.empresa.varchar.limits.email})`,
                                ['NOT NULL']
                            ],
                            [
                                'DateAt',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'empresa', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'razao_social',
                                        `varchar(${tables.empresa.varchar.limits.razao_social}) NOT NULL UNIQUE AFTER codigo`
                                    ],
                                    [
                                        'fantasia',
                                        `varchar(${tables.empresa.varchar.limits.fantasia}) NOT NULL AFTER razao_social`
                                    ],
                                    [
                                        'telefone',
                                        `varchar(${tables.empresa.varchar.limits.telefone}) NOT NULL AFTER fantasia`
                                    ],
                                    [
                                        'endereco',
                                        `varchar(${tables.empresa.varchar.limits.endereco}) NOT NULL AFTER telefone`
                                    ],
                                    [
                                        'site',
                                        `varchar(${tables.empresa.varchar.limits.site}) NOT NULL AFTER endereco`
                                    ],
                                    [
                                        'email',
                                        `varchar(${tables.empresa.varchar.limits.email}) NOT NULL AFTER site`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER email`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'cliente'
                 */
                mysql.createTable(database, 'cliente')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'cliente', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'razao_social',
                                `COLUMN %COLUMN_NAME varchar(${tables.cliente.varchar.limits.razao_social})`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'fantasia',
                                `COLUMN %COLUMN_NAME varchar(${tables.cliente.varchar.limits.fatansia})`,
                                ['NOT NULL']
                            ],
                            [
                                'telefone',
                                `COLUMN %COLUMN_NAME varchar(${tables.cliente.varchar.limits.telefone})`,
                                ['NOT NULL']
                            ],
                            [
                                'endereco',
                                `COLUMN %COLUMN_NAME varchar(${tables.cliente.varchar.limits.endereco})`,
                                ['NOT NULL']
                            ],
                            [
                                'site',
                                `COLUMN %COLUMN_NAME varchar(${tables.cliente.varchar.limits.site})`,
                                ['NOT NULL']
                            ],
                            [
                                'email',
                                `COLUMN %COLUMN_NAME varchar(${tables.cliente.varchar.limits.email})`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'cliente', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'razao_social',
                                        `varchar(${tables.cliente.varchar.limits.razao_social}) NOT NULL UNIQUE AFTER codigo`
                                    ],
                                    [
                                        'fantasia',
                                        `varchar(${tables.cliente.varchar.limits.fantasia}) NOT NULL AFTER razao_social`
                                    ],
                                    [
                                        'telefone',
                                        `varchar(${tables.cliente.varchar.limits.telefone}) NOT NULL AFTER fantasia`
                                    ],
                                    [
                                        'endereco',
                                        `varchar(${tables.cliente.varchar.limits.endereco}) NOT NULL AFTER telefone`
                                    ],
                                    [
                                        'site',
                                        `varchar(${tables.cliente.varchar.limits.site}) NOT NULL AFTER endereco`
                                    ],
                                    [
                                        'email',
                                        `varchar(${tables.cliente.varchar.limits.email}) NOT NULL AFTER site`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER email`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'servico'
                 */
                mysql.createTable(database, 'servico')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'servico', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'nome',
                                `COLUMN %COLUMN_NAME varchar(${tables.servico.varchar.limits.nome})`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_dia',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.servico.decimal.valor_dia.digits}, ${tables.servico.decimal.valor_dia.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_hora',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.servico.decimal.valor_hora.digits}, ${tables.servico.decimal.valor_hora.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'servico', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'nome',
                                        `varchar(${tables.servico.varchar.limits.nome}) NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'valor_dia',
                                        `DECIMAL(${tables.servico.decimal.valor_dia.digits}, ${tables.servico.decimal.valor_dia.decimals}) UNSIGNED NOT NULL AFTER nome`
                                    ],
                                    [
                                        'valor_hora',
                                        `DECIMAL(${tables.servico.decimal.valor_hora.digits}, ${tables.servico.decimal.valor_hora.decimals}) UNSIGNED NOT NULL AFTER valor_dia`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER valor_hora`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'funcao'
                 */
                mysql.createTable(database, 'funcao')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'funcao', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'nome',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcao.varchar.limits.nome})`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'funcao', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'nome',
                                        `varchar(${tables.funcao.varchar.limits.nome}) NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER nome`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'contrato'
                 */
                mysql.createTable(database, 'contrato')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'contrato', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'codigo_empresa',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_empresa',
                                `COLUMN %COLUMN_NAME varchar(${tables.contrato.varchar.limits.nome_empresa})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_cliente',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_cliente',
                                `COLUMN %COLUMN_NAME varchar(${tables.contrato.varchar.limits.nome_cliente})`,
                                ['NOT NULL']
                            ],
                            [
                                'observacao',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                []
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'contrato', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'codigo_empresa',
                                        `INT(10) ZEROFILL NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'nome_empresa',
                                        `varchar(${tables.contrato.varchar.limits.nome_empresa}) NOT NULL AFTER codigo_empresa`
                                    ],
                                    [
                                        'codigo_cliente',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_empresa`
                                    ],
                                    [
                                        'nome_cliente',
                                        `varchar(${tables.contrato.varchar.limits.nome_cliente}) NOT NULL AFTER codigo_cliente`
                                    ],
                                    [
                                        'observacao',
                                        `LONGTEXT AFTER nome_cliente`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER observacao`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'itens_contrato'
                 */
                mysql.createTable(database, 'itens_contrato')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'itens_contrato', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'codigo_servico',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_servico',
                                `COLUMN %COLUMN_NAME varchar(${tables.itens_contrato.varchar.limits.nome_servico})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_funcao',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcao',
                                `COLUMN %COLUMN_NAME varchar(${tables.itens_contrato.varchar.limits.nome_funcao})`,
                                ['NOT NULL']
                            ],
                            [
                                'qt_efetivo',
                                `COLUMN %COLUMN_NAME INT(3) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'horario_inicio',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                []
                            ],
                            [
                                'horario_fim',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                []
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'itens_contrato', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'codigo_servico',
                                        `INT(10) ZEROFILL NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'nome_servico',
                                        `varchar(${tables.itens_contrato.varchar.limits.nome_servico}) NOT NULL AFTER codigo_servico`
                                    ],
                                    [
                                        'codigo_funcao',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_servico`
                                    ],
                                    [
                                        'nome_funcao',
                                        `varchar(${tables.itens_contrato.varchar.limits.nome_funcao}) NOT NULL AFTER codigo_funcao`
                                    ],
                                    [
                                        'qt_efetivo',
                                        `INT(10) INT(3) UNSIGNED NOT NULL AFTER nome_funcao`
                                    ],
                                    [
                                        'horario_inicio',
                                        `LONGTEXT AFTER qt_efetivo`
                                    ],
                                    [
                                        'horario_fim',
                                        `LONGTEXT AFTER horario_inicio`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER horario_fim`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'funcionario'
                 */
                mysql.createTable(database, 'funcionario')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'funcionario', [
                            [
                                're',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'nome',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.nome})`,
                                ['NOT NULL']
                            ],
                            [
                                'cpf',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.cpf})`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'rg',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.rg})`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'pis',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.pis})`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'data_nascimento',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                []
                            ],
                            [
                                'endereco',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.endereco})`,
                                ['NOT NULL']
                            ],
                            [
                                'telefone_1',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.telefone_1})`,
                                ['NOT NULL']
                            ],
                            [
                                'telefone_2',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.telefone_2})`,
                                ['NOT NULL']
                            ],
                            [
                                'email',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.email})`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'carteira_trabalho',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.carteira_trabalho})`,
                                ['NOT NULL']
                            ],
                            [
                                'banco',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.banco})`,
                                ['NOT NULL']
                            ],
                            [
                                'agencia',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.agencia})`,
                                ['NOT NULL']
                            ],
                            [
                                'conta_corrente',
                                `COLUMN %COLUMN_NAME varchar(${tables.funcionario.varchar.limits.conta_corrente})`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'funcionario', [
                                    [
                                        're',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'nome',
                                        `varchar(${tables.funcionario.varchar.limits.nome}) NOT NULL AFTER re`
                                    ],
                                    [
                                        'cpf',
                                        `varchar(${tables.funcionario.varchar.limits.cpf}) NOT NULL UNIQUE AFTER nome`
                                    ],
                                    [
                                        'rg',
                                        `varchar(${tables.funcionario.varchar.limits.rg}) NOT NULL UNIQUE AFTER cpf`
                                    ],
                                    [
                                        'pis',
                                        `varchar(${tables.funcionario.varchar.limits.pis}) NOT NULL UNIQUE AFTER rg`
                                    ],
                                    [
                                        'data_nascimento',
                                        `LONGTEXT AFTER pis`
                                    ],
                                    [
                                        'endereco',
                                        `varchar(${tables.funcionario.varchar.limits.endereco}) NOT NULL AFTER data_nascimento`
                                    ],
                                    [
                                        'telefone_1',
                                        `varchar(${tables.funcionario.varchar.limits.telefone_1}) NOT NULL AFTER endereco`
                                    ],
                                    [
                                        'telefone_2',
                                        `varchar(${tables.funcionario.varchar.limits.telefone_2}) NOT NULL AFTER telefone_1`
                                    ],
                                    [
                                        'email',
                                        `varchar(${tables.funcionario.varchar.limits.email}) NOT NULL UNIQUE AFTER telefone_2`
                                    ],
                                    [
                                        'carteira_trabalho',
                                        `varchar(${tables.funcionario.varchar.limits.carteira_trabalho}) NOT NULL AFTER email`
                                    ],
                                    [
                                        'banco',
                                        `varchar(${tables.funcionario.varchar.limits.banco}) NOT NULL AFTER carteira_trabalho`
                                    ],
                                    [
                                        'agencia',
                                        `varchar(${tables.funcionario.varchar.limits.agencia}) NOT NULL AFTER banco`
                                    ],
                                    [
                                        'conta_corrente',
                                        `varchar(${tables.funcionario.varchar.limits.conta_corrente}) NOT NULL UNIQUE AFTER agencia`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER conta_corrente`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'escala'
                 */
                mysql.createTable(database, 'escala')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'escala', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'nome',
                                `COLUMN %COLUMN_NAME varchar(${tables.escala.varchar.limits.nome})`,
                                ['NOT NULL']
                            ],
                            [
                                'dias_trabalho',
                                `COLUMN %COLUMN_NAME INT(2) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'dias_folga',
                                `COLUMN %COLUMN_NAME INT(2) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'escala', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'nome',
                                        `varchar(${tables.escala.varchar.limits.nome}) NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'dias_trabalho',
                                        `INT(2) UNSIGNED NOT NULL AFTER nome`
                                    ],
                                    [
                                        'dias_folga',
                                        `INT(2) UNSIGNED NOT NULL AFTER dias_trabalho`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER dias_folga`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'valores_regras'
                 */
                mysql.createTable(database, 'valores_regras')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'valores_regras', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'nome',
                                `COLUMN %COLUMN_NAME varchar(${tables.valores_regras.varchar.limits.nome})`,
                                ['NOT NULL']
                            ],
                            [
                                'valor',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.valores_regras.decimal.valor.digits}, ${tables.valores_regras.decimal.valor.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'nivel',
                                `COLUMN %COLUMN_NAME INT(2) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'valores_regras', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'nome',
                                        `varchar(${tables.valores_regras.varchar.limits.nome}) NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'valor',
                                        `DECIMAL(${tables.valores_regras.decimal.valor.digits}, ${tables.valores_regras.decimal.valor.decimals}) UNSIGNED NOT NULL AFTER nome`
                                    ],
                                    [
                                        'nivel',
                                        `INT(2) UNSIGNED NOT NULL AFTER valor`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER nivel`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'alocacao_funcionario'
                 */
                mysql.createTable(database, 'alocacao_funcionario')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'alocacao_funcionario', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                're_funcionario',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcionario',
                                `COLUMN %COLUMN_NAME varchar(${tables.alocacao_funcionario.varchar.limits.nome_funcionario})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_escala',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_escala',
                                `COLUMN %COLUMN_NAME varchar(${tables.alocacao_funcionario.varchar.limits.nome_escala})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_contrato',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_contrato',
                                `COLUMN %COLUMN_NAME varchar(${tables.alocacao_funcionario.varchar.limits.nome_contrato})`,
                                ['NOT NULL']
                            ],
                            [
                                'dia_inicio',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'dia_fim',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'horario_entrada',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'horario_saida',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'alocacao_funcionario', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        're_funcionario',
                                        `INT(10) ZEROFILL NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'nome_funcionario',
                                        `varchar(${tables.alocacao_funcionario.varchar.limits.nome_funcionario}) NOT NULL AFTER re_funcionario`
                                    ],
                                    [
                                        'codigo_escala',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_funcionario`
                                    ],
                                    [
                                        'nome_escala',
                                        `varchar(${tables.alocacao_funcionario.varchar.limits.nome_escala}) NOT NULL AFTER codigo_escala`
                                    ],
                                    [
                                        'codigo_contrato',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_escala`
                                    ],
                                    [
                                        'nome_contrato',
                                        `varchar(${tables.alocacao_funcionario.varchar.limits.nome_contrato}) NOT NULL AFTER codigo_contrato`
                                    ],
                                    [
                                        'dia_inicio',
                                        `LONGTEXT NOT NULL AFTER nome_contrato`
                                    ],
                                    [
                                        'dia_fim',
                                        `LONGTEXT NOT NULL AFTER dia_inicio`
                                    ],
                                    [
                                        'horario_entrada',
                                        `LONGTEXT NOT NULL AFTER dia_fim`
                                    ],
                                    [
                                        'horario_saida',
                                        `LONGTEXT NOT NULL AFTER horario_entrada`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER horario_saida`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'confirmacao_presenca'
                 */
                mysql.createTable(database, 'confirmacao_presenca')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'confirmacao_presenca', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'codigo_contrato',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_contrato',
                                `COLUMN %COLUMN_NAME varchar(${tables.confirmacao_presenca.varchar.limits.nome_contrato})`,
                                ['NOT NULL']
                            ],
                            [
                                're_funcionario',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcionario',
                                `COLUMN %COLUMN_NAME varchar(${tables.confirmacao_presenca.varchar.limits.re_funcionario})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_funcao',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcao',
                                `COLUMN %COLUMN_NAME varchar(${tables.confirmacao_presenca.varchar.limits.nome_funcao})`,
                                ['NOT NULL']
                            ],
                            [
                                'data',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'horario_entrada',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'horario_saida',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'status',
                                `COLUMN %COLUMN_NAME varchar(${tables.confirmacao_presenca.varchar.limits.status})`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'confirmacao_presenca', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'codigo_contrato',
                                        `INT(10) ZEROFILL NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'nome_contrato',
                                        `varchar(${tables.confirmacao_presenca.varchar.limits.nome_contrato}) NOT NULL AFTER codigo_contrato`
                                    ],
                                    [
                                        're_funcionario',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_contrato`
                                    ],
                                    [
                                        'nome_funcionario',
                                        `varchar(${tables.confirmacao_presenca.varchar.limits.nome_funcionario}) NOT NULL AFTER re_funcionario`
                                    ],
                                    [
                                        'codigo_funcao',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_funcionario`
                                    ],
                                    [
                                        'nome_funcao',
                                        `varchar(${tables.confirmacao_presenca.varchar.limits.nome_funcao}) NOT NULL AFTER codigo_funcao`
                                    ],
                                    [
                                        'data',
                                        `LONGTEXT NOT NULL AFTER nome_funcao`
                                    ],
                                    [
                                        'horario_entrada',
                                        `LONGTEXT NOT NULL AFTER data`
                                    ],
                                    [
                                        'horario_saida',
                                        `LONGTEXT NOT NULL AFTER horario_entrada`
                                    ],
                                    [
                                        'status',
                                        `varchar(${tables.confirmacao_presenca.varchar.limits.status}) NOT NULL AFTER horario_saida`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER status`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'apontamentos'
                 */
                mysql.createTable(database, 'apontamentos')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'apontamentos', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'data',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_contrato',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_contrato',
                                `COLUMN %COLUMN_NAME varchar(${tables.apontamentos.varchar.limits.nome_contrato})`,
                                ['NOT NULL']
                            ],
                            [
                                're_funcionario',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcionario',
                                `COLUMN %COLUMN_NAME varchar(${tables.apontamentos.varchar.limits.nome_funcionario})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_servico',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_servico',
                                `COLUMN %COLUMN_NAME varchar(${tables.apontamentos.varchar.limits.nome_servico})`,
                                ['NOT NULL']
                            ],
                            [
                                'horario_entrada',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'horario_saida',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'horas_trabalhadas',
                                `COLUMN %COLUMN_NAME INT(2) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_dia',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.apontamentos.decimal.valor_dia.digits}, ${tables.apontamentos.decimal.valor_dia.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'apontamentos', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'data',
                                        `LONGTEXT NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'codigo_contrato',
                                        `INT(10) ZEROFILL NOT NULL AFTER data`
                                    ],
                                    [
                                        'nome_contrato',
                                        `varchar(${tables.apontamentos.varchar.limits.nome_contrato}) NOT NULL AFTER codigo_contrato`
                                    ],
                                    [
                                        're_funcionario',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_contrato`
                                    ],
                                    [
                                        'nome_funcionario',
                                        `varchar(${tables.apontamentos.varchar.limits.nome_funcionario}) NOT NULL AFTER re_funcionario`
                                    ],
                                    [
                                        'codigo_servico',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_funcionario`
                                    ],
                                    [
                                        'nome_servico',
                                        `varchar(${tables.apontamentos.varchar.limits.nome_servico}) NOT NULL AFTER codigo_servico`
                                    ],
                                    [
                                        'horario_entrada',
                                        `LONGTEXT NOT NULL AFTER nome_servico`
                                    ],
                                    [
                                        'horario_saida',
                                        `LONGTEXT NOT NULL AFTER horario_entrada`
                                    ],
                                    [
                                        'horas_trabalhadas',
                                        `INT(2) UNSIGNED NOT NULL AFTER horario_saida`
                                    ],
                                    [
                                        'valor_dia',
                                        `DECIMAL(${tables.apontamentos.decimal.valor_dia.digits}, ${tables.apontamentos.decimal.valor_dia.decimals}) UNSIGNED NOT NULL AFTER horas_trabalhadas`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER valor_dia`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'calculo_pagamento'
                 */
                mysql.createTable(database, 'calculo_pagamento')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'calculo_pagamento', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                're_funcionario',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcionario',
                                `COLUMN %COLUMN_NAME varchar(${tables.calculo_pagamento.varchar.limits.nome_funcionario})`,
                                ['NOT NULL']
                            ],
                            [
                                'nome',
                                `COLUMN %COLUMN_NAME varchar(${tables.calculo_pagamento.varchar.limits.nome})`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_dia',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.calculo_pagamento.decimal.valor_dia.digits}, ${tables.calculo_pagamento.decimal.valor_dia.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_total',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.calculo_pagamento.decimal.valor_total.digits}, ${tables.calculo_pagamento.decimal.valor_total.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'calculo_pagamento', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        're_funcionario',
                                        `INT(10) ZEROFILL NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'nome_funcionario',
                                        `varchar(${tables.calculo_pagamento.varchar.limits.nome_funcionario}) NOT NULL AFTER re_funcionario`
                                    ],
                                    [
                                        'nome',
                                        `varchar(${tables.calculo_pagamento.varchar.limits.nome}) NOT NULL AFTER nome_funcionario`
                                    ],
                                    [
                                        'valor_dia',
                                        `DECIMAL(${tables.calculo_pagamento.decimal.valor_dia.digits}, ${tables.calculo_pagamento.decimal.valor_dia.decimals}) UNSIGNED NOT NULL AFTER nome`
                                    ],
                                    [
                                        'valor_total',
                                        `DECIMAL(${tables.calculo_pagamento.decimal.valor_total.digits}, ${tables.calculo_pagamento.decimal.valor_total.decimals}) UNSIGNED NOT NULL AFTER valor_dia`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER valor_total`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'conferencia_pagamento'
                 */
                mysql.createTable(database, 'conferencia_pagamento')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'conferencia_pagamento', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'data',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                're_funcionario',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcionario',
                                `COLUMN %COLUMN_NAME varchar(${tables.conferencia_pagamento.varchar.limits.nome_funcionario})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_funcao',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcao',
                                `COLUMN %COLUMN_NAME varchar(${tables.conferencia_pagamento.varchar.limits.nome_funcao})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_contrato',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_contrato',
                                `COLUMN %COLUMN_NAME varchar(${tables.conferencia_pagamento.varchar.limits.nome_contrato})`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_total',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.conferencia_pagamento.decimal.valor_total.digits}, ${tables.conferencia_pagamento.decimal.valor_total.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'falta',
                                `COLUMN %COLUMN_NAME TINYINT(1) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_desconto',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.conferencia_pagamento.decimal.valor_desconto.digits}, ${tables.conferencia_pagamento.decimal.valor_desconto.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'nivel',
                                `COLUMN %COLUMN_NAME INT(2) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_gratificacao',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.conferencia_pagamento.decimal.valor_gratificacao.digits}, ${tables.conferencia_pagamento.decimal.valor_gratificacao.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_final',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.conferencia_pagamento.decimal.valor_final.digits}, ${tables.conferencia_pagamento.decimal.valor_final.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'conferencia_pagamento', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'data',
                                        `LONGTEXT NOT NULL AFTER codigo`
                                    ],
                                    [
                                        're_funcionario',
                                        `INT(10) ZEROFILL NOT NULL AFTER data`
                                    ],
                                    [
                                        'nome_funcionario',
                                        `varchar(${tables.conferencia_pagamento.varchar.limits.nome_funcionario}) NOT NULL AFTER re_funcionario`
                                    ],
                                    [
                                        'codigo_funcao',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_funcionario`
                                    ],
                                    [
                                        'nome_funcao',
                                        `INT(10) ZEROFILL NOT NULL AFTER codigo_funcao`
                                    ],
                                    [
                                        'codigo_contrato',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_funcao`
                                    ],
                                    [
                                        'nome_contrato',
                                        `varchar(${tables.conferencia_pagamento.varchar.limits.nome_contrato}) NOT NULL AFTER codigo_contrato`
                                    ],
                                    [
                                        'valor_total',
                                        `DECIMAL(${tables.conferencia_pagamento.decimal.valor_total.digits}, ${tables.conferencia_pagamento.decimal.valor_total.decimals}) UNSIGNED NOT NULL AFTER nome_contrato`
                                    ],
                                    [
                                        'falta',
                                        `TINYINT(1) UNSIGNED NOT NULL AFTER valor_total`
                                    ],
                                    [
                                        'valor_desconto',
                                        `DECIMAL(${tables.conferencia_pagamento.decimal.valor_desconto.digits}, ${tables.conferencia_pagamento.decimal.valor_desconto.decimals}) UNSIGNED NOT NULL AFTER falta`
                                    ],
                                    [
                                        'nivel',
                                        `INT(2) UNSIGNED NOT NULL AFTER valor_desconto`
                                    ],
                                    [
                                        'valor_gratificacao',
                                        `DECIMAL(${tables.conferencia_pagamento.decimal.valor_gratificacao.digits}, ${tables.conferencia_pagamento.decimal.valor_gratificacao.decimals}) UNSIGNED NOT NULL AFTER nivel`
                                    ],
                                    [
                                        'valor_final',
                                        `DECIMAL(${tables.conferencia_pagamento.decimal.valor_final.digits}, ${tables.conferencia_pagamento.decimal.valor_final.decimals}) UNSIGNED NOT NULL AFTER valor_gratificacao`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER valor_final`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'pagamento'
                 */
                mysql.createTable(database, 'pagamento')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'pagamento', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'data',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                're_funcionario',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcionario',
                                `COLUMN %COLUMN_NAME varchar(${tables.pagamento.varchar.limits.nome_funcionario})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_funcao',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcao',
                                `COLUMN %COLUMN_NAME varchar(${tables.pagamento.varchar.limits.nome_funcao})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_contrato',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_contrato',
                                `COLUMN %COLUMN_NAME varchar(${tables.pagamento.varchar.limits.nome_contrato})`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_total',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.pagamento.decimal.valor_total.digits}, ${tables.pagamento.decimal.valor_total.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'falta',
                                `COLUMN %COLUMN_NAME TINYINT(1) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_desconto',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.pagamento.decimal.valor_desconto.digits}, ${tables.pagamento.decimal.valor_desconto.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'nivel',
                                `COLUMN %COLUMN_NAME INT(2) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_gratificacao',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.pagamento.decimal.valor_gratificacao.digits}, ${tables.pagamento.decimal.valor_gratificacao.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_final',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.pagamento.decimal.valor_final.digits}, ${tables.pagamento.decimal.valor_final.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'banco',
                                `COLUMN %COLUMN_NAME varchar(${tables.pagamento.varchar.limits.banco})`,
                                ['NOT NULL']
                            ],
                            [
                                'agencia',
                                `COLUMN %COLUMN_NAME varchar(${tables.pagamento.varchar.limits.agencia})`,
                                ['NOT NULL']
                            ],
                            [
                                'conta_corrente',
                                `COLUMN %COLUMN_NAME varchar(${tables.pagamento.varchar.limits.conta_corrente})`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'pagamento', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        'data',
                                        `LONGTEXT NOT NULL AFTER codigo`
                                    ],
                                    [
                                        're_funcionario',
                                        `INT(10) ZEROFILL NOT NULL AFTER data`
                                    ],
                                    [
                                        'nome_funcionario',
                                        `varchar(${tables.pagamento.varchar.limits.nome_funcionario}) NOT NULL AFTER re_funcionario`
                                    ],
                                    [
                                        'codigo_funcao',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_funcionario`
                                    ],
                                    [
                                        'nome_funcao',
                                        `varchar(${tables.pagamento.varchar.limits.nome_funcao}) NOT NULL AFTER codigo_funcao`
                                    ],
                                    [
                                        'codigo_contrato',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_funcao`
                                    ],
                                    [
                                        'nome_contrato',
                                        `varchar(${tables.pagamento.varchar.limits.nome_contrato}) NOT NULL AFTER codigo_contrato`
                                    ],
                                    [
                                        'valor_total',
                                        `DECIMAL(${tables.pagamento.decimal.valor_total.digits}, ${tables.pagamento.decimal.valor_total.decimals}) UNSIGNED NOT NULL AFTER nome_contrato`
                                    ],
                                    [
                                        'falta',
                                        `TINYINT(1) UNSIGNED NOT NULL AFTER valor_total`
                                    ],
                                    [
                                        'valor_desconto',
                                        `DECIMAL(${tables.pagamento.decimal.valor_desconto.digits}, ${tables.pagamento.decimal.valor_desconto.decimals}) UNSIGNED NOT NULL AFTER falta`
                                    ],
                                    [
                                        'nivel',
                                        `INT(2) UNSIGNED NOT NULL AFTER valor_desconto`
                                    ],
                                    [
                                        'valor_gratificação',
                                        `DECIMAL(${tables.pagamento.decimal.valor_gratificacao.digits}, ${tables.pagamento.decimal.valor_gratificacao.decimals}) UNSIGNED NOT NULL AFTER nivel`
                                    ],
                                    [
                                        'valor_final',
                                        `DECIMAL(${tables.pagamento.decimal.valor_final.digits}, ${tables.pagamento.decimal.valor_final.decimals}) UNSIGNED NOT NULL AFTER valor_gratificação`
                                    ],
                                    [
                                        'banco',
                                        `varchar(${tables.pagamento.varchar.limits.banco}) NOT NULL AFTER valor_final`
                                    ],
                                    [
                                        'agencia',
                                        `varchar(${tables.pagamento.varchar.limits.agencia}) NOT NULL AFTER banco`
                                    ],
                                    [
                                        'conta_corrente',
                                        `varchar(${tables.pagamento.varchar.limits.conta_corrente}) NOT NULL AFTER agencia`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER conta_corrente`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria a tabela 'recibo'
                 */
                mysql.createTable(database, 'recibo')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'recibo', [
                            [
                                'codigo',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                're_funcionario',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcionario',
                                `COLUMN %COLUMN_NAME varchar(${tables.recibo.varchar.limits.nome_funcionario})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_funcao',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_funcao',
                                `COLUMN %COLUMN_NAME varchar(${tables.recibo.varchar.limits.nome_funcao})`,
                                ['NOT NULL']
                            ],
                            [
                                'codigo_contrato',
                                `COLUMN %COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'nome_contrato',
                                `COLUMN %COLUMN_NAME varchar(${tables.recibo.varchar.limits.nome_contrato})`,
                                ['NOT NULL']
                            ],
                            [
                                'valor_final',
                                `COLUMN %COLUMN_NAME DECIMAL(${tables.recibo.decimal.valor_final.digits}, ${tables.recibo.decimal.valor_final.decimals}) UNSIGNED`,
                                ['NOT NULL']
                            ],
                            [
                                'observacao',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                []
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'recibo', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL UNIQUE NOT NULL FIRST`
                                    ],
                                    [
                                        're_funcionario',
                                        `INT(10) ZEROFILL NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'nome_funcionario',
                                        `varchar(${tables.recibo.varchar.limits.nome_funcionario}) NOT NULL AFTER re_funcionario`
                                    ],
                                    [
                                        'codigo_funcao',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_funcionario`
                                    ],
                                    [
                                        'nome_funcao',
                                        `varchar(${tables.recibo.varchar.limits.nome_funcao}) NOT NULL AFTER codigo_funcao`
                                    ],
                                    [
                                        'codigo_contrato',
                                        `INT(10) ZEROFILL NOT NULL AFTER nome_funcao`
                                    ],
                                    [
                                        'nome_contrato',
                                        `varchar(${tables.recibo.varchar.limits.nome_contrato}) NOT NULL AFTER codigo_contrato`
                                    ],
                                    [
                                        'valor_final',
                                        `DECIMAL(${tables.recibo.decimal.valor_final.digits}, ${tables.recibo.decimal.valor_final.decimals}) UNSIGNED NOT NULL AFTER nome_contrato`
                                    ],
                                    [
                                        'observacao',
                                        `LONGTEXT AFTER valor_final`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER observacao`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria tabela 'nivel_acesso'
                 */
                mysql.createTable(database, 'nivel_acesso')
                    .then(({
                        sql,
                        query
                    }) => {
                        mysql.modifyTable(database, 'nivel_acesso', [
                            [
                                'codigo',
                                `%COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'nome',
                                `COLUMN %COLUMN_NAME varchar(${tables.nivel_acesso.varchar.limits.nome})`,
                                ['NOT NULL']
                            ],
                            [
                                'menu',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'nivel_acesso', [
                                    [
                                        'codigo',
                                        `INT(10) ZEROFILL NOT NULL UNIQUE FIRST`
                                    ],
                                    [
                                        'nome',
                                        `varchar(${tables.nivel_acesso.varchar.limits.nome}) NOT NULL AFTER codigo`
                                    ],
                                    [
                                        'menu',
                                        `LONGTEXT NOT NULL AFTER nome`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER menu`
                                    ],
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * Cria tabela 'usuario'
                 */
                mysql.createTable(database, 'usuario')
                    .then(({
                        sql,
                        query
                    }) => {

                        mysql.modifyTable(database, 'usuario', [
                            [
                                'database_token',
                                `COLUMN %COLUMN_NAME varchar(5)`,
                                ['DEFAULT', `'${token.value}'`]
                            ],
                            [
                                'nome',
                                `COLUMN %COLUMN_NAME varchar(${tables.usuario.varchar.limits.nome})`,
                                ['NOT NULL']
                            ],
                            [
                                'email',
                                `COLUMN %COLUMN_NAME varchar(${tables.usuario.varchar.limits.email})`,
                                ['NOT NULL', 'UNIQUE']
                            ],
                            [
                                'password',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                ['NOT NULL']
                            ],
                            [
                                'password_reset',
                                'COLUMN %COLUMN_NAME LONGTEXT',
                                []
                            ],
                            [
                                'nivel_acesso_id',
                                `%COLUMN_NAME INT(10) ZEROFILL`,
                                ['NOT NULL']
                            ],
                            [
                                'data_de_criacao',
                                `COLUMN %COLUMN_NAME TIMESTAMP`,
                                ['DEFAULT', 'CURRENT_TIMESTAMP()']
                            ],
                            [
                                'messages',
                                `COLUMN %COLUMN_NAME LONGTEXT`,
                                []
                            ]
                        ])
                            .then(({
                                sql,
                                query
                            }) => {

                                mysql.setPositionColumnsInTable(database, 'usuario', [
                                    [
                                        'database_token',
                                        `varchar(5) DEFAULT '${token.value}' FIRST`
                                    ],
                                    [
                                        'nome',
                                        `varchar(${tables.usuario.varchar.limits.nome}) NOT NULL AFTER database_token`
                                    ],
                                    [
                                        'email',
                                        `varchar(${tables.usuario.varchar.limits.email}) NOT NULL UNIQUE AFTER nome`
                                    ],
                                    [
                                        'password',
                                        `LONGTEXT NOT NULL AFTER email`
                                    ],
                                    [
                                        'password_reset',
                                        `LONGTEXT AFTER password`
                                    ],
                                    [
                                        'nivel_acesso_id',
                                        `INT(10) ZEROFILL NOT NULL AFTER password_reset`
                                    ],
                                    [
                                        'data_de_criacao',
                                        `TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER nivel_acesso_id`
                                    ],
                                    [
                                        'messages',
                                        `LONGTEXT AFTER data_de_criacao`
                                    ]
                                ])
                                    .catch(({
                                        err,
                                        details
                                    }) => {
                                        if (err) return console.error({
                                            error: err,
                                            details
                                        });
                                    })
                            })
                            .catch(({
                                err,
                                details
                            }) => {
                                if (err) return console.error({
                                    error: err,
                                    details
                                });
                            })
                    })
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err) return console.error({
                            error: err,
                            details
                        });
                    })

                /**
                 * ADICIONA REFERENCIA ENTRE TABELAS
                 */
                mysql.insertReferenceInTable(database, ['usuario', 'nivel_acesso_id'], ['nivel_acesso', 'codigo'], 'fk_nivel_acesso')
                    .catch(({
                        err,
                        details
                    }) => {
                        if (err)
                            if (details['errno'] != 1826 && details['errno'] != 1213) return console.error({
                                error: err,
                                details
                            });
                    })

                /** PONTO FINAL PARA NOVOS BANCO DE DADOS */
            }).catch(({
                err,
                details
            }) => {
                if (err) return console.error({
                    error: err,
                    details
                });
            })
    })

}


/**
 * Para criar o relacionamento entre tabelas.
 */
// [
//     'empresa_id',
//     `%COLUMN_NAME INT(10) ZEROFILL`,
//     ['NOT NULL']
// ],
//     [
//         'fk_empresa_id',
//         `CONSTRAINT fk_empresa_id FOREIGN KEY (empresa_id) REFERENCES empresa(codigo)`,
//         []
//     ]