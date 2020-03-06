const
    path = require('path'),
    fs = require('fs'),
    authConfig = require('../config/auth'),
    jwt = require('jsonwebtoken');

module.exports = {
    sign: (token, levelaccess, webtoken) => {
        return new Promise(async (resolve, reject) => {
            const
                folder = path.resolve('./mysql/webtoken/'),
                file = `${folder}\\invitetoken.json`;

            if (!fs.existsSync(folder)) fs.mkdirSync(folder);
            if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}, null, 2), 'utf8');

            try {
                let data = JSON.parse(fs.readFileSync(file, 'utf8'));

                let _token = jwt.sign({
                    token: token
                }, authConfig.secret, {
                    expiresIn: 60
                }).split('.')[2].substr(0, 5);

                const
                    filter = Object.values(data).filter(value => {
                        return value['token'] === token;
                    }),
                    filter2 = Object.keys(data).filter(key => {
                        return data[key]['token'] === token;
                    });

                if (filter.length <= 0) {
                    const now = new Date();

                    now.setMinutes(now.getMinutes() + 5);

                    data[String(_token)] = {
                        webtoken: webtoken,
                        token: token,
                        levelaccess: levelaccess,
                        expiresIn: now
                    };
                    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
                } else {
                    _token = filter2[0];
                }

                return resolve(_token);
            } catch (error) {
                return reject(error);
            }
        })
    },
    verify: (token, webtoken) => {
        return new Promise((resolve, reject) => {
            const
                folder = path.resolve('./mysql/webtoken/'),
                file = `${folder}\\invitetoken.json`;

            if (!fs.existsSync(folder) || !fs.existsSync(file))
                return reject();

            try {
                let data = JSON.parse(fs.readFileSync(file, 'utf8'));

                const filter = Object.keys(data).filter(key => {
                    return key === String(token);
                })

                if (filter.length > 0) {
                    if (data[String(token)]['webtoken'] === webtoken) {
                        return resolve(data[String(token)]);
                    } else {
                        return reject();
                    }
                } else {
                    return reject();
                }

            } catch (error) {
                return reject(error);
            }

        })
    },
    destroy: (token) => {
        return new Promise((resolve, reject) => {
            const
                folder = path.resolve('./mysql/webtoken/'),
                file = `${folder}\\invitetoken.json`;

            if (!fs.existsSync(folder) || !fs.existsSync(file))
                return reject();

            try {
                let data = JSON.parse(fs.readFileSync(file, 'utf8'));

                const filter = Object.keys(data).filter(key => {
                    return key === String(token);
                })

                if (filter.length > 0) {
                    delete data[String(token)];

                    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');

                    return resolve();
                } else {
                    return reject();
                }

            } catch (error) {
                return reject(error);
            }
        })
    }
}