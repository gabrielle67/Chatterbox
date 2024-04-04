const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message')
const cors = require('cors');
const bcrypt = require('bcryptjs')
const ws = require('ws');


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

async function getUserData(req, res){
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
    });
    } else {
      reject('no token');
    }
  });
}

// ensure server is running
app.get('/api/health', (req, res) => {
    res.json('ok')
});

// retrieve all previous messages between two users
app.get('/api/messages/:userId', async (req, res) => {
  const {userId} = req.params;
  const userData = await getUserData(req);
  const selfId = userData.userId;
  const messages = await Message.find({
    sender:{$in:[userId, selfId]},
    recipient:{$in:[userId, selfId]}
  }).sort({createdAt:1})
  res.json(messages);
});

// Retrieve total messages sent by a user
// app.get('/api/messages/total/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//       const totalMessagesSent = await Message.countDocuments({
//           sender: userId
//       });
//       res.json({ totalMessagesSent });
//   } catch (error) {
//       console.error("Error fetching total messages sent:", error);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });

// hold user cookies to keep user logged in
app.get('/api/profile', (req,res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.get('/api/users', async (req, res) => {
  const users = await User.find({}, {'_id': 1, username:1});
  res.json(users);
});

// log in current user -- search for username and ensure pass is correct
app.post('/api/login', async (req, res) => {
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
        } else {
          res.status(401).json({ error: 'Incorrect password' });
        }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
});

// log out current user by removing cookies
app.post('/api/logout', (req, res) => {
  wss.clients.forEach(client => {
    client.close();
  });
  res.cookie('token', '', {sameSite:'none', secure:true}).json('ok');
});

// sign in new users -- add new username and pass
app.post('/api/signup', async (req,res) => {
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
          id: createdUser._id,
        });
      });
    } catch(err) {
      if (err.code === 11000 && err.keyPattern.username) {
        // MongoDB duplicate key error (username already exists)
        res.status(400).json({ error: 'Username already exists' });
    } else {
      if (err) throw err;
      res.status(500).json('error');
    }
  }});

const server = app.listen(4000);

// create websocket server
const wss = new ws.WebSocketServer({server});
wss.on('connection', (connection, req) => {

  // handle old connections
  function notifyAboutOnlineUsers() {
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId:c.userId,username:c.username})),
      }));
    });
  }
  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlineUsers();
      console.log('dead');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  // handle users
  const cookies = req.headers.cookie;
  if (cookies) {
      const tokenString = cookies.split(';').find(str => str.startsWith('token='));
      if (tokenString) {
          const token = tokenString.split('=')[1];
          if (token) {
              jwt.verify(token, jwtSecret, {}, (err, userData) => {
                  if (err) throw err;
                  const {userId, username} = userData;
                  connection.userId = userId;
                  connection.username = username;
              })
          }
      }
  }
  
  // handle messages
  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const {recipient, text} = messageData;
    if (recipient && text){
      const messageDoc = await Message.create({
        sender:connection.userId,
        recipient,
        text
      });
      [...wss.clients]
        .filter(c => c.userId === recipient)
        .forEach(c => c.send(JSON.stringify({
          text, 
          sender:connection.userId,
          recipient, 
          _id:messageDoc._id
        })));
    }
  });

  notifyAboutOnlineUsers();
})

