const { times } = require("./time.controller");

let campeonatos = [];
let idAtual = 1;

//função de embaralhar o Array de times
function embaralharArray(array) {
  const novoArray = [...array];

  for (let i = novoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
  }

  return novoArray;
}
//função de criar as partidas
function criarPartida(fase, time1 = null, time2 = null) {
  return {
    fase,
    time_1: time1,
    time_2: time2,
    vencedor: null,
    golsTime_1: null,
    golsTime_2: null,
    status: "Aguardando resultado",
  };
}
//função montar chave de jogos
function montarChave(timesSelecionados) {
  const timesEmbaralhados = embaralharArray(timesSelecionados);

  const quartas = [
    criarPartida("quartas", timesEmbaralhados[0], timesEmbaralhados[1]),
    criarPartida("quartas", timesEmbaralhados[2], timesEmbaralhados[3]),
    criarPartida("quartas", timesEmbaralhados[4], timesEmbaralhados[5]),
    criarPartida("quartas", timesEmbaralhados[6], timesEmbaralhados[7]),
  ];

  const semifinais = [criarPartida("semifinal"), criarPartida("semifinal")];

  const final = criarPartida("final");
  const terceiroLugar = criarPartida("terceiro_lugar");

  return {
    quartas,
    semifinais,
    final,
    terceiroLugar,
  };
}

listarCampeonatos = (req, res) => {
  res.json(campeonatos);
};

getCampeonato = (req, res) => {
  return res.status(200).json({ campeonato: req.campeonato });
};

criarCampeonato = (req, res) => {
  const { nome, dataFim, status, timeIds } = req.body;

  if (!Array.isArray(timeIds)) {
    return res.status(400).json({
      mensagem: "Você precisa enviar um array chamado timeIds com 8 times.",
    });
  }

  if (timeIds.length !== 8) {
    return res.status(400).json({
      mensagem: "O campeonato precisa ter exatamente 8 times.",
    });
  }

  const idsUnicos = [...new Set(timeIds)];
  if (idsUnicos.length !== 8) {
    return res.status(400).json({
      mensagem: "Não pode haver times repetidos.",
    });
  }

  const timesSelecionados = idsUnicos.map((id) => {
    return times.find((time) => time.id === id);
  });

  if (timesSelecionados.some((time) => !time)) {
    return res.status(400).json({
      mensagem: "Um ou mais times informados não existem.",
    });
  }

  // ✅ NOVA REGRA: cada time precisa ter 5 jogadores
  const timeInvalido = timesSelecionados.find(
    (time) => time.jogadores.length !== 5,
  );

  if (timeInvalido) {
    return res.status(400).json({
      mensagem: `O time ${timeInvalido.nome} não possui 5 jogadores.`,
    });
  }

  const novoCampeonato = {
    id: idAtual++,
    nome,
    dataInicio: new Date(),
    dataFim,
    status,
    times: timesSelecionados.map((time) => ({
      id: time.id,
      nome: time.nome,
    })),
    partidas: montarChave(
      timesSelecionados.map((time) => ({
        id: time.id,
        nome: time.nome,
      })),
    ),
  };

  campeonatos.push(novoCampeonato);

  return res.status(201).json(novoCampeonato);
};

editarCampeonato = (req, res) => {
  const campeonato = req.campeonato;

  campeonato.nome = req.body.nome ?? campeonato.nome;
  campeonato.dataInicio = req.body.dataInicio ?? campeonato.dataInicio;
  campeonato.dataFim = req.body.dataFim ?? campeonato.dataFim;
  campeonato.status = req.body.status ?? campeonato.status;

  return res.json(campeonato);
};

deletarCampeonato = (req, res) => {
  campeonatos = campeonatos.filter((c) => c.id != req.campeonato.id);

  return res.json({
    mensagem: "Campeonato removido com sucesso.",
    campeonatoRemovido: req.campeonato.nome,
  });
};

module.exports = {
  campeonatos, //variável
  listarCampeonatos, //função
  getCampeonato, //função
  criarCampeonato, //função
  editarCampeonato, //função
  deletarCampeonato, //função
};
