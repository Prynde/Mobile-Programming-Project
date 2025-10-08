import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ListContent({setVisibility, selectedList}) { 
    console.log(selectedList)

    const handleProfile = () => {
        setVisibility(false)
    }

    return(
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.profileHeader}>Otsikko: {selectedList.content[0].title}</Text>
                <Text style={styles.profileHeader}>Viesti: {selectedList.content[0].message}</Text>
            </View>
            <View style={styles.subContainer}>
                <TouchableOpacity style={styles.buttonInput} onPress={handleProfile}>
                    <Text>Palaa takaisin</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        alignItems: 'center',
        justifyContent: "flex-start",
        height: "50%",
        backgroundColor: "#818080ff"
    },
    subContainer: {
        flex: 1,
        width: "80%",
        height: "50%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#666666ff",
        borderWidth: 2,
        marginBottom: 5,
        
    },
    buttonInput: {
        width: "70%",
        height: 50,
        marginTop: 5,
        backgroundColor: "#abababff",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#40c844ff",    
    },
    profileHeader: {
        fontSize: 20,
        marginTop: "auto",
        marginBottom: "auto",  
        marginLeft: "auto",
        marginRight: "auto",  
    },
})