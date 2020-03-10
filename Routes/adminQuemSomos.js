const express = require("express");
const router = express.Router();
const QuemSomos = require("../model/QuemSomos");

router.get("/", async (req, res) => {
  try {
    const quemSomos = await QuemSomos.find({})
      .limit(3)
      .exec();

    res.render("admin/quemsomos/index.ejs", {
      quemSomos: quemSomos,
      logado: true
    });
  } catch (err) {
    console.log("index" + err);
  }
});

//Show evento by ID
router.get("/quemsomos/:quemsomosid", async (req, res) => {
  try {
    const quemSomos = await QuemSomos.findById(req.params.quemsomosid);

    res.render("admin/quemsomos/show", {
      quemSomos: quemSomos,
      logado: true
    });
  } catch (error) {}
});

//Novo quem somos
router.get("/new", async (req, res) => {
  renderNewPage(res, new QuemSomos());
});

// create quem somos route
router.post("/new", async (req, res) => {
  const quemSomos = new QuemSomos({
    title: req.body.title,
    description: req.body.description
  });

  try {
    const newQuemSomos = await quemSomos.save();
    res.redirect("/admin/quemsomos");
  } catch (error) {
    if (evento.coverImageName != null) {
      removeEventoCover(evento.eventoImageName);
    }
    renderNewPage(res, evento, true, error);
  }
});

//Edit quem somos route
router.get("/:id/edit", async (req, res) => {
  try {
    const quemSomos = await QuemSomos.findById(req.params.id);

    renderEditPage(res, quemSomos);
  } catch (error) {
    res.redirect("/");
  }
});

//Update evento route
router.put("/edit/:id", async (req, res) => {
  let quemSomos;
  try {
    quemSomos = await QuemSomos.findById(req.params.id);
    quemSomos.title = req.body.title;
    quemSomos.description = req.body.description;

    await quemSomos.save();
    res.redirect(`/admin/quemsomos/${quemSomos.id}/edit`);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/remover/:id", async (req, res) => {
  let quemSomos;
  try {
    quemSomos = await QuemSomos.findById(req.params.id);
    await quemSomos.remove();
    res.redirect("/admin/quemsomos");
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

async function renderNewPage(res, quemSomos, hasError = false) {
  renderFormPage(res, quemSomos, "new", hasError);
}

async function renderEditPage(res, quemSomos, hasError = false) {
  renderFormPage(res, quemSomos, "edit", hasError);
}

async function renderFormPage(res, quemSomos, form, hasError = false) {
  try {
    const params = {
      quemSomos: quemSomos,
      logado: true
    };

    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating quem Somos";
      } else {
        params.errorMessage = "Error creating quem Somos";
      }
    }

    res.render(`admin/quemsomos/${form}`, params);
  } catch (error) {
    res.redirect("/admin/quemSomos");
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
