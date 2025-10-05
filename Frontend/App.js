import React, {useState} from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import io from "socket.io-client";

import LoginRegister from './components/LoginRegister';
import MainMenu from './components/MainMenu';
import TopBar from './components/TopBar';
import { ServerGetUserListId, ServerGetUsers } from './serverFunctions';

const socket = io.connect("https://lappis.mau-mooneye.ts.net", {transports: ['websocket']});
const data = {
      username: "test",
      password: "test",
    };
const socketTest = () => {
  alert("Status: " + socket.connected);
  socket.emit("authentication", { ...data, register: true });
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(undefined); // Kirjautunut käyttäjä

  const testiCurrentUser = () => {
    console.log(currentUser);
  }
  const testiUsers = () => {
    console.log(ServerGetUsers());
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <Button onPress={socketTest} color="blue" size="large" title="Test">Test</Button>
        <TopBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        {currentUser !== undefined ? <MainMenu setCurrentUser={setCurrentUser} /> : <LoginRegister setCurrentUser={setCurrentUser} />}
        <Button title="TESTI: Kirjautunut käyttäjä" onPress={testiCurrentUser}/>
        <Button title="TESTI: Kaikki käyttäjät" onPress={testiUsers}/>
        <StatusBar style="auto" />
    </View>
  );
}