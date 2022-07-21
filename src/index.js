const { response } = require("express");
const express = require("express");
const { request } = require("http");

const app = express();

app.get("/cursos", (request, response) => {
  return response.json(["Curso 1", "Curso 2", "Curso 3"]);
});

app.post("/cursos", (request, response) => {
  return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
});

app.put("/cursos/:id", (request, response) => {
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
