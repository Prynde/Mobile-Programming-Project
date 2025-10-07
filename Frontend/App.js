import React, {useState} from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import io from "socket.io-client";

import LoginRegister from './components/LoginRegister';
import MainMenu from './components/MainMenu';
import TopBar from './components/TopBar';
import Profile from './components/Profile';

// Used for connecting app to server. Socket variable is passed to several components
const socket = io.connect("https://lappis.mau-mooneye.ts.net", {transports: ['websocket']});

export default function App() {
  const [currentUser, setCurrentUser] = useState(undefined); // Kirjautunut käyttäjä

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <Button onPress={()=>console.log(currentUser)} color="blue" size="large" title="Current user" />
        <Button onPress={()=>setCurrentUser("MobileMobiloija")} color="blue" size="large" title="Test: go to main menu." />
        <TopBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        {currentUser !== undefined ? <MainMenu currentUser={currentUser} /> : <LoginRegister setCurrentUser={setCurrentUser} socket={socket} />}
        <StatusBar style="auto" />
    </View>
  );
}