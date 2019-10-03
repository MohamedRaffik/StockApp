const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/local', {useNewUrlParser: true});

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    hash: String,
    transactions: Array,
    stocks: Object
});

const User = mongoose.model('User', UserSchema);