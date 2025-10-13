const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  users: [String], // Tallennetaan username
  items: [String], // Lista tuotteista
  createdOn: { type: Date, default: Date.now },
});

const List = mongoose.model("List", listSchema);
module.exports = List;
