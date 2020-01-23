const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
* Import models to database
*/
require('./models/User');
require('./models/Product');

/**
 * Connect to Database
 */
mongoose.Promise = global.Promise;
mongoose
    .set('useNewUrlParser', true)
    .set('useFindAndModify', false)
    .set('useCreateIndex', true)
    .set('useUnifiedTopology', true)
    .connect(process.env.MONGODB_URI || `mongodb://localhost:27017/node-react-starter`);

/**
 * Import Routes
 */
require('./routes/index')(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
});