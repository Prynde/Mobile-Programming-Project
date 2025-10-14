import React from 'react';
import * as SQLite from 'expo-sqlite';

// Initializes database. Creates database if it does not exist.
// Message can be null!
export const init = async() => {
    try {
        const db = await SQLite.openDatabaseAsync("shoppinglist.db");
        await db.execAsync("PRAGMA journal_mode = WAL;create table if not exists shoppinglist(id integer not null primary key, owner text not null, title text not null, message text, date text not null);");
        return db;
    } catch (error) {
        throw new Error("Error while initializing local db.")
    }
}

// Adds values to database.
export const createList = async(newShoppingList) => {
    const owner = newShoppingList.owner
    const title = newShoppingList.title
    const message = newShoppingList.message
    const date = newShoppingList.date

    const db = await init();
    const statement = await db.prepareAsync("INSERT INTO shoppinglist (owner, title, message, date) VALUES ($owner, $title, $message, $date)");
    
    try {
        let result = await statement.executeAsync({$owner: owner, $title: title, $message: message, $date: date });
        await statement.finalizeAsync();
    } catch (error) {
        throw new Error("Error while creating new list to local db.")
    }
}

// Returns all lists as objects inside array.
export const readAllList = async() => {
    try {
        const db = await init();
        const result = await db.getAllAsync("SELECT * FROM shoppinglist");
        return result;
    } 
    catch (error) {
        throw new Error("Error while reading all lists from local db: " + error.message);
    }
}

// Updates title, message and date of a specific list.
export const updateList = async(id, title, message, date) => {
    try {
        const db = await init();
        const statement = await db.prepareAsync("UPDATE shoppinglist SET title = $title, message = $message, date = $date WHERE id = $id;");
        const result = await statement.executeAsync({$title: title, $message: message, $date: date, $id: id});
        await statement.finalizeAsync();
    } catch (error) {
        throw new Error("Error while updating list id: " + id + " error: " + error.message)
    }
}

// Removes rows from shoppinglist table.
export const deleteAllList = async() => {
    try {
        const db = await init();
        await db.runAsync("DELETE FROM shoppinglist;");
    } catch (error) {
        throw new Error("Error while removing all lists from local db shoppinglist table: " + error.message);
    }
}