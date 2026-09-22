const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema({
  soilType: String,
  location: String,
  season: String,
  cropName: String,
  fertilizer: String,
  tips: String
});

module.exports = mongoose.model("Crop", CropSchema);