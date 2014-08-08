var Enemy = function(manager, spriteName, x, y, hp) {
	this.manager = manager;
	this.HP = hp;
	//add sprite
	this.sprite = game.add.sprite(x, y, spriteName);
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.anchor.set(0.5);
	this.sprite.body.allowRotation = false;
	this.sprite.owner = this;

	//bullet
	this.bullet = new EnemyBullet('enemylaser', this, null);

	this.sprite.body.velocity.y = 100;
	
	
};

Enemy.prototype = {

	constructor: Enemy,
	
	update: function() {
		if (this.sprite.y > h){
			this.manager.kill(this.sprite);
		}
		
		//this.bullet.fire();
	},
	
	changeBoundSize: function(wRatio, hRatio) {
		this.sprite.body.setSize(this.sprite.width*wRatio, this.sprite.height*hRatio, 0, 0);
	},
};

var EnemyManager = function(player) {
	this.player = player;
	this.sprites = game.add.group();
	this.sprites.enableBody = true;
    this.sprites.physicsBodyType = Phaser.Physics.ARCADE;
	
	// Collsion Handler
	this.collsionManager = new CollisionManager();
};

EnemyManager.prototype = {	

	constructor: EnemyManager,

	update: function(player) {
		this.sprites.forEach(function(enemy){
			if(enemy){
				enemy.owner.update();
				enemy.owner.bullet.update(player);
				enemy.owner.bullet.fire(player);
				
			}
		});
		game.physics.arcade.overlap(player.sprite, this.sprites, this.playerHitEnemy, null, this);
		
	},

	playerHitEnemy: function(player, enemy){
		this.collsionManager.playerEnemyCollision(player, enemy);
		this.kill(enemy);
	},

	kill: function(enemy) {
		if (enemy) {
			enemy.kill();
			this.sprites.remove(enemy);
		}
	},

	add: function(enemyNumber, x, y) {
		var enemy = new Enemy(this, 'enemy' + enemyNumber, x, y, enemyNumber);
		this.sprites.add(enemy.sprite);
	},

};


var CollisionManager = function() {
	this.playerEnemyCollision = function(player, enemy) {
		// do something here
	}
	
	this.playerEnemyBulletCollision = function(player, bullet) {
		bullet.kill();
	}
	
	this.playerBulletEnemyCollision = function(bullet, enemy) {
		bullet.kill();
		enemy.owner.HP--;
	}
}