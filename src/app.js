const express = require("express");
const app = express();
const CampeonatoRoutes = require("./routes/campeonato.routes");
const TimeRoutes = require("./routes/time.routes");
const JogadorRoutes = require("./routes/jogador.routes");
const { listarCampeonatos } = require("./controllers/campeonato.controller");

app.use(express.json());

app.get("/", listarCampeonatos, (req, res) => {});

app.use(CampeonatoRoutes);
app.use(TimeRoutes);
app.use(JogadorRoutes);

module.exports = app;
