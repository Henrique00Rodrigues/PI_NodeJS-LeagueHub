const jogadorService = require("../services/jogador.service");

const criarJogador = (req, res) => {
  const jogadoresCriados = jogadorService.criarJogadores(
    req.body,
    req.timeExistente,
  );

  return res.status(201).json({
    mensagem: "Jogadores criados com sucesso.",

    jogadores: jogadoresCriados,
  });
};

const editarJogador = (req, res) => {
  const jogadorEditado = jogadorService.editarJogador(req.jogador, req.body);

  return res.json(jogadorEditado);
};

const deleteJogador = (req, res) => {
  const jogadorRemovido = jogadorService.deletarJogador(
    req.jogador,
    req.timeExistente,
  );

  return res.json({
    mensagem: "Jogador removido com sucesso.",
    jogadorRemovido: jogadorRemovido.nome,
  });
};

module.exports = { criarJogador, editarJogador, deleteJogador };
