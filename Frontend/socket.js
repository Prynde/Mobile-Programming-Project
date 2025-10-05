import io from "socket.io-client";
const socket = io.connect("https://lappis.mau-mooneye.ts.net", {transports: ['websocket']});

const socketTest = () => { // Test register
  socket.emit("authentication", { username, password, register: true }
)};

const socketTest2 = () => { // Test login
  socket.emit("authentication",  { username, password } 
)};

const socketTest3 = () => { // Test login
  socket.emit("logintest"
)};

socket.on('unauthorized', (err) => { // Show message if wrong username or password was given
  alert("There was an error with the authentication: " + err.message);
});

socket.on('registered', (message) => { // Show message for succesfull registration
  alert(message.message + " registered succesfully.");
});

socket.on('loggedIn', (message) => { // Show message for succesfull login
  alert(message.message);
});

socket.on('testok', (message) => { // Show message for succesfull logged in test
  alert("Test ok");
});

function upload(files) {
  socket.emit("upload", files[0], (status) => {
    alert(status);
  });
};
