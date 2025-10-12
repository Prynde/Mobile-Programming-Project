import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal } from "react-native";
import ListContent from './ListContent';


export default function MainMenu({currentUser}) {
    const [newList, setNewList] = useState("");
    const [shown, setShown] = useState(true); // If true all lists are shown, if false only recent ones are. DEFINE WHAT ARE ACITVE SHOPPING LISTS, THIS IS KIND OF USELESS RIGHT NOW!
    const [shoppingList, setNewShoppingList] = useState([]); // For testing without backend!
    const [selectedList, setSelectedList] = useState()
    const [visibility, setVisibility] = useState(false) // Shows shopping list.
    
    // Opens pressed shopping list.
    const handleListContent = (props) => {
        setSelectedList(props)
        setVisibility(true)
    }

  const handleNewList = (props) => {
    setNewList(props);
  };

  // Makes new object which are rendered.
  const handleNewListButton = () => {
    if (newList.trim().length > 0) {
      const newDate = new Date();
      const newShoppingList = {
        id: shoppingList.length + 1,
        owner: currentUser,
        content: [
          { title: newList.trim(), message: "", date: newDate.toISOString() },
        ],
      };
      setNewShoppingList([...shoppingList, newShoppingList]);
    }
  };

  // For showing recently made or edited lists.
  const handleShownFilter = () => {
    setShown(false);
  };

  const handleShownAll = () => {
    setShown(true);
  };
  // Branch Conflict --> Miika: Tämä näyttäisi uudemmalta koodilta? kts. seuraava Branch Conflict kommentti rivi 77-125
    // Titles of lists are shown. For now also creation dates.
    const renderList = (item) => {
        return (
                <TouchableOpacity 
                  style={styles.listItemStyle} 
                  onPress={() => handleListContent(item.item)}>
                    <Text>{item.item.content[0].title} {item.item.content[0].date}</Text>
                </TouchableOpacity>
        )   
    }

    return(
        <View style={styles.mainMenu}>
                <Modal visible={visibility}>
                    <ListContent 
                      setVisibility={setVisibility} 
                      selectedList={selectedList} />
                </Modal>
            <View style={styles.mainMenuNewList}>
                <TextInput 
                  placeholder='Uusi ostoslista' 
                  style={styles.textInputNewList} 
                  onChangeText={handleNewList} 
                />
                
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
                  onPress={handleShownFilter}>
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
                            data = {
                              shown === true 
                                ? shoppingList.sort(
                                  (a, b) => 
                                    new Date(b.content[0].date) - new Date(a.content[0].date)) 
                                : shoppingList.sort(
                                  (a, b) => 
                                    new Date(b.content[0].date) - new Date(a.content[0].date))
                                    .slice(0, 5)
                            }
                            renderItem = {renderList}
                            keyExtractor={item => item.id.toString()}/> 
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
    paddingBottom: 50
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
});
