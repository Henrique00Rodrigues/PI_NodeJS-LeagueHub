# 🏆 Como usar o software

---

## 🧩 1º Passo - Criar os times

Devem ser 8 times ou mais. Os times dever ser criados no padrão:

```json
{
    "nome": ""
}
```

Ex:

```json
{
    "nome": "Lobos"
}
```

Use no Postman o:

```http
POST - url: http://localhost:3000/times
```

---

## 👥 2º Passo - Criar os jogadores

Devem ser 5 jogadores por time (Atacante, Zagueiro, Lateral Direito, Lateral Esquerdo e Goleiro).

Deve ser enviado um array contendo os 5 jogadores e os jogadores devem ser criados no padrão:

```json
{
    "nome": "",
    "posicao": "",
    "time": ""
}
```

Ex:

```json
{
    "nome": "Dida",
    "posicao": "Goleiro",
    "time": "Lobos"
}
```

Use no Postman o:

```http
POST - url: http://localhost:3000/jogador
```

---

## 🏁 3º Passo - Criar o campeonato

Criar o campeonato informando o nome, data do fim, status e os times criados por id através de um array.

Exemplo:

```json
{
  "nome": "Copa da Escola",
  "dataFim": "2026-06-30",
  "status": "Em andamento",
  "timeIds": [1, 2, 3, 4, 5, 6, 7, 8]
}
```

Use no Postman o:

```http
POST - url: http://localhost:3000/campeonatos
```

---

## ⚽ 4º Passo - Registrar os resultados da partida

Registrar os resultados da partida através dos gols que cada time fez.

Exemplo:

```json
{
  "golsTime_1": [38, 38],
  "golsTime_2": [27]
}
```

Use no Postman o:

```http
PUT - url: http://localhost:3000/campeonatos/:campeonatoId/partidas/:partidaId/resultado
```

---

## 🔎 5º Passo - Achar o campeonato por id

Você pode achar o campeonato por id, usando:

```http
GET - url: http://localhost:3000/campeonatos/:id
```

---

## 🗑️ 6ª Passo - Deletar um campeonato

Você pode deletar um campeonato existente, usando:

```http
DELETE - url: http://localhost:3000/campeonatos/:id
```

---

## ✏️ 7º Passo - Editar um campeonato

Você pode editar um campeonato existente, usando:

```http
PUT - url: http://localhost:3000/campeonatos/:id
```

---

## 📋 8º Passo - Listar os times existentes

Você pode listar os times existentes, usando:

```http
GET - url: http://localhost:3000/times
```

---

## 🛠️ 9º Passo - Editar um time

Você pode editar um time existente, usando:

```http
PUT - url: http://localhost:3000/times/:id
```

---

## 👤 10º Passo - Editar um jogador

Você pode editar um jogador existente, usando:

```http
PUT - url: http://localhost:3000/jogador/:id
```

---

## ❌ 11º Passo - Remover um jogador

Você pode remover um jogador existente, usando:

```http
DELETE - url: http://localhost:3000/jogador/:id
```

---

## 📌 Resumo das rotas

| Passo | Ação                    | Método | URL                                                                             |
| ----- | ----------------------- | ------ | ------------------------------------------------------------------------------- |
| 1º    | Criar times             | POST   | `http://localhost:3000/times`                                                   |
| 2º    | Criar jogadores         | POST   | `http://localhost:3000/jogador`                                                 |
| 3º    | Criar campeonato        | POST   | `http://localhost:3000/campeonatos`                                             |
| 4º    | Registrar resultado     | PUT    | `http://localhost:3000/campeonatos/:campeonatoId/partidas/:partidaId/resultado` |
| 5º    | Achar campeonato por id | GET    | `http://localhost:3000/campeonatos/:id`                                         |
| 6º    | Deletar campeonato      | DELETE | `http://localhost:3000/campeonatos/:id`                                         |
| 7º    | Editar campeonato       | PUT    | `http://localhost:3000/campeonatos/:id`                                         |
| 8º    | Listar times            | GET    | `http://localhost:3000/times`                                                   |
| 9º    | Editar time             | PUT    | `http://localhost:3000/times/:id`                                               |
| 10º   | Editar jogador          | PUT   | `http://localhost:3000/jogador/:id`                                             |
| 11º   | Remover jogador         | DELETE | `http://localhost:3000/jogador/:id`                                             |
