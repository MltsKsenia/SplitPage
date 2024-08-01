document.addEventListener('DOMContentLoaded', () => {
    const groups = [];
    const expenses = [];
    let groupIdCounter = 1;
    let expenseIdCounter = 1;

    const groupList = document.getElementById('group-list');
    const groupSelect = document.getElementById('group-select');

    document.getElementById('add-group-btn').addEventListener('click', addGroup);
    document.getElementById('add-expense-btn').addEventListener('click', addExpense);

    function addGroup() {
        const groupName = prompt('Enter group name:');
        if (groupName) {
            const group = { id: groupIdCounter++, name: groupName, members: [], expenses: [] };
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
            const expense = { id: expenseIdCounter++, description, amount, date: new Date() };
            const group = groups.find(g => g.id === groupId);
            if (group) {
                group.expenses.push(expense);
                renderExpenses(groupId);
            }
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
                const expensesContainer = document.createElement('div');
                expensesContainer.classList.add('expenses-container');
                if (li.nextElementSibling && li.nextElementSibling.classList.contains('expenses-container')) {
                    li.nextElementSibling.remove();
                } else {
                    renderExpenses(group.id, expensesContainer);
                    li.after(expensesContainer);
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

    function renderExpenses(groupId, container) {
        const group = groups.find(g => g.id === groupId);
        if (group) {
            container.innerHTML = '';
            group.expenses.forEach(expense => {
                const expenseItem = document.createElement('div');
                expenseItem.innerHTML = `
                    <strong>${expense.description}</strong> - $${expense.amount.toFixed(2)}
                    <br>Date: ${expense.date.toLocaleDateString()}
                `;
                container.appendChild(expenseItem);
            });
        }
    }
});
