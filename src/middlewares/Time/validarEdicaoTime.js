const timeService = require("../../services/time.service");

module.exports = (req, res, next) => {
  const { nome } = req.body;
  const id = +req.params.id;

  const time = timeService.buscarTimePorId(id);

  if (!time) {
    return res.status(404).json({
      erro: "Time não encontrado",
    });
  }

  if (nome) {
    const timeExistente = timeService.buscarTimePorNome(nome);

    if (timeExistente && timeExistente.id !== time.id) {
      return res.status(409).json({
        erro: "Já existe um time com esse nome.",
      });
    }
  }

  req.time = time;

  next();
};
