const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');
const bcrypt = require('bcryptjs')


require('dotenv').config();

mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
    res.json('ok')
});

// hold user cookies to keep user logged in
app.get('/profile', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) {
                console.error('Token verification failed:', err);
                res.status(401).json('Unauthorized');
            } else {
                res.json(userData);
            }
        });
    } else {
        res.status(401).json('No token found');
    }
});

// log in current users -- search for username and ensure pass is correct
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const foundUser = await User.findOne({username});
    if (foundUser) {
        const correctPass = bcrypt.compareSync(password, foundUser.password);
        if (correctPass) {
            jwt.sign({userId:foundUser._id,username}, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
                id: foundUser._id
                });
            });
        }
    }
})

// sign in new users -- add new username and pass
app.post('/signup', async (req,res) => {
    const {username,password} = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            username:username,
            password:hashedPassword,
        });
        jwt.sign({userId:createdUser._id,username}, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
            id: createdUser._id
            });
        });
        } catch(err) {
        if (err) throw err;
        res.status(500).json('error');
        }
  });

app.listen(4000);
