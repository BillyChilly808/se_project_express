const mongoose = require("mongoose");

const validator = require("validator");

const userSchema = new mongoose.Schema({});

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: { type: String, required: true },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

module.exports = mongoose.model("clothingItem", clothingItem);
