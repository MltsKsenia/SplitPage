// controllers/groupController.js
const db = require('../configdb/database');

// Создание группы
exports.createGroup = async (req, res) => {
    const { name, created_by } = req.body;
    try {
        // Создаем новую группу
        const newGroup = await db('groups').insert({ name, created_by }).returning('*');
        await db('usergroups').insert({ user_id: created_by, group_id: newGroup.id });
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Добавление пользователя в группу
exports.addUserToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { email } = req.body;
    try {
        // Проверяем, существует ли пользователь с таким email
        const user = await db('users').where({ email }).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Проверяем, существует ли группа
        const group = await db('groups').where({ id: groupId }).first();
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Добавляем пользователя в группу
        await db('usergroups').insert({ user_id: user.id, group_id: groupId });
        res.status(200).json({ message: 'User added to group' });
    } catch (error) {
        console.error('Error with adding user to group:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Получение групп пользователя
exports.getUserGroups = async (req, res) => {
    const { userId } = req.params;
    try {
        const groups = await db('usergroups')
            .join('groups', 'usergroups.group_id', 'groups.id')
            .where('usergroups.user_id', userId)
            .select('groups.id', 'groups.name', 'groups.created_by');
        res.json(groups);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Удаление группы
exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    try {
        // Удаляем группу и связанные записи
        await db('usergroups').where({ group_id: groupId }).del();
        await db('expenseshares').whereIn('expense_id', db('expenses').select('id').where({ group_id: groupId })).del();
        await db('expenses').where({ group_id: groupId }).del();
        await db('groups').where({ id: groupId }).del();
        res.status(200).json({ message: 'Group deleted' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Получение баланса группы
exports.getGroupBalance = async (req, res) => {
    const { groupId } = req.params;
    try {
        const expenses = await db('expenses')
            .where({ group_id: groupId })
            .select('id', 'amount', 'paid_by');

        const balances = {};

        for (const expense of expenses) {
            const shares = await db('expenseshares').where({ expense_id: expense.id });

            for (const share of shares) {
                if (share.user_id !== expense.paid_by) {
                    balances[share.user_id] = (balances[share.user_id] || 0) + share.amount;
                    balances[expense.paid_by] = (balances[expense.paid_by] || 0) - share.amount;
                }
            }
        }

        res.json(balances);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
