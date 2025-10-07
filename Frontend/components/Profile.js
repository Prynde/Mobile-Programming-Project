import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Button } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function Profile({setVisibility}) {

    let [image, setImage, result] = useState("");

    const handleProfile = () => {
        setVisibility(false)
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const camera = async () => {
        result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });
        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    function upload(result) {
        socket.emit("upload", result.assets[0].uri, (status) => {
            alert(status);
        });
    };

    return (

        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.profileHeader}>Profiilikuva</Text>
                <TouchableOpacity style={styles.buttonInput} onPress={pickImage}>
                    <Text>Valitse galleriasta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonInput} onPress={camera}>
                    <Text>Käytä kameraa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonInput} onPress={upload}>
                    <Text>Tallenna profiilikuvana</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
            
            <View style={styles.subContainer}>
                <Text style={styles.profileHeader}>Muuta</Text>
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
    profileHeader: {
        fontSize: 20,
        marginTop: "auto",
        marginBottom: "auto",  
        marginLeft: "auto",
        marginRight: "auto",  
    },
    image: {
        width: 200,
        height: 200,
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

});