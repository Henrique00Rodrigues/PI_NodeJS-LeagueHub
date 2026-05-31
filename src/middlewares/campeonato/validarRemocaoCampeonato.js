const campeonatoService = require("../../services/campeonato.service");

module.exports = (req, res, next) => {
  const id = +req.params.id;

  const campeonato = campeonatoService.buscarCampeonatoPorId(id);

  if (!campeonato) {
    return res.status(404).json({
      erro: "Campeonato não encontrado (Not found!)",
    });
  }

  req.campeonato = campeonato;

  next();
};
