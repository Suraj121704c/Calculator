const express = require('express');
const app = express();
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

    res.json({ result });
});

app.listen(port, () => {
    console.log(`Calculator API is running on http://localhost:${port}`);
});
