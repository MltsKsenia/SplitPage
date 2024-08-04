document.addEventListener('DOMContentLoaded', () => {
    const expenses = [];
    let expenseIdCounter = 1;

    const groupSelect = document.getElementById('group-select');

    document.getElementById('add-expense-btn').addEventListener('click', addExpense);

    function addExpense() {
        const groupId = parseInt(groupSelect.value);
        const description = document.getElementById('expense-description').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);

        if (groupId && description && amount) {
            const expense = { id: expenseIdCounter++, description, amount, date: new Date() };
            const group = groups.find(g => g.id === groupId);
            if (group) {
                group.expenses.push(expense);
                renderExpenses(group.id);
            }
        } else {
            alert('Please fill in all fields.');
        }
    }

    function deleteExpense(groupId, expenseId) {
        const group = groups.find(g => g.id === groupId);
        if (group) {
            group.expenses = group.expenses.filter(expense => expense.id !== expenseId);
            renderExpenses(group.id);
        }
    }

    function renderExpenses(groupId, container) {
        const group = groups.find(g => g.id === groupId);
        if (group) {
            container.innerHTML = '';
            group.expenses.forEach(expense => {
                const expenseItem = document.createElement('div');
                expenseItem.classList.add('expense-item');
                expenseItem.innerHTML = `
                    <div class='expense'>
                        <strong>${expense.description}</strong> - ${expense.amount.toFixed(2)}
                    </div>
                    <button onclick="deleteExpense(${group.id}, ${expense.id})">Delete</button>`;
                container.appendChild(expenseItem);
            });
        }
    }

    window.deleteExpense = deleteExpense;
});