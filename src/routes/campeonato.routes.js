const express = require("express");
//routes
const {
  criarCampeonato,
  deletarCampeonato,
  getCampeonato,
  editarCampeonato,
  registrarResultadoPartida,
} = require("../controllers/campeonato.controller");
//routes
//middlewares
const validarCriacaoCampeonato = require("../middlewares/campeonato/validarCriacaoCampeonato");
const validarRemocaoCampeonato = require("../middlewares/campeonato/validarRemocaoCampeonato");
const validarBuscaCampeonato = require("../middlewares/campeonato/validarBuscaCampeonato");
const validarEdicaoCampeonato = require("../middlewares/campeonato/validarEdicaoCampeonato");
//middlewares
const router = express.Router();

router.get("/campeonatos/:id", validarBuscaCampeonato, getCampeonato);

router.post("/campeonatos", validarCriacaoCampeonato, criarCampeonato);

router.put("/campeonatos/:id", validarEdicaoCampeonato, editarCampeonato);

router.delete("/campeonatos/:id", validarRemocaoCampeonato, deletarCampeonato);

router.put(
  "/campeonatos/:campeonatoId/partidas/:partidaId/resultado",
  validarBuscaCampeonato,
  registrarResultadoPartida,
);

module.exports = router;
