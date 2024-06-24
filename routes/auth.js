const express = require('express');
const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

const router = express.Router();

const dummyCredentials = {
    username: 'saltman',
    password: 'oai1122'
};

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === dummyCredentials.username && password === dummyCredentials.password) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).json({ error: 'Invalid username or password' });
    }
});

module.exports = router;
