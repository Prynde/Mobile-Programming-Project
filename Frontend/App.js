import React, {useState} from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import io from "socket.io-client";

import LoginRegister from './components/LoginRegister';
import MainMenu from './components/MainMenu';
import TopBar from './components/TopBar';
import { ServerGetUserListId, ServerGetUsers } from './serverFunctions';
 // Ottaa yhteyden seuraavaan osoitteeseen ja lähettää datan.
const socket = io.connect("https://lappis.mau-mooneye.ts.net", {transports: ['websocket']});


export default function App() {
  const [currentUser, setCurrentUser] = useState(undefined); // Kirjautunut käyttäjä
  
  const data = {
    username: "test",
    password: "test",
  };

  const registerUser = () => {
    socket.emit("authentication", { ...data, register: true });
  }

  const logInUser = () => {
      console.log(socket.connected);
      socket.emit("authentication", { ...data, register: false });
      setTimeout(() => {
          checkLogIn();
      }, 1000)
  };
  
  const checkLogIn = () => {
    socket.emit("poke", { ...data, register: false });
    socket.on("logged in", () => setCurrentUser(data.username));
  };

  console.log(currentUser)
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <Button onPress={logInUser} color="blue" size="large" title="Test" />
        <Button onPress={registerUser} color="blue" size="large" title="Register test user" />
        <Button onPress={()=>console.log(currentUser)} color="blue" size="large" title="Current user" />
        <TopBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        {currentUser !== undefined ? <MainMenu setCurrentUser={setCurrentUser} /> : <LoginRegister setCurrentUser={setCurrentUser} />}
        <StatusBar style="auto" />
    </View>
  );
}