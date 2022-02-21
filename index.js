const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const jwt = require("jsonwebtoken");

app.use(express.json());

const port = process.env.PORT


// basic route
app.get('/', (req, res)=> {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log('Server is running');
})