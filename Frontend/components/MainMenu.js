import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Switch,
} from "react-native";
import ListContent from "./ListContent";
import { createList, readAllList, deleteList } from "../sqlconnection/db";
import { socket, sendListToServer } from "../socket";

export default function MainMenu({ currentUser }) {
  const [newList, setNewList] = useState("");
  const [offlineMode, setOfflineMode] = useState(false);
  const [shown, setShown] = useState(true); // If true all lists are shown, if false only recent ones are. DEFINE WHAT ARE ACITVE SHOPPING LISTS, THIS IS KIND OF USELESS RIGHT NOW!
  const [shoppingList, setNewShoppingList] = useState([]); // Saves temporarily lists for showing them on screen.
  const [selectedList, setSelectedList] = useState();
  const [visibility, setVisibility] = useState(false); // Shows shopping list.

  // On first render all lists are red from local db.
  useEffect(() => {
    updateNewShoppingListState();
  }, []);

  // Opens pressed shopping list.
  const handleListContent = (props) => {
    setSelectedList(props);
    setVisibility(true);
  };

  const handleNewList = (props) => {
    setNewList(props);
  };

  // Makes new object which are rendered. Also handles sending list to database and adding it to useState list.
  // const handleNewListButton = async() => {
  //   if (newList.trim().length > 0) {
  //     const newDate = new Date();
  //     const newShoppingList = {
  //       //id: shoppingList.length + 1,
  //       owner: currentUser,
  //       title: newList.trim(),
  //       message: "",
  //       date: newDate.toISOString()
  //     };
  //     // Sends list to database. Reads all lists from database and adds them to useState list.
  //     await createList(newShoppingList)
  //     updateNewShoppingListState()
  //   }
  // };

  // Makes new object which are rendered. Also handles sending list to database and adding it to useState list. (Saara added sending also to MongoDB)
  // const handleNewListButton = async () => {
  //   if (newList.trim().length > 0) {
  //     const newDate = new Date();
  //     const newShoppingList = {
  //       //id: shoppingList.length + 1,
  //       owner: currentUser,
  //       title: newList.trim(),
  //       message: "",
  //       date: newDate.toISOString(),
  //     };
  //     try {
  //       // 1. Tallenna paikalliseen SQLite-tietokantaan
  //       await createList(newShoppingList);
  //       console.log(
  //         "Lista tallennettu SQL:n paikalliseen tietokantaan:",
  //         newShoppingList
  //       );

  //       // 2. Lähetä palvelimelle (jos yhteys on)
  //       await sendListToServer(newShoppingList);
  //       console.log("Lista lähetetty palvelimelle:", newShoppingList);

  //       // 3. Päivitä käyttöliittymä
  //       updateNewShoppingListState();
  //     } catch (error) {
  //       console.error("Error while creating new list:", error);
  //     }
  //   }
  // };

  //Toinen yritys (Saara)
  const handleNewListButton = async () => {
    if (newList.trim().length === 0) return;

    const newDate = new Date();
    const newShoppingList = {
      owner: currentUser,
      title: newList.trim(),
      message: "",
      date: newDate.toISOString(),
    };

    try {
      // if switch turned to offline mode
      if (offlineMode) {
        // OFFLINE: SQLite
        await createList(newShoppingList);
        console.log(
          "Lista tallennettu paikalliseen SQLite-tietokantaan:",
          newShoppingList
        );
      } else {
        // ONLINE: MongoDB
        if (!socket || !socket.connected) {
          console.warn("Ei yhteyttä palvelimeen.");
          return; // Lopetetaan funktio tähän
        }

        await sendListToServer({
          username: currentUser,
          slname: newShoppingList.title,
          date: newShoppingList.date,
        })
          .then((response) => {
            console.log("Lista lähetetty MongoDB-palvelimelle:", response.list);
          })
          .catch((error) => {
            console.error("Virhe listan lähetyksessä:", error);
          });
      }

      // Päivitä käyttöliittymä molemmissa tapauksissa
      updateNewShoppingListState();
      setNewList(""); // tyhjennä TextInput
    } catch (error) {
      console.error("Error while creating new list:", error);
    }
  };

  // Updates useState array with content.
  const updateNewShoppingListState = async () => {
    setNewShoppingList(await readAllList(currentUser));
  };

  // Removest selected list. Called in ListContent.
  const deleteSelectedList = async () => {
    const deleteOne = await deleteList(selectedList.id, currentUser);
    setNewShoppingList(deleteOne);
    console.log(deleteOne);
  };

  // For showing recently made or edited lists.
  const handleShownFilter = () => {
    setShown(false);
  };

  const handleShownAll = () => {
    setShown(true);
  };

  // Titles of lists are shown. For now also creation dates.
  const renderList = (item) => {
    return (
      <TouchableOpacity
        style={styles.listItemStyle}
        onPress={() => handleListContent(item.item)}
      >
        <Text>
          {item.item.title} {item.item.date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainMenu}>
      <Modal visible={visibility} transparent={true}>
        <ListContent
          setVisibility={setVisibility}
          selectedList={selectedList}
          updateNewShoppingListState={updateNewShoppingListState}
          deleteSelectedList={deleteSelectedList}
        />
      </Modal>
      <View style={styles.mainMenuNewList}>
        <TextInput
          placeholder="Uusi ostoslista"
          style={styles.textInputNewList}
          onChangeText={handleNewList}
        />

        {/* Offline checkbox / switch */}
        <View style={styles.offlineSwitchContainer}>
          <Text
            style={{
              color: offlineMode ? "#40c844" : "#999999",
              fontWeight: "bold",
            }}
          >
            Offline
          </Text>
          <Switch
            value={offlineMode}
            onValueChange={(value) => setOfflineMode(value)}
            trackColor={{ false: "#cccccc", true: "#a0e080" }}
            thumbColor={offlineMode ? "#40c844" : "#f4f3f4"}
          />
        </View>
        {/*switch end*/}

        <TouchableOpacity
          style={styles.buttonNewList}
          onPress={handleNewListButton}
        >
          <Text>Luo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainMenuSelectList}>
        <TouchableOpacity
          style={styles.buttonInput}
          onPress={handleShownFilter}
        >
          <Text>Aktiiviset ostoslistat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonInput} onPress={handleShownAll}>
          <Text>Kaikki ostoslistat</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listStyle}>
        {shoppingList.length === 0 ? (
          <Text style={styles.topBarTitle}>
            Sinulla ei ole yhtään ostoslistaa.
          </Text>
        ) : (
          <FlatList
            style={styles.listFlatStyle}
            // https://forum.freecodecamp.org/t/how-to-format-these-dates-and-sort/453354/3
            // Sorts from newest to olderst. If filtered returns how many is wanted.
            data={
              shown === true
                ? shoppingList.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                  )
                : shoppingList
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5)
            }
            renderItem={renderList}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainMenu: {
    flex: 5,
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    marginTop: 10,
    marginBottom: 0,
    justifyContent: "center",
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "#EEEEEE",
  },
  mainMenuNewList: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    alignContents: "top",
    width: "100%",
    paddingBottom: 50,
  },
  mainMenuSelectList: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column",
    width: "100%",
    paddingBottom: 100,
    minHeight: 35,
  },
  textInputNewList: {
    height: 40,
    width: "50%",
    backgroundColor: "#EEEEEE",
    marginTop: "10",
    marginBottom: "auto",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#40c844ff",
  },
  buttonNewList: {
    height: 40,
    width: "30%",
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: "10",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#40c844ff",
  },
  buttonInput: {
    height: 40,
    width: "90%",
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "space-around",
    //marginTop: 5,
    marginTop: 12, // lisää väliä yläpuolelle
    marginBottom: 12,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#40c844ff",
  },
  listStyle: {
    flex: 6,
    width: "100%",
  },
  listFlatStyle: {
    width: "100%",
  },
  listItemStyle: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ffffffaa",
    marginBottom: 2,
    borderWidth: 2,
    height: 50,
  },
  topBarTitle: {
    // Copied from TopBar!
    fontSize: 20,
    marginBottom: 10,
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },

  offlineSwitchContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
