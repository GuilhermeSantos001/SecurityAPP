const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = require('../config/mail')

const transport = nodemailer.createTransport({ host, port, auth: { user, pass } });

const handlebarOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./resources/mail/'),
        layoutsDir: path.resolve('./resources/mail/'),
        defaultLayout: undefined
    },
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html'
};

transport.use('compile', hbs(handlebarOptions));

module.exports = transport;