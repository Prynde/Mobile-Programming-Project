import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";

export default function Footer({ children }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}></Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    height: 50,
    paddingTop: Platform.OS === "ios" ? 20 : 10,
    backgroundColor: "#08CB00",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
