const express = require("express");

const app = express();

app.get("/", (request, response) => {
  // retornando mensagem
  // return response.send("Hello World");

  //retornando json
  return response.json({
    message: "Hello World",
  });
});

//localhost:3333
app.listen(3333);
