// controllers/userController.js
const db = require('../configdb/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Проверяем, существует ли пользователь
        const user = await db('users').where({ email }).first();
        if (user) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Сохраняем пользователя в базу данных
        const newUser = await db('users').insert({ name, email, password: hashedPassword }).returning('*');
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Логин пользователя
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Проверяем, существует ли пользователь
        const user = await db('users').where({ email }).first();
        if (!user) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        // Создаем JWT токен
        const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });

        res.json({ token, userId: user.id });
    } catch (error) {
        console.error('Ошибка при логине пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получение профиля пользователя
exports.getUserProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await db('users').where({ id: userId }).select('id', 'name', 'email').first();
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (error) {
        console.error('Ошибка при получении профиля пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Обновление профиля пользователя
exports.updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const { name, email } = req.body;
    try {
        const updatedUser = await db('users').where({ id: userId }).update({ name, email }).returning(['id', 'name', 'email']);
        res.json(updatedUser);
    } catch (error) {
        console.error('Ошибка при обновлении профиля пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получение списка пользователей для конкретной группы
exports.getGroupUsers = async (req, res) => {
    const { groupId } = req.params;
    try {
        // Запрос к таблице usergroups, чтобы получить всех пользователей для данной группы
        const users = await db('usergroups')
            .join('users', 'usergroups.user_id', '=', 'users.id') // Соединяем таблицу usergroups с users
            .select('users.id', 'users.name') // Выбираем нужные поля из таблицы users
            .where('usergroups.group_id', groupId); // Фильтруем по group_id

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found for this group' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users for group:', error);
        res.status(500).json({ message: 'Server error' });
    }
};