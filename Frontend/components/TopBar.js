import React, {useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import Profile from './Profile';

export default function TopBar({currentUser, setCurrentUser}) { 
    const [visibility, setVisibility] = useState(false)
    
    const handleLogOut = () => {
        setCurrentUser(undefined);
    }

    const handleProfile = () => {
        setVisibility(true)
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
            <Text style={styles.topBarTitle}>{currentUser}</Text>
            <TouchableOpacity style={styles.buttonLogOut} onPress={handleLogOut}>
                <Text>Kirjaudu ulos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonLogOut} onPress={handleProfile}>
                <Text>Avaa profiili</Text>
            </TouchableOpacity>

            <Modal visible={visibility}>
                <Profile setVisibility={setVisibility} />
            </Modal>
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
        borderColor: "#40c844ff",
    }
})