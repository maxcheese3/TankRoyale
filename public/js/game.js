var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  } 
};

var game = new Phaser.Game(config);
function preload() {
  this.load.image('ship', 'assets/tank.png');
  this.load.image('otherPlayer', 'assets/tank.png');
  this.load.image('star', 'assets/star_gold.png');
  this.load.image('bg', 'assets/IMG_5321.jpg');

}


//////////////////////////////////////////////
//CREATE FUNCTION/////////////////////////////
//////////////////////////////////////////////
function create() {
  var self = this;
  var players = [];
  this.players = players;
  this.socket = io();

    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(0, 0, 2592, 1728);
    this.physics.world.setBounds(0, 0, 2592, 1728);

    //  Mash 4 images together to create our background
    this.add.image(0, 0, 'bg').setOrigin(0);
    //this.add.image(1920, 0, 'bg').setOrigin(0).setFlipX(true);
    //this.add.image(0, 1080, 'bg').setOrigin(0).setFlipY(true);
    //this.add.image(1920, 1080, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

    //this.cameras.main.startFollow(self.ship, true, 0.05, 0.05);


  this.socket.on('heartbeat', function (serverPlayers) {
    //Update list of players from server list of players
    this.players = serverPlayers;
    //check to make sure every player has a ship physics sprite
    // self.players.forEach(function (player) {
    //     if(player.ship === NULL){
    //       addOtherPlayer(player);
    //       //players.ship =self.add.sprite(playerInfo.x, playerInfo.y, id).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    //     }
    //     textAlign(CENTER);
    //     textSize(4);
    //     text(player.playerID, player.x, player.y);
    //   });
  });

  this.cursors = this.input.keyboard.createCursorKeys();
  this.wasd = {
    up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    score: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
  };

  // this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
  // this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });
  
  // this.socket.on('scoreUpdate', function (scores) {
  //   self.blueScoreText.setText('Blue: ' + scores.blue);
  //   self.redScoreText.setText('Red: ' + scores.red);
  // });

  // this.socket.on('starLocation', function (starLocation) {
  //   if (self.star) self.star.destroy();
  //   self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
  //   self.physics.add.overlap(self.ship, self.star, function () {
  //     this.socket.emit('starCollected');
  //   }, null, self);
  // });
}





//////////////////////////////////////////////
//UPDATE FUNCTION/////////////////////////////
//////////////////////////////////////////////
function update() {
  if (this.ship) {

    checkInput(this);

    // emit player movement
    //var curs = 
    var x = this.ship.x;
    var y = this.ship.y;
    var r = this.ship.rotation;
    if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
      this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
      //console.log("I'm moving", self.playerId)
    }
    // save old position data
    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation
    };
  }
}

//////////////////////////////////////////////
//OTHER FUNCTIONS/////////////////////////////
//////////////////////////////////////////////
function addPlayer(self, playerInfo) {
  self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  if (playerInfo.team === 'blue') {
    //self.ship.setTint(0x000044);
  } else {
    //self.ship.setTint(0x440000);
  }

  self.ship.setDrag(800);
  self.ship.setAngularDrag(200);
  self.ship.setMaxVelocity(300);
  self.ship.setFriction(1000); 
  self.ship.setCollideWorldBounds(true);
  self.cameras.main.startFollow(self.ship, true, 0.05, 0.05);
  this.players[self.socket.id] = self;
}

function addOtherPlayer(self, player) {
  console.log("adding other player");
  //this.players[player.playerID] = new Player();
  //this.players[player.playerID].createPlayer(player.type,player.playerID);
  //players.ship =self.add.sprite(player.x, player.y, player.playerID).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  //players[player.PlayerID] = player;
  //const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  //if (playerInfo.team === 'blue') {
    //otherPlayer.setTint(0x0000ff);
  //} else {
    //otherPlayer.setTint(0xff0000);
  //}
  //otherPlayer.playerId = playerInfo.playerId;
  //self.otherPlayers.add(otherPlayer);
}

function checkInput(player){
  //Keyboard detection
    //CASE: A
    if (player.wasd.left.isDown || player.cursors.left.isDown) {
      player.ship.body.setVelocityX(player.ship.body.velocity.x-25);
      player.ship.angle=270;
    }
    //CASE: D
    if (player.wasd.right.isDown || player.cursors.right.isDown) {
      player.ship.body.setVelocityX(player.ship.body.velocity.x+25);
      player.ship.angle=90;
    }  
     //CASE: W
    if (player.wasd.up.isDown || player.cursors.up.isDown) {
      player.ship.body.setVelocityY(player.ship.body.velocity.y-25);
      player.ship.angle=0;
    } 
    //CASE: S
    if (player.wasd.down.isDown || player.cursors.down.isDown){
      player.ship.body.setVelocityY(player.ship.body.velocity.y+25);
      player.ship.angle=180;
    }
    //CASE: A+W
    if ((player.wasd.left.isDown || player.cursors.left.isDown) && (player.wasd.up.isDown || player.cursors.up.isDown))  {
      player.ship.angle=-45;
    }
    //CASE: A+S
    if ((player.wasd.left.isDown || player.cursors.left.isDown) && (player.wasd.down.isDown || player.cursors.down.isDown))  {
      player.ship.angle=225;
    }
    //CASE: D+W
    if ((player.wasd.right.isDown || player.cursors.right.isDown) && (player.wasd.up.isDown || player.cursors.up.isDown))  {
      player.ship.angle=45;
    }
    //CASE: D+S
    if ((player.wasd.right.isDown || player.cursors.right.isDown) && (player.wasd.down.isDown || player.cursors.down.isDown))  {
      player.ship.angle=135;
    }

    else{
    }

    //player.ship.rotation = (player.ship.velocityX + player.ship.velocityY)
    var rot = 0;
    var x = player.ship.x;
    var y = player.ship.y;
    // console.log(player.input.activePointer.worldX);

    // player.input.on('pointermove', (pointer) => {
    //   rot = Phaser.Math.Angle.Between(x, y, pointer.x, pointer.y );
    //   player.ship.rotation=rot+1.570795;
    //   //console.log(rot);
    // }, player);
    //var rot = Phaser.Math.Angle.Between(player.ship.x, player.ship.y, mouseX,mouseY);
    //console.log(rot);
    //player.ship.rotation=rot+1.570795;
    //player.ship.rotation=rot;
    player.physics.world.wrap(player.ship, 5);
}