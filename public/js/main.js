
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

