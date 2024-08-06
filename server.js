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

const groupsRoutes = require('./routes/groups');
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/user');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});