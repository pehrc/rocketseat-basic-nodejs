const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

/**
 * cpf: sting
 * nome: string;
 * id: uuid;
 * statement: [];
 */

app.post("/conta", (request, response) => {
  const { cpf, nome } = request.body;

  // Busca e compara CPF
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  const id = uuidv4();

  customers.push({
    cpf,
    nome,
    id,
    statement: [],
  });

  return response.status(201).send();
});

app.listen(3333);
