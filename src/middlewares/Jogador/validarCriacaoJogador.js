const { times } = require("../../controllers/time.controller");

module.exports = (req, res, next) => {
  const { nome, posicao, time } = req.body;

  if (!nome || !posicao || !time) {
    return res
      .status(400)
      .json({ erro: "É preciso inserir todas as informações para continuar" });
  }

  if (
    posicao !== "Atacante" &&
    posicao !== "Lateral Direito" &&
    posicao !== "Lateral Esquerdo" &&
    posicao !== "Zagueiro" &&
    posicao !== "Goleiro"
  ) {
    return res.status(400).json({
      erro: "A posição precisa ser uma dessas: Atacante, Lateral Direito/Esquerdo, Zagueiro ou Goleiro",
    });
  }

  const timeExistente = times.find(
    (t) => t.nome.toLowerCase() === time.toLowerCase(),
  );

  if (!timeExistente) {
    return res.status(404).json({ erro: "Time não existe (Not found!)" });
  }

  const jogadorExistente = timeExistente.jogadores.find(
    (j) => j.nome.toLowerCase() === nome.toLowerCase(),
  );

  if (jogadorExistente) {
    return res.status(409).json({ erro: "Jogador já está no time" });
  }

  const posicaoJaExiste = timeExistente.jogadores.find(
    (j) => j.posicao === posicao,
  );

  if (posicaoJaExiste) {
    return res.status(409).json({
      erro: `Já existe um jogador na posição ${posicao} nesse time`,
    });
  }

  req.timeExistente = timeExistente;

  next();
};
