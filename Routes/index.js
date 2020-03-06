const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("index", { logado: false });
  } catch (err) {
    console.log("index" + err);
  }
});

module.exports = router;
