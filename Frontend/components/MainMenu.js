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
  Alert,
  Image,
} from "react-native";
import ListContent from "./ListContent";
import { createList, readAllList, deleteList } from "../sqlconnection/db";
import { socket, sendListToServer } from "../socket";
import { getListsFromServer } from "../socket";
import { addItemToListOnServer } from "../socket";
import Toast from "react-native-toast-message";
import dateFormat from 'dateformat';

export default function MainMenu({ currentUser /*socket*/ }) {
  const [newList, setNewList] = useState("");
  const [offlineMode, setOfflineMode] = useState(false);
  const [shown, setShown] = useState(true); // If true all lists are shown, if false only recent ones are. DEFINE WHAT ARE ACITVE SHOPPING LISTS, THIS IS KIND OF USELESS RIGHT NOW!
  const [shoppingList, setNewShoppingList] = useState([]); // Saves temporarily lists for showing them on screen.
  const [selectedList, setSelectedList] = useState(null);
  const [visibility, setVisibility] = useState(false); // Shows shopping list.
  const [newItem, setNewItem] = useState("");

  const [listOverviewVisible, setListOverviewVisible] = useState(false); //listat palvelimelta
  const [singleListVisible, setSingleListVisible] = useState(false);
  const [selectedListServer, setSelectedListServer] = useState(null);

  const [serverLists, setServerLists] = useState([]);

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

  const fetchServerLists = async () => {
    try {
      const lists = await getListsFromServer(currentUser);
      console.log("Haetut listat:", lists);
      setServerLists(lists);
    } catch (error) {
      console.error("Virhe listojen haussa palvelimelta:", error);
      Toast.show({
        type: "error",
        text1: "Virhe haettaessa listoja ❌",
        text2: error.toString(),
      });
    }
  };

  const handleAddItem = async () => {
    console.log(
      "Lisätään tuote:",
      newItem,
      "listaan:",
      selectedListServer.name
    );
    try {
      const updatedList = await addItemToListOnServer(
        selectedListServer._id,
        newItem
      );
      setSelectedListServer(updatedList); // päivitä lista
      setNewItem(""); // tyhjennä kenttä
    } catch (error) {
      console.error("Virhe lisättäessä tuotetta:", error);
      Toast.show({
        type: "error",
        text1: "Tuotteen lisäys epäonnistui ❌",
        text2: error.toString(),
      });
    }
    console.log("Tuote lisätty onnistuneesti.");
  };

  const openSingleListModal = (item) => {
    setSelectedListServer(item);
    setSingleListVisible(true);
    setListOverviewVisible(false);
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
        Toast.show({
          type: "success",
          text1: "Lista tallennettu offline-tilassa ✅",
          text2: newShoppingList.title,
        });
      } else {
        // ONLINE: MongoDB
        if (!socket || !socket.connected) {
          console.warn("Ei yhteyttä palvelimeen.");
          Toast.show({
            type: "error",
            text1: "Ei yhteyttä palvelimeen ❌",
            text2: "Yritä myöhemmin uudelleen.",
          });
          return; // Lopetetaan funktio tähän
        }

        await sendListToServer({
          username: currentUser,
          slname: newShoppingList.title,
          date: newShoppingList.date,
        })
          .then((response) => {
            console.log("Lista lähetetty MongoDB-palvelimelle:", response.list);
            // Alert.alert("Onnistui", "Lista tallennettiin palvelimelle.");
            Toast.show({
              type: "success",
              text1: "Lista tallennettu palvelimelle ✅",
              text2: newShoppingList.title,
            });
          })
          .catch((error) => {
            console.error("Virhe listan lähetyksessä:", error);
            // Alert.alert("Virhe", "Listan lähetys palvelimelle epäonnistui.");
            Toast.show({
              type: "error",
              text1: "Virhe listan luonnissa ⚠️",
              text2: error.message || "Tuntematon virhe",
            });
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
          {item.item.title} {dateFormat(item.item.date, "hh:mm dd.mm.yyyy")}
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

      {/* MODAALI: Palvelimen ostoslistat */}
      <Modal visible={listOverviewVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ostoslistat</Text>
            <FlatList
              data={serverLists}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItemStyle2}
                  onPress={() => openSingleListModal(item)}
                >
                  <View style={styles.listItemContent}>
                    <View style={styles.greenBullet} />
                    <Text style={styles.listItemText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setListOverviewVisible(false)}
            >
              <Text>Sulje</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*MODAALI LISÄÄ TUOTE*/}
      <Modal visible={singleListVisible} transparent={false}>
        <View style={styles.modalContent}>
          {/* Listan nimi */}
          <Text style={styles.modalTitle}>
            {selectedListServer?.name ?? "Lista"}
          </Text>

          {/* Input + kuvapainike rivissä */}
          <View style={styles.inputRow}>
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Lisää tuote"
              style={styles.textInputNewListServer}
            />
            <TouchableOpacity onPress={handleAddItem}>
              <Image
                source={require("../assets/basket.png")}
                style={styles.addButtonImage}
              />
            </TouchableOpacity>
          </View>

          {/* Lista tai tyhjäteksti */}
          {selectedListServer?.content?.length > 0 ? (
            <FlatList
              data={selectedListServer.content}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                // <Text>{item}</Text>}

                <View style={styles.listItemStyle}>
                  <View style={styles.listItemContent}>
                    <View style={styles.greenBullet} />
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                </View>
              )}
              style={styles.list}
            />
          ) : (
            <Text style={styles.emptyText}>Lista on tyhjä.</Text>
          )}

          {/* Sulje-painike*/}
          <TouchableOpacity
            onPress={() => setSingleListVisible(false)}
            style={styles.closeButton}
          >
            <Text>Sulje</Text>
          </TouchableOpacity>
        </View>
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
          onPress={() => {
            fetchServerLists(); // tämä hakee MongoDB:stä
            setListOverviewVisible(true); // avaa modaalin
            console.log(
              "Listat haettu palvelimelta ja modaalin pitäisi aueta."
            );
          }}
        >
          <Text>Ostoslistat</Text>
        </TouchableOpacity>
          <View style={styles.mainMenuSelectList2}>
          <TouchableOpacity
            style={styles.buttonInput2}
            onPress={handleShownFilter}
          >
            <Text>Aktiiviset ostoslistat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonInput2} onPress={handleShownAll}>
            <Text>Kaikki ostoslistat</Text>
          </TouchableOpacity>
        </View>
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
  mainMenuSelectList2: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
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

  textInputNewListServer: {
    borderWidth: 2,
    borderColor: "#40c844ff",
    height: 40,
    width: "50%",
    backgroundColor: "#EEEEEE",
    marginTop: 10,
    borderRadius: 40,
    textAlignVertical: "center",
    paddingHorizontal: 10,
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
  buttonInput2: {
    height: 40,
    width: "40%",
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
    //justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // keskittää koko rivin
    marginVertical: 10,
  },

  textInputNewListServer: {
    height: 40,
    flex: 1, // vie tilaa riviltä
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#40c844ff",
    textAlignVertical: "center",
  },

  addButtonImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },

  listItemStyle2: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
  },

  listItemText: {
    fontSize: 16,
    color: "#333",
  },

  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  greenBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#40c844",
    marginRight: 10,
  },
});
