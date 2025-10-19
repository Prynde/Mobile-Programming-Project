import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {updateList} from '../sqlconnection/db';

export default function ListContent({setVisibility, selectedList, updateNewShoppingListState, deleteSelectedList}) { 
    console.log(selectedList.id)
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("") // Message that is shown.
    const [edited, setEdited] = useState(false) // If user have edited message in any way this is changed to true.
    const [menuVisible, setMenuVisible] = useState(false);
    // TextInput is initialized with useEffect on first render.
    useEffect(() => {
        setTitle(selectedList.title)
        setMessage(selectedList.message)
    }, []);

    const handleProfile = () => {
        handleSaving()
        setMenuVisible(false)
        setVisibility(false)
    }

    const handleTitle = (props) => {
        setEdited(true) // Called every time something is pressee, find a better way?
        setTitle(props)
    }

    const handleMessage = (props) => {
        setEdited(true) // Called every time something is pressee, find a better way?
        setMessage(props)
    }

    // Saves title and message to the object and updates date if either has been edited.
    const handleSaving = () => {
        if (edited) {
            updateNewValues();
        }
    }

    const handleDelete = () => {
        setMenuVisible(false);
        setEdited(false)
        deleteSelectedList()
        setVisibility(false)
    }

    const updateNewValues = async() => {
        const newDate = new Date();
        console.log(selectedList.id, title, message, newDate.toISOString())
        updateList(selectedList.id, title, message, newDate.toISOString())
        updateNewShoppingListState() // From MainMenu.js.
    }
    
    return(
        <View style={styles.container}>
            <View style={styles.subContainerTop}>
                <TextInput style={styles.title} onChangeText={handleTitle} value={title} />
                <View style={styles.right}>
                  <TouchableOpacity
                    style={styles.hamburger}
                    onPress={() => setMenuVisible(true)}
                  >
                    <View style={styles.bar} />
                    <View style={styles.bar} />
                    <View style={styles.bar} />
                  </TouchableOpacity>
                </View>
            </View>
                {menuVisible && (
                        <View style={styles.dropdownContainer}>
                          <View style={styles.dropdownContent}>
                            <TouchableOpacity
                              style={styles.dropdownButton}
                              onPress={
                                handleDelete
                              }
                            >
                              <View style={styles.dropdownRow}>
                                <Text style={styles.dropdownButtonText}>Poista lista</Text>
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
            <View style={styles.subContainer}>
                <TextInput style={styles.textInputMultiline} multiline autoFocus={true} onChangeText={handleMessage} numberOfLines={150} value={message} />
            </View>
            <View style={styles.subContainerLower}>
                <TouchableOpacity style={styles.buttonInput} onPress={handleProfile}>
                    <Text>Palaa takaisin ja tallenna</Text>
                </TouchableOpacity>
            </View>
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
    },
    subContainer: {
        flex: 5,
        width: "95%",
        height: "50%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 1,
        marginBottom: 0,
    },
    subContainerTop: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: "30",
        width: "95%",
        backgroundColor: "black",
    },
    subContainerLower: {
        flex: 0,
        width: "95%",
        height: "10%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 1,
        marginBottom: 5,
    },
    title: {
        flex: 1,
        width: "100%", 
        fontSize: 20,
        color: "white",
    },
    textInputMultiline: {
        width: "100%", 
        height: "100%", 
        borderWidth: 0,
    },
    buttonInput: {
        width: "70%",
        height: 50,
        marginTop: 5,
        backgroundColor: "#abababff",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#40c844ff",    
    },
    profileHeader: {
        fontSize: 20,
        marginTop: "auto",
        marginBottom: "auto",  
        marginLeft: "auto",
        marginRight: "auto",  
    },
// Rest are from Header.js.
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
})