import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { useFonts } from "expo-font";
import Profile from "./Profile";

export default function TopBar({ currentUser, setCurrentUser, socket }) {
  const [visibility, setVisibility] = useState(false);
  const [fontsLoaded] = useFonts({
    JustAnotherHand: require("../assets/fonts/JustAnotherHand-Regular_e324a4054498cee2bae0e36df7910e11.ttf"),
  });

  const handleLogOut = () => {
    setCurrentUser(undefined);
  };

  const handleProfile = () => {
    setVisibility(true);
  };

  if (currentUser === undefined) {
    return (
      <View style={styles.topBar}>
        <Text
          style={[
            styles.topBarTitle,
            fontsLoaded && { fontFamily: "JustAnotherHand" },
          ]}
        >
          Älykäs ostoskori
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.topBar}>
      <Text
        style={[
          styles.topBarTitle,
          fontsLoaded && { fontFamily: "JustAnotherHand" },
        ]}
      >
        Tervetuloa {currentUser}!
      </Text>
      {/* Logout moved to Header; keep this here as reference
      <TouchableOpacity style={styles.buttonLogOut} onPress={handleLogOut}>
        <Text>Kirjaudu ulos</Text>
      </TouchableOpacity>
      */}

      {/* Profile button removed because Header handles profile modal now
      <TouchableOpacity style={styles.buttonLogOut} onPress={handleProfile}>
        <Text>Avaa profiili</Text>
      </TouchableOpacity>

      <Modal visible={visibility}>
        <Profile setVisibility={setVisibility} />
      </Modal>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    width: "95%",
    maxHeight: "10%",
    //marginTop: 10,
    justifyContent: "center",
    // borderWidth: 5,
    // borderRadius: 15,
    backgroundColor: "white",
    marginBottom: 40,
  },
  topBarTitle: {
    fontSize: 35,
    fontWeight: "600",
    marginBottom: 50,
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
  },
});
