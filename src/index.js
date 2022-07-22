const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

//Middleware
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "CPF não existe" });
  }

  //Repassando informação que esta sendo consumida dentro do middleware para outras rotas
  request.customer = customer;

  return next();
}

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

//RECEBENDO CPF POR PARAMS
/**  app.get("/extrato/:cpf", (request, response) => {
   const { cpf } = request.params;

   const customer = customers.find((customer) => customer.cpf === cpf);

   if (!customer) {
     return response.status(400).json({ error: "CPF não existe !" });
   }

   return response.json(customer.statement);
 }); */

// CASO TODAS AS ROTAS A SEGUIR PRECISE PASSAR POR ESSE MIDDLEWARE, UTILIZAR O APP.USE()
app.use(verifyIfExistsAccountCPF);

//RECEBENDO CPF POR HEADERS

app.get("/extrato", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.post("/deposito", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  const { description, amount } = request.body;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credito",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

app.listen(3333);
