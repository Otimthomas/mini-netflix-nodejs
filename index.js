const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const users = require('./routes/user');
const auth = require('./routes/auth');
const movies = require('./routes/movies');
const app = express();

//check if the private key is set
if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not set');
    process.exit(1);
}

// connect to database(mongoose)
mongoose.connect('mongodb://localhost/mini-netflix-react', {
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('connected to MongoDB...'))
    .catch(() => console.log('could not connect to db...'))

// middleware usage
app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/movies', movies);

// create port to listen to
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

module.exports = server;