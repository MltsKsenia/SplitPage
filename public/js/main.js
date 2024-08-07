

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

// Логин пользователя
async function loginUser(email, password) {
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            alert('Entered!');
            window.location.href = '/profile.html'; // Перенаправление на страницу профиля
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

// Создание группы
async function createGroup(name, created_by) {
    try {
        const response = await fetch('/api/groups/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, created_by })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Group created!');
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Добавление пользователя в группу
async function addUserToGroup(groupId, email) {
    try {
        const response = await fetch(`/api/groups/${groupId}/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (response.ok) {
            alert('User addet to the group successfully!');
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
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
            alert('Расход успешно добавлен!');
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
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


document.addEventListener('DOMContentLoaded', () => {
    // Пример использования функции для регистрации пользователя
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        await registerUser(name, email, password);
    });

    // Пример использования функции для входа пользователя
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        await loginUser(email, password);
    });

    // Пример использования функции для обновления профиля пользователя
    document.getElementById('updateProfileForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        const name = e.target.name.value;
        const email = e.target.email.value;
        await updateUserProfile(userId, name, email);
    });

    // Пример использования функции для создания группы
    document.getElementById('createGroupForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = e.target.groupName.value;
        const created_by = localStorage.getItem('userId');
        await createGroup(name, created_by);
    });

    // Пример использования функции для добавления пользователя в группу
    document.getElementById('addUserToGroupForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const groupId = e.target.groupId.value;
        const email = e.target.userEmail.value;
        await addUserToGroup(groupId, email);
    });

    // Пример использования функции для добавления расхода
    document.getElementById('addExpenseForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const group_id = e.target.groupId.value;
        const description = e.target.description.value;
        const amount = parseFloat(e.target.amount.value);
        const date = e.target.date.value;
        const paid_by = localStorage.getItem('userId');
        const shares = JSON.parse(e.target.shares.value); // Пример: [{"user_id": 1, "amount": 50}, {"user_id": 2, "amount": 50}]
        await addExpense(group_id, description, amount, date, paid_by, shares);
    });

    // Пример использования функции для получения групп пользователя
    async function displayUserGroups() {
        const userId = localStorage.getItem('userId');
        const groups = await getUserGroups(userId);
        const groupsContainer = document.getElementById('userGroups');
        if (groupsContainer) {
            groupsContainer.innerHTML = '';
            groups.forEach(group => {
                const groupElement = document.createElement('div');
                groupElement.innerText = `Группа: ${group.name}`;
                groupsContainer.appendChild(groupElement);
            });
        }
    }

    // Пример использования функции для получения расходов группы
    async function displayGroupExpenses(groupId) {
        const expenses = await getGroupExpenses(groupId);
        const expensesContainer = document.getElementById('groupExpenses');
        if (expensesContainer) {
            expensesContainer.innerHTML = '';
            expenses.forEach(expense => {
                const expenseElement = document.createElement('div');
                expenseElement.innerText = `Расход: ${expense.description}, Сумма: ${expense.amount}`;
                expensesContainer.appendChild(expenseElement);
            });
        }
    }

    // Пример использования функции для получения баланса группы
    async function displayGroupBalance(groupId) {
        const balance = await getGroupBalance(groupId);
        const balanceContainer = document.getElementById('groupBalance');
        if (balanceContainer) {
            balanceContainer.innerHTML = JSON.stringify(balance, null, 2);
        }
    }

    // Обновляем группы пользователя и баланс группы при загрузке страницы
    displayUserGroups();
    displayGroupBalance(localStorage.getItem('currentGroupId')); // Пример: используется текущая группа
});