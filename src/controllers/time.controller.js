let times = [];
let idAtual = 1;

class Time {
  constructor(nome, status = "A decidir...") {
    this.id = idAtual++;
    this.nome = nome;
    this.jogadores = [];
    this.status = status;
  }
}

listarTimes = (req, res) => {
  res.json(times);
};

criarTime = (req, res) => {
  const { nome } = req.body;

  const time = new Time(nome);

  times.push(time);

  return res.status(201).json({ time });
};

editarTime = (req, res) => {
  const time = req.time;

  time.nome = req.body.nome ?? time.nome;
  time.status = req.body.status ?? time.status;

  return res.json(time);
};

module.exports = { times, listarTimes, criarTime, editarTime };
