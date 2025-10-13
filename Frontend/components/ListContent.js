import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ListContent({setVisibility, selectedList}) { 
    console.log(selectedList)
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("") // Message that is shown.
    const [edited, setEdited] = useState(false) // If user have edited message in any way this is changed to true.
    // TextInput is initialized with useEffect on first render.
    useEffect(() => {
        setTitle(selectedList.title)
        setMessage(selectedList.message)
    }, []);

    const handleProfile = () => {
        handleSaving()
        setVisibility(false)
    }

    const handleTitle = (props) => {
        setEdited(true) // Called every time something is pressee, find a better way?
        setTitle(props)
        handleSaving()
    }

    const handleMessage = (props) => {
        setEdited(true) // Called every time something is pressee, find a better way?
        setMessage(props)
        handleSaving()
    }

    // Saves title and message to the object and updates date if either has been edited.
    const handleSaving = () => {
        if (edited) {
            selectedList.title = title;
            selectedList.message = message;
            const newDate = new Date();
            selectedList.date = newDate.toISOString();
        }
    }
    
    return(
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <TextInput style={{ width: "100%", borderWidth: 1}} onChangeText={handleTitle} value={title} />
                <TextInput style={{ width: "100%", height: "100%", borderWidth: 1}} multiline autoFocus={true} onChangeText={handleMessage} numberOfLines={10} value={message} />
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