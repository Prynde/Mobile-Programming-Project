const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const httpServer = require("http").createServer(app);
var io = require('socket.io')(httpServer);

const dbURI = 'mongodb+srv://' + process.env.DBUSERNAME + ':' + process.env.DBPASSWORD + '@' + process.env.CLUSTER + '.c7byj1n.mongodb.net/' + process.env.DB + '?retryWrites=true&w=majority&appName=Hamk-projects';

mongoose.connect(dbURI)
.then((result) => {
    console.log('Connected to the DB');
})
.catch((err) => {
    console.log(err);
});



const sessionMiddleware = session({
  secret: 'You will never guess it',
  resave: false,
  saveUninitialized: true,
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new LocalStrategy((username, password, done) => {
        if (username === process.env.ADMINUSERNAME && bcrypt.compareSync(password, process.env.ADMINPASSWORD)) {
            console.log('Logged in');
            return done(null, { id: 1, username: username });
        } else {
            return done(null, false, { message: 'Invalid credentials' });
        }
    })
);

const saltRounds = 10; // Typically a value between 10 and 12

bcrypt.genSalt(saltRounds, (err, salt) => {
if (err) {
    // Handle error
    return;
}

// Salt generation successful, proceed to hash the password
});

function hash(password) {
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            // Handle error
            return;
        }
        // Hashing successful, 'hash' contains the hashed password
        return hash;
})};

const User = require('./models/user');

// Socket connections
// Auth stuff
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.on('connection', function(socket) {
    console.log("a user has connected!");
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    
    socket.on('register', async function(username, password) {
        hashedpw = hash(password);
        const user = new User({
            username,
            hashedpw
        });
        try {
            await user.save();
            callback({ status: 'ok' });
        } catch (err) {
        console.error(err);
        callback({ status: 'error' });
    }
});

    /*
    socket.on('register', function(username, password) {
        if (socket.request.user) { <-- for logged in user check
            
        }
    });
    */

    socket.on('like-feedback', async function (id, callback) {
        await Feedback.updateOne({ _id: id }, { $inc: { likes: 1 }})
            .catch(err => {
                console.log(err);
                callback({status: "error"});
            });
        
        let document = await Feedback.findOne({ _id: id });
        callback({status: "ok", likes: document.likes });
    });
});


// Create listener for connections
const PORT = process.env.PORT || 3300;
httpServer.listen(PORT, () => console.log(`App listening on port ${PORT}`));