const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Sequelize } = require('sequelize');
const app = express();
const port = 3000;

const sequelize = require('./config/database');
const User = require('./models/user');
const Group = require('./models/group');
const Expense = require('./models/expense');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/groups', require('./routes/groups'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});