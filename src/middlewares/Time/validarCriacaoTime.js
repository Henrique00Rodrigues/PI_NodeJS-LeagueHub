const { times } = require("../../controllers/time.controller");

function nomeJaExiste(nome) {
  return times.find((t) => t.nome.toLowerCase() === nome.toLowerCase());
}

module.exports = (req, res, next) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      erro: "Nome do time é obrigatório",
    });
  }

  const timeExistente = times.find((t) => t.nome == nome);

  if (nomeJaExiste(nome)) {
    return res.status(409).json({
      erro: "Já existe um time com esse nome.",
    });
  }

  next();
};
