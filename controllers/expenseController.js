// controllers/expenseController.js
const db = require('../configdb/database');

// Добавление нового расхода
exports.addExpense = async (req, res) => {
    const { group_id, description, amount, date, paid_by, shares } = req.body;
    try {
        // Проверяем, существует ли группа
        const group = await db('Groups').where({ id: group_id }).first();
        if (!group) {
            return res.status(404).json({ message: 'Группа не найдена' });
        }

        // Проверяем, существует ли пользователь, который оплатил
        const payer = await db('Users').where({ id: paid_by }).first();
        if (!payer) {
            return res.status(404).json({ message: 'Пользователь, который оплатил, не найден' });
        }

        // Добавляем расход в базу данных
        const newExpense = await db('Expenses').insert({ group_id, description, amount, date, paid_by }).returning('*');

        // Добавляем доли для каждого пользователя
        for (const share of shares) {
            await db('ExpenseShares').insert({ expense_id: newExpense[0].id, user_id: share.user_id, amount: share.amount });
        }

        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Ошибка при добавлении расхода:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получение расходов группы
exports.getGroupExpenses = async (req, res) => {
    const { groupId } = req.params;
    try {
        const expenses = await db('Expenses')
            .where({ group_id: groupId })
            .select('id', 'description', 'amount', 'date', 'paid_by');
        res.json(expenses);
    } catch (error) {
        console.error('Ошибка при получении расходов группы:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получение расходов пользователя
exports.getUserExpenses = async (req, res) => {
    const { userId } = req.params;
    try {
        const expenses = await db('ExpenseShares')
            .join('Expenses', 'ExpenseShares.expense_id', 'Expenses.id')
            .where('ExpenseShares.user_id', userId)
            .select('Expenses.id', 'Expenses.description', 'Expenses.amount', 'Expenses.date', 'Expenses.paid_by');
        res.json(expenses);
    } catch (error) {
        console.error('Ошибка при получении расходов пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Разделение расходов
exports.splitExpense = async (req, res) => {
    const { expense_id, shares } = req.body;
    try {
        // Проверяем, существует ли расход
        const expense = await db('Expenses').where({ id: expense_id }).first();
        if (!expense) {
            return res.status(404).json({ message: 'Расход не найден' });
        }

        // Обновляем доли пользователей
        for (const share of shares) {
            await db('ExpenseShares').update({ amount: share.amount }).where({ expense_id, user_id: share.user_id });
        }

        res.status(200).json({ message: 'Расход разделен' });
    } catch (error) {
        console.error('Ошибка при разделении расхода:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
