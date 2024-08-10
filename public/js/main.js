//main.js

// Calling a function to load groups after the page has loaded
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        getUserGroups(userId);
    }
});

function hideCreateModal() {
    document.getElementById('create-group-modal').style.display = 'none';
    document.getElementById('add-expense-modal').style.display = 'none';
}

// Creating a group and adding a user to the group
document.getElementById('addGroupBtn').addEventListener('click', showCreateGroupModal);
function showCreateGroupModal() {
    document.getElementById('create-group-modal').style.display = 'flex';
}
async function createGroupAndAddUser(groupName, created_by, friendId) {
    try {
        // Creating a group
        const groupResponse = await fetch('/api/groups/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: groupName, created_by, friendId })
        });

        const groupData = await groupResponse.json();
        if (groupResponse.ok) {
            // alert('Group created!');

            // Adding a user to the group
            const groupId = groupData.group.id;
            window.location.reload();
            // alert('User added to the group successfully!');
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
        groupItem.textContent = `${groupName}`;

        groupItem.addEventListener('click', () => showExpenses(groupName));
        groupList.appendChild(groupItem);
        document.getElementById('groupNameInput').value = '';
        document.getElementById('friendIdInput').value = '';
        hideCreateModal();
        createGroupAndAddUser(groupName, created_by, friendId);
    } else {
        alert('Please enter both group name and friend ID.');
    }
}
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
        // console.log('Groups fetched:', userGroups); // Лог для проверки данных

        const groupList = document.getElementById('groupList');
        groupList.innerHTML = '';

        userGroups.forEach(userGroup => {
            const groupItem = document.createElement('li');
            groupItem.textContent = `${userGroup.name}`;
            groupItem.setAttribute('data-group-id', userGroup.id);
            groupItem.addEventListener('click', () => showExpenses(userGroup.id, userGroup.name));
            groupList.appendChild(groupItem);
            // console.log('Group item added:', groupItem); // Лог добавленных элементов
        });
    } catch (error) {
        console.error('Error:', error.message);
        alert('Failed to fetch groups: ' + error.message);
    }
}
// Verifying the token and extracting user information
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            // console.log('Decoded Token:', decodedToken);  // Лог структуры токена

            const userId = decodedToken.id;
            // console.log('User ID:', userId); // Лог user ID для проверки

            // Make sure `userId` is not `undefined`
            if (userId) {
                getUserGroups(userId);
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

// Handler for the delete group button
document.getElementById('deleteGroupBtn').addEventListener('click', () => {
    enableDeleteGroups();
});

// Deleting a group
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
            // alert('Group successfully deleted!');
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error with delete:', error);
        throw error;
    }
}
// Group Delete Handler
async function deleteGroupHandler(groupItem, groupId) {
    if (confirm('Are you sure you want to delete this group?')) {
        try {
            await deleteGroup(groupId);

            // If the deletion was successful, remove the element from the UI
            groupItem.remove();
            cancelDeleteMode();
            // window.location.reload();
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Failed to delete the group. Please try again.');
        }
    }
}

// Function to enable the ability to delete groups
function enableDeleteGroups() {
    const groupItems = document.querySelectorAll('#groupList li');

    // Coloring all elements when deletion mode is activated
    groupItems.forEach(groupItem => {
        groupItem.style.backgroundColor = '#ff7f7f';

        groupItem.addEventListener('click', () => {
            const groupId = groupItem.getAttribute('data-group-id');
            deleteGroupHandler(groupItem, groupId);
        });

        // Hover over li elements
        groupItem.addEventListener('mouseover', () => {
            groupItem.style.backgroundColor = '#ff4d4d';
            groupItem.style.cursor = 'pointer';
        });

        groupItem.addEventListener('mouseout', () => {
            groupItem.style.backgroundColor = '#ff7f7f';
            groupItem.style.cursor = 'pointer';
        });
        // Click on li element
        groupItem.addEventListener('mousedown', () => {
            groupItem.style.backgroundColor = '#ff7f7f';
            groupItem.style.cursor = 'pointer';
        });

        groupItem.addEventListener('mouseup', () => {
            groupItem.style.backgroundColor = '#ff4d4d';
            groupItem.style.cursor = 'pointer';
        });
    });

    //  Reset colors after uninstall completes
    document.addEventListener('deleteComplete', () => {
        groupItems.forEach(groupItem => {
            groupItem.style.backgroundColor = '';
            groupItem.style.cursor = '';
        });
    });
}

// Function to cancel the delete mode
function cancelDeleteMode() {
    const groupItems = document.querySelectorAll('#groupList li');
    groupItems.forEach(groupItem => {
        groupItem.style.backgroundColor = '';
        groupItem.style.cursor = '';
        // Removing the old click handler
        const newGroupItem = groupItem.cloneNode(true);
        groupItem.parentNode.replaceChild(newGroupItem, groupItem);

        // Adding a new click handler
        newGroupItem.addEventListener('click', () => {
            const groupName = newGroupItem.textContent.trim();
            showExpenses(groupName);
        });
    });
}
// Handler for the delete group button
let deleteModeActive = false;
document.getElementById('deleteGroupBtn').addEventListener('click', () => {
    if (deleteModeActive) {
        // If the deletion mode is active, cancel it
        cancelDeleteMode();
        deleteModeActive = false;
    } else {
        // If the deletion mode is not active, enable it
        enableDeleteGroups();
        deleteModeActive = true;
    }
});

// Functions for displaying expenses
function showExpenses(groupId) {
    document.getElementById('selectedGroupName').textContent = `Group ID: ${groupId}`;
    document.getElementById('addExpenseBtn').style.display = 'block';
    document.getElementById('deleteExpenseBtn').style.display = 'block';
    const expenseTableBody = document.getElementById('expenseTableBody');
    expenseTableBody.innerHTML = '';

    // Получение и отображение расходов
    fetch(`/api/transactions/${groupId}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(transaction => {
                const row = document.createElement('tr');

                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = transaction.description;
                row.appendChild(descriptionCell);

                const totalAmountCell = document.createElement('td');
                totalAmountCell.textContent = transaction.amount;
                row.appendChild(totalAmountCell);

                const owedOrDebtCell = document.createElement('td');
                const amountColor = transaction.type === 'owed' ? 'green' : 'red';
                const amountLabel = transaction.type === 'owed' ? 'Owed' : 'Debt';
                owedOrDebtCell.innerHTML = `<b style="color: ${amountColor};">${amountLabel}: ${transaction.amount}</b>`;
                row.appendChild(owedOrDebtCell);

                expenseTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function showAddExpenseModal() {
    document.getElementById('add-expense-modal').style.display = 'flex';
}

// Добавление расхода
document.getElementById('addExpenseBtn').addEventListener('click', showAddExpenseModal);

async function addExpense(group_id, description, amount, date, paid_by, shares) {
    try {
        const response = await fetch('/api/transactions/add', {
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


function addExpenseHandler(paidBy, splitType) {
    const expenseName = document.getElementById('expenseName').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('expenseDate').value;
    const group_id = document.getElementById('groupId').value.trim();

    if (!expenseName || isNaN(amount) || !date || !group_id) {
        alert('Please enter all required fields.');
        return;
    }

    // Получаем friendId и проверяем его наличие
    const friendId = document.getElementById('friendId') ? document.getElementById('friendId').value.trim() : null;
    if (!friendId) {
        console.log('Friend ID is required.');
        return;
    }

    let shares = [];
    const currentUser = localStorage.getItem('userId');

    if (splitType === 'split') {
        shares = [
            { user_id: currentUser, amount: amount / 2, type: 'owed' },
            { user_id: friendId, amount: amount / 2, type: 'debt' }
        ];
    } else if (splitType === 'full') {
        if (paidBy === 'you') {
            shares = [
                { user_id: currentUser, amount: amount, type: 'owed' },
                { user_id: friendId, amount: amount, type: 'debt' }
            ];
        } else {
            shares = [
                { user_id: currentUser, amount: amount, type: 'debt' },
                { user_id: friendId, amount: amount, type: 'owed' }
            ];
        }
    }

    const expenseTableBody = document.getElementById('expenseTableBody');
    const row = document.createElement('tr');

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = expenseName;
    row.appendChild(descriptionCell);

    const totalAmountCell = document.createElement('td');
    totalAmountCell.textContent = amount;
    row.appendChild(totalAmountCell);

    const owedOrDebtCell = document.createElement('td');
    const amountColor = splitType === 'split' ? 'green' : 'red';
    const amountLabel = splitType === 'split' ? 'Owed' : 'Debt';
    owedOrDebtCell.innerHTML = `<b style="color: ${amountColor};">${amountLabel}: ${amount}</b>`;
    row.appendChild(owedOrDebtCell);

    expenseTableBody.appendChild(row);

    // Вызов асинхронной функции для добавления в базу данных
    addExpense(group_id, expenseName, amount, date, paidBy === 'you' ? currentUser : friendId, shares);

    hideCreateModal(); // Закрыть модальное окно
}


//Удаление расхода
// document.getElementById('deleteExpenseBtn').addEventListener('click', enableDeleteExpenses);

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