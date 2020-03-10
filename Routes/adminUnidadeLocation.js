const express = require("express");
const router = express.Router();
const UniLocation = require("../model/UnidadeLocation");
const Unidade = require("../model/Unidade");

router.get("/", async (req, res) => {
  try {
    const uniLocation = await UniLocation.find({})
      .limit(3)
      .exec();

    res.render("admin/unidadeLocations/index.ejs", {
      uniLocation: uniLocation,
      logado: true
    });
  } catch (err) {
    console.log("index" + err);
  }
});

//Admin unidades - todas
router.get("/allUnidadeLocations", async (req, res) => {
  const uniLocation = await UniLocation.find({});

  res.render("admin/unidadeLocations/allUnidadeLocations.ejs", {
    uniLocation: uniLocation,
    logado: true
  });
});

//Show unidade by ID
router.get("/unidadeLocation/:unidadeid/show", async (req, res) => {
  try {
    const uniLocation = await UniLocation.findById(req.params.unidadeid);

    res.render("admin/unidadeLocations/show", {
      uniLocation: uniLocation,
      logado: true
    });
  } catch (error) {}
});

//Nova unidade
router.get("/new", async (req, res) => {
  renderNewPage(res, new UniLocation());
});

// create unidade route
router.post("/new/unidade", async (req, res) => {
  console.log(req.body);
  const uniLocation = new UniLocation({
    title: req.body.title,
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    num_Telefone: req.body.num_Telefone,
    num_Whats: req.body.num_Whats,
    email: req.body.email,
    endereco: req.body.endereco,
    bairro: req.body.bairro,
    numero: req.body.numero,
    unidade: req.body.unidade
  });

  try {
    const newuniLocation = await uniLocation.save();
    res.redirect("/admin/unidadeLocations");
  } catch (error) {
    //console.log(error);
    renderNewPage(res, uniLocation, true, error);
  }
});

//Edit unidade route
router.get(
  "/unidadeLocation/:id/edit",

  async (req, res) => {
    try {
      const uniLocation = await UniLocation.findById(req.params.id);

      renderEditPage(res, uniLocation);
    } catch (error) {
      res.redirect("/");
    }
  }
);

//Update unidade route
router.put("/edit/:id/update", async (req, res) => {
  let uniLocation;
  try {
    uniLocation = await UniLocation.findById(req.params.id);
    uniLocation.title = req.body.title;
    uniLocation.apiKey = req.body.apiKey;
    uniLocation.latitude = req.body.latitude;
    uniLocation.longitude = req.body.longitude;
    uniLocation.num_Telefone = req.body.num_Telefone;
    uniLocation.num_Whats = req.body.num_Whats;
    uniLocation.email = req.body.email;
    uniLocation.endereco = req.body.endereco;
    uniLocation.bairro = req.body.bairro;
    uniLocation.numero = req.body.numero;
    uniLocation.unidade = req.body.unidade;

    await uniLocation.save();
    res.redirect(`/admin/unidadeLocations/unidade/${uniLocation.id}/edit`);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/remover/:id", async (req, res) => {
  let uniLocation;
  try {
    uniLocation = await UniLocation.findById(req.params.id);
    await uniLocation.remove();
    res.redirect("/admin/unidadeLocations/allunidadeLocations");
  } catch (error) {
    if (unidade != null) {
      res.render("admin/unidades/show", {
        unidade: unidade,
        errorMessage: "Could not remove evento"
      });
    } else {
      console.log(error);
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, uniLocation, hasError = false) {
  renderFormPage(res, uniLocation, "new", hasError);
}

async function renderEditPage(res, uniLocation, hasError = false) {
  renderFormPage(res, uniLocation, "edit", hasError);
}

async function renderFormPage(res, uniLocation, form, hasError = false) {
  try {
    const unidades = await Unidade.find({});
    const params = {
      unidades: unidades,
      uniLocation: uniLocation,
      logado: true
    };

    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating unidade location";
      } else {
        params.errorMessage = "Error creating unidade location";
      }
    }

    res.render(`admin/unidadeLocations/${form}`, params);
  } catch (error) {
    console.log(error);
    res.redirect("/admin/unidades");
  }
}

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
