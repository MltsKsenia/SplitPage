document.getElementById('addGroupBtn').addEventListener('click', showCreateGroupModal);
document.getElementById('addExpenseBtn').addEventListener('click', showAddExpenseModal);
document.getElementById('deleteExpenseBtn').addEventListener('click', enableDeleteExpenses);

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

function createGroup() {
    const groupName = document.getElementById('groupNameInput').value;
    const groupEmail = document.getElementById('groupEmailInput').value;

    if (groupName && groupEmail) {
        const groupList = document.getElementById('groupList');
        const groupItem = document.createElement('li');
        groupItem.textContent = `${groupName} (${groupEmail})`;
        groupItem.addEventListener('click', () => showExpenses(groupName));
        groupList.appendChild(groupItem);
        document.getElementById('groupNameInput').value = '';
        document.getElementById('groupEmailInput').value = '';
        hideCreateModal();
    } else {
        alert('Please enter both group name and email.');
    }
}

function createExpense() {
    const expenseName = document.getElementById('expenseName').value;
    const amount = document.getElementById('amount').value;

    if (expenseName && amount) {
        const expenseList = document.getElementById('expenseList');
        const expenseItem = document.createElement('li');
        expenseItem.textContent = `${expenseName} (${amount})`;
        expenseList.appendChild(expenseItem);
        document.getElementById('expenseName').value = '';
        document.getElementById('amount').value = '';
        hideCreateModal();
    } else {
        alert('Please enter both expense name and amount.');
    }
}

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
        expenseItem.style.backgroundColor = '#095b4d';

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