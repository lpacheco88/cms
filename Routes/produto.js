const express = require("express");
const router = express.Router();
const Produto = require("../model/Produto");
const Categoria = require("../model/Categoria");
const Unidade = require("../model/UnidadeLocation");

router.get("/", async (req, res) => {
  try {
    const unidades = await Unidade.find({}).exec();

    res.render("produto/index.ejs", {
      unidades: unidades,
      logado: false
    });
  } catch (err) {
    console.log("index" + err);
  }
});

router.get("/getCategorias/:id", async (req, res) => {
  // let query = Produto.find();

  // console.log("ln27" + query);
  // const produtos = await query.exec();
  // res.json(produtos);

  const produto = Produto.find({ unidade: req.params.id }).exec(function(
    err,
    unidades
  ) {
    if (err) return handleError(err);
  });

  res.json(produto);
});

module.exports = router;
