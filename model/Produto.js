const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  produtoImagem: {
    type: Buffer,
    required: true
  },
  produtoImagemType: {
    type: String,
    required: true
  },
  unidade: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UnidadeLocationData"
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Categoria"
  }
});

produtoSchema.virtual("produtoImagePath").get(function() {
  if (this.produtoImagem != null && this.produtoImagemType != null) {
    return `data:${
      this.produtoImagemType
    };charset=utf-8;base64,${this.produtoImagem.toString("base64")}`;
  }
});

module.exports = mongoose.model("Produto", produtoSchema);
