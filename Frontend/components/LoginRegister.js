import React, {useState} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ServerLoginUser, ServerRegisterUser } from '../serverFunctions';
// Komponentti, mikä hallitsee kirjautumisen ja rekisteröitymisen näyttämisen.
export default function LoginRegister({setCurrentUser}) { 
    const [pressed, setPressed] = useState(false); // Jos false, niin näytetään kirjautumiskomponentti, muuten rekisteröitymiskomponentti.
    return(
        <>
            {pressed === false ? <Login setPressed={setPressed} setCurrentUser={setCurrentUser} /> : <Register setPressed={setPressed} />}
        </>
    );
}

// Kirjautumiskomponentti.
function Login({setPressed, setCurrentUser}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginCorrect, setLoginCorrect] = useState(true);

    const handleUsername = (props) => { 
        setUsername(props);
    }

    const handlePassword = (props) => {
        setPassword(props);
    }

    const handleRegisterButton = () => {
        setPressed(true);
    }
    const handleLoginButton = () => {
        const login = ServerLoginUser(username, password);
        if (login !== false) {
            setLoginCorrect(true);
            setCurrentUser(login);
        }
        else {
            setLoginCorrect(false);
        }
        
    }

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

// Rekisteröitymiskomponentti.
function Register({setPressed}) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [registerCorrect, setRegisterCorrect] = React.useState(true);

    const handleUsername = (props) => { 
        setUsername(props);
    }

    const handlePassword = (props) => {
        setPassword(props);
    }

    const handleRegisterButton = () => {
        const newUser = ServerRegisterUser(username, password);
        console.log("NEWUSER: " + newUser);
        if (newUser !== false) {
            setRegisterCorrect(true);
            setPressed(false);
        }
        else {
            setRegisterCorrect(false);
        }
    }

    const returnToLogin = () => {
        setPressed(false);
    }
    return (
        <View style={styles.loginBox}>
            {registerCorrect === true ? <Text style={styles.textInputTop}>Rekisteröidy</Text> : <Text style={styles.textInputTopError}>Käyttäjätunnus on jo käytössä!</Text>}
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