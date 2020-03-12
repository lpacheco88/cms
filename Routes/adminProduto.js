const express = require("express");
const router = express.Router();
const imageMimeTypes = ["image/jpge", "image/png", "image/gif"];
const Produto = require("../model/Produto");
const Categoria = require("../model/Categoria");
const Unidade = require("../model/UnidadeLocation");

router.get("/", checkAuthenticated, async (req, res) => {
  try {
    const produtos = await Produto.find({})
      .limit(3)
      .exec();

    res.render("admin/produtos/index.ejs", {
      produtos: produtos,
      logado: true
    });
  } catch (err) {
    console.log("index" + err);
  }
});

router.get("/all", checkAuthenticated, async (req, res) => {
  const produtos = await Produto.find({})
    .populate("unidade")
    .populate("categoria")
    .exec();
  res.render("admin/produtos/allProdutos.ejs", {
    produtos: produtos,
    logado: true
  });
});

router.get("/produto/:produtoid/show", checkAuthenticated, async (req, res) => {
  try {
    // const produtos = await Produto.findById(req.params.produtoid);
    const produtos = await Produto.findById(req.params.produtoid)
      .populate("unidade")
      .populate("categoria")
      .exec();

    res.render("admin/produtos/show", {
      produtos: produtos,
      logado: true
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/new", checkAuthenticated, async (req, res) => {
  renderNewPage(res, new Produto());
});

router.post("/new/produto", checkAuthenticated, async (req, res) => {
  const produto = new Produto({
    title: req.body.title,
    description: req.body.description,
    categoria: req.body.categoria,
    unidade: req.body.unidade
  });

  if (req.body.produtoImagem != null && req.body.produtoImagem !== "") {
    saveProdutoImagem(produto, req.body.produtoImagem);
  }

  try {
    const newProduto = await produto.save();
    res.redirect(`/admin/produtos/produto/${newProduto.id}/show`);
  } catch (error) {
    renderNewPage(res, produto, true, error);
  }
});

router.get("/produto/:produtoid/edit", checkAuthenticated, async (req, res) => {
  try {
    const produtos = await Produto.findById(req.params.produtoid)
      .populate("unidade")
      .populate("categoria")
      .exec();

    renderEditPage(res, produtos);
  } catch (error) {
    res.redirect("/");
  }
});

router.put("/edit/:id/update", checkAuthenticated, async (req, res) => {
  let produtos;
  try {
    produtos = await Produto.findById(req.params.id);
    produtos.title = req.body.title;
    produtos.description = req.body.description;
    produtos.unidade = req.body.unidade;
    produtos.categoria = req.body.categoria;

    await produtos.save();
    res.redirect(`/admin/produtos/produto/${produtos.id}/edit`);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/remover/:id", checkAuthenticated, async (req, res) => {
  let produto;
  try {
    produto = await Produto.findById(req.params.id);
    await produto.remove();
    res.redirect("/admin/produtos/all");
  } catch (error) {
    if (unidade != null) {
      res.render("admin/produtos/all", {
        produto: produto,
        errorMessage: "Could not remove produto"
      });
    } else {
      console.log(error);
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, produto, hasError = false) {
  renderFormPage(res, produto, "new", hasError);
}

async function renderEditPage(res, produto, hasError = false) {
  renderFormPage(res, produto, "edit", hasError);
}

async function renderFormPage(res, produto, form, hasError = false) {
  try {
    const categorias = await Categoria.find({});
    const unidades = await Unidade.find({});
    const params = {
      produtos: produto,
      categorias: categorias,
      unidades: unidades,
      logado: true
    };

    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating produto";
      } else {
        params.errorMessage = "Error creating produto";
      }
    }

    res.render(`admin/produtos/${form}`, params);
  } catch (error) {
    console.log(error);
    res.redirect("/admin/produtos");
  }
}

function saveProdutoImagem(produto, imagemEnconded) {
  if (imagemEnconded == null) return;
  const imagem = JSON.parse(imagemEnconded);
  if (imagem != null && imageMimeTypes.includes(imagem.type)) {
    produto.produtoImagem = new Buffer.from(imagem.data, "base64");
    produto.produtoImagemType = imagem.type;
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
