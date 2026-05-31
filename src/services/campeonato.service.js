const partidaService = require("./partida.service");

class CampeonatoService {
  constructor() {
    this.campeonatos = []; //arraay onde os campeonats vão ficar enquanto não houver BDD
    this.idAtual = 1;
  }

  //função de retornar os campeonatos que já foram criados
  listarCampeonatos() {
    return this.campeonatos;
  }
  //busca um campeonato específico por id
  buscarCampeonatoPorId(id) {
    return this.campeonatos.find((c) => c.id === +id);
  }
  //Essa função embaralha a ordem dos times para serem colocados nas quartas de final
  embaralharArray(array) {
    const novo_Array = [...array]; //operador de spread (...) ele desestrutura um array dentro de outro, deste modo, evitando a expansão ecessiva de código

    //método extremamente eficiente de embaralhar um array (no caso serão os times das quartas de final que serão escalados de maneira aleatoria)
    for (let i = novo_Array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [novo_Array[i], novo_Array[j]] = [novo_Array[j], novo_Array[i]]; //está trocando as posições dos elementos
    }

    return novo_Array;
  }
  //função para montar a grade de partidas do campeontato com os times escolhidos
  montarChave(timesSelecionados) {
    const timesEmbaralhados = this.embaralharArray(timesSelecionados); //chama a função de embaralhamento
    //está criando as partidas com base no arquivo service de partidas
    const quartas = [
      partidaService.criarPartida(
        "quartas",
        timesEmbaralhados[0],
        timesEmbaralhados[1],
      ),
      partidaService.criarPartida(
        "quartas",
        timesEmbaralhados[2],
        timesEmbaralhados[3],
      ),
      partidaService.criarPartida(
        "quartas",
        timesEmbaralhados[4],
        timesEmbaralhados[5],
      ),
      partidaService.criarPartida(
        "quartas",
        timesEmbaralhados[6],
        timesEmbaralhados[7],
      ),
    ];
    //Aqui está criando as semis, porém só serão preenchidas quando forem declarados os times campeões
    const semifinais = [
      partidaService.criarPartida("semifinal"),
      partidaService.criarPartida("semifinal"),
    ];
    //Aqui também.
    const final = partidaService.criarPartida("final");
    const terceiroLugar = partidaService.criarPartida("terceiro_lugar");

    return {
      quartas,
      semifinais,
      final,
      terceiroLugar,
    };
  }
  //função que cria o campeonato com os dados já validados pelo middleware.
  criarCampeonato({ nome, dataFim, status, timesSelecionados }) {
    const novoCampeonato = {
      id: this.idAtual++,
      nome,
      dataInicio: new Date(),
      dataFim,
      status,
      //a função map está gerando um novo arrau com base no arrau fornecido (timesSelecionados)
      times: timesSelecionados.map((time) => ({
        id: time.id,
        nome: time.nome,
      })),
      //criando as partidas
      partidas: this.montarChave(
        timesSelecionados.map((time) => ({
          id: time.id,
          nome: time.nome,
        })),
      ),

      campeao: null,
      viceCampeao: null,
      terceiroLugarVencedor: null,
    };

    this.campeonatos.push(novoCampeonato);

    return novoCampeonato;
  }
  //função de edição de campeonato
  editarCampeonato(campeonato, dados) {
    campeonato.nome = dados.nome ?? campeonato.nome; //O operador de coalecencia nula está sendo usado para caso o nome fornecido seja nulo, ele continua mantendo o valor antigo.
    campeonato.dataInicio = dados.dataInicio ?? campeonato.dataInicio; //Aqui também
    campeonato.dataFim = dados.dataFim ?? campeonato.dataFim; //Aqui também
    campeonato.status = dados.status ?? campeonato.status; //Aqui també

    return campeonato;
  }
  //função para deletar campeonatos
  deletarCampeonato(campeonatoId) {
    const index = this.campeonatos.findIndex(
      (c) => c.id === +campeonatoId, //O + é um recurso do javascript que transforma automaticamente em número
    );
    //Se o findIndex não encontrar o campeonato, ele vai retornar -1
    if (index !== -1) {
      return this.campeonatos.splice(index, 1)[0]; //O [0] está retornando justamente o elemento que foi removido, pois, o splice modifica o array original e retorna o elemento que foi removido.
    }
    //Se o findIndex retornar -1, então vai cair na linha abaixo (return null;)
    return null;
  }
  //Função que faz o time avançar de fase
  avancarNaChave(campeonato, fase, partida) {
    if (fase === "quartas") {
      const indice = campeonato.partidas.quartas.findIndex(
        (p) => p.id === partida.id,
      );
      // Cada semifinal recebe vencedores de duas partidas das quartas.
      // Partidas 0 e 1 alimentam a semifinal 0.
      // Partidas 2 e 3 alimentam a semifinal 1.
      const semifinalIndex = Math.floor(indice / 2);
      const semifinal = campeonato.partidas.semifinais[semifinalIndex];

      if (indice % 2 === 0) {
        semifinal.time_1 = partida.vencedor;
      } else {
        semifinal.time_2 = partida.vencedor;
      }

      return;
    }

    if (fase === "semifinais") {
      const indice = campeonato.partidas.semifinais.findIndex(
        (p) => p.id === partida.id,
      );

      if (indice === 0) {
        // Primeira semifinal.
        campeonato.partidas.final.time_1 = partida.vencedor;
        campeonato.partidas.terceiroLugar.time_1 = partida.perdedor;
      } else {
        // Segunda semifinal.
        campeonato.partidas.final.time_2 = partida.vencedor;
        campeonato.partidas.terceiroLugar.time_2 = partida.perdedor;
      }

      return;
    }
    //Se a partida finalizada for a final, então, definimos o campeão e o vice.
    if (fase === "final") {
      campeonato.campeao = partida.vencedor;
      campeonato.viceCampeao = partida.perdedor;
      campeonato.status = "Encerrado";

      return;
    }
    //Se a partida finalizada foi a disputa de terceiro lugar, então, o vencedor fica com o terceiro lugar
    if (fase === "terceiroLugar") {
      campeonato.terceiroLugarVencedor = partida.vencedor;
    }
  }
}

module.exports = new CampeonatoService();
