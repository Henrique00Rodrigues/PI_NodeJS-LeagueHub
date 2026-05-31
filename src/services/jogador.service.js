class JogadorService {
  constructor() {
    this.jogadores = []; //Lista dos jogadores guardados em memória.
    this.idAtual = 1;
  }

  listarJogadores() {
    return this.jogadores;
  }

  buscarJogadorPorId(id) {
    return this.jogadores.find((jogador) => jogador.id === Number(id));
  }
  //Função de criação de um único jogador
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
  //função de criação de jogadores
  criarJogadores(dadosJogadores, timeExistente) {
    const jogadoresCriados = [];

    for (const dados of dadosJogadores) {
      //Iterando sobre os dados que estão no array dos jogadores
      const { nome, posicao, time } = dados; //Desestruturação de objetos (Pegando o objeto dados e pegando as propriedades desejadas dele)

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
  //Função de edição de jogador
  editarJogador(jogador, dados) {
    jogador.nome = dados.nome ?? jogador.nome; //Operador ?? (coalecencia nula)
    jogador.posicao = dados.posicao ?? jogador.posicao;
    jogador.gols = dados.gols ?? jogador.gols;

    return jogador;
  }
  //funça~o de deletar jogador
  deletarJogador(jogador, timeExistente) {
    const index = this.jogadores.findIndex((j) => j.id === jogador.id);
    //verificação da existencia do jogador
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
