const express = require("./node_modules/express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    console.log("index" + err);
  }
});

module.exports = router;
