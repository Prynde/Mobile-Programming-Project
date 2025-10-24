import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Button, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function Profile({ setVisibility, socket, currentUser }) {

    let [image, setImage] = useState("");
    let [pwcResult, setPwcResult] = useState('');
    const [profileIcon, setprofileIcon] = useState(""); // From header.

    let result = [];
    const handleProfile = () => {
        setVisibility(false)
    };
    
    // From header.
    socket.on('profilepic', data => {
        console.log('receiving pic: ' + data.ext);
        setprofileIcon("data:image/" + data.ext + ";base64," + data.buffer);
    });

    const pickImage = async () => {
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });
        console.log('pickImage: ' + result.assets[0].uri);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            upload(result);
        };
    };

    const camera = async () => {
        result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });
        

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            upload(result);
        };
    };

    const upload = async (result) => {
    const name = result.assets[0].uri.slice(56);
        socket.emit("upload", {username: currentUser, name: name, buffer: result.assets[0].base64 });

    };


    const [oldpassword, setPassword1] = useState("");
    const [password, setPassword2] = useState("");
    const [password2, setPassword3] = useState("");

    const handlePassword1 = (props) => {
        setPassword1(props);
    };
    const handlePassword2 = (props) => {
        setPassword2(props);
    };
    const handlePassword3 = (props) => {
        setPassword3(props);
    };

    const handlePwchange = (socket) => {
        let data = {
            username: currentUser,
            oldpassword: oldpassword,
            password: password,
            password2: password2
        };
        console.log(data);
        socket.emit("pwchange", data);
    };
    
    socket.on('pwcanswer', (result) => {
        setPwcResult(result.status);
    });

    return (
    
        <View style={styles.container}>
            <ScrollView style={styles.scrollview}>
                <View style={styles.subContainer}>
                    <Text style={styles.profileHeader}>Profiilikuva</Text>
                    <TouchableOpacity style={styles.buttonInput} onPress={pickImage}>
                        <Text>Valitse galleriasta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonInput} onPress={camera}>
                        <Text>Käytä kameraa</Text>
                    </TouchableOpacity>
                    {image && <Image source={{ uri: image }} style={styles.imageStyle} /> ? image && <Image source={{ uri: image }} style={styles.imageStyle} /> : <Image source={{uri: profileIcon}} style={styles.imageStyle} />}
                </View>
        
                <View style={styles.subContainer}>
                    <Text style={styles.profileHeader}>Salasana</Text>
                    <TextInput style={styles.textInput} placeholder="Vanha salasana" secureTextEntry={true} onChangeText={handlePassword1} />
                    <TextInput style={styles.textInput} placeholder="Uusi salasana" secureTextEntry={true} onChangeText={handlePassword2} />
                    <TextInput style={styles.textInput} placeholder="Toista uusi salasana" secureTextEntry={true} onChangeText={handlePassword3} />
                    <TouchableOpacity style={styles.buttonInput} onPress={() => handlePwchange(socket)}>
                        <Text>Vaihda salasana</Text>
                    </TouchableOpacity>
                    <Text style={styles.textInputTopError}>{pwcResult}</Text>
                    <TouchableOpacity style={styles.buttonInput} onPress={handleProfile}>
                        <Text>Palaa takaisin</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        backgroundColor: "#fff"
    },
    scrollview: {
        width: "100%"
    },
    subContainer: {
        flex: 1,
        width: "100%",
        height: "50%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#EEEEEE",
        borderWidth: 2,
        marginBottom: 5,

    },
    profileHeader: {
        fontSize: 20,
        marginTop: "10",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
    },
    imageStyle: {
        flex: 1,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
        marginBottom: 10,
        resizeMode: "cover"
    },
    buttonInput: {
        height: 40,
        width: "90%",
        backgroundColor: "#EEEEEE",
        alignItems: "center",
        justifyContent: "space-around",
        marginBottom: 10,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#40c844ff", 
    },
    textInput: {
        height: 40,
        width: "90%",
        margin: 1,
        backgroundColor: "#fff",
        marginTop: 1,
        marginBottom: 10,
        justifyContent: "space-around",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#000000ff",
    },
    textInputTopError: {
        fontSize: 20,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 10,
        marginTop: 10,
        color: "red",
    },
});