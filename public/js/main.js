// Регистрация пользователя
async function registerUser(name, email, password) {
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('User registered!');
            window.location.href = '/index.html'; // Перенаправление на страницу входа
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Обновление профиля пользователя
async function updateUserProfile(userId, name, email) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, email })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Profile updated!');
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
// Декорация страницы с группами и расходами
document.getElementById('addGroupBtn').addEventListener('click', showCreateGroupModal);
document.getElementById('addExpenseBtn').addEventListener('click', showAddExpenseModal);
document.getElementById('deleteExpenseBtn').addEventListener('click', enableDeleteExpenses);
document.getElementById('deleteGroupBtn').addEventListener('click', enableDeleteGroups);

function showExpenses(groupName) {
    document.getElementById('selectedGroupName').textContent = groupName;
    document.getElementById('addExpenseBtn').style.display = 'block';
    document.getElementById('deleteExpenseBtn').style.display = 'block';
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';
}

function enableDeleteExpenses() {
    const expenseItems = document.querySelectorAll('#expenseList li');
    expenseItems.forEach(expenseItem => {
        expenseItem.style.backgroundColor = '#6dac95';

        expenseItem.addEventListener('click', () => {
            expenseItem.remove();
        });

        expenseItem.addEventListener('mouseover', () => {
            expenseItem.style.backgroundColor = '#095b4d';
            expenseItem.style.cursor = 'pointer';
        });

        expenseItem.addEventListener('mouseout', () => {
            expenseItem.style.backgroundColor = '#6dac95';
            expenseItem.style.cursor = 'pointer';
        });

        expenseItem.addEventListener('mousedown', () => {
            expenseItem.style.backgroundColor = '#6dac95';
            expenseItem.style.cursor = 'pointer';
        });

        expenseItem.addEventListener('mouseup', () => {
            expenseItem.style.backgroundColor = '#095b4d';
            expenseItem.style.cursor = 'pointer';
        });
    });
}

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
async function createGroupAndAddUser(groupName, created_by, email) {
    try {
        // Создание группы
        const groupResponse = await fetch('/api/groups/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: groupName, created_by })
        });

        const groupData = await groupResponse.json();
        if (groupResponse.ok) {
            alert('Group created!');

            // Добавление пользователя в группу
            const groupId = groupData.group.id; // Предполагается, что API возвращает ID группы
            const userResponse = await fetch(`/api/groups/${groupId}/addUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ email })
            });

            const userData = await userResponse.json();
            if (userResponse.ok) {
                alert('User added to the group successfully!');
                window.location.reload();
            } else {
                alert(userData.message);
            }
        } else {
            alert(groupData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function createGroupHandler() {
    const groupName = document.getElementById('groupNameInput').value;
    const friendEmail = document.getElementById('friendEmailInput').value;
    const created_by = 'user_id'; // замените на текущего пользователя

    if (groupName && friendEmail) {
        const groupList = document.getElementById('groupList');
        const groupItem = document.createElement('li');
        groupItem.textContent = `${groupName} (${friendEmail})`;

        groupItem.addEventListener('click', () => showExpenses(groupName));
        groupList.appendChild(groupItem);
        document.getElementById('groupNameInput').value = '';
        document.getElementById('friendEmailInput').value = '';
        hideCreateModal();

        // Вызов асинхронной функции для создания группы и добавления пользователя
        createGroupAndAddUser(groupName, created_by, friendEmail);
    } else {
        alert('Please enter both group name and email.');
    }
}


// Добавление расхода
async function addExpense(group_id, description, amount, date, paid_by, shares) {
    try {
        const response = await fetch('/api/expenses/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ group_id, description, amount, date, paid_by, shares })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Expense added successfully!');
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function addExpenseHandler() {
    const expenseName = document.getElementById('expenseName').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('expenseDate').value;
    const paid_by = document.getElementById('paidBy').value;
    const group_id = document.getElementById('groupId').value;
    const shares = document.getElementById('shares').value.split('/').map(share => share.trim());

    if (expenseName && amount && date && paid_by && group_id && shares.length > 0) {
        const expenseList = document.getElementById('expenseList');
        const expenseItem = document.createElement('li');
        expenseItem.textContent = `${expenseName} (${amount})`;
        expenseList.appendChild(expenseItem);
        document.getElementById('expenseName').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('expenseDate').value = '';
        document.getElementById('paidBy').value = '';
        document.getElementById('groupId').value = '';
        document.getElementById('shares').value = '';
        hideCreateModal();

        // Вызов асинхронной функции
        addExpense(group_id, expenseName, amount, date, paid_by, shares);
    } else {
        alert('Please enter all required fields.');
    }
}
// Получение групп пользователя
async function getUserGroups(userId) {
    try {
        const response = await fetch(`/api/groups/user/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const groups = await response.json();
        if (response.ok) {
            return groups;
        } else {
            alert(groups.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Получение расходов группы
async function getGroupExpenses(groupId) {
    try {
        const response = await fetch(`/api/expenses/group/${groupId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const expenses = await response.json();
        if (response.ok) {
            return expenses;
        } else {
            alert(expenses.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Получение баланса группы
async function getGroupBalance(groupId) {
    try {
        const response = await fetch(`/api/groups/${groupId}/balance`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const balance = await response.json();
        if (response.ok) {
            return balance;
        } else {
            alert(balance.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Удаление группы
async function deleteGroup(groupId) {
    try {
        const response = await fetch(`/api/groups/${groupId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const data = await response.json();
        if (response.ok) {
            alert('Group successfully deleted!');
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error with delete:', error);
    }
}

function deleteGroupHandler(groupItem, groupId) {
    if (confirm('Are you sure you want to delete this group?')) {
        deleteGroup(groupId);
        groupItem.remove();
    }
}

function enableDeleteGroups() {
    const groupItems = document.querySelectorAll('#groupList li');
    groupItems.forEach(groupItem => {
        groupItem.style.backgroundColor = '#ff7f7f';

        groupItem.addEventListener('click', () => {
            const groupId = groupItem.getAttribute('data-group-id');
            deleteGroupHandler(groupItem, groupId);
        });

        groupItem.addEventListener('mouseover', () => {
            groupItem.style.backgroundColor = '#ff4d4d';
            groupItem.style.cursor = 'pointer';
        });

        groupItem.addEventListener('mouseout', () => {
            groupItem.style.backgroundColor = '#ff7f7f';
            groupItem.style.cursor = 'pointer';
        });

        groupItem.addEventListener('mousedown', () => {
            groupItem.style.backgroundColor = '#ff7f7f';
            groupItem.style.cursor = 'pointer';
        });

        groupItem.addEventListener('mouseup', () => {
            groupItem.style.backgroundColor = '#ff4d4d';
            groupItem.style.cursor = 'pointer';
        });
    });
}
// // Получение групп пользователя
// async function getUserGroups(userId) {
//     try {
//         const response = await fetch(`/api/groups/user/${userId}`, {
//             headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//         });

//         const groups = await response.json();
//         if (response.ok) {
//             const groupList = document.getElementById('groupList');
//             groupList.innerHTML = '';
//             groups.forEach(group => {
//                 const groupItem = document.createElement('li');
//                 groupItem.textContent = `${group.name} (${group.id})`;
//                 groupItem.setAttribute('data-group-id', group.id);
//                 groupItem.addEventListener('click', () => showExpenses(group.id, group.name));
//                 groupList.appendChild(groupItem);
//             });
//         } else {
//             alert(groups.message);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // Получение расходов группы
// async function getGroupExpenses(groupId) {
//     try {
//         const response = await fetch(`/api/expenses/group/${groupId}`, {
//             headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//         });

//         const expenses = await response.json();
//         if (response.ok) {
//             return expenses;
//         } else {
//             alert(expenses.message);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // Получение баланса группы
// async function getGroupBalance(groupId) {
//     try {
//         const response = await fetch(`/api/groups/${groupId}/balance`, {
//             headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//         });

//         const balance = await response.json();
//         if (response.ok) {
//             return balance;
//         } else {
//             alert(balance.message);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // Обновление долгов
// async function updateDebt(groupId) {
//     try {
//         const balance = await getGroupBalance(groupId);
//         if (balance) {
//             document.getElementById('groupBalance').textContent = `Balance: ${balance.total}`;
//         } else {
//             console.error('Balance data is invalid or undefined:', balance);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // Проверка токена и извлечение информации о пользователе
// document.addEventListener('DOMContentLoaded', () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         const decodedToken = jwt_decode(token);
//         const userId = decodedToken.user_id;

//         // Получение групп пользователя при загрузке страницы
//         getUserGroups(userId);
//     } else {
//         window.location.href = '/login';
//     }
// });

// document.getElementById('createGroupBtn').addEventListener('click', createGroupHandler);
// document.getElementById('createExpenseBtn').addEventListener('click', () => addExpenseHandler('you', 'split'));
// document.getElementById('createFriendExpenseBtn').addEventListener('click', () => addExpenseHandler('friend', 'split'));
// document.getElementById('fullExpenseBtn').addEventListener('click', () => addExpenseHandler('you', 'full'));
// document.getElementById('fullFriendExpenseBtn').addEventListener('click', () => addExpenseHandler('friend', 'full'));
// document.getElementById('cancelCreateGroupBtn').addEventListener('click', hideCreateModal);
// document.getElementById('cancelAddExpenseBtn').addEventListener('click', hideCreateModal);

// document.addEventListener('DOMContentLoaded', () => {
//     // Пример использования функции для регистрации пользователя
//     document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const name = e.target.name.value;
//         const email = e.target.email.value;
//         const password = e.target.password.value;
//         await registerUser(name, email, password);
//     });

//     // Пример использования функции для входа пользователя
//     document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const email = e.target.email.value;
//         const password = e.target.password.value;
//         await loginUser(email, password);
//     });

//     // Пример использования функции для обновления профиля пользователя
//     document.getElementById('updateProfileForm')?.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const userId = localStorage.getItem('userId');
//         const name = e.target.name.value;
//         const email = e.target.email.value;
//         await updateUserProfile(userId, name, email);
//     });

//     // Пример использования функции для создания группы
//     document.getElementById('createGroupForm')?.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const name = e.target.groupName.value;
//         const created_by = localStorage.getItem('userId');
//         await createGroup(name, created_by);
//     });

//     // Пример использования функции для добавления пользователя в группу
//     document.getElementById('addUserToGroupForm')?.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const groupId = e.target.groupId.value;
//         const email = e.target.userEmail.value;
//         await addUserToGroup(groupId, email);
//     });

//     // Пример использования функции для добавления расхода
//     document.getElementById('addExpenseForm')?.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const group_id = e.target.groupId.value;
//         const description = e.target.description.value;
//         const amount = parseFloat(e.target.amount.value);
//         const date = e.target.date.value;
//         const paid_by = localStorage.getItem('userId');
//         const shares = JSON.parse(e.target.shares.value); // Пример: [{"user_id": 1, "amount": 50}, {"user_id": 2, "amount": 50}]
//         await addExpense(group_id, description, amount, date, paid_by, shares);
//     });

//     // Пример использования функции для получения групп пользователя
//     async function displayUserGroups() {
//         const userId = localStorage.getItem('userId');
//         const groups = await getUserGroups(userId);
//         const groupsContainer = document.getElementById('userGroups');
//         if (groupsContainer) {
//             groupsContainer.innerHTML = '';
//             groups.forEach(group => {
//                 const groupElement = document.createElement('div');
//                 groupElement.innerText = `Группа: ${group.name}`;
//                 groupsContainer.appendChild(groupElement);
//             });
//         }
//     }

//     // Пример использования функции для получения расходов группы
//     async function displayGroupExpenses(groupId) {
//         const expenses = await getGroupExpenses(groupId);
//         const expensesContainer = document.getElementById('groupExpenses');
//         if (expensesContainer) {
//             expensesContainer.innerHTML = '';
//             expenses.forEach(expense => {
//                 const expenseElement = document.createElement('div');
//                 expenseElement.innerText = `Расход: ${expense.description}, Сумма: ${expense.amount}`;
//                 expensesContainer.appendChild(expenseElement);
//             });
//         }
//     }

//     // Пример использования функции для получения баланса группы
//     async function displayGroupBalance(groupId) {
//         const balance = await getGroupBalance(groupId);
//         const balanceContainer = document.getElementById('groupBalance');
//         if (balanceContainer) {
//             balanceContainer.innerHTML = JSON.stringify(balance, null, 2);
//         }
//     }

//     // Обновляем группы пользователя и баланс группы при загрузке страницы
//     displayUserGroups();
//     displayGroupBalance(localStorage.getItem('currentGroupId')); // Пример: используется текущая группа
// });
