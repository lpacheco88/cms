const express = require("express");
const router = express.Router();
// Encrypt pass module
const bcrypt = require("bcrypt");
// Authecation module
const passport = require("passport");
const initializePassport = require("../../passport-config");
// Session using flash modules
const flash = require("express-flash");
const session = require("express-session");
// User model
const User = require("../../Model/Admin/User");

initializePassport(
  passport,
  (email) => User.find((user) => user.email === email),
  (id) => User.find((user) => user.id === id)
);

router.use(express.urlencoded({ extended: false }));
router.use(flash());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.get("/", async (req, res) => {
  res.render("admin/user/login.ejs");
});

router.get("/login", async (req, res) => {
  res.render("admin/user/index.ejs", {
    logado:
      "Enviou formulario de login, data: " + req.body.email + req.body.senha
  });
});

router.post(
  "/login",
  async (req, res) => {
    res.redirect("/admin/login");
  }
  // passport.authenticate("local", {
  //   successRedirect: "/admin",
  //   failureRedirect: "/admin/error",
  //   failureFlash: true
  // })
);

module.exports = router;
