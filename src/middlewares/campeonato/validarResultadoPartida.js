const timeService = require("../../services/time.service");

function normalizarGols(gols) {
  if (!Array.isArray(gols)) return [];

  return gols.map((gol) => {
    if (typeof gol === "number") {
      return { jogadorId: gol };
    }

    return gol;
  });
}

module.exports = (req, res, next) => {
  const partida = req.partida;

  const { golsTime_1 = [], golsTime_2 = [] } = req.body;

  if (partida.status === "Finalizada") {
    return res.status(400).json({
      erro: "Essa partida já foi finalizada.",
    });
  }

  if (!partida.time_1 || !partida.time_2) {
    return res.status(400).json({
      erro: "Essa partida ainda não está pronta.",
    });
  }

  if (!Array.isArray(golsTime_1) || !Array.isArray(golsTime_2)) {
    return res.status(400).json({
      erro: "golsTime_1 e golsTime_2 precisam ser arrays.",
    });
  }

  if (golsTime_1.length === golsTime_2.length) {
    return res.status(400).json({
      erro: "Partida mata-mata não pode empatar.",
    });
  }

  const time1Completo = timeService.buscarTimePorId(partida.time_1.id);
  const time2Completo = timeService.buscarTimePorId(partida.time_2.id);

  if (!time1Completo || !time2Completo) {
    return res.status(400).json({
      erro: "Não foi possível encontrar os times da partida.",
    });
  }

  const golsNormalizadosTime1 = normalizarGols(golsTime_1);
  const golsNormalizadosTime2 = normalizarGols(golsTime_2);

  for (const gol of golsNormalizadosTime1) {
    const jogador = time1Completo.jogadores.find(
      (j) => j.id === Number(gol.jogadorId),
    );

    if (!jogador) {
      return res.status(400).json({
        erro: `O jogador ${gol.jogadorId} não pertence ao time ${time1Completo.nome}.`,
      });
    }
  }

  for (const gol of golsNormalizadosTime2) {
    const jogador = time2Completo.jogadores.find(
      (j) => j.id === Number(gol.jogadorId),
    );

    if (!jogador) {
      return res.status(400).json({
        erro: `O jogador ${gol.jogadorId} não pertence ao time ${time2Completo.nome}.`,
      });
    }
  }

  req.time1Completo = time1Completo;
  req.time2Completo = time2Completo;
  req.golsNormalizadosTime1 = golsNormalizadosTime1;
  req.golsNormalizadosTime2 = golsNormalizadosTime2;

  next();
};
