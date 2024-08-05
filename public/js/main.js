document.getElementById('create-group-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const groupName = document.getElementById('group-name').value;
    const groupMembers = document.getElementById('group-members').value.split(',');

    const response = await fetch('/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ groupName, groupMembers })
    });

    const result = await response.json();
    if (response.ok) {
        alert(`Group created successfully with ID: ${result.groupId}`);
    } else {
        alert(`Error: ${result.message}`);
    }
});

document.getElementById('add-expense-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const groupId = document.getElementById('group-id').value;
    const expenseAmount = document.getElementById('expense-amount').value;

    const response = await fetch(`/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expenseAmount })
    });

    const result = await response.json();
    if (response.ok) {
        alert('Expense added successfully');
    } else {
        alert(`Error: ${result.message}`);
    }
});
