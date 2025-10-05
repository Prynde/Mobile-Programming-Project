import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Testaus({setId}) { 
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [pressed, setPressed] = React.useState(false);

    const handleRegisterButton = () => {
        setPressed(true);
    }

    return(
        <View style={styles.loginBox}>
            <Text style={styles.textInputTop}>Kirjaudu sisään, tai luo uusi tunnus!</Text>
            <TextInput style={styles.textInput} placeholder="Käyttäjätunnus" />
             <TextInput style={styles.textInput} placeholder="Salasana" secureTextEntry={true}/>
            <TouchableOpacity style={styles.buttonInput} onPress={handleRegisterButton}>
                <Text>Kirjaudu sisään</Text>
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
        maxHeight: "40%",
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
        borderColor: "#40c844ff",    }
})