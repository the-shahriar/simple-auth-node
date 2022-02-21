const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const session = require('express-session');

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    session({
        name: 'SESSION_ID', 
        secret: process.env.JWT_SECRET,
        cookie: {
            maxAge: 0.5 * 86400000,
        },
        resave: false,
        saveUninitialized: true
    })
);

app.use(cookieParser());


const port = process.env.PORT




app.post('/api/auth2/login', (req, res)=> {
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

        req.session.userId = user.username;
        res.json({sucess: result, token: token});

    }
    else{
        res.status(403).send('Authentication failed')
    }
})


app.get('/api/auth2/user', async(req, res, next)=> {
    // pre defined user
    try{
        const user = {
            username: 'shahriar',
            role: "admin"
        }
    
        const userId = req.session.userId;
        const token = req.headers.token;
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded && userId){
            res.status(200).json({user: user})
        }
        else{
            res.status(403).json({message: "User loggedout"})
        }
    }
    catch{
        next()
    }
})

app.get('/api/logout', (req, res)=> {
    if(req.session.userId && req.headers.token){
        delete req.session.userId;
        res.json({result: 'SUCCESS'});
    }
    else{
        res.json({result: 'ERROR', message: 'User already logged out'});
    }
})


// basic route
app.get('/', (req, res)=> {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log('Server is running');
})