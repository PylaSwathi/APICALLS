const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
let dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

let initializeAndStartServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    console.log(`DB ERROR:${e.message}`);
    process.exit(1);
  }
};

initializeAndStartServer();

app.get("/players/", async (request, response) => {
  const sqlQuery = `
    select *
     from
      cricket_team;`;
  let resp = await db.all(sqlQuery);
  response.send(resp);
});

app.post("/players/", async (request, response) => {
  console.log(request.body);
  let { playerName, jerseyNumber, role } = request.body;
  console.log(playerName);
  console.log(jerseyNumber);
  console.log(role);
  const sqlQuery = `insert into cricket_team(player_name,jersey_number,role)
     values  ('${playerName}',${jerseyNumber},'${role}');
     `;
  const addBook = await db.run(sqlQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  let sqlQuery = `select * from cricket_team where player_id = ${playerId}`;
  const res = db.get(sqlQuery);
  response.send(res);
});
