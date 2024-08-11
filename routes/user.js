
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Регистрация нового пользователя
router.post('/register', userController.register);

// Логин пользователя
router.post('/login', userController.login);

// Получение профиля пользователя
router.get('/:userId', userController.getUserProfile);

// Обновление профиля пользователя
router.put('/:userId', userController.updateUserProfile);

// Маршрут для получения пользователей группы
router.get('/usergroups/:groupId', userController.getGroupUsers);

module.exports = router;