
async function loadUserProfile() {
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
        } else {
            alert('Failed to load profile data');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('An error occurred. Please try again later.');
    }
}

loadUserProfile();

//update profile function
async function updateUserProfile(name, email, password) {
    const userId = localStorage.getItem('userId');
    const body = { name, email };

    // adding password only if user wants to change it
    if (password) {
        body.password = password;
    }

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert('Profile updated successfully!');
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred. Please try again later.');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('Logged out successfully');
    window.location.href = '../index.html'; 
}

document.getElementById('updateProfileForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await updateUserProfile(name, email, password);
});

document.getElementById('logoutButton').addEventListener('click', () => {
    logout();
});

document.getElementById('goToGroupsButton').addEventListener('click', () => {
    window.location.href = '../groups.html'; 
});