const path = require('node:path');
const express = require('express');
const cors = require('cors');
const user = require('./src/routes/user.route');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'views/index.html'));
});

app.use('/api', user);

module.exports = app;
