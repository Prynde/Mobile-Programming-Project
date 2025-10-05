import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TopBar({currentUser, setCurrentUser}) { 
    const handleLogOut = () => {
        setCurrentUser(undefined);
    }

    if (currentUser === undefined) { 
        return(
            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Älykäs ostoskori</Text>
            </View>
        );
    }
    return(
        <View style={styles.topBar}>
            <Text style={styles.topBarTitle}>Hei {currentUser.name}</Text>
            <TouchableOpacity style={styles.buttonLogOut} onPress={handleLogOut}>
                <Text>Kirjaudu ulos</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    topBar:{
        flex: 1,
        flexDirection: "row",
        alignItems:"flex-start",
        width: "95%",
        maxHeight: "10%",
        marginTop: 10,
        justifyContent:"center",
        borderWidth: 5,
        borderRadius:15,
        backgroundColor: "#818080ff",
    },
    topBarTitle: {
        fontSize: 20,
        marginBottom: 10,
        marginTop: "auto",
        marginBottom: "auto",  
        marginLeft: "auto",
        marginRight: "auto",  
    },
    buttonLogOut: {
        height: 40,
        width: "30%",
        backgroundColor: "#abababff",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#40c844ff",    }
})