import React, { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import io from "socket.io-client";
import Toast from "react-native-toast-message";

import LoginRegister from "./components/LoginRegister";
import MainMenu from "./components/MainMenu";
import TopBar from "./components/TopBar";
import Profile from "./components/Profile";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Used for connecting app to server. Socket variable is passed to several components
const socket = io.connect("https://lappis.mau-mooneye.ts.net", {
  transports: ["websocket"],
});

export default function App() {
  const [currentUser, setCurrentUser] = useState(undefined); // Kirjautunut käyttäjä
  const [profileVisible, setProfileVisible] = useState(false);
  const [profileIcon, setprofileIcon] = useState(""); // Moved from header.
  const handleLogout = () => {
    setCurrentUser(undefined);
    setProfileVisible(false);
    setprofileIcon("")
  };

  return (
    <>
      <View style={styles.container}>
        <Header
          onProfilePress={() => setProfileVisible(true)}
          onLogout={handleLogout}
          socket={socket}
          profileIcon={profileIcon}
          setprofileIcon={setprofileIcon}
        />

        <View style={styles.content}>
          <Button
            onPress={() => console.log(currentUser)}
            color="blue"
            size="large"
            title="Current user"
          />
          <Button
            onPress={() => setCurrentUser("MobileMobiloija")}
            color="blue"
            size="large"
            title="Test: go to main menu."
          />
          {!profileVisible && (
            <TopBar
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              socket={socket}
            />
          )}

          {profileVisible ? (
            <Profile
              setVisibility={setProfileVisible}
              currentUser={currentUser}
              socket={socket}
              profileIcon={profileIcon}
              setprofileIcon={setprofileIcon}
            />
          ) : currentUser !== undefined ? (
            <MainMenu currentUser={currentUser} socket={socket} />
          ) : (
            <LoginRegister setCurrentUser={setCurrentUser} socket={socket} />
          )}
          <StatusBar style="auto" />
        </View>

        <Footer />

        {/* Profile is rendered inside the content area so Header/Footer stay visible */}
      </View>
      {/*Toast näkyy kaikkien muiden komponenttien päällä */}
      <Toast position="bottom" visibilityTime={3000} />
    </>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
};
