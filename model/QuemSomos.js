const mongoose = require("mongoose");

const quemSomosSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("QuemSomos", quemSomosSchema);
