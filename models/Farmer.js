const mongoose = require("mongoose");

const FarmerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  location: String,
  soilType: String,
  landSize: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Farmer", FarmerSchema);