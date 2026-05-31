const jogadorService = require("../../services/jogador.service");
const timeService = require("../../services/time.service");

module.exports = (req, res, next) => {
  const id = +req.params.id;

  const jogador = jogadorService.buscarJogadorPorId(id);

  if (!jogador) {
    return res.status(404).json({
      erro: "Jogador não encontrado (Not found!)",
    });
  }

  const timeExistente = timeService.buscarTimePorNome(jogador.time);

  req.jogador = jogador;
  req.timeExistente = timeExistente;

  next();
};
