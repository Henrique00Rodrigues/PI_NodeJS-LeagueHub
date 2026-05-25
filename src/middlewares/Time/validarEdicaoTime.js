const { times } = require("../../controllers/time.controller");

module.exports = (req, res, next) => {
  const { nome } = req.body;

  const id = req.params.id;

  const time = times.find((t) => t.id == id);

  if (!time) {
    return res.status(404).json({
      erro: "Time não encontrado",
    });
  }

  const timeExistente = times.find((t) => t.nome == nome);

  if (timeExistente) {
    return res.status(409).json({
      erro: "Já existe um time com esse nome.",
    });
  }

  req.time = time;

  next();
};
