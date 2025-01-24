require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/User');
const { configureMiddlewares, authenticate, errorHandler } = require('./middlewares/middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

//Configurar middlewares
configureMiddlewares(app);

//Arquivos estáticos
app.use(express.static('public'));

// Rota inicial
app.get('/', (req, res) => { res.send('Painel de Administração'); });

// Rota de registro
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ user, token });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ user, token });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

//Rotas para Gerenciamento de Usuários
app.post('/users', authenticate, async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.json(user);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

app.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

app.put('/users/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update(req.body);
            return res.json(user);
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

app.delete('/users/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            return res.json({ message: 'User deleted' });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// Middleware de tratamento de erros
app.use(errorHandler);

//Sincronização dos Modelos com o Banco de Dados
sequelize.sync({ alter: true }).then(() => {
    console.log('Database & tables created!');
});

// Iniciar o servidor
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
