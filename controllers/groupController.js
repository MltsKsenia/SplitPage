// controllers/groupController.js
const db = require('../configdb/database');

// Создание группы
exports.createGroup = async (req, res) => {
    const { name, created_by, friendId } = req.body;
    try {
        // Проверяем, что name, created_by и friendId предоставлены
        if (!name || !created_by || !friendId) {
            return res.status(400).json({ message: 'Name, created_by, and friendId are required' });
        }

        // Преобразуем created_by и friendId в числа
        const createdBy = Number(created_by);
        const friendIdNumber = Number(friendId);

        // Создание группы
        const [groupIdRow] = await db('groups').insert({ name, created_by: createdBy }).returning('id');
        const groupId = groupIdRow.id || groupIdRow; // В зависимости от версии Knex возвращается объект или значение

        // Добавление создателя группы в usergroups
        await db('usergroups').insert({ group_id: groupId, user_id: createdBy });

        // Добавление второго пользователя в usergroups
        await db('usergroups').insert({ group_id: groupId, user_id: friendIdNumber });

        res.status(201).json({ message: 'Group created successfully', group: { id: groupId, name } });
    } catch (error) {
        console.error('Error creating group:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Добавление пользователя в группу
exports.addUserToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { friendId } = req.body; // Получаем friendId из тела запроса

    try {
        // Проверяем, существует ли пользователь с таким ID
        const user = await db('users').where({ id: friendId }).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Проверяем, существует ли группа
        const group = await db('groups').where({ id: groupId }).first();
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Добавляем пользователя в группу
        await db('usergroups').insert({ user_id: friendId, group_id: groupId });
        res.status(200).json({ message: 'User added to group' });
    } catch (error) {
        console.error('Error with adding user to group:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Получение списка групп юзера
exports.getUserGroups = async (req, res) => {
    const { userId } = req.params;
    try {
        console.log(`Fetching groups for user with ID: ${userId}`);

        const groups = await db('usergroups')
            .join('groups', 'groups.id', 'usergroups.group_id') // Соединяем таблицы по group_id
            .where('usergroups.user_id', userId) // Фильтруем по user_id
            .select('groups.id', 'groups.name'); // Выбираем необходимые поля

        console.log('Groups fetched:', groups); // Лог данных

        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Удаление группы
exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    console.log(`Deleting group with ID: ${groupId}`);
    try {
        await db('groups').where('id', groupId).del(); // Удаление группы из таблицы групп
        await db('usergroups').where('group_id', groupId).del(); // Удаление записей из таблицы usergroups

        res.status(200).json({ message: 'Group successfully deleted' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Получение всех транзакций для группы
exports.getTransactions = async (req, res) => {
    const { groupId } = req.params;
    try {
        const transactions = await db('transactions')
            .where({ group_id: groupId })
            .select('description', 'amount', 'payer_id', 'receiver_id', 'type', 'date');

        const formattedTransactions = transactions.map(transaction => {
            return {
                ...transaction,
                amount: transaction.amount, // Оставляем форматирование суммы, если необходимо
                total_amount: transaction.amount // Убедитесь, что total_amount правильно отображается
            };
        });

        res.json(formattedTransactions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Добавление нового расхода
exports.addExpense = async (req, res) => {
    const { description, amount, date, payer_id, receiver_id, type } = req.body;
    const { groupId } = req.params; // Получаем groupId из параметров URL

    try {
        // Добавление записи в таблицу transactions
        await db('transactions').insert({
            group_id: groupId, // Используем groupId из параметров URL
            description,
            amount,
            date,
            payer_id,
            receiver_id,
            type
        });

        res.status(201).json({ message: 'Expense added successfully' });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};