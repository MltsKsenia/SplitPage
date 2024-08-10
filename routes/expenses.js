// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Добавление нового расхода
router.post('/add', expenseController.addExpense);

// Получение расходов группы
router.get('/group/:groupId', expenseController.getGroupExpenses);

// Удаление транзакции
router.delete('/:expenseId', expenseController.deleteExpense);

module.exports = router;