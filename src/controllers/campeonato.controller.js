const campeonatoService = require("../services/campeonato.service");
const partidaService = require("../services/partida.service");

const listarCampeonatos = (req, res) => {
  res.json(campeonatoService.listarCampeonatos());
};

const getCampeonato = (req, res) => {
  return res.status(200).json({ campeonato: req.campeonato });
};

const criarCampeonato = (req, res) => {
  const { nome, dataFim, status } = req.body;

  const novoCampeonato = campeonatoService.criarCampeonato({
    nome,
    dataFim,
    status,
    timesSelecionados: req.timesSelecionados,
  });

  return res.status(201).json(novoCampeonato);
};

const editarCampeonato = (req, res) => {
  const campeonatoEditado = campeonatoService.editarCampeonato(
    req.campeonato,
    req.body,
  );

  return res.json(campeonatoEditado);
};

const deletarCampeonato = (req, res) => {
  const campeonatoRemovido = campeonatoService.deletarCampeonato(
    req.campeonato.id,
  );

  return res.json({
    mensagem: "Campeonato removido com sucesso.",
    campeonatoRemovido: campeonatoRemovido.nome,
  });
};

const registrarResultadoPartida = (req, res) => {
  const campeonato = req.campeonato;
  const partida = req.partida;
  const fase = req.fase;

  partidaService.registrarGolsDoTime(
    req.time1Completo,
    req.golsNormalizadosTime1,
    partida.golsJogadoresTime_1,
  );

  partidaService.registrarGolsDoTime(
    req.time2Completo,
    req.golsNormalizadosTime2,
    partida.golsJogadoresTime_2,
  );

  partida.golsTime_1 = partida.golsJogadoresTime_1.length;
  partida.golsTime_2 = partida.golsJogadoresTime_2.length;

  partidaService.definirVencedor(partida);

  campeonatoService.avancarNaChave(campeonato, fase, partida);

  return res.json({
    mensagem: "Resultado registrado com sucesso.",
    partida,
    campeonatoResumo: {
      campeao: campeonato.campeao,
      viceCampeao: campeonato.viceCampeao,
      terceiroLugarVencedor: campeonato.terceiroLugarVencedor,
    },
  });
};

module.exports = {
  listarCampeonatos, //função
  getCampeonato, //função
  criarCampeonato, //função
  editarCampeonato, //função
  deletarCampeonato, //função
  registrarResultadoPartida, //função
};
