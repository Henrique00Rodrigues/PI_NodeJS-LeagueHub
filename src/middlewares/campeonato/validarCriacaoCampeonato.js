const { campeonatos } = require("../../controllers/campeonato.controller");

module.exports = (req, res, next) => {
  if (campeonatos.length >= 5) {
    return res.status(409).json({
      erro: "Já existem 5 campeonatos. Não é possível criar mais. (Conflict!)",
    });
  }

  const { nome } = req.body;

  const campeonatoExistente = campeonatos.find(
    (c) => c.nome.toLowerCase() === nome.toLowerCase(),
  );

  if (campeonatoExistente) {
    return res.status(409).json({
      erro: "Já existe um campeonato com esse nome.",
    });
  }

  next();
};
