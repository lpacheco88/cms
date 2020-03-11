const mongoose = require("mongoose");

const unidadeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cidade: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    required: true
  },
  endereco: {
    type: String,
    required: true
  },
  rua: {
    type: String,
    required: true
  },
  numero: {
    type: Number,
    required: true
  },
  cep: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Unidade", unidadeSchema);
