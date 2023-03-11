const express = require('express');
const app = express();
const dotenv = require('dotenv');

const databaseConnect = require('./config/database');

dotenv.config({
    path : 'backend/config/config.env'
});

// This is the port for the backend while frontend is running on 3000
const port = process.env.port || 5000;

app.get('/', (req, res) => {
    res.send('This is from backend sever');
});

databaseConnect();

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});
