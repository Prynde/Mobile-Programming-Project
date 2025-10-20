import React, { useState } from "react";
import { Buffer } from "buffer";

import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";

export default function Header({
  socket,
  title = "Älykäs ostoskori",
  profileSource,
  onProfilePress = () => {},
  onLogout = () => {},
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileIcon, setprofileIcon] = useState("");
  const [fontsLoaded] = useFonts({
    JustAnotherHand: require("../assets/fonts/JustAnotherHand-Regular_e324a4054498cee2bae0e36df7910e11.ttf"),
  });

  const leftIcon = require("../assets/basket.png");
  
  //let profileIcon = profileSource
  //  ? profileSource
  //  : require("../assets/icon.png");
  
    socket.on('profilepic', data => {
        console.log('receiving pic: ' + data.ext);
        setprofileIcon("data:image/" + data.ext + ";base64," + data.buffer);
    });

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Image source={leftIcon} style={styles.leftImage} />
        <Text
          style={[
            styles.title,
            fontsLoaded && { fontFamily: "JustAnotherHand" },
          ]}
        >
          {title}
        </Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => setMenuVisible(true)}
        >
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </TouchableOpacity>
          {profileIcon && 
        <TouchableOpacity onPress={onProfilePress}>
          <Image source={{uri: profileIcon}} style={styles.profile} />
        </TouchableOpacity>}
      </View>

      {menuVisible && (
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownContent}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => {
                setMenuVisible(false);
                onLogout();
              }}
            >
              <View style={styles.dropdownRow}>
                <Image
                  source={require("../assets/favicon.png")}
                  style={styles.dropdownIcon}
                />
                <Text style={styles.dropdownButtonText}>Kirjaudu ulos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownCancel}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.dropdownCancelText}>Peruuta</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 70,
    paddingTop: Platform.OS === "ios" ? 30 : 10,
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftImage: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 6,
    marginRight: 10,
  },
  title: {
    color: "white",
    fontSize: 35,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  hamburger: {
    width: 36,
    height: 28,
    justifyContent: "space-between",
    marginRight: 12,
    paddingVertical: 4,
  },
  bar: {
    height: 3,
    backgroundColor: "white",
    borderRadius: 2,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  dropdownContainer: {
    position: "absolute",
    top: 70,
    right: 12,
    zIndex: 50,
  },
  dropdownContent: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#222",
  },
  dropdownCancel: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  dropdownCancelText: {
    fontSize: 16,
    color: "#007AFF",
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#222",
  },
  modalCancel: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
