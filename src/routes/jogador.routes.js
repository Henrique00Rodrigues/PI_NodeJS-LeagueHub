const express = require("express");
//routes
const {
  criarJogador,
  editarJogador,
  deleteJogador,
} = require("../controllers/jogador.controller");
//routes
//middlewares
const validarCriacaoJogador = require("../middlewares/Jogador/validarCriacaoJogador");
const validarEdicaoJogador = require("../middlewares/Jogador/validarEdicaoJogador");
const validarRemocaoJogador = require("../middlewares/Jogador/validarRemocaoJogador");
//middlewares

const router = express.Router();

router.post("/jogador", validarCriacaoJogador, criarJogador);

router.put("/jogador/:id", validarEdicaoJogador, editarJogador);

router.delete("/jogador/:id", validarRemocaoJogador, deleteJogador);

module.exports = router;
