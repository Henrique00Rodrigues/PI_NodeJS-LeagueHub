const campeonatoService = require("../../services/campeonato.service");
const timeService = require("../../services/time.service");

module.exports = (req, res, next) => {
  const campeonatos = campeonatoService.listarCampeonatos();

  if (campeonatos.length >= 5) {
    return res.status(409).json({
      erro: "Já existem 5 campeonatos. Não é possível criar mais. (Conflict!)",
    });
  }

  const { nome, timeIds } = req.body;

  const campeonatoExistente = campeonatos.find(
    (c) => c.nome.toLowerCase() === nome.toLowerCase(),
  );

  if (campeonatoExistente) {
    return res.status(409).json({
      erro: "Já existe um campeonato com esse nome.",
    });
  }

  // validar array
  if (!Array.isArray(timeIds)) {
    return res.status(400).json({
      mensagem: "Você precisa enviar um array chamado timeIds com 8 times.",
    });
  }
  // validar quantidade
  if (timeIds.length !== 8) {
    return res.status(400).json({
      mensagem: "O campeonato precisa ter exatamente 8 times.",
    });
  }
  // validar repetidos
  const idsUnicos = [...new Set(timeIds)];

  if (idsUnicos.length !== 8) {
    return res.status(400).json({
      mensagem: "Não pode haver times repetidos.",
    });
  }
  // buscar times
  const timesSelecionados = idsUnicos.map((id) => {
    return timeService.buscarTimePorId(id);
  });
  // validar existência
  if (timesSelecionados.some((time) => !time)) {
    return res.status(400).json({
      mensagem: "Um ou mais times informados não existem.",
    });
  }
  // cada time precisa ter 5 jogadores (validar jogadores)
  const timeInvalido = timesSelecionados.find(
    (time) => time.jogadores.length !== 5,
  );

  if (timeInvalido) {
    return res.status(400).json({
      mensagem: `O time ${timeInvalido.nome} não possui 5 jogadores.`,
    });
  }

  req.timesSelecionados = timesSelecionados; // salvando para reutilizar no controller

  next();
};
