const { campeonatos } = require("../../controllers/campeonato.controller");

module.exports = (req, res, next) => {
  const id = +(req.params.id || req.params.campeonatoId);

  const campeonato = campeonatos.find((c) => c.id === id);

  if (!campeonato) {
    return res
      .status(404)
      .json({ message: "Campeonato não encontrado (Not found!)" });
  }

  req.campeonato = campeonato;

  next();
};
