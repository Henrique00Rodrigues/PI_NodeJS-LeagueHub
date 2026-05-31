const timeService = require("../../services/time.service");

module.exports = (req, res, next) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      erro: "Nome do time é obrigatório",
    });
  }

  const timeExistente = timeService.buscarTimePorNome(nome);

  if (timeExistente) {
    return res.status(409).json({
      erro: "Já existe um time com esse nome.",
    });
  }

  next();
};
