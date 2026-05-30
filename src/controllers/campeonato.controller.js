const { times } = require("./time.controller");

let campeonatos = [];
let idAtual = 1;
let idPartidaAtual = 1;

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
    id: idPartidaAtual++,

    fase,

    time_1: time1,
    time_2: time2,

    vencedor: null,
    perdedor: null,

    golsTime_1: 0,
    golsTime_2: 0,

    golsJogadoresTime_1: [],
    golsJogadoresTime_2: [],

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

function encontrarPartida(campeonato, partidaId) {
  for (const partida of campeonato.partidas.quartas) {
    if (partida.id === partidaId) {
      return { partida, fase: "quartas" };
    }
  }

  for (const partida of campeonato.partidas.semifinais) {
    if (partida.id === partidaId) {
      return { partida, fase: "semifinais" };
    }
  }

  if (campeonato.partidas.final.id === partidaId) {
    return {
      partida: campeonato.partidas.final,
      fase: "final",
    };
  }

  if (campeonato.partidas.terceiroLugar.id === partidaId) {
    return {
      partida: campeonato.partidas.terceiroLugar,
      fase: "terceiroLugar",
    };
  }

  return null;
}

function normalizarGols(gols) {
  if (!Array.isArray(gols)) return [];

  return gols.map((gol) => {
    if (typeof gol === "number") {
      return { jogadorId: gol };
    }

    return gol;
  });
}

function registrarGolsDoTime(timeCompleto, gols, listaDestino) {
  const golsNormalizados = normalizarGols(gols);

  for (const gol of golsNormalizados) {
    const jogador = timeCompleto.jogadores.find(
      (j) => j.id === Number(gol.jogadorId),
    );

    if (!jogador) {
      throw new Error(
        `O jogador ${gol.jogadorId} não pertence ao time ${timeCompleto.nome}.`,
      );
    }

    jogador.gols += 1;

    listaDestino.push({
      jogadorId: jogador.id,
      jogadorNome: jogador.nome,
    });
  }
}

function avancarNaChave(campeonato, fase, partida) {
  // QUARTAS -> SEMIFINAL
  if (fase === "quartas") {
    const indice = campeonato.partidas.quartas.findIndex(
      (p) => p.id === partida.id,
    );

    const semifinalIndex = Math.floor(indice / 2);

    const semifinal = campeonato.partidas.semifinais[semifinalIndex];

    if (indice % 2 === 0) {
      semifinal.time_1 = partida.vencedor;
    } else {
      semifinal.time_2 = partida.vencedor;
    }

    return;
  }

  // SEMIFINAL -> FINAL E 3º LUGAR
  if (fase === "semifinais") {
    const indice = campeonato.partidas.semifinais.findIndex(
      (p) => p.id === partida.id,
    );

    if (indice === 0) {
      campeonato.partidas.final.time_1 = partida.vencedor;

      campeonato.partidas.terceiroLugar.time_1 = partida.perdedor;
    } else {
      campeonato.partidas.final.time_2 = partida.vencedor;

      campeonato.partidas.terceiroLugar.time_2 = partida.perdedor;
    }

    return;
  }

  // FINAL
  if (fase === "final") {
    campeonato.campeao = partida.vencedor;

    campeonato.viceCampeao = partida.perdedor;

    campeonato.status = "Encerrado";

    return;
  }

  // 3º LUGAR
  if (fase === "terceiroLugar") {
    campeonato.terceiroLugarVencedor = partida.vencedor;
  }
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

  // cada time precisa ter 5 jogadores
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

    campeao: null,
    viceCampeao: null,
    terceiroLugarVencedor: null,
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

registrarResultadoPartida = (req, res) => {
  const campeonato = req.campeonato;

  const { partidaId } = req.params;

  const { golsTime_1 = [], golsTime_2 = [] } = req.body;

  const resultadoBusca = encontrarPartida(campeonato, Number(partidaId));

  if (!resultadoBusca) {
    return res.status(404).json({
      mensagem: "Partida não encontrada.",
    });
  }

  const { partida, fase } = resultadoBusca;

  if (partida.status === "Finalizada") {
    return res.status(400).json({
      mensagem: "Essa partida já foi finalizada.",
    });
  }

  if (!partida.time_1 || !partida.time_2) {
    return res.status(400).json({
      mensagem: "Essa partida ainda não está pronta.",
    });
  }

  const time1Completo = times.find((t) => t.id === partida.time_1.id);

  const time2Completo = times.find((t) => t.id === partida.time_2.id);

  try {
    registrarGolsDoTime(time1Completo, golsTime_1, partida.golsJogadoresTime_1);

    registrarGolsDoTime(time2Completo, golsTime_2, partida.golsJogadoresTime_2);
  } catch (erro) {
    return res.status(400).json({
      mensagem: erro.message,
    });
  }

  partida.golsTime_1 = partida.golsJogadoresTime_1.length;

  partida.golsTime_2 = partida.golsJogadoresTime_2.length;

  if (partida.golsTime_1 === partida.golsTime_2) {
    return res.status(400).json({
      mensagem: "Partida mata-mata não pode empatar.",
    });
  }

  if (partida.golsTime_1 > partida.golsTime_2) {
    partida.vencedor = partida.time_1;

    partida.perdedor = partida.time_2;
  } else {
    partida.vencedor = partida.time_2;

    partida.perdedor = partida.time_1;
  }

  partida.status = "Finalizada";

  avancarNaChave(campeonato, fase, partida);

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
  campeonatos, //variável
  listarCampeonatos, //função
  getCampeonato, //função
  criarCampeonato, //função
  editarCampeonato, //função
  deletarCampeonato, //função
  registrarResultadoPartida, //função
};
