class JogadorService {
  constructor() {
    this.jogadores = [];
    this.idAtual = 1;
  }

  listarJogadores() {
    return this.jogadores;
  }

  buscarJogadorPorId(id) {
    return this.jogadores.find((jogador) => jogador.id === Number(id));
  }

  criarJogador({ nome, posicao, time }) {
    const jogador = {
      id: this.idAtual++,
      nome,
      posicao,
      time,
      gols: 0,
    };

    this.jogadores.push(jogador);

    return jogador;
  }

  criarJogadores(dadosJogadores, timeExistente) {
    const jogadoresCriados = [];

    for (const dados of dadosJogadores) {
      const { nome, posicao, time } = dados;

      const jogador = this.criarJogador({
        nome,
        posicao,
        time,
      });

      timeExistente.jogadores.push(jogador);

      jogadoresCriados.push(jogador);
    }

    return jogadoresCriados;
  }

  editarJogador(jogador, dados) {
    jogador.nome = dados.nome ?? jogador.nome;
    jogador.posicao = dados.posicao ?? jogador.posicao;
    jogador.gols = dados.gols ?? jogador.gols;

    return jogador;
  }

  deletarJogador(jogador, timeExistente) {
    const index = this.jogadores.findIndex((j) => j.id === jogador.id);

    if (index !== -1) {
      this.jogadores.splice(index, 1);
    }

    timeExistente.jogadores = timeExistente.jogadores.filter(
      (j) => j.id !== jogador.id,
    );

    return jogador;
  }
}

module.exports = new JogadorService();
