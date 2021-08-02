require("dotenv").config();
const express = require('express')
const app = express();
const { auth,requiresAuth } = require('express-openid-connect');
const http = require("http")
const server = http.createServer(app);
let io = require("socket.io")(http);
const config = require("./authConfig")

io.on("connection", (socket) =>{
    console.log("Client connected");
    ers.startGame(io, socket)
    socket.on("msg", (msg)=>{
        console.log(msg)
    })
    
})

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

app.listen(3000, () => {

    console.log("ERS listening on port: 3000");
})

