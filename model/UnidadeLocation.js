const mongoose = require("mongoose");

const unidadeLocationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  num_Telefone: {
    type: String,
    required: true
  },
  num_Whats: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  endereco: {
    type: String,
    required: true
  },
  bairro: {
    type: String,
    required: true
  },
  numero: {
    type: Number,
    required: true
  },
  unidade: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Unidade"
  }
});

module.exports = mongoose.model("UnidadeLocationData", unidadeLocationSchema);
