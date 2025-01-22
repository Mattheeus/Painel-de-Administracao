const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();

// Configurar Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

//Arquivos estáticos
app.use(express.static('public'));

// Rota inicial
app.get('/', (req, res) => {res.send('Painel de Administração');});

//Rotas para Gerenciamento de Usuários
app.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.json(user);
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if(user){
            await user.update(req.body);
            return res.json(user);
        }else{
            return res.status(404).json({error: 'User not found'});
        }
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if(user){
            await user.destroy();
            return res.json({message: 'User deleted'});
        }else{
            return res.status(404).json({error: 'User not found'});
        }
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
});

//Sincronização dos Modelos com o Banco de Dados
sequelize.sync({force: true}).then(() => {
    console.log('Database & tables created!');
});

// Iniciar o servidor
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});
