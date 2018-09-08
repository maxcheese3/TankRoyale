var express = require('express');
const Player = require('./public/js/Player.js');
//const player = new Player();
//let Player = playersClass.Player;
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
var star = {
  x: Math.floor(Math.random() * 700) + 50,
  y: Math.floor(Math.random() * 500) + 50
};
var scores = {
  blue: 0,
  red: 0
};
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);
  // create a new player and add it to our players object
  players[socket.id] = new Player().createPlayer('MBT',socket.id);
  //players[socket.id].createPlayer('MBT', socket.id);
  // send the star object to the new player
  //socket.emit('starLocation', star);
  // send the current scores
  //socket.emit('scoreUpdate', scores);
  // update all other players of the new player
  //socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    //console.log(players.length)
    for( var i = 0; i < players.length-1; i++){ 
      if ( array[i] === socket.id) {
        arr.splice(i, 1); 
        console.log("spliced",i, socket.id)
      }
   }
    delete players[socket.id];
    // emit a message to all players to remove this player
    //io.emit('disconnect', socket.id);
    console.log(players)
  });

  // when a player moves, update the local player data, but do not send out an update
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].angle = movementData.angle;
  });



  socket.on('starCollected', function () {
    if (players[socket.id].team === 'red') {
      scores.red += 10;
    } else {
      scores.blue += 10;
    }
    star.x = Math.floor(Math.random() * 700) + 50;
    star.y = Math.floor(Math.random() * 500) + 50;
    io.emit('starLocation', star);
    io.emit('scoreUpdate', scores);
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});

setInterval(heartbeat, 33);
var heartbeatCounter = 0;
function heartbeat() {
  //console.log(players);
  heartbeatCounter++;
  console.log(heartbeatCounter);
  io.emit('heartbeat', players);
}