// Função para registrar um novo usuário
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })

        });

        const data = await response.json();
        if (response.ok) {
            alert('Usuário cadastrado com sucesso');
            localStorage.setItem('token', data.token);
        } else {
            alert(`Erro: ${data.error}`);
        }

    } catch (err) {
        console.error('Erro:', err);
    }

});

// Função para fazer login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })

        });

        const data = await response.json();
        if (response.ok) {
            alert('Login efetuado com sucesso');
            localStorage.setItem('token', data.token);
            fetchUsers();
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (err) {
        console.error('Erro:', err);
    }
});

// Função para buscar usuários
const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const users = await response.json();
        const usersDiv = document.getElementById('users');
        usersDiv.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.textContent = `Nome: ${user.username}, Email: ${user.email}`;
            usersDiv.appendChild(userElement);
        });

    } catch (err) {
        console.error('Erro:', err);
    }
};
// Buscar usuários ao carregar a página, se o token estiver presente
if (localStorage.getItem('token')) {
    fetchUsers();
}