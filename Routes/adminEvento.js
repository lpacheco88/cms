const express = require("express");
const router = express.Router();
const Evento = require("../model/Evento");
const imageMimeTypes = ["image/jpge", "image/png", "image/gif"];

//**********************CRUD - INICIO************************* */
router.get("/", checkAuthenticated, async (req, res) => {
  const eventos = await Evento.find({})
    .limit(3)
    .exec();

  res.render("admin/eventos/index.ejs", {
    logado: true,
    eventos: eventos,
    showLogOff: true
  });
});

//Todos eventos cadastrados
router.get("/allEventos", checkAuthenticated, async (req, res) => {
  const eventos = await Evento.find({});

  res.render("admin/eventos/allEventos.ejs", {
    eventos: eventos,
    logado: true
  });
});

//Show evento by ID
router.get("/evento/:eventoid", checkAuthenticated, async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.eventoid);

    res.render("admin/eventos/show", {
      evento: evento,
      logado: true
    });
  } catch (error) {}
});

//Novo evento
router.get("/new", checkAuthenticated, async (req, res) => {
  renderNewPage(res, new Evento());
});

// create evento route
router.post("/new/evento", checkAuthenticated, async (req, res) => {
  const evento = new Evento({
    title: req.body.title,
    name: req.body.name,
    description: req.body.description,
    publishDate: new Date(req.body.publishDate),
    publishedBy: "5e59170344123675280556ea"
  });
  saveEventoImg(evento, req.body.imgEvento);

  try {
    const newEvento = await evento.save();
    res.redirect("/admin/evento");
  } catch (error) {
    if (evento.coverImageName != null) {
      removeEventoCover(evento.eventoImageName);
    }
    renderNewPage(res, evento, true, error);
  }
});

//Edit evento route
router.get("/:id/edit", checkAuthenticated, async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);

    renderEditPage(res, evento);
  } catch (error) {
    res.redirect("/");
  }
});
//Update evento route
router.put("/edit/:id", checkAuthenticated, async (req, res) => {
  let evento;
  try {
    evento = await Evento.findById(req.params.id);
    evento.title = req.body.title;
    evento.name = req.body.name;
    evento.description = req.body.description;

    await evento.save();
    res.redirect(`/admin/evento/${evento.id}/edit`);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/remover/:id", checkAuthenticated, async (req, res) => {
  let evento;
  try {
    evento = await Evento.findById(req.params.id);
    await evento.remove();
    res.redirect("/admin/evento/alleventos");
  } catch (error) {
    if (evento != null) {
      res.render("admin/eventos/show", {
        evento: evento,
        errorMessage: "Could not remove evento"
      });
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, evento, hasError = false) {
  renderFormPage(res, evento, "new", hasError);
}

async function renderEditPage(res, evento, hasError = false) {
  renderFormPage(res, evento, "edit", hasError);
}

async function renderFormPage(res, evento, form, hasError = false) {
  try {
    const params = {
      evento: evento,
      logado: true
    };

    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating evento";
      } else {
        params.errorMessage = "Error creating evento";
      }
    }

    res.render(`admin/eventos/${form}`, params);
  } catch (error) {
    res.redirect("/admin/eventos");
  }
}

function saveEventoImg(evento, eventoImgEnconded) {
  if (eventoImgEnconded == null) return;
  const event = JSON.parse(eventoImgEnconded);
  if (event != null && imageMimeTypes.includes(event.type)) {
    evento.eventoImage = new Buffer.from(event.data, "base64");
    evento.eventoImageType = event.type;
  }
}

//**********************CRUD - FIM************************* */
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

module.exports = router;
