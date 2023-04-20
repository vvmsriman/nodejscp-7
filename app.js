const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const databasePath = path.join(__dirname, "cricketMatchDetails.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
const convertPlayerDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};
const convertMatchDbObjectToResponseObject = (dbObject) => {
  return {
    matchId: dbObject.match_id,
    match: dbObject.match,
    year: dbObject.year,
  };
};
const convertPlayerMatchDbObjectToResponseObject = (dbObject) => {
  return {
    playerMatchId: dbObject.player_match_id,
    playerId: dbObject.player_id,
    matchId: dbObject.matchId,
    score: dbObject.score,
    fours: dbObject.fours,
    sixes: dbObject.sixes,
  };
};
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
       SELECT
       *
       FROM 
       player_details`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertPlayerDbObjectToResponseObject(eachPlayer)
    )
  );
});
app.get("/players/:playerId/", async (request, response) => {
    const {playerId} = request.params;
    getPlayerQuery = `
    SELECT 
    *
    FROM 
    player_details
    WHERE
    player_id = ${playerId}`;
    const player = await db.get(getPlayerQuery);
    response.send(convertPlayerDbObjectToResponseObject (player))

app.put("/players/:playerId/", async (request, response) => {
         {playerId} = request.params;
         const updatePlayerQuery = `
         UPDATE
         player_details
         SET
         player_id = ${playerId},
         player_name = ${playerName}
         WHERE
         player_id = ${playerId}`
         await db.run(updatePlayerQuery);
         response.send("Player Details Updated")
});
