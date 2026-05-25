const { jogadores } = require("../../controllers/jogador.controller");
const { times } = require("../../controllers/time.controller");

module.exports = (req, res, next) => {
  const id = Number(req.params.id);
  const { nome, posicao } = req.body;

  const jogador = jogadores.find((j) => j.id === id);

  if (!jogador) {
    return res.status(404).json({
      erro: "Jogador não encontrado",
    });
  }

  const timeExistente = times.find(
    (t) => t.nome.toLowerCase() === jogador.time.toLowerCase(),
  );

  if (!timeExistente) {
    return res.status(404).json({
      erro: "Time não existe",
    });
  }

  if (
    posicao &&
    posicao !== "Atacante" &&
    posicao !== "Lateral Direito" &&
    posicao !== "Lateral Esquerdo" &&
    posicao !== "Zagueiro" &&
    posicao !== "Goleiro"
  ) {
    return res.status(400).json({
      erro: "Posição inválida",
    });
  }

  if (posicao) {
    const posicaoJaExiste = timeExistente.jogadores.find(
      (j) =>
        j.posicao.toLowerCase() === posicao.toLowerCase() &&
        j.id !== jogador.id,
    );

    if (posicaoJaExiste) {
      return res.status(409).json({
        erro: `Já existe outro jogador na posição ${posicao}`,
      });
    }
  }

  if (nome) {
    const nomeDuplicado = timeExistente.jogadores.find(
      (j) => j.nome.toLowerCase() === nome.toLowerCase() && j.id !== jogador.id,
    );

    if (nomeDuplicado) {
      return res.status(409).json({
        erro: "Já existe um jogador com esse nome no time",
      });
    }
  }

  req.jogador = jogador;
  req.timeExistente = timeExistente;

  next();
};
