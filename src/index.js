const express = require("express");

/**
 * Tipos de parametros
 *
 * route params => identificar um recurso para editar/deletar/buscar
 * query params => paginação / filtro   Exemplo url query params para paginação: localhost:3333/cursos?page=1&order=asc
 * body params => Objetos para inserção / alteração
 */

const app = express();

app.use(express.json());

app.get("/cursos", (request, response) => {
  const query = request.query;
  console.log(query);

  return response.json(["Curso 1", "Curso 2", "Curso 3"]);
});

app.post("/cursos", (request, response) => {
  const body = request.body;
  console.log(body);

  return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
});

app.put("/cursos/:id", (request, response) => {
  const params = request.params;
  console.log("param recebido pela rota", params);

  return response.json(["Curso 5", "Curso 2", "Curso 3", "Curso 4"]);
});

app.patch("/cursos/:id", (request, response) => {
  return response.json(["Curso 5", "Curso 6", "Curso 3", "Curso 4"]);
});

app.delete("/cursos/:id", (request, response) => {
  return response.json(["Curso 5", "Curso 2", "Curso 4"]);
});

//localhost:3333
app.listen(3333);
