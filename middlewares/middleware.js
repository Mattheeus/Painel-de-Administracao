const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const configureMiddlewares = (app) => {
    // Configurar Body-Parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
};

// Middleware de autenticação
const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Not authorized to access this resource' });
    }
};



// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};

module.exports = { configureMiddlewares, authenticate, errorHandler };