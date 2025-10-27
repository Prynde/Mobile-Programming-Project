const mongoose = require("mongoose");

const shoppinglistSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  users: { type: String },
  content: { type: [] },
});

const Shoppinglist = mongoose.model("Shoppinglist", shoppinglistSchema);
module.exports = Shoppinglist;
