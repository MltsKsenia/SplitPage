// controllers/expenseController.js
const db = require('../configdb/database');

// Add new expense
exports.addExpense = async (req, res) => {
    const { group_id, description, amount, date, payer_id, receiver_id, type } = req.body;

    try {
        const newTransaction = await db('transactions')
            .insert({ group_id, description, amount, date, payer_id, receiver_id, type })
            .returning('*');

        res.status(201).json(newTransaction[0]);
    } catch (error) {
        console.error('Ошибка при добавлении транзакции:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получение расходов группы
exports.getGroupExpenses = async (req, res) => {
    const { groupId } = req.params;
    try {
        const expenses = await db('expenses')
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
        const expenses = await db('expenseshares')
            .join('expenses', 'epenseshares.expense_id', 'Expenses.id')
            .where('expenseShares.user_id', userId)
            .select('expenses.id', 'expenses.description', 'Expenses.amount', 'Expenses.date', 'Expenses.paid_by');
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
        const expense = await db('expenses').where({ id: expense_id }).first();
        if (!expense) {
            return res.status(404).json({ message: 'Расход не найден' });
        }

        // Обновляем доли пользователей
        for (const share of shares) {
            await db('expenseshares').update({ amount: share.amount }).where({ expense_id, user_id: share.user_id });
        }

        res.status(200).json({ message: 'Расход разделен' });
    } catch (error) {
        console.error('Ошибка при разделении расхода:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
