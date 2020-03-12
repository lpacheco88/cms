console.log("Client-side code running");

const getCategoria = function(unidade) {
  let url_unidades = "/produtos/getCategorias/" + unidade;
  fetch(url_unidades)
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      data.forEach(function(produto) {
        console.log(produto.title);
      });

      /* process your data further */
    })
    .catch((error) => console.error(error));
};
