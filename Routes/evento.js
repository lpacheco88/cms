const express = require("express");
const router = express.Router();
const Evento = require("../model/Evento");

router.get("/", async (req, res) => {
  const eventos = await Evento.find({})
    .limit(3)
    .exec();

  res.render("eventos/index.ejs", {
    logado: false,
    eventos: eventos,
    showLogOff: false
  });
});

router.get("/details/:id", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);

    res.render("eventos/details", { logado: false, evento: evento });
  } catch (error) {
    res.redirect("/");
  }
});
module.exports = router;
