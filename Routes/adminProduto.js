const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("admin/produtos/index.ejs", {
      logado: true
    });
  } catch (err) {
    console.log("index" + err);
  }
});

module.exports = router;
