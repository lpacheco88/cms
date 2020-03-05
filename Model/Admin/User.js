const mongoose = require("mongoose");

// Cadastro de usuario

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  usuario: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    required: true
  },
  dataCadastro: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
