document.addEventListener('DOMContentLoaded', () => {
    const addGroupBtn = document.getElementById('add-group-btn');
    const groupList = document.getElementById('group-list');

    function addGroup(name) {
        const li = document.createElement('li');
        li.textContent = name;
        li.addEventListener('click', () => {
            window.location.href = `group.html?name=${encodeURIComponent(name)}`;
        });
        groupList.appendChild(li);
    }

    addGroupBtn.addEventListener('click', () => {
        const groupName = prompt('Write the group name');
        if (groupName) {
            addGroup(groupName);
        }
    });

    const initialGroups = [];
    initialGroups.forEach(group => addGroup(group));
});
