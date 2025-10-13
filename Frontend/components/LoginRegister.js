import React, {useState} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ServerLoginUser, ServerRegisterUser } from '../serverFunctions';
import io from "socket.io-client";
// Komponentti, mikä hallitsee kirjautumisen ja rekisteröitymisen näyttämisen.
export default function LoginRegister({setCurrentUser, socket}) { 
    const [pressed, setPressed] = useState(false); // Jos false, niin näytetään kirjautumiskomponentti, muuten rekisteröitymiskomponentti.
    return(
        <>
            {pressed === false ? <Login setPressed={setPressed} setCurrentUser={setCurrentUser} socket={socket} /> : <Register setPressed={setPressed} socket={socket} />}
        </>
    );
}

// Log in component.
function Login({setPressed, setCurrentUser, socket}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginCorrect, setLoginCorrect] = useState(true);

    //Username and password are saved to object which is sent to server.
    const data = {
        username: username, //test
        password: password, //test
    };

    const handleUsername = (props) => { 
        setUsername(props);
    }

    const handlePassword = (props) => {
        setPassword(props);
    }

    const handleRegisterButton = () => {
        setPressed(true);
    }

    // Tries to log in with username and password.
    const handleLoginButton = () => {
        console.log(socket.connected);
        socket.emit("authentication", { ...data, register: false });
        setTimeout(() => {
            checkLogIn();
        }, 1000)
    };
    
    // Sends an event to server for checking if user is authorized to log in.
    const checkLogIn = () => {
        socket.emit("logintest", { ...data, register: false });
    };

    // Show message for succesfull login
    socket.on("loggedIn", (message) => { 
        setCurrentUser(data.username)
        console.log("Logged in: " + message.message)
    });

    // Show message if wrong username or password was given
    socket.on('unauthorized', (err) => { 
        setLoginCorrect(false);
        console.log("Authentication error: " + err.message);
    });

    return (
        <View style={styles.loginBox}>
            {loginCorrect === true ? <Text style={styles.textInputTop}>Kirjaudu sisään, tai luo uusi tunnus!</Text> : <Text style={styles.textInputTopError}>Käyttäjätunnus tai salasana väärin.</Text>}
            <TextInput style={styles.textInput} placeholder="Käyttäjätunnus" onChangeText={handleUsername}/>
            <TextInput style={styles.textInput} placeholder="Salasana" secureTextEntry={true} onChangeText={handlePassword}/>
            
            <TouchableOpacity style={styles.buttonInput} onPress={handleLoginButton}>
                <Text>Kirjaudu sisään</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.buttonInput2} onPress={handleRegisterButton}>
                <Text>Luo uusi tunnus</Text>
            </TouchableOpacity>
        </View>
    );
}

// Registers users.
function Register({setPressed, socket}) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [registerCorrect, setRegisterCorrect] = React.useState(true);

    //Username and password are saved to object which is sent to server.
    const data = {
        username: username, //test
        password: password, //test
    };

    const handleUsername = (props) => { 
        setUsername(props);
    }

    const handlePassword = (props) => {
        setPassword(props);
    }

    const handleRegisterButton = () => {
        socket.emit("authentication", { ...data, register: true });

    }
    socket.on('unauthorized', (message) => { 
        console.log("Authentication error: " + message.message);
        setRegisterCorrect(false)
    });

    socket.on('registered', (message) => { // Show message for succesfull registration
        console.log("Registered succesfully: " + message.message);
    });


    const returnToLogin = () => {
        setPressed(false);
    }
    return (
        <View style={styles.loginBox}>
            {registerCorrect === true ? <Text style={styles.textInputTop}>Rekisteröidy</Text> : <Text style={styles.textInputTopError}>Virhe rekisteröityessä!</Text>}
            <TextInput style={styles.textInput} placeholder="Käyttäjätunnus" onChangeText={handleUsername}/>
            <TextInput style={styles.textInput} placeholder="Salasana" secureTextEntry={true} onChangeText={handlePassword}/>
            <TouchableOpacity style={styles.buttonInput} onPress={handleRegisterButton}>
                <Text>Rekisteröidy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonInput2} onPress={returnToLogin}>
                <Text>Palaa</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    loginBox:{
        flex: 5,
        flexDirection: "column",
        alignItems:"flex-start",
        width: "95%",
        maxHeight: "50%",
        marginTop: 10,
        marginBottom: 10,
        justifyContent:"center",
        borderWidth: 5,
        borderRadius:15,
        backgroundColor: "#818080ff",
    },
    textInputTop: {
        fontSize: 20,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 10,
        marginTop: 10,
    },
    textInputTopError: {
        fontSize: 20,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 10,
        marginTop: 10,
        color: "red",
    },
    textInput: {
        height: 40,
        width: "90%",
        margin: 1,
        backgroundColor: "#abababff",
        marginTop: 1,
        justifyContent: "space-around",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#000000ff",
    },
    buttonInput: {
        height: 40,
        width: "90%",
        backgroundColor: "#abababff",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 5,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#40c844ff",    
    },
    buttonInput2: {
        height: 40,
        width: "90%",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 5,
        marginLeft: "auto",
        marginRight: "auto",
    }

})