//main.js

// document.getElementById('addExpenseBtn').addEventListener('click', showAddExpenseModal);
// document.getElementById('deleteExpenseBtn').addEventListener('click', enableDeleteExpenses);


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

function showAddExpenseModal() {
    document.getElementById('add-expense-modal').style.display = 'flex';
}

function hideCreateModal() {
    document.getElementById('create-group-modal').style.display = 'none';
    document.getElementById('add-expense-modal').style.display = 'none';
}

// Создание группы и добавление пользователя в группу
document.getElementById('addGroupBtn').addEventListener('click', showCreateGroupModal);

function showCreateGroupModal() {
    document.getElementById('create-group-modal').style.display = 'flex';
}

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

// Обработчик на кнопку удаления группы
document.getElementById('deleteGroupBtn').addEventListener('click', () => {
    enableDeleteGroups();
});

// Удаление группы
async function deleteGroup(groupId) {
    try {
        const response = await fetch(`/api/groups/${groupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            alert('Group successfully deleted!');
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error with delete:', error);
        throw error;
    }
}
// Обработчик удаления группы
async function deleteGroupHandler(groupItem, groupId) {
    if (confirm('Are you sure you want to delete this group?')) {
        try {
            await deleteGroup(groupId);  // Дождаться завершения удаления

            // Если удаление прошло успешно, удалить элемент из UI
            groupItem.remove();
            cancelDeleteMode()
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Failed to delete the group. Please try again.');
        }
    }
}

// Функция для включения возможности удаления групп
function enableDeleteGroups() {
    const groupItems = document.querySelectorAll('#groupList li');

    // Окрашивание всех элементов при активации режима удаления
    groupItems.forEach(groupItem => {
        groupItem.style.backgroundColor = '#ff7f7f'; // Фон при активации удаления

        groupItem.addEventListener('click', () => {
            const groupId = groupItem.getAttribute('data-group-id');
            deleteGroupHandler(groupItem, groupId);
        });

        // Наведение на элементы li
        groupItem.addEventListener('mouseover', () => {
            groupItem.style.backgroundColor = '#ff4d4d';
            groupItem.style.cursor = 'pointer';
        });

        groupItem.addEventListener('mouseout', () => {
            groupItem.style.backgroundColor = '#ff7f7f';
            groupItem.style.cursor = 'pointer';
        });
        // Обработка нажатия на элемент li
        groupItem.addEventListener('mousedown', () => {
            groupItem.style.backgroundColor = '#ff7f7f';
            groupItem.style.cursor = 'pointer';
        });

        // При отпускании мыши, если элемент выбран для удаления
        groupItem.addEventListener('mouseup', () => {
            groupItem.style.backgroundColor = '#ff4d4d';
            groupItem.style.cursor = 'pointer';
        });
    });
    //  Сброс цветов после завершения удаления
    document.addEventListener('deleteComplete', () => {
        groupItems.forEach(groupItem => {
            groupItem.style.backgroundColor = ''; // Возвращаем цвет к оригинальному из CSS
            groupItem.style.cursor = '';
        });
    });
}
// Функция для отмены режима удаления
function cancelDeleteMode() {
    const groupItems = document.querySelectorAll('#groupList li');
    groupItems.forEach(groupItem => {
        groupItem.style.backgroundColor = ''; // Сброс цвета на исходный
        groupItem.style.cursor = '';
        // Удаление старого обработчика клика
        const newGroupItem = groupItem.cloneNode(true);
        groupItem.parentNode.replaceChild(newGroupItem, groupItem);

        // Добавление нового обработчика клика
        newGroupItem.addEventListener('click', () => {
            const groupName = newGroupItem.textContent.trim(); // Получение названия группы
            showExpenses(groupName);
        });
    });
}
// Вызов функции для загрузки групп после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        getUserGroups(userId);
    }
});



//add Expense

async function addExpenseHandler(payer, type) {
    const description = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('expenseDate').value;
    const userId = localStorage.getItem('userId');
    const friendId = document.getElementById('friendIdInput').value;

    if (!selectedGroupId || !description || isNaN(amount) || !date) {
        alert('Please fill in all fields');
        return;
    }

    let payer_id, receiver_id;
    if (payer === 'you') {
        payer_id = userId;
        receiver_id = friendId;
    } else {
        payer_id = friendId;
        receiver_id = userId;
    }

    try {
        const response = await fetch('/api/transactions/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                group_id: selectedGroupId,
                description,
                amount,
                date,
                payer_id,
                receiver_id,
                type: type === 'split' ? 'owed' : 'debt'
            })
        });

        if (response.ok) {
            alert('Expense added successfully!');
            loadTransactions(selectedGroupId);
            hideCreateModal();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to add expense');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('An error occurred. Please try again later.');
    }
}





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