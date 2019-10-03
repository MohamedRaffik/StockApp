const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const api = require('./routes');

app.use(express.json());
app.use('/api', api);
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});