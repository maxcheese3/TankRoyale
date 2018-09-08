class Player {
    createPlayer(tankClass, socketID) {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.playerId= socketID;
        this.team = (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue';
        switch(tankClass){
            case "MBT":
                this.type = "MBT";
                this.health = 100;
                this.armour = 50;
                this.armourRegenRate = 2;
                this.damageMultiplier = 1;
                this.speed = 5;
                this.vision = 40;
                this.xp = 0;
                break;
            default:
                this.type = "MBT";
                this.health = 100;
                this.armour = 50;
                this.armourRegenRate = 2;
                this.damageMultiplier = 1;
                this.speed = 5;
                this.vision = 40;
                this.xp = 0;
        }
        return this;
    }
}

module.exports = Player;
// module.exports = {
//     Player: Player
// }