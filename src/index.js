const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

app.post("/conta", (request, response) => {
  const { cpf, nome } = request.body;

  // Busca e compara CPF
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "CPF já existente" });
  }

  const id = uuidv4();

  customers.push({
    cpf,
    nome,
    id,
    statement: [],
  });

  return response.status(201).send();
});

app.get("/extrato/:cpf", (request, response) => {
  const cpf = request.params;

  const customer = customer.find((customer) => customer.cpf === cpf);

  return response.json(customer.statement);
});

app.listen(3333);
