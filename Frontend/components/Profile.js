import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Button } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {

    let [image, setImage, result] = useState("");

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
            <Button title="Pick an image from gallery" onPress={pickImage} />
            <Button title="Use camera" onPress={camera} />
            <Button title="Save as profile picture" onPress={upload} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
});