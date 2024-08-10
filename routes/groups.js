const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Создание новой группы
router.post('/create', groupController.createGroup);

// Добавление пользователя в группу
router.post('/:groupId/addUser', groupController.addUserToGroup);

// Получение групп пользователя
router.get('/user/:userId', groupController.getUserGroups);

// Удаление группы
router.delete('/:groupId', groupController.deleteGroup);

// Получение всех транзакций для группы
router.get('/transactions/:groupId', groupController.getTransactions);

// Добавление транзакций в группу
router.post('/transactions/:groupId/add', groupController.addExpense);

module.exports = router;