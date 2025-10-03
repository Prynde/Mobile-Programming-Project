const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
var io = require('socket.io')(httpServer);
const mongoose = require('mongoose');
mongoose.Promise = require("bluebird");
const socketioAuth = require("socketio-auth");
const dotenv = require('dotenv');
dotenv.config();


io.on('connection', function(socket) {
  console.log('client connected on websocket');
  socket.on('test', function (callback) {
    console.log('Button press');
  })
});



const dbURI = 'mongodb+srv://' + process.env.DBUSERNAME + ':' + process.env.DBPASSWORD + '@' + process.env.CLUSTER + '.c7byj1n.mongodb.net/' + process.env.DB + '?retryWrites=true&w=majority&appName=Hamk-projects';

mongoose.connect(dbURI)
.then((result) => {
    console.log('Connected to the DB');
})
.catch((err) => {
    console.log(err);
});

const User = require('./models/user');

const authenticate = async (client, data, callback) => {
  const { username, password, register } = data;
    console.log("input");
try {
    if (register) {
      const user = await User.create({ username, password });
      callback(null, !!user);
    } else {
      const user = await User.findOne({ username });
      callback(null, user && user.validPassword(password));
    }
  } catch (error) {
    callback(error);
  }
};

const postAuthenticate = client => {
  client.on("poke", () => client.emit("logged in"));
};


socketioAuth(io, { authenticate, postAuthenticate, timeout: "none" });


const PORT = process.env.PORT || 3300;
httpServer.listen(PORT, () => console.log(`App listening on port ${PORT}`));