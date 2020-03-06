const
    path = require('path'),
    fs = require('fs'),
    authConfig = require('../config/auth'),
    jwt = require('jsonwebtoken');

module.exports = {
    sign: (database) => {
        return new Promise(async (resolve, reject) => {
            const
                folder = path.resolve('./mysql/webtoken/'),
                file = `${folder}\\databasetoken.json`;

            if (!fs.existsSync(folder)) fs.mkdirSync(folder);
            if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}, null, 2), 'utf8');

            try {
                let data = JSON.parse(fs.readFileSync(file, 'utf8'));

                let token = jwt.sign({
                    database: database
                }, authConfig.secret, {
                    expiresIn: 60
                }).split('.')[2].substr(0, 5);

                const
                    filter = Object.values(data).filter(value => {
                        return value === database;
                    }),
                    filter2 = Object.keys(data).filter(key => {
                        return data[key] === database;
                    });

                if (filter.length <= 0) {
                    data[String(token)] = String(database);
                    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
                } else {
                    token = filter2[0];
                }

                return resolve(String(token));
            } catch (error) {
                return reject(error);
            }
        })
    },
    verify: (token) => {
        return new Promise((resolve, reject) => {
            const
                folder = path.resolve('./mysql/webtoken/'),
                file = `${folder}\\databasetoken.json`;

            if (!fs.existsSync(folder) || !fs.existsSync(file))
                return reject();

            try {
                let data = JSON.parse(fs.readFileSync(file, 'utf8'));

                if (
                    Object.keys(data).filter(key => {
                        return key === String(token);
                    }).length > 0
                ) {
                    return resolve(data[String(token)]);
                } else {
                    return reject();
                }

            } catch (error) {
                return reject(error);
            }

        })
    }
}