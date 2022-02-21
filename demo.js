const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());


const port = process.env.PORT




app.post('/api/auth/login', (req, res)=> {
    // pre-defined user
    const user = {
        username: 'shahriar',
        password: process.env.USER_PASSWORD,
        role: "admin"
    }

    const {username, password} = req.body;
    const result = username === user.username && password === user.password;

    if(result){
        // Create token
        const token = jwt.sign(
            {username: user.username},
            process.env.JWT_SECRET,
            {
                expiresIn: "4h",
            }
        );

        res.cookie('Auth_Token', token);
        res.status(200).json({success: result, token});

    }
    else{
        res.status(403).send('Authentication failed')
    }
})


app.get('/api/user', (req, res)=> {
    // pre defined user
    const user = {
        username: 'shahriar',
        role: "admin"
    }

    const {token} = req.headers;
    const splitedToken = token.split(' ')[1];
    
    const decoded = jwt.verify(splitedToken, process.env.JWT_SECRET)

    if(decoded && req.cookies){
        const cookie = req.cookies;
        res.status(200).json({token: "verified", user: user, cookie: cookie})
    }
    else{
        res.status(403).send('Token not verified');
    }
})


// basic route
app.get('/', (req, res)=> {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log('Server is running');
})