const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app); 

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const port = 3000;

app.use(express.json());

app.get('/calculator', (req, res) => {
    const { a, b, operation } = req.query;
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);

    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({ error: 'Invalid numbers provided' });
    }

    let result;

    switch (operation) {
        case 'add':
            result = num1 + num2;
            break;
        case 'subtract':
            result = num1 - num2;
            break;
        case 'multiply':
            result = num1 * num2;
            break;
        case 'divide':
            if (num2 === 0) {
                return res.status(400).json({ error: 'Division by zero is not allowed' });
            }
            result = num1 / num2;
            break;
        default:
            return res.status(400).json({ error: 'Invalid operation. Use add, subtract, multiply, or divide' });
    }

    io.emit('calculationResult', { a: num1, b: num2, operation, result });

    res.json({ result });
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.emit('welcomeMessage', { message: 'Welcome to the Calculator API Socket.IO server!' });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

server.listen(port, () => {
    console.log(`Calculator API is running on http://localhost:${port}`);
});
