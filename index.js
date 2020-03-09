const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.options('*', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, api_key, authorization");
    return res.sendStatus(200);
});

app.use(cors(corsOptions));


/**
 * Import Routes
 */
require('./routes/index')(app);

/**
 * Starting MySQL
 */
require('./mysql/initialize');


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
});