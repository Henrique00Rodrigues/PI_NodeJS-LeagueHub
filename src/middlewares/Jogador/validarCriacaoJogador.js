const { times } = require("../../controllers/time.controller");

module.exports = (req, res, next) => {
  const jogadores = req.body;

  // verifica se veio array
  if (!Array.isArray(jogadores)) {
    return res.status(400).json({
      erro: "Envie um array de jogadores",
    });
  }

  // array vazio
  if (jogadores.length === 0) {
    return res.status(400).json({
      erro: "Envie pelo menos um jogador",
    });
  }

  // precisa ter exatamente 5 jogadores
  if (jogadores.length !== 5) {
    return res.status(400).json({
      erro: "O time precisa possuir exatamente 5 jogadores",
    });
  }

  // pega o time do primeiro jogador
  const nomeTime = jogadores[0].time;

  if (!nomeTime) {
    return res.status(400).json({
      erro: "O time é obrigatório",
    });
  }

  // verifica se o time existe
  const timeExistente = times.find(
    (t) => t.nome.toLowerCase() === nomeTime.toLowerCase(),
  );

  if (!timeExistente) {
    return res.status(404).json({
      erro: "Time não existe (Not found!)",
    });
  }

  // impede adicionar jogadores novamente
  if (timeExistente.jogadores.length > 0) {
    return res.status(400).json({
      erro: "Esse time já possui jogadores cadastrados",
    });
  }

  // posições válidas
  const posicoesValidas = [
    "Atacante",
    "Lateral Direito",
    "Lateral Esquerdo",
    "Zagueiro",
    "Goleiro",
  ];

  // usado para verificar repetição dentro do array
  const posicoesRecebidas = [];
  const nomesRecebidos = [];

  // valida cada jogador
  for (const jogador of jogadores) {
    const { nome, posicao, time } = jogador;

    // campos obrigatórios
    if (!nome || !posicao || !time) {
      return res.status(400).json({
        erro: "Todos os jogadores precisam ter nome, posição e time",
      });
    }

    // todos precisam ser do mesmo time
    if (time.toLowerCase() !== nomeTime.toLowerCase()) {
      return res.status(400).json({
        erro: "Todos os jogadores precisam pertencer ao mesmo time",
      });
    }

    // posição válida
    if (!posicoesValidas.includes(posicao)) {
      return res.status(400).json({
        erro: `Posição inválida: ${posicao}`,
      });
    }

    // nome repetido no array
    if (nomesRecebidos.includes(nome.toLowerCase())) {
      return res.status(409).json({
        erro: `O jogador ${nome} está repetido`,
      });
    }

    // posição repetida no array
    if (posicoesRecebidas.includes(posicao.toLowerCase())) {
      return res.status(409).json({
        erro: `A posição ${posicao} está repetida`,
      });
    }

    nomesRecebidos.push(nome.toLowerCase());

    posicoesRecebidas.push(posicao.toLowerCase());
  }

  // garante todas as posições obrigatórias
  const posicoesObrigatorias = [
    "Atacante",
    "Lateral Direito",
    "Lateral Esquerdo",
    "Zagueiro",
    "Goleiro",
  ];

  for (const posicao of posicoesObrigatorias) {
    const possuiPosicao = jogadores.find(
      (j) => j.posicao.toLowerCase() === posicao.toLowerCase(),
    );

    if (!possuiPosicao) {
      return res.status(400).json({
        erro: `O time precisa possuir um ${posicao}`,
      });
    }
  }

  req.timeExistente = timeExistente;

  next();
};
