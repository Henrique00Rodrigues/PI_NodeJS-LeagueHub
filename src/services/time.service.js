class TimeService {
  constructor() {
    this.times = []; //Times que já foram criados armazenados em memória por conta da falta de BDD
    this.idAtual = 1;
  }
  // Retorna todos os times cadastrados.
  listarTimes() {
    return this.times;
  }
  //Busca time por id
  buscarTimePorId(id) {
    return this.times.find((time) => time.id === Number(id));
  }
  //Por nome
  buscarTimePorNome(nome) {
    return this.times.find(
      (time) => time.nome.toLowerCase() === nome.toLowerCase(),
    );
  }
  //Função de criação do time
  criarTime(nome) {
    const time = {
      id: this.idAtual++, //Sobe 1 no id, ná próxima fica 2, depois 3, 4, 5...
      nome,
      jogadores: [], //Jogadores do time, que no caso estão começando sem jogadores, mas pretendo mudá-lo.
      status: "A decidir...",
    };

    this.times.push(time); //Adiciona o time criado à memoria

    return time;
  }
  //Função de edição de times
  editarTime(time, dados) {
    time.nome = dados.nome ?? time.nome; //O operador de coalecencia nula está sendo usado para caso o nome fornecido seja nulo, ele continua mantendo o valor antigo.
    time.status = dados.status ?? time.status; //Mesma coisa aqui

    return time;
  }
}

module.exports = new TimeService();
