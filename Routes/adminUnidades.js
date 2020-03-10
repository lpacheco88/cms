const express = require("express");
const router = express.Router();
const Unidade = require("../model/Unidade");

router.get("/", checkAuthenticated, async (req, res) => {
  try {
    const unidades = await Unidade.find({})
      .limit(3)
      .exec();

    res.render("admin/unidades/index.ejs", {
      unidades: unidades,
      logado: true
    });
  } catch (err) {
    console.log("index" + err);
  }
});

//Todas unidades cadastradas
router.get("/allUnidades", checkAuthenticated, async (req, res) => {
  const unidades = await Unidade.find({});

  res.render("admin/unidades/allUnidades.ejs", {
    unidades: unidades,
    logado: true
  });
});

//Show unidade by ID
router.get("/unidade/:unidadeid/show", checkAuthenticated, async (req, res) => {
  try {
    const unidade = await Unidade.findById(req.params.unidadeid);

    res.render("admin/unidades/show", {
      unidade: unidade,
      logado: true
    });
  } catch (error) {}
});

//Nova unidade
router.get("/new", checkAuthenticated, async (req, res) => {
  renderNewPage(res, new Unidade());
});

// create unidade route
router.post("/new/unidade", checkAuthenticated, async (req, res) => {
  const unidade = new Unidade({
    name: req.body.name,
    cidade: req.body.cidade,
    estado: req.body.estado,
    endereco: req.body.endereco,
    rua: req.body.rua,
    numero: req.body.numero,
    cep: req.body.cep
  });

  try {
    const newUnidade = await unidade.save();
    res.redirect("/admin/unidades");
  } catch (error) {
    console.log(error);
    renderNewPage(res, unidade, true, error);
  }
});

//Edit unidade route
router.get("/unidade/:id/edit", checkAuthenticated, async (req, res) => {
  try {
    const unidade = await Unidade.findById(req.params.id);

    renderEditPage(res, unidade);
  } catch (error) {
    res.redirect("/");
  }
});

//Update unidade route
router.put("/edit/:id/update", checkAuthenticated, async (req, res) => {
  let unidade;
  try {
    unidade = await Unidade.findById(req.params.id);
    unidade.name = req.body.name;
    unidade.cidade = req.body.cidade;
    unidade.estado = req.body.estado;
    unidade.endereco = req.body.endereco;
    unidade.rua = req.body.rua;
    unidade.numero = req.body.numero;
    unidade.cep = req.body.cep;

    await unidade.save();
    res.redirect(`/admin/unidades/unidade/${unidade.id}/edit`);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/remover/:id", checkAuthenticated, async (req, res) => {
  let unidade;
  try {
    unidade = await Unidade.findById(req.params.id);
    await unidade.remove();
    res.redirect("/admin/unidades/allunidades");
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

async function renderNewPage(res, unidade, hasError = false) {
  renderFormPage(res, unidade, "new", hasError);
}

async function renderEditPage(res, unidade, hasError = false) {
  renderFormPage(res, unidade, "edit", hasError);
}

async function renderFormPage(res, unidade, form, hasError = false) {
  try {
    const params = {
      unidade: unidade,
      logado: true
    };

    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating unidade";
      } else {
        params.errorMessage = "Error creating unidade";
      }
    }

    res.render(`admin/unidades/${form}`, params);
  } catch (error) {
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
