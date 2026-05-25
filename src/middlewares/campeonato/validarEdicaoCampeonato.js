const { campeonatos } = require("../../controllers/campeonato.controller");

module.exports = (req, res, next) => {
  const id = +req.params.id;

  const campeonato = campeonatos.find((c) => c.id === id);

  if (!campeonato) {
    return res.status(404).json({
      erro: "Campeonato não encontrado",
    });
  }

  req.campeonato = campeonato;

  next();
};
