// Nämä on tarkoitettu toimintojen testaukseen toimintoja kehitettäessä!
// Korvaa ottamalla yhteyttä backendiin!
let userDatabase = [{"id":1, "name":"Juho", "password":"123", "listId":[1,2,3]}, {"id":2, "name":"Lauri", "password":"abc", "listId":[2,3]}]
let messageDatabase = [
    {"id":1, "ownerId":1, "users":[1], "content":[{"name": "Kauppalista", "message":"Osta makaroonia kolme pussia."}]},
    {"id":2, "ownerId":1, "users":[1, 2], "content":[{"name": "Torilta ostettavaa", "message":"muutama peruna ja mansikoita"}]},
    {"id":3, "ownerId":2, "users":[1, 2], "content":[{"name": "muistilista", "message":"Uusi takki?"}]}
];


// Palauttaa KAIKKI käyttäjät!
export function ServerGetUsers() {
    return userDatabase;
}

// Reksteröidään uusi käyttäjä.
export function ServerRegisterUser(username, password) {
    for (const key in userDatabase) {
        if (userDatabase[key].name === username) {
            console.log("Käyttäjätunnus on jo käytössä!");
            return false;
        }
    }
    const id = userDatabase.length + 1;
    userDatabase.push({"id": id, "name": username, "password": password});
    return id;
}

// Kirjaudutaan sisään, jos käyttäjää ei löydy palautetaan false.
export function ServerLoginUser(username, password) {
    for (const key in userDatabase) {
        if (userDatabase[key].name === username && userDatabase[key].password === password) {
            console.log("Kirjautuminen onnistui!");
            console.log(userDatabase[key].id);
            return {"id": userDatabase[key].id, "name": userDatabase[key].name}
        }
    }
    return false;
}

