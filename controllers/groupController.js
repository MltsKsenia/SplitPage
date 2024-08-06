// controllers/groupController.js
const db = require('../configdb/database');

// Создание группы
exports.createGroup = async (req, res) => {
    const { name, created_by } = req.body;
    try {
        // Создаем новую группу
        const newGroup = await db('Groups').insert({ name, created_by }).returning('*');
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Ошибка при создании группы:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Добавление пользователя в группу
exports.addUserToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { email } = req.body;
    try {
        // Проверяем, существует ли пользователь с таким email
        const user = await db('Users').where({ email }).first();
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем, существует ли группа
        const group = await db('Groups').where({ id: groupId }).first();
        if (!group) {
            return res.status(404).json({ message: 'Группа не найдена' });
        }

        // Добавляем пользователя в группу
        await db('UserGroups').insert({ user_id: user.id, group_id: groupId });
        res.status(200).json({ message: 'Пользователь добавлен в группу' });
    } catch (error) {
        console.error('Ошибка при добавлении пользователя в группу:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получение групп пользователя
exports.getUserGroups = async (req, res) => {
    const { userId } = req.params;
    try {
        const groups = await db('UserGroups')
            .join('Groups', 'UserGroups.group_id', 'Groups.id')
            .where('UserGroups.user_id', userId)
            .select('Groups.id', 'Groups.name', 'Groups.created_by');
        res.json(groups);
    } catch (error) {
        console.error('Ошибка при получении групп пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Удаление группы
exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    try {
        // Удаляем группу и связанные записи
        await db('UserGroups').where({ group_id: groupId }).del();
        await db('ExpenseShares').whereIn('expense_id', db('Expenses').select('id').where({ group_id: groupId })).del();
        await db('Expenses').where({ group_id: groupId }).del();
        await db('Groups').where({ id: groupId }).del();
        res.status(200).json({ message: 'Группа удалена' });
    } catch (error) {
        console.error('Ошибка при удалении группы:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получение баланса группы
exports.getGroupBalance = async (req, res) => {
    const { groupId } = req.params;
    try {
        const expenses = await db('Expenses')
            .where({ group_id: groupId })
            .select('id', 'amount', 'paid_by');

        const balances = {};

        for (const expense of expenses) {
            const shares = await db('ExpenseShares').where({ expense_id: expense.id });

            for (const share of shares) {
                if (share.user_id !== expense.paid_by) {
                    balances[share.user_id] = (balances[share.user_id] || 0) + share.amount;
                    balances[expense.paid_by] = (balances[expense.paid_by] || 0) - share.amount;
                }
            }
        }

        res.json(balances);
    } catch (error) {
        console.error('Ошибка при получении баланса группы:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
