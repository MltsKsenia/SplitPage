const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Sequelize } = require('sequelize');


const app = express();
const port = 3000;

const db = require('./configdb/database');

const User = require('./models/user');
const Group = require('./models/group');
const Expense = require('./models/expense');

const indexRoutes = require('./routes/index');
const profileRoutes = require('./routes/profile');
const groupsRoutes = require('./routes/groups');
const expensesRoutes = require('./routes/expenses');
const registerRoutes = require('./routes/register');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);
app.use('/register', registerRoutes);
app.use('/groups', groupsRoutes);
app.use('/expenses', expensesRoutes);
app.use('/profile', profileRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});