const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const api = require('./routes');
const session = require('express-session');
const uuid = require('uuid/v4');
const { CreateConnection } = require('./models');
const utils = require('./controllers/utils');

CreateConnection().then(db => {
    const User = require('./models').User(db);
    const passport = require('./passport')(User);

    const context = {
        User,
        passport,
        utils
    };
    
    app.use(express.json());
    app.use(session({
        'secret': uuid(),
        'resave': false,
        'saveUninitialized': false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/api', api(context));
    app.use(express.static(path.join(__dirname, 'client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'));
    });
    
    app.listen(PORT, () => {
        console.log(`Listening on Port ${PORT}`);
    });
}).catch(err => console.error(err));
