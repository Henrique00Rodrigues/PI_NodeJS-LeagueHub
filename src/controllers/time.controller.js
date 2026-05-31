const timeService = require("../services/time.service");

const listarTimes = (req, res) => {
  return res.json(timeService.listarTimes());
};

const criarTime = (req, res) => {
  const { nome } = req.body;

  const time = timeService.criarTime(nome);

  // times.push(time);

  return res.status(201).json({ time });
};

const editarTime = (req, res) => {
  const timeEditado = timeService.editarTime(req.time, req.body);

  return res.json(timeEditado);
};

module.exports = { listarTimes, criarTime, editarTime };
