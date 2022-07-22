const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const clientes = [];

//Middleware
function verificaSeExisteCPF(request, response, next) {
  const { cpf } = request.headers;

  const cliente = clientes.find((cliente) => cliente.cpf === cpf);

  if (!cliente) {
    return response.status(400).json({ error: "Cliente não cadastrado" });
  }

  //Repassando informação que esta sendo consumida dentro do middleware para outras rotas
  request.cliente = cliente;

  return next();
}

function verificaSaldo(extratoBancario) {
  const balanco = extratoBancario.reduce((acumulador, operacao) => {
    if (operacao.type === "credito") {
      return acumulador + operacao.valor;
    } else {
      return acumulador - operacao.valor;
    }
  }, 0);

  return balanco;
}

app.post("/conta", (request, response) => {
  const { cpf, nome } = request.body;

  // Busca e compara CPF
  const customerAlreadyExists = clientes.some((cliente) => cliente.cpf === cpf);

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "CPF já existente" });
  }

  const id = uuidv4();

  clientes.push({
    cpf,
    nome,
    id,
    extratoBancario: [],
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

   return response.json(customer.extratoBancario);
 }); */

// CASO TODAS AS ROTAS A SEGUIR PRECISE PASSAR POR ESSE MIDDLEWARE, UTILIZAR O APP.USE()
app.use(verificaSeExisteCPF);

//RECEBENDO CPF POR HEADERS

app.get("/extrato", verificaSeExisteCPF, (request, response) => {
  const { cliente } = request;

  return response.json(cliente.extratoBancario);
});

app.post("/deposito", verificaSeExisteCPF, (request, response) => {
  const { cliente } = request;

  const { descricao, valor } = request.body;

  const extratoBancarioOperacao = {
    descricao,
    valor,
    created_at: new Date(),
    type: "credito",
  };

  cliente.extratoBancario.push(extratoBancarioOperacao);

  return response.status(201).send();
});

app.post("/saque", verificaSeExisteCPF, (request, response) => {
  const { cliente } = request;
  const { valor } = request.body;

  const balanco = verificaSaldo(cliente.extratoBancario);

  if (balanco < valor) {
    return response.status(400).json({ error: "Saldo insuficiente" });
  }

  const extratoBancarioOperacao = {
    valor,
    created_at: new Date(),
    type: "debito",
  };

  cliente.extratoBancario.push(extratoBancarioOperacao);

  return response.status(201).send();
});

app.get("/extrato/data", verificaSeExisteCPF, (request, response) => {
  const { cliente } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const extrato = cliente.extratoBancario.filter(
    (extrato) =>
      extrato.created_at.toDateString() === new Date(dateFormat).toDateString()
  );

  return response.json(extrato);
});

// ALTERA NOME
app.put("/conta", verificaSeExisteCPF, (request, response) => {
  const { cliente } = request;
  const { nome } = request.body;

  cliente.nome = nome;

  return response.status(201).send();
});

app.get("/conta", verificaSeExisteCPF, (request, response) => {
  const { cliente } = request;

  return response.json(cliente);
});

app.listen(3333);
