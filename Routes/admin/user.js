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

//Route index para login do usuario
router.get("/", async (req, res) => {
  res.render("admin/user/login.ejs");
});

//Route redirect de usuario validado pelo passport
router.get("/login", checkAuthenticated, async (req, res) => {
  const user = await User.findById(req.user);
  res.render("admin/user/index.ejs", {
    logado: "Enviou formulario de login, data: " + user + req.user
  });
});

//Route post action para validar usuario via passport
router.post(
  "/user/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/error",
    failureFlash: true
  })
);

//Logout route
router.delete("/logout", (req, res) => {
  req.logout();
  res.redirect("/admin/login");
});

//********************************************************* */
//***********************Register route******************** */
// Router index register
router.get("/register", async (req, res) => {
  res.render("admin/user/new.ejs");
});
// Route post para novo usuario
router.post("/register/new/user", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      usuario: req.body.usuario,
      password: hashedPassword,
      email: req.body.email,
      cargo: req.body.cargo,
      dataCadastro: req.body.dataCadastro
    });

    const newUser = await user.save();

    res.redirect("/");
  } catch (error) {
    res.redirect("/admin/register");
  }
});

//Check if user has loggedIn
function checkAuthenticated(req, res, next) {
  console.log("chegando no auth");
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/admin/login");
}

module.exports = router;
