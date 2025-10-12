const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
var io = require('socket.io')(httpServer);
const mongoose = require('mongoose');
// const socketioAuth = require("socketio-auth");
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const fs = require("fs");

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
                resolve(bcryptpw = hash); // return hashed password
            });
        });
    });
};

var users = new Object();

io.on('connection', function (socket) {
    console.log('client connected on websocket');

    socket.on("authentication", async (data, callback) => {
        if (data.username == '' || data.password == '') {
            return callback(new Error("No username or password given"));
        };
        const user = await User.findOne({ username: data.username });

        if (data.register) { // register new user if true
            if (user) {
                return callback(new Error("User already exists"));
            } else {
                await hashpw(data.password); // hash the password
                const user = await User.create({ username: data.username, password: bcryptpw });
                io.emit("registered", { message: data.username })
            }
        } else { // else attempt to login
            if (!user) {
                return callback(new Error("User not found")); // -> client.emit("unauthorized")...
            } else if (!bcrypt.compareSync(data.password, user.password)) {
                return callback(new Error("Authentication failure"));
            } else {
                users[data.username] = socket.id;
                console.log(users[data.username]);
                socket.emit("loggedIn", { message: "Logged in succesfully.", sessionID: socket.id })
            };
        };
    });

    socket.on("logintest", (data) => { if (users[data.username] == socket.id) { console.log("testok") } else {console.log(socket.id)} });

    // Password change
    socket.on("pwchange", async (data) => {
        if (users[data.username] == socket.id) {
        if (data.oldpassword == '' || data.password == '' || data.password2 == '') {
                    console.log(data);
            io.emit("pwcanswer", {status: "Tyhjä kenttä"});
            return;
        };
        if (data.oldpassword == data.password) {
            io.emit("pwcanswer", { status: "Vanha ja uusi salasana ovat identtisiä." });
            return;
        };
        const user = await User.findOne({ username: data.username });
        if (bcrypt.compareSync(data.oldpassword, user.password)) {
            if (data.password == data.password2) {
                await hashpw(data.password); // hash the password
                const user = await User.updateOne({ username: data.username }, { password: bcryptpw });
                io.emit("pwcanswer", { status: "Salasana vaihdettu" })
            } else {
                io.emit("pwcanswer", { status: "New password-fields do not match" });
            };
        } else {
            io.emit("pwcanswer", {status: "Vanha salasa on väärin"});
        };
}});
});


/*
const authenticate = async (client, data, callback) => {
    if (data.username == '' || data.password == '') {
        return callback(new Error("No username or password given"));
    };
    const user = await User.findOne({ username: data.username });

    if (data.register) { // register new user if true
        if (user) {
            return callback(new Error("User already exists"));
        } else {
            await hashpw(data.password); // hash the password
            const user = await User.create({ username: data.username, password: bcryptpw });
            io.emit("registered", { message: data.username })
        }
    } else { // else attempt to login

        if (!user) {
            return callback(new Error("User not found")); // -> client.emit("unauthorized")...
        } else if (!bcrypt.compareSync(data.password, user.password)) {
            return callback(new Error("Authentication failure"));
        } else {
            client.emit("loggedIn", { message: "Logged in succesfully." })
            return callback(null, data.username && true); // Internal callback to register the login event
        };
    };
};


const postAuthenticate = async (client, data, callback) => {
    /* Handle authenticated socket calls 
    client.on("logintest", () => console.log("testok"));

    // File upload, needs more code to link the image to a user in MongoDB
    client.on("upload", async (file, callback) => {
        console.log("upload");
        console.log(file);
        let image = atob(file.content);
        fs.writeFile("/images/" + file.name, image, (err) => {
            // callback({ message: err ? "failure" : "success" });
        });
        let path = '/images/'; // Find the filename...
        // const user = await User.updateOne({ username: data.username }, { profilepic: path });

    });

    // Password change
    client.on("pwchange", async (data, callback) => {
        console.log(data);
        if (data.oldpassword == '' || data.password == '' || data.password2 == '') {
            callback({status: "Empty field"});
            return;
        };
        if (data.oldpassword == data.password) {
            callback({status: "Vanha ja uusi salasana ovat identtisiä."});
            return;
        };
        const user = await User.findOne({ username: data.username });
        if (bcrypt.compareSync(data.oldpassword, user.password)) {
            if (data.password == data.password2) {
                await hashpw(data.password); // hash the password
                const user = await User.updateOne({ username: data.username }, { password: bcryptpw });
                callback({status: "Salasana vaihdettu"})
            } else {
                callback({status: "New password-fields do not match"});
            };
        };
    });
};
*/

// socketioAuth(io, { authenticate, postAuthenticate, timeout: "10000000" });


const PORT = process.env.PORT || 3300;
httpServer.listen(PORT, () => console.log(`App listening on port ${PORT}`));