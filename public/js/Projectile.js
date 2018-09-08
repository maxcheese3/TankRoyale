class Projectile {
    createProjectile(projectileType, socketID) {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.playerId= socketID;
        this.team = (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue';
        switch(projectileType){
            case "Cannon":
                this.damage = 40;
                this.clip = 1;
                this.rate = 0;
                this.reload = 0.75
                this.range = 40;
                this.speed = 30;
                this.accuracy = .9;
                break;
            default:
                this.damage = 40;
                this.clip = 1;
                this.rate = 0;
                this.reload = 0.75
                this.range = 40;
                this.speed = 30;
                this.accuracy = .9;
        }
        return this;
    }
}

module.exports = Player;
// module.exports = {
//     Player: Player
// }