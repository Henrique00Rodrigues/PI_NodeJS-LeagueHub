class PartidaService {
  constructor() {
    this.idPartidaAtual = 1;
  }

  criarPartida(fase, time1 = null, time2 = null) {
    return {
      id: this.idPartidaAtual++,

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

  registrarGolsDoTime(timeCompleto, golsNormalizados, listaDestino) {
    for (const gol of golsNormalizados) {
      const jogador = timeCompleto.jogadores.find(
        (j) => j.id === Number(gol.jogadorId),
      );

      jogador.gols += 1;

      listaDestino.push({
        jogadorId: jogador.id,
        jogadorNome: jogador.nome,
      });
    }
  }

  definirVencedor(partida) {
    if (partida.golsTime_1 > partida.golsTime_2) {
      partida.vencedor = partida.time_1;
      partida.perdedor = partida.time_2;
    } else {
      partida.vencedor = partida.time_2;
      partida.perdedor = partida.time_1;
    }

    partida.status = "Finalizada";
  }
}

module.exports = new PartidaService();
