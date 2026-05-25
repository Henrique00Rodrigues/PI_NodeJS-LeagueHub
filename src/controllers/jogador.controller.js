let jogadores = [];
let idAtual = 1;

class Jogador {
  constructor(nome, posicao, time) {
    this.id = idAtual++;
    this.nome = nome;
    this.posicao = posicao;
    this.time = time;
    this.gols = 0;
  }
}

criarJogador = (req, res) => {
  const { nome, posicao, time } = req.body;

  const jogador = new Jogador(nome, posicao, time);

  jogadores.push(jogador);
  req.timeExistente.jogadores.push(jogador);

  return res.status(201).json(jogador);
};

editarJogador = (req, res) => {
  const jogador = req.jogador;

  jogador.nome = req.body.nome ?? jogador.nome;
  jogador.posicao = req.body.posicao ?? jogador.posicao;
  jogador.gols = req.body.gols ?? jogador.gols;

  return res.json(jogador);
};

deleteJogador = (req, res) => {
  jogadores = jogadores.filter((j) => j.id != req.jogador.id); //está removendo da lista global

  req.timeExistente.jogadores = req.timeExistente.jogadores.filter(
    (j) => j.id !== req.jogador.id,
  ); //está removendo do time

  return res.json({
    mensagem: "Jogador removido com sucesso.",
    jogadorRemovido: req.jogador.nome,
  });
};

module.exports = { jogadores, criarJogador, editarJogador, deleteJogador };
