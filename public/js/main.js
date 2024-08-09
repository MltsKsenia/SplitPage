//main.js
// Декорация страницы с группами и расходами
document.getElementById('addGroupBtn').addEventListener('click', showCreateGroupModal);
document.getElementById('addExpenseBtn').addEventListener('click', showAddExpenseModal);
// document.getElementById('deleteExpenseBtn').addEventListener('click', enableDeleteExpenses);
// document.getElementById('deleteGroupBtn').addEventListener('click', enableDeleteGroups);

function showExpenses(groupName) {
    document.getElementById('selectedGroupName').textContent = groupName;
    document.getElementById('addExpenseBtn').style.display = 'block';
    document.getElementById('deleteExpenseBtn').style.display = 'block';
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';
}

// function enableDeleteExpenses() {
//     const expenseItems = document.querySelectorAll('#expenseList li');
//     expenseItems.forEach(expenseItem => {
//         expenseItem.style.backgroundColor = '#6dac95';

//         expenseItem.addEventListener('click', () => {
//             expenseItem.remove();
//         });

//         expenseItem.addEventListener('mouseover', () => {
//             expenseItem.style.backgroundColor = '#095b4d';
//             expenseItem.style.cursor = 'pointer';
//         });

//         expenseItem.addEventListener('mouseout', () => {
//             expenseItem.style.backgroundColor = '#6dac95';
//             expenseItem.style.cursor = 'pointer';
//         });

//         expenseItem.addEventListener('mousedown', () => {
//             expenseItem.style.backgroundColor = '#6dac95';
//             expenseItem.style.cursor = 'pointer';
//         });

//         expenseItem.addEventListener('mouseup', () => {
//             expenseItem.style.backgroundColor = '#095b4d';
//             expenseItem.style.cursor = 'pointer';
//         });
//     });
// }

function showCreateGroupModal() {
    document.getElementById('create-group-modal').style.display = 'flex';
}

function showAddExpenseModal() {
    document.getElementById('add-expense-modal').style.display = 'flex';
}

function hideCreateModal() {
    document.getElementById('create-group-modal').style.display = 'none';
    document.getElementById('add-expense-modal').style.display = 'none';
}

// Создание группы и добавление пользователя в группу
async function createGroupAndAddUser(groupName, created_by, friendId) {
    try {
        // Создание группы
        const groupResponse = await fetch('/api/groups/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: groupName, created_by, friendId }) // Передаем friendId здесь
        });

        const groupData = await groupResponse.json();
        if (groupResponse.ok) {
            alert('Group created!');

            // Добавление пользователя в группу
            const groupId = groupData.group.id; // Предполагается, что API возвращает ID группы
            // Обновление интерфейса или другое действие
            alert('User added to the group successfully!');
            // window.location.reload();
        } else {
            alert(groupData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function createGroupHandler() {
    const groupName = document.getElementById('groupNameInput').value;
    const friendId = document.getElementById('friendIdInput').value;
    const created_by = localStorage.getItem('userId');

    if (groupName && friendId) {
        const groupList = document.getElementById('groupList');
        const groupItem = document.createElement('li');
        groupItem.textContent = `${groupName} (${friendId})`;

        groupItem.addEventListener('click', () => showExpenses(groupName));
        groupList.appendChild(groupItem);
        document.getElementById('groupNameInput').value = '';
        document.getElementById('friendIdInput').value = '';
        hideCreateModal();
        // Вызов асинхронной функции для создания группы и добавления пользователя
        createGroupAndAddUser(groupName, created_by, friendId);
    } else {
        alert('Please enter both group name and friend ID.');
    }
}
// Получение групп пользователя
async function getUserGroups(userId) {
    try {
        const response = await fetch(`/api/groups/user/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error fetching groups: ${errorMessage}`);
        }

        const userGroups = await response.json();
        console.log('Groups fetched:', userGroups); // Лог для проверки данных

        const groupList = document.getElementById('groupList');
        groupList.innerHTML = ''; // Очищаем список перед добавлением

        userGroups.forEach(userGroup => {
            const groupItem = document.createElement('li');
            groupItem.textContent = `${userGroup.name} (${userGroup.id})`;
            groupItem.setAttribute('data-group-id', userGroup.id);
            groupItem.addEventListener('click', () => showExpenses(userGroup.id, userGroup.name));
            groupList.appendChild(groupItem);
            console.log('Group item added:', groupItem); // Лог добавленных элементов
        });
    } catch (error) {
        console.error('Error:', error.message);
        alert('Failed to fetch groups: ' + error.message);
    }
}

// Проверка токена и извлечение информации о пользователе
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            console.log('Decoded Token:', decodedToken);  // Лог структуры токена

            const userId = decodedToken.id; // Проверка ключа
            console.log('User ID:', userId); // Лог user ID для проверки

            // Убедитесь, что `userId` не равен `undefined`
            if (userId) {
                getUserGroups(userId);  // Вызов функции с правильным userId
            } else {
                console.error('Error: userId is undefined');
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    } else {
        console.error('No token found in localStorage');
        window.location.href = '/login';
    }
});

// // Добавление расхода
// async function addExpense(group_id, description, amount, date, paid_by, shares) {
//     try {
//         const response = await fetch('/api/expenses/add', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             body: JSON.stringify({ group_id, description, amount, date, paid_by, shares })
//         });

//         const data = await response.json();
//         if (response.ok) {
//             alert('Expense added successfully!');
//             window.location.reload();
//         } else {
//             alert(data.message);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// function addExpenseHandler() {
//     const expenseName = document.getElementById('expenseName').value;
//     const amount = document.getElementById('amount').value;
//     const date = document.getElementById('expenseDate').value;
//     const paid_by = document.getElementById('paidBy').value;
//     const group_id = document.getElementById('groupId').value;
//     const shares = document.getElementById('shares').value.split('/').map(share => share.trim());

//     if (expenseName && amount && date && paid_by && group_id && shares.length > 0) {
//         const expenseList = document.getElementById('expenseList');
//         const expenseItem = document.createElement('li');
//         expenseItem.textContent = `${expenseName} (${amount})`;
//         expenseList.appendChild(expenseItem);
//         document.getElementById('expenseName').value = '';
//         document.getElementById('amount').value = '';
//         document.getElementById('expenseDate').value = '';
//         document.getElementById('paidBy').value = '';
//         document.getElementById('groupId').value = '';
//         document.getElementById('shares').value = '';
//         hideCreateModal();

//         // Вызов асинхронной функции
//         addExpense(group_id, expenseName, amount, date, paid_by, shares);
//     } else {
//         alert('Please enter all required fields.');
//     }
// }
