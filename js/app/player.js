/**
 * This class define a Player Object
 * @param {type} player_data
 * @param {type} lives
 * @returns {Player}
 */
define(['app/structure3d','app/bullet'],function(Structure3d,Bullet){
function Player(player_data,lives,speed,game){
    this.lives=lives;
    this.speed = speed;
    this.game = game;
    this.bullets = new Array();
    this.direction = [0,1,0]; //pointing to y (Player direction)
    this.score = 0;
    this.can_fire = true;
    this.killable = true;

    Structure3d.call(this,player_data);
    this.rotation.z += -90* Math.PI / 180;
    this.scale.set(4,4,4);
    
         // Keyboard :  change state of player. 
    var wasPressed = {};
    var that = this;
    that.game.keyboard.domElement.addEventListener('keydown', function (event) {
        if (that.game.keyboard.eventMatches(event, 'i') && !wasPressed['i']) {
            wasPressed['i'] = true;
            that.killable = !that.killable;
            document.getElementById("killable").innerHTML = that.killable;

        }
    });
    // listen on keyup to maintain ```wasPressed``` array
    that.game.keyboard.domElement.addEventListener('keyup', function (event) {
        if (that.game.keyboard.eventMatches(event, 'i')) {
            wasPressed['i'] = false;
        }
    });
};

// Create a Player.prototype object that inherits from Structure3d.prototype
Player.prototype = Object.create(Structure3d.prototype);
// Set the "constructor" property to refer to Player
Player.prototype.constructor = Player;


Player.prototype.fire = function() {
    if(this.can_fire){
         console.log("-> player.fire()");
        this.can_fire=false;
        var tmp_bullet = new Bullet(bullet_data,15,this);
        tmp_bullet.position.set(this.position.x+(this.height*2),this.position.y,this.position.z);
        this.game.add(tmp_bullet);
        this.bullets.push(tmp_bullet);
        
        var that = this;    //setTimeOut use the global scope so the keyword this need to be changed
        setTimeout(function () {
                that.can_fire = true;
            }, 500);
            
    console.log("<- player.fire()");
    }
};


Player.prototype.move = function(direction) {
  console.log("-> player.move()");
        this.position.x +=(direction[0]*this.speed);
        this.position.y +=(direction[1]*this.speed);
        this.position.z +=(direction[2]*this.speed);
  console.log("-> player.move()");

};

Player.prototype.destroyBullet = function(bullet){
    var i = this.bullets.indexOf(bullet);
    this.game.remove(this.bullets[i]);
    console.log(this.bullets);
    this.bullets.splice(i, 1);
    console.log(this.bullets);
};

Player.prototype.moveBullets = function() {
    for (var i=0; i< this.bullets.length ; i++){
        this.bullets[i].move(this.direction);
        if(this.bullets[i] && this.bullets[i].position.y >= max_height ){
            console.log("removing");
            this.destroyBullet(this.bullets[i]);
        }
    }
};

Player.prototype.clearBullets = function (){
    while(this.bullets.length > 0){
                this.destroyBullet(this.bullets[this.bullets.length-1]);
        }
};
    return Player;
});

