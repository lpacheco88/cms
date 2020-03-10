const express = require("express");
const router = express.Router();
const QuemSomos = require("../model/QuemSomos");

router.get("/", async (req, res) => {
  try {
    const quemSomos = await QuemSomos.find({})
      .limit(1)
      .exec();
    res.render("quemsomos/index.ejs", { quemSomos: quemSomos, logado: false });
  } catch (err) {
    console.log("index" + err);
  }
});

module.exports = router;
