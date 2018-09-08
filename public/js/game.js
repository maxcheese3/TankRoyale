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

var updateLimiter = new Boolean(true);

//////////////////////////////////////////////
//CREATE FUNCTION/////////////////////////////
//////////////////////////////////////////////
function create() {
  var self = this;
  self.players = {};
  self.playersSrpites = {};
  this.socket = io();

    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(0, 0, 2100, 1400);
    this.physics.world.setBounds(0, 0, 2100, 1400);

    //  Mash 4 images together to create our background
    this.add.image(0, 0, 'bg').setOrigin(0);
    //this.add.image(1920, 0, 'bg').setOrigin(0).setFlipX(true);
    //this.add.image(0, 1080, 'bg').setOrigin(0).setFlipY(true);
    //this.add.image(1920, 1080, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

    //this.cameras.main.startFollow(self.ship, true, 0.05, 0.05);


  this.socket.on('heartbeat', function (serverPlayers) {
    //Update list of players from server list of players
    //console.log(self.players[self.socket.id]);
    if ( typeof self.players[self.socket.id] === 'undefined'){
      addPlayer(self, serverPlayers[self.socket.id]);
      console.log("added myself");
    }
    self.players = serverPlayers;
    
    //check to make sure every player has a ship physics sprite
    Object.keys(self.playersSrpites).forEach(function (sprite) {
      self.playersSrpites[sprite].destroy();
    });
    self.playersSrpites = {};
    Object.keys(self.players).forEach(function (player) {
          if (player !== self.socket.id){
            self.playersSrpites[player] = self.add.sprite(self.players[player].x, self.players[player].y, "ship").setOrigin(0.5, 0.5).setDisplaySize(53, 40).setAngle(self.players[player].angle);
          }
        //textAlign(CENTER);
        //textSize(4);
        //text(player.playerID, player.x, player.y);
      });
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
    var r = this.ship.angle;
    if (this.ship.oldPosition && updateLimiter && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.angle)) {
      this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, angle: this.ship.angle });
      console.log("I'm moving", self.playerId);

    }
    updateLimiter = !updateLimiter;
    console.log(updateLimiter);
    // save old position data
    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      angle: this.ship.angle
    };
  }
}

//////////////////////////////////////////////
//OTHER FUNCTIONS/////////////////////////////
//////////////////////////////////////////////
function addPlayer(self, playerInfo) {
  self.ship = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  // if (playerInfo.team === 'blue') {
  //   //self.ship.setTint(0x000044);
  // } else {
  //   //self.ship.setTint(0x440000);
  // }

  self.ship.setDrag(800);
  self.ship.setAngularDrag(200);
  self.ship.setMaxVelocity(200);
  self.ship.setFriction(1000); 
  self.ship.setCollideWorldBounds(true);
  self.cameras.main.startFollow(self.ship, true, 0.05, 0.05);
  self.players[self.socket.id] = self;
}

function addOtherPlayer(self, player) {
  console.log("adding other player");
  //this.ship =self.add.sprite(player.x, player.y, player.playerID).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  //this.players[player.playerID] = new Player();

}

function checkInput(player){
  //Keyboard detection
    //CASE: A
    if (player.wasd.left.isDown || player.cursors.left.isDown) {
      player.ship.body.setVelocityX(player.ship.body.velocity.x-15);
      player.ship.angle=270;
    }
    //CASE: D
    if (player.wasd.right.isDown || player.cursors.right.isDown) {
      player.ship.body.setVelocityX(player.ship.body.velocity.x+15);
      player.ship.angle=90;
    }  
     //CASE: W
    if (player.wasd.up.isDown || player.cursors.up.isDown) {
      player.ship.body.setVelocityY(player.ship.body.velocity.y-15);
      player.ship.angle=0;
    } 
    //CASE: S
    if (player.wasd.down.isDown || player.cursors.down.isDown){
      player.ship.body.setVelocityY(player.ship.body.velocity.y+15);
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
    player.physics.world.wrap(player.ship, 5);
}