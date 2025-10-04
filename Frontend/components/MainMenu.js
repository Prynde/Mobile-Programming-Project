import React from 'react';
import { StyleSheet, Text, View } from "react-native";

export default function MainMenu({setCurrentUser}) {
    return(
        <View style={styles.loginBox}>
            <Text>Hienoa pääsit sisälle!</Text>
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