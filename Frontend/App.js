import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import io from "socket.io-client";
const socket = io.connect("https://lappis.mau-mooneye.ts.net:3000", {transports: ['websocket']});

const socketTest = () => {
  socket.emit("test", "test");
};

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button onClick={socketTest} color="blue" size="large"
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
