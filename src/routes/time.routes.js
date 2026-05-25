const express = require("express");
//routes
const {
  criarTime,
  listarTimes,
  editarTime,
} = require("../controllers/time.controller");
//routes
//middlewares
const validarCriacaoTime = require("../middlewares/Time/validarCriacaoTime");
const validarEdicaoTime = require("../middlewares/Time/validarEdicaoTime");
//middlewares

const router = express.Router();

router.get("/times", listarTimes);

router.post("/times", validarCriacaoTime, criarTime);

router.put("/times/:id", validarEdicaoTime, editarTime);

module.exports = router;
