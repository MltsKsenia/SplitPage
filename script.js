document.addEventListener('DOMContentLoaded', () => {
    const groups = [];
    const expenses = [];
    let groupIdCounter = 1;
    let expenseIdCounter = 1;

    const groupList = document.getElementById('group-list');
    const expenseList = document.getElementById('expense-list');
    const groupSelect = document.getElementById('group-select');

    document.getElementById('add-group-btn').addEventListener('click', addGroup);
    document.getElementById('add-expense-btn').addEventListener('click', addExpense);

    function addGroup() {
        const groupName = prompt('Enter group name:');
        if (groupName) {
            const group = { id: groupIdCounter++, name: groupName, members: [] };
            groups.push(group);
            renderGroups();
            renderGroupOptions();
        }
    }

    function addExpense() {
        const groupId = parseInt(groupSelect.value);
        const description = document.getElementById('expense-description').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);

        if (groupId && description && amount) {
            const expense = { id: expenseIdCounter++, groupId, description, amount, date: new Date() };
            expenses.push(expense);
            renderExpenses();
        } else {
            alert('Please fill in all fields.');
        }
    }

    function renderGroups() {
        groupList.innerHTML = '';
        groups.forEach(group => {
            const li = document.createElement('li');
            li.textContent = group.name;
            li.addEventListener('click', () => {
                const memberName = prompt('Enter member name:');
                if (memberName) {
                    group.members.push(memberName);
                    alert(`Added ${memberName} to ${group.name}`);
                }
            });
            groupList.appendChild(li);
        });
    }

    function renderGroupOptions() {
        groupSelect.innerHTML = '';
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            groupSelect.appendChild(option);
        });
    }

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const group = groups.find(group => group.id === expense.groupId);
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${expense.description}</strong> - $${expense.amount.toFixed(2)}
                <br>Group: ${group.name}
                <br>Date: ${expense.date.toLocaleDateString()}
            `;
            expenseList.appendChild(li);
        });
    }
});
