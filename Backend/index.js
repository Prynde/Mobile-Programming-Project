const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
var io = require('socket.io')(httpServer);
const mongoose = require('mongoose');
const socketioAuth = require("socketio-auth");
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const fs = require("fs");



io.on('connection', function(socket) {
  console.log('client connected on websocket');
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
var bcryptpw;

async function hashpw(password) {
    const saltRounds = 10;
    await new Promise((resolve) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                // Handle error
                return;
            }
            // Salt generation successful, proceed to hash the password
        
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    // Handle error
                    return;
                }
                resolve(bcryptpw = hash);
            });
        });
    });
};

const authenticate = async (client, data, callback) => {
    const user = await User.findOne({username:data.username});

    if (data.register) {
        if (user) {
            return callback(new Error("User already exists"));
        } else {
            await hashpw(data.password);
            const user = await User.create({ username:data.username, password:bcryptpw });
            io.emit("registered", {message: data.username})
        }
    } else {
    
        if (!user) {
            return callback(new Error("User not found"));
        } else if (!bcrypt.compareSync(data.password, user.password)) {
            return callback(new Error("Authentication failure"));
        } else {
            client.emit("loggedIn", {message: "Logged in succesfully."})
            return callback(null, data.username && true); // Internal callback to register the login event
        };
    };
};


const postAuthenticate = client => {
  /* Handle authenticated socket calls */
  client.on("logintest", () => client.emit("testok"));

  // File upload
  client.on("upload", (file, callback) => {
    fs.writeFile("/images", file, (err) => {
      callback({ message: err ? "failure" : "success" });
    });
  });
};


socketioAuth(io, { authenticate, postAuthenticate, timeout: "100000" });


const PORT = process.env.PORT || 3300;
httpServer.listen(PORT, () => console.log(`App listening on port ${PORT}`));