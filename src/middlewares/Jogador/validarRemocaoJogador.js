const { jogadores } = require("../../controllers/jogador.controller");
const { times } = require("../../controllers/time.controller");

module.exports = (req, res, next) => {
  const id = +req.params.id;

  const jogador = jogadores.find((j) => j.id == id);

  if (!jogador) {
    return res.status(404).json({
      erro: "Jogador não encontrado (Not found!)",
    });
  }

  const timeExistente = times.find(
    (t) => t.nome.toLowerCase() === jogador.time.toLowerCase(),
  );

  req.jogador = jogador;
  req.timeExistente = timeExistente;

  next();
};
