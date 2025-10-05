import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

export default function MainMenu({currentUser}) {
    return(
        <View style={styles.mainMenu}>
            <View style={styles.mainMenuNewList}>
                <TextInput placeholder='Uusi ostoslista' style={styles.textInputNewList} />
                <TouchableOpacity style={styles.buttonNewList} onPress={() => console.log("Painettu")}>
                    <Text>Luo</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.mainMenuSelectList}>
                <TouchableOpacity style={styles.buttonInput} onPress={() => console.log("Painettu")}>
                    <Text>Aktiiviset ostoslistat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonInput} onPress={() => console.log("Painettu")}>
                    <Text>Kaikki ostoslistat</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    mainMenu:{
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
    mainMenuNewList: {
        backgroundColor: "#fff", // Debuggausta
        flex: 1,
        flexDirection: "row",
        width: "100%",
        maxHeight: "20%",

    },
    mainMenuSelectList: {
        backgroundColor: "#ff0000ff", // Debuggausta
        flex: 1,
        flexDirection: "column",
        width: "100%",
        maxHeight: "35%",
        marginBottom: "auto",
    },
    textInputNewList: {
        height: 40,
        width: "50%",
        backgroundColor: "#abababff", 
        marginTop: "auto",
        marginBottom: "auto",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",        
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#000000ff",
    },
    buttonNewList: {
        height: 40,
        width: "30%",
        backgroundColor: "#abababff",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",        
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#40c844ff",
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
})