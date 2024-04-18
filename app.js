const express = require('express')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbPath = path.join(__dirname, 'cricketTeam.db')
const app = express()

app.use(express.json())

let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

const dbObjectToResponseObject = dbPlayerObject => {
  return {
    playerId: dbPlayerObject.player_id,
    playerName: dbPlayerObject.player_name,
    jerseyNumber: dbPlayerObject.jersey_number,
    role: dbPlayerObject.role,
  }
}

//API1

app.get('/players/', async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
     cricket_team
    ORDER BY
      player_id;`
  const playerList = await db.all(getBooksQuery)
  response.send(
    playerList.map(eachPlayer => dbObjectToResponseObject(eachPlayer)),
  )
})

//API2

app.post('/players/', async (request, response) => {
  const newPlayer = request.body
  const {player_name, jersey_number, role} = newPlayer
  const addNewPlayer = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
        '${playerName}',
         '${jerseyNumber}',
         '${role}',
        
      );`

  const dbResponse = await db.run(addNewPlayer)
  const playerId = dbResponse.lastID
  response.send('Player Added to Team')
})

//API3

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const getWithId = `
    SELECT
      *
    FROM
     cricket_team
    where
      player_id=1;`
  const playerList = await db.all(getWithId)
  response.send(playerList)
})

//API4

app.put('/players/:playerId/', async (request, response) => {
  const {playerName, jerseyNumber} = request.params
  const playerDetails = request.body
  const {player_name, jersey_number, role} = playerDetails
  const updatePlayer = `
    UPDATE
      cricket_team
    SET
      player_name='${playerName}',
      jersey_number=${jerseyNumber},
      role=${role},
      
    WHERE
      player_id = ${playerId};`
  await db.run(updatePlayer)
  response.send('Player Details Updated')
})

//API 5
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayer = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`
  await db.run(deletePlayer)
  response.send('Player Removed')
})

module.exports = app
