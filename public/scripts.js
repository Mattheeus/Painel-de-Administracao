// Initiate the fetch request to the server
fetch('/users')
    .then(response => response.json())
    .then(users => {
        const content = document.getElementById('content');
        content.innerHTML = '<h2>Usuários</h2>';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.textContent = `Nome: ${user.username}, Email: ${user.email}`;
            content.appendChild(userElement);
        });
    });
