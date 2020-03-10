const express = require("express");
const router = express.Router();
// Encrypt pass module
const bcrypt = require("bcrypt");
// Authecation module
const passport = require("passport");
const initializePassport = require("../passport-config");
// Session using flash modules
const flash = require("express-flash");
const session = require("express-session");
// User model
const User = require("../model/User");
//Admin area models
const Evento = require("../model/Evento");
const Unidade = require("../model/Unidade");

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
router.get("/", checkAuthenticated, async (req, res) => {
  const users = await User.find({})
    .limit(3)
    .exec();

  const eventos = await Evento.find({})
    .limit(3)
    .exec();

  const unidades = await Unidade.find({})
    .limit(3)
    .exec();
  res.render("admin/user/index.ejs", {
    logado: true,
    users: users,
    eventos: eventos,
    unidades: unidades,
    showLogOff: true
  });
});

router.get("/allUsers", checkAuthenticated, async (req, res) => {
  const users = await User.find({});

  res.render("admin/user/allUsers.ejs", { users: users, logado: true });
});

//Route redirect de usuario validado pelo passport
router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("admin/user/login.ejs", { logado: false });
});

//Route post action para validar usuario via passport
router.post(
  "/user/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
    failureFlash: true
  })
);

//Show usuario Route
router.get("/crud/:userid", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    res.render("admin/user/show", {
      user: user,
      logado: true
    });
  } catch (error) {}
});

//Edit usuario route
router.get("/:id/edit", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    res.render("admin/user/edit", {
      user: user,
      logado: true
    });
  } catch (error) {
    console.log(error);
  }
});

//Update usuario route
router.put("/user/:id", checkAuthenticated, async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    user.name = req.body.name;
    user.usuario = req.body.usuario;
    user.email = req.body.email;
    user.cargo = req.body.cargo;
    user.dataCadastro = req.body.dataCadastro;
    await user.save();

    res.redirect(`/admin/`);
  } catch (error) {
    console.log(error);
  }
});

//Logout route
router.delete("/logout", (req, res) => {
  req.logout();

  res.redirect("/admin/login");
});

//********************************************************* */
//***********************Register route******************** */
// Router index register
router.get("/register", checkNotAuthenticated, async (req, res) => {
  res.render("admin/user/new.ejs", { user: User(), logado: false });
});
// Route post para novo usuario
router.post("/register/new/user", checkNotAuthenticated, async (req, res) => {
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

    res.redirect("/admin");
  } catch (error) {
    res.redirect("/admin/register");
  }
});

//Check if user has loggedIn
function checkAuthenticated(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect("/admin/login");
  } catch (error) {
    console.log(error);
  }
}

function checkNotAuthenticated(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/admin");
    }
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;
