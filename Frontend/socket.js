import io from "socket.io-client";
const socket = io.connect("https://lappis.mau-mooneye.ts.net", {
  transports: ["websocket"],
});

const socketTest = () => {
  // Test register
  socket.emit("authentication", { username, password, register: true });
};

const socketTest2 = () => {
  // Test login
  socket.emit("authentication", { username, password });
};

const socketTest3 = () => {
  // Test if logged in
  socket.emit("logintest");
};

socket.on("unauthorized", (err) => {
  // Show message if wrong username or password was given
  alert("There was an error with the authentication: " + err.message);
});

socket.on("registered", (message) => {
  // Show message for succesfull registration
  alert(message.message + " registered succesfully.");
});

socket.on("loggedIn", (message) => {
  // Show message for succesfull login
  alert(message.message);
});

socket.on("testok", (message) => {
  // Show message for succesfull logged in test
  alert("Test ok");
});

function upload(files) {
  socket.emit("upload", files[0], (status) => {
    alert(status);
  });
}

const sendListToServer = (list) => {
  return new Promise((resolve, reject) => {
    socket.emit("newsl", list, (response) => {
      if (response?.success) resolve(response);
      else reject(response?.error || "Unknown error");
    });
  });
};

const getListsFromServer = (username) => {
  return new Promise((resolve, reject) => {
    console.log("Socket status:", socket.connected);
    socket.emit("getLists", { username }, (response) => {
      if (response?.success) resolve(response.lists);
      else reject(response?.error || "Tuntematon virhe");
    });
  });
};

const addItemToListOnServer = (listId, item) => {
  return new Promise((resolve, reject) => {
    console.log("Socket status:", socket.connected);
    socket.emit("addItemToList", { listId, item }, (response) => {
      if (response?.success) resolve(response.list);
      else reject(response?.error || "Tuntematon virhe");
    });
  });
};

// const handleAddItem = () => {
//   socket.emit(
//     "addItemToList",
//     { listId: selectedList._id, item: newItem },
//     (response) => {
//       if (response.success) {
//         setSelectedList(response.list); // päivitä lista
//         setNewItem(""); // tyhjennä kenttä
//       } else {
//         console.error("Virhe lisättäessä tuotetta:", response.error);
//       }
//     }
//   );
// };

export { socket, sendListToServer, getListsFromServer, addItemToListOnServer };
