const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3019, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
//get players
app.get("/players/", async (request, response) => {
  const getCricketPlayersQuery = `
    SELECT * FROM cricket_team`;
  const getPlayers = await db.all(getCricketPlayersQuery);
  response.send(getPlayers);
});
//get create player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const createPlayerQuery = `
    INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES(
        '${playerName}',
        ${jerseyNumber},
        '${role}'
    );`;
  await db.run(createPlayerQuery);
  response.send("Player Added to Team");
});
//get single player Details
app.get(`/players/:playerId/`, async (request, response) => {
  const playerId = request.params;
  const getSinglePlayerQuery = `SELECT * FROM cricket_team`;
  const getSinglePlayer = await db.get(getSinglePlayerQuery);
  response.send(getSinglePlayer);
});
//Update Player Details
app.put("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const updatePlayer = request.body;
  const { playerName, jerseyNumber, role } = updatePlayer;
  const updatePlayerQuery = `
  UPDATE cricket_team
  SET
  player_name='${playerName}',
  jersey_number=${jerseyNumber},
  role='${role}';`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});
//Delete Player Details
app.delete("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const deleteQuery = `
    DELETE FROM cricket_team `;
  await db.get(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
