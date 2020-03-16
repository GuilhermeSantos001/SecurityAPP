const crypto = require('../api/crypto');
const fs = require('fs');
const path = require('path');
const file = path.resolve('./api/apiKey.json');
const key = require('../config/api').key;
const getReqProps = require('../modules/getReqProps');

/**
 * Generate API Key
 */
if (!fs.existsSync(file)) {
    let data = crypto.encrypt(key);
    let iv = data.iv;

    data.tag = data.tag.toString('binary');
    delete data.iv;

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    console.log('Copy Your API KEY');
    console.log(iv);
}

module.exports = (req, res, next) => {
    const authHeader = getReqProps(req, ['api_key'])['api_key'];

    if (!fs.existsSync(file))
        return res.status(401).send({ error: 'Not possible access the Api Key' });

    if (!authHeader) return res.status(401).send({ error: 'No Api Key provided' });

    let api_key = JSON.parse(fs.readFileSync(file, 'utf8'));

    api_key.tag = Buffer.from(api_key.tag, 'binary');
    api_key.iv = authHeader;

    if (!crypto.decrypt(api_key, key)) return res.status(401).send({ error: 'Verify your Api Key' });

    return next();
};