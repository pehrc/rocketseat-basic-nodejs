const express = require("express");

const app = express();

app.get("/cursos", (request, response) => {
  return response.json(["Curso 1", "Curso 2", "Curso 3"]);
});

//localhost:3333
app.listen(3333);
