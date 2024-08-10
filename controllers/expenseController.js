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
        console.error('Error with adding expense:', error);
        res.status(500).json({ message: 'ServerError' });
    }
};

// Get group expenses
exports.getGroupExpenses = async (req, res) => {
    const { groupId } = req.params;
    try {
        const expenses = await db('transactions')
            .where({ group_id: groupId });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error with getting all group transactions', error);
        res.status(500).json({ message: 'server error' });
    }
};

// Delete Expense

exports.deleteExpense = async (req, res) => {
    
    const { expenseId } = req.params;
    
    try {
        await db('transactions').where('id', expenseId).del();
        res.status(200).json({ message: 'Expense deleted' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};