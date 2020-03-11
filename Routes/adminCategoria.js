const express = require("express");
const router = express.Router();
const Categoria = require("../model/Categoria");

router.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.find({})
      .limit(3)
      .exec();

    res.render("admin/categorias/index.ejs", {
      categorias: categorias,
      logado: true
    });
  } catch (err) {
    console.log("index" + err);
  }
});

router.get("/all", async (req, res) => {
  const categorias = await Categoria.find({});

  res.render("admin/categorias/allCategorias.ejs", {
    categorias: categorias,
    logado: true
  });
});

router.get("/categoria/:categoriaid/show", async (req, res) => {
  try {
    const categorias = await Categoria.findById(req.params.categoriaid);

    res.render("admin/categorias/show", {
      categorias: categorias,
      logado: true
    });
  } catch (error) {
    console.log(error);
  }
});

//Nova unidade
router.get("/new", async (req, res) => {
  renderNewPage(res, new Categoria());
});

// create unidade route
router.post("/new/categoria", async (req, res) => {
  const categoria = new Categoria({
    title: req.body.title,
    description: req.body.description
  });

  try {
    const newCategoria = await categoria.save();
    res.redirect(`admin/categorias/categoria/${newCategoria.id}/show`);
  } catch (error) {
    console.log(error);
    renderNewPage(res, categoria, true, error);
  }
});

router.put("/:id", async (req, res) => {
  let categoria;

  try {
    categoria = await Categoria.findById(req.params.id);
    categoria.title = req.body.title;
    categoria.description = req.body.description;

    await categoria.save();
    res.redirect(`admin/categorias/categoria/${categoria.id}/show`);
  } catch (error) {
    console.log(error);
    if (book != null) {
      renderEditPage(res, categoria, true);
    } else {
      redirect("/");
    }
  }
});

router.get(
  "/categoria/:id/edit",

  async (req, res) => {
    try {
      const categoria = await Categoria.findById(req.params.id);

      renderEditPage(res, categoria);
    } catch (error) {
      res.redirect("/");
    }
  }
);

router.put("/categoria/:id/update", checkAuthenticated, async (req, res) => {
  let categoria;
  try {
    categoria = await Categoria.findById(req.params.id);
    categoria.title = req.body.title;
    categoria.description = req.body.description;

    await categoria.save();
    res.redirect(
      `/admin/unidadeLocations/unidadeLocation/${categoria.id}/edit`
    );
  } catch (error) {
    console.log(error);
  }
});

router.delete("/remover/:id", checkAuthenticated, async (req, res) => {
  let categoria;
  try {
    categoria = await Categoria.findById(req.params.id);
    await categoria.remove();
    res.redirect("/admin/categorias/allCategorias");
  } catch (error) {
    if (categoria != null) {
      res.render("admin/categorias/all", {
        categoria: categoria,
        errorMessage: "Could not remove evento"
      });
    } else {
      console.log(error);
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, categoria, hasError = false) {
  renderFormPage(res, categoria, "new", hasError);
}

async function renderEditPage(res, categoria, hasError = false) {
  renderFormPage(res, categoria, "edit", hasError);
}

async function renderFormPage(res, categoria, form, hasError = false) {
  try {
    const params = {
      categoria: categoria,
      logado: true
    };

    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating categoria";
      } else {
        params.errorMessage = "Error creating categoria";
      }
    }

    res.render(`admin/categorias/${form}`, params);
  } catch (error) {
    console.log(error);
    res.redirect("/admin/categorias");
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
