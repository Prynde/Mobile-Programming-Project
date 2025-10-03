import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import io from "socket.io-client";
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
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button onPress={socketTest} color="blue" size="large"
        title="Test">
          Test
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
