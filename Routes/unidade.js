const express = require("express");
const router = express.Router();
const Unidade = require("../model/UnidadeLocation");

router.get("/", async (req, res) => {
  const unidades = await Unidade.find({});

  res.render("unidades/index", { unidades: unidades, logado: false });
});

module.exports = router;
