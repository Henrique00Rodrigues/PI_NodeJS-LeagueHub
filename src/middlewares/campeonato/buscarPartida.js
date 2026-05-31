module.exports = (req, res, next) => {
  const campeonato = req.campeonato;

  const partidaId = Number(req.params.partidaId);

  let resultadoBusca = null;

  // quartas
  for (const partida of campeonato.partidas.quartas) {
    if (partida.id === partidaId) {
      resultadoBusca = {
        partida,
        fase: "quartas",
      };
    }
  }

  // semifinais
  for (const partida of campeonato.partidas.semifinais) {
    if (partida.id === partidaId) {
      resultadoBusca = {
        partida,
        fase: "semifinais",
      };
    }
  }

  // final
  if (campeonato.partidas.final.id === partidaId) {
    resultadoBusca = {
      partida: campeonato.partidas.final,
      fase: "final",
    };
  }

  // terceiro lugar
  if (campeonato.partidas.terceiroLugar.id === partidaId) {
    resultadoBusca = {
      partida: campeonato.partidas.terceiroLugar,
      fase: "terceiroLugar",
    };
  }

  // não encontrou
  if (!resultadoBusca) {
    return res.status(404).json({
      erro: "Partida não encontrada.",
    });
  }

  req.partida = resultadoBusca.partida;

  req.fase = resultadoBusca.fase;

  next();
};
