const mongoose = require("mongoose");

const PestSchema = new mongoose.Schema({
  pestName: {
    type: String,
    required: true
  },
  cropAffected: {
    type: String,
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  organicSolution: {
    type: String,
    required: true
  },
  chemicalSolution: {
    type: String,
    required: true
  },
  prevention: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Pest", PestSchema);