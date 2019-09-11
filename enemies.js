function Enemy(plateau,posX,color,species,direction,keepsToLedge) {
    this.type = "enemy";
    this.keepsToLedge = keepsToLedge;
    this.color = color;
    this.species = species;
    this.plateau = plateau;
    this.frameTextures = [];

    this.liftable = true;

    if (color === "red") {
        this.speed = tileWidth/36;
    } else {
        this.speed = tileWidth/36;
    };

//    this.frameTextures[0] = PIXI.Texture.fromImage("shyguyred1.png");
//    this.frameTextures[1] = PIXI.Texture.fromImage("shyguyred2.png");

    this.blocked = false;
    this.velocity = {x:0,y:0};
    this.plateau = plateau;
    this.standingOn = undefined;
    if (species === "shyGuy") {
        this.legCycleRate = 15;
        this.actualSize = tileWidth;
        if (color === "red") {
            this.speed = tileWidth/36;
            this.frameTextures[0] = PIXI.Texture.fromImage("shyguyred1.png");
            this.frameTextures[1] = PIXI.Texture.fromImage("shyguyred2.png");
        }
        if (color === "blue") {
            this.speed = tileWidth/28;
            this.frameTextures[0] = PIXI.Texture.fromImage("shyguyblue1.png");
            this.frameTextures[1] = PIXI.Texture.fromImage("shyguyblue2.png");
        }
    }
    if (species === "spitter") {
        this.legCycleRate = 15;
        this.bulletSpeed = tileWidth/6;
        this.actualSize = tileWidth;
        if (color === "red") {
            this.speed = tileWidth/36;
            this.frameTextures[0] = PIXI.Texture.fromImage("spitterred1.png");
            this.frameTextures[1] = PIXI.Texture.fromImage("spitterred2.png");
        }
        if (color === "blue") {
            this.speed = tileWidth/28;
            this.frameTextures[0] = PIXI.Texture.fromImage("spitterblue1.png");
            this.frameTextures[1] = PIXI.Texture.fromImage("spitterblue2.png");
        }
        if (color === "gray") {
            this.speed = tileWidth/24
            this.bulletSpeed = tileWidth/5;
            this.frameTextures[0] = PIXI.Texture.fromImage("spittergray1.png");
            this.frameTextures[1] = PIXI.Texture.fromImage("spittergray2.png");
        }

        this.shotDivisor = randomInt(0,99);
        this.shoot = function() {
            var bullet = new Bullet(this);
        }
        this.jump = function() {

            this.velocity.y = -randomInt(22,25);
            this.velocity.x = 2*this.flippedX;


            if (player.standingOn === this) {
                player.velocity.y += 15;
            }
        }
    }
    if (species === "ostrich") {
        this.frameTextures[0] = PIXI.Texture.fromImage("ostrich1.png");
        this.frameTextures[1] = PIXI.Texture.fromImage("ostrich2.png");
        this.actualSize = tileWidth*2;
        this.legCycleRate = 12;
        this.speed = tileWidth/15;
    }
    if (species === "hedgehog") {
        this.frameTextures[0] = PIXI.Texture.fromImage("hedgehog1.png");
        this.frameTextures[1] = PIXI.Texture.fromImage("hedgehog2.png");
        this.actualSize = tileWidth;
        this.legCycleRate = 15;
        this.speed = tileWidth/20;
        this.liftable = false;
    }

    this.sprite = new PIXI.Sprite(this.frameTextures[0]);
    this.sprite.height = this.actualSize;
    this.sprite.width = tileWidth;

    if (direction === "right") {
        this.flippedX = -1;
    } else {
        this.flippedX = 1;
    }


    this.actualWidth = this.sprite.width;
    this.actualSize = this.sprite.height;

    this.sprite.anchor.set(0.5);
    this.sprite.x = (plateau.posX+posX)*tileWidth+(this.sprite.width/2);
    this.sprite.y = (tilesPerHeight-plateau.posY-6)*tileWidth;
    this.sprite.y -= this.actualSize;
    this.sprite.scale.x *= this.flippedX;



    this.beingPickedUp = false;
    this.died = undefined;
    this.dying = false;

    enemies.push(this);
    stage.addChild(this.sprite);

    this.cycleLegs = function(speed) {
        if (counter % speed === 0) {
            if (this.sprite.texture === this.frameTextures[0]) {
                this.sprite.texture = this.frameTextures[1];
            } else {
                this.sprite.texture = this.frameTextures[0]
            }

            this.sprite.scale.x *= this.flippedX;

            if (player.carrying === this && this.sprite.scale.y > 0) {
                this.sprite.scale.y *= -1;
            }
        }
    }
    this.checkForBlockages = function() {
        var blocked = false;
        for (var n=0;n<mushroomBlocks.length;n++) {
            var mBlock = mushroomBlocks[n];
            if (this.standingOn !== mBlock && player.carrying !== mBlock && this.sprite.x-(this.actualWidth/2)+(this.speed*-this.flippedX) < mBlock.sprite.x+(mBlock.actualWidth/2) && this.sprite.x+(this.actualWidth/2)+(this.speed*-this.flippedX) > mBlock.sprite.x-(mBlock.actualWidth/2) && this.sprite.y+(this.actualSize/2) > mBlock.sprite.y && this.sprite.y+(this.actualSize/2) <= mBlock.sprite.y+mBlock.sprite.height) {
                blocked = true;
            }
        }
        for (var p=0;p<posts.length;p++) {
            var post = posts[p];
            if (this.standingOn !== post && this.sprite.y > post.topPiece.y && this.sprite.y-this.sprite.height < post.topPiece.y+(post.topPiece.height*post.floorSpan.span) && this.sprite.x <= post.topPiece.x+tileWidth && this.sprite.x >= post.topPiece.x-tileWidth) {
                if ((this.flippedX === 1 && post.topPiece.x < this.sprite.x) || (this.flippedX === -1 && post.topPiece.x > this.sprite.x) ) {
                    blocked = true;
                }
            }
        }
        this.blocked = blocked;
    }
    this.walk = function() {

        if (this.keepsToLedge && this.standingOn && this.standingOn.type === "plateau" && !this.onStartingPlateau()) {
            this.sprite.scale.x *= -1;
            this.flippedX *= -1;
        }

        this.cycleLegs(this.legCycleRate);
        this.sprite.x += this.speed*-this.flippedX;

//        if (player.standingOn === this) {
//            player.sprite.x += this.speed*player.flippedX;
//        }

        if (counter > 60 && this.species === "spitter") {
            if (counter % 100 === this.shotDivisor) {
                this.shoot();
            }
            if (counter % 100 === Math.round(this.shotDivisor/2)) {
                this.jump();
            };
        }

    }
    this.fly = function() {
//        if (counter-player.threw < 5) {
//            this.sprite.x -= tileWidth/5*this.tossDirection;
//        } else {
        if (!this.blocked) {
            this.sprite.x += tileWidth*(this.velocity.x/48);
        }
        if (this.sprite.scale.y < 0) {
            this.sprite.y -= tileWidth*(this.velocity.y/48);
        } else {
            this.sprite.y += tileWidth*(this.velocity.y/48);
        }
//        if (!this.touchingGround()) {
//            this.applyGravity();
//        }
//        if (this.velocity.x-0.05 >= 0) {this.velocity.x -= 0.05};
        if (this.velocity.y > 0) {
            if (this.velocity.y-1 >= 0) {this.velocity.y -= 1};
        } else {
            if (this.velocity.y+1 <= 0) {this.velocity.y += 1};
        }
//        this.velocity.x -= 0.05;
//        this.velocity.y -= 1;

//        }
    }

    this.onStartingPlateau = function() {
        var onPlateau = false;
        if (this.sprite.x+(this.speed*-this.flippedX) >= this.plateau.floorSpan.startX+(this.actualWidth/2) && this.sprite.x+(this.speed*-this.flippedX) <= this.plateau.floorSpan.startX+(this.plateau.floorSpan.span*tileWidth)-(this.actualWidth/2) && this.sprite.y+gravityStrength >= this.plateau.floorSpan.groundY-this.actualSize/2 && this.sprite.y <= this.plateau.floorSpan.groundY-this.actualSize/2) {
            onPlateau = true;
        }
        return onPlateau;
    }
    this.touchingGround = function() {
        var touching = false;
        for (var p=0;p<plateaus.length;p++) {
            var plat = plateaus[p];
            if (this.sprite.x >= plat.floorSpan.startX && this.sprite.x <= plat.floorSpan.startX+(plat.floorSpan.span*tileWidth) && this.sprite.y+gravityStrength > plat.floorSpan.groundY-this.actualSize/2 && this.sprite.y-gravityStrength < plat.floorSpan.groundY-this.actualSize/2) {
                touching = true;
                if (this.thrown) {
                    this.sprite.scale.y *= -1;
//                    this.flippedY *= -1;
                    this.thrown = false;
                }
                this.sprite.y = plat.floorSpan.groundY-this.actualSize/2;
                this.standingOn = plat;
                this.plateau = plat;
            }

        }
        for (var s=0;s<posts.length;s++) {
            var post = posts[s];
            if (this.sprite.x >= post.topPiece.x-tileWidth && this.sprite.x <= post.topPiece.x+tileWidth && this.sprite.y+gravityStrength >= post.topPiece.y-this.actualSize/2 && this.sprite.y <= post.topPiece.y-this.actualSize/2) {
                touching = true;
                if (this.thrown) {
                    this.sprite.scale.y *= -1;
                    this.flipped *= -1;
                    this.thrown = false;
                }
                player.standingOn = post;
                this.sprite.y = post.topPiece.y-this.sprite.height/2;
                this.standingOn = post;
            }
        }
        for (var m=0;m<mushroomBlocks.length;m++) {
            var mBlock = mushroomBlocks[m];
            if (this.sprite.x+(this.actualWidth/2) >= mBlock.sprite.x-(mBlock.sprite.width/2) && this.sprite.x-(this.actualWidth/2) <= mBlock.sprite.x+(mBlock.sprite.width/2) && this.sprite.y+gravityStrength >= mBlock.sprite.y-this.actualSize/2 && this.sprite.y <= mBlock.sprite.y-this.actualSize/2) {
                touching = true;
                if (this.thrown) {
                    this.sprite.scale.y *= -1;
                    this.flipped *= -1;
                    this.thrown = false;
                }
                this.sprite.y = mBlock.sprite.y-this.sprite.height/2;
                this.standingOn = mBlock;

            }
        }
//        for (var b=0;b<bombs.length;b++) {
//            var bomb = bombs[b];
//            if (this !== bomb && this.sprite.x >= bomb.sprite.x-tileWidth/2 && this.sprite.x <= bomb.sprite.x+tileWidth/2 && this.sprite.y+gravityStrength >= bomb.sprite.y-tileWidth && this.sprite.y <= bomb.sprite.y) {
//                touching = true;
//                this.sprite.y = bomb.sprite.y-tileWidth;
//                this.thrown = false;
//                this.standingOn = bomb;
//            }
//        }
        if (touching) {
            if (this.velocity.x !== 0) {
                this.velocity.x = 0;
            }
            if (this.velocity.y !== 0) {
                this.velocity.y = 0;
            }
        }
        return touching;
    }
    this.applyGravity = function() {
        this.sprite.y += gravityStrength;
    }
    this.die = function() {
        playSound(enemyHitSound);
        this.died = counter;
        this.dying = true;
        if (this.sprite.scale.y > 0) {
            this.sprite.scale.y *= -1;
        };
//        this.sprite.y -= this.actualSize;
        this.velocity.x = 0;
        this.velocity.y = 32;
    }
    this.checkForProjectiles = function() {
        for (var p=0;p<vegetables.length;p++) {
            var veg = vegetables[p];
            if (veg.thrown && !veg.died && this.sprite.x < veg.sprite.x+tileWidth && this.sprite.x > veg.sprite.x-tileWidth && this.sprite.y < veg.sprite.y+veg.sprite.height && this.sprite.y > veg.sprite.y-this.sprite.height) {
                this.die();
                veg.velocity.x = 0;
                veg.velocity.y = 24;
                veg.died = counter;
            }
        }
        for (var n=0;n<enemies.length;n++) {
            var enemy = enemies[n];
            if (this !== enemy && enemy.thrown && !enemy.died && this.sprite.x < enemy.sprite.x+tileWidth && this.sprite.x > enemy.sprite.x-tileWidth && this.sprite.y < enemy.sprite.y+enemy.actualSize/2 && this.sprite.y > enemy.sprite.y-this.actualSize/2) {
                this.die();
                enemy.die();
            }
        }
        for (var m=0;m<mushroomBlocks.length;m++) {
            var mBlock = mushroomBlocks[m];
            if (mBlock.thrown && this.sprite.x+(this.actualWidth/2) >= mBlock.sprite.x-tileWidth/2 && this.sprite.x-(this.actualWidth/2) <= mBlock.sprite.x+tileWidth/2 && this.sprite.y+(this.actualSize/2) >= mBlock.sprite.y-mBlock.sprite.height/2 && this.sprite.y-(this.actualWidth/2) <= mBlock.sprite.y+(mBlock.sprite.height/2)) {
                this.die();

            }
        }
        for (var e=0;e<explosionSprites.length;e++) {
            var explosion = explosionSprites[e];
            if (this.sprite.x < explosion.x+explosion.width/2+this.actualSize/2 && this.sprite.x > explosion.x-explosion.width/2-this.actualSize/2 && this.sprite.y < explosion.y+explosion.height/2+this.actualSize/2 && this.sprite.y > explosion.y-explosion.width/2-this.actualSize/2) {
                this.die();
            }
        }
    }

}
function Egg(home,posX,posY) {
    this.home = home
    this.textureSheet = eggSheet.clone();
    this.currentFrame = 0;
    this.textureSheet.frame = new PIXI.Rectangle(0, 0, 32, 32);
    this.sprite = new PIXI.Sprite(this.textureSheet);
    this.sprite.anchor.x = 0.5
    this.sprite.anchor.y = 1
    this.sprite.width = this.sprite.height = tileWidth*2
    this.range = tileWidth*4
    this.opening = false
    this.opened = false
    this.onFire = 0
    this.flames = []
    this.hp = this.maxHP = 500
    this.maxFlames = 5
    this.damageSkins = []
    this.burned = 0
    this.flammable = true
    eggs.push(this)
    if (home.type==="plateau") {
        this.sprite.x = home.floorSpan.startX+(posX*tileWidth)
        this.sprite.y = home.floorSpan.groundY // always on ground
        console.log("egg placed " + this.sprite.x + " , " + this.sprite.y)
    }
    if (home.type==="cave") {
        home.eggs.push(this)
        this.sprite.x = home.posX+(posX*tileWidth)
        this.sprite.y = (home.posY+(home.screensHigh*viewHeight)-viewHeight)-(posY*tileWidth)
        console.log("cave egg placed " + this.sprite.x + " , " + this.sprite.y)
    }
    home.container.addChildAt(this.sprite,home.container.children.length)
    this.centerPoint = {x:this.home.container.x+this.sprite.x,y:this.home.container.y+this.sprite.y-(this.sprite.height/2.4)}
    // stage.addChild(this.sprite)
    this.changeFrame = function(targetFrame) {
        this.currentFrame = targetFrame
        this.textureSheet.frame = new PIXI.Rectangle(this.currentFrame*32, 0, 32, 32);
    }
    this.open = function() {
        if (mod(6)) {
            var newFrame = this.currentFrame+1
            if (newFrame <= 4) {
                this.changeFrame(newFrame)
            } else {
                this.opening = false
                this.opened = true
            }
        }
    }
    this.listenForPlayer = function() {
        var actualX = home.container.x+this.sprite.x
        var actualY = home.container.y+this.sprite.y
        var xDiff = Math.abs(player.sprite.x-actualX)
        var yDiff = Math.abs((player.sprite.y-(player.sprite.height/2))-(actualY-(this.sprite.height/2)))


        if (!this.opening && !this.opened && xDiff < this.range && yDiff < this.range) {
            this.opening = true
            // this.home.container.visible = true
        }
    }
    this.burn = function(intensity) {
        for (var f=0;f<intensity;f++) {
            var randSize = (tileWidth/2)+(randomInt(-1,2)*(tileWidth/64))
            var flame = new Flame(randSize,8)
            var randAngle = randomInt(0,359)
            var randDist = randomInt(-this.sprite.width/2.75,this.sprite.height/2.75)
            var spot = pointAtAngle(this.centerPoint.x,this.centerPoint.y,randAngle,randDist)
            flame.fireTime = counter
            flame.sprite.x = spot.x
            flame.sprite.y = spot.y
            this.flames.push(flame)
            stage.setChildIndex(flame.sprite,stage.children.length-1)
            
        }
        this.damage(Math.ceil(intensity/10))
        this.burned += intensity
        if (!this.dead && this.burned > 500) {
            this.sprite.tint = 0x999999
        }
        // if (!this.dead) {
        //     var alphaLevel = (this.hp/this.maxHP)
        //     this.sprite.alpha = alphaLevel
        // }
        
    }
    this.damage = function(amount) {
        
        if (this.hp-amount >= 0) {
            this.hp -= amount
        } else {
            this.hp = 0
            console.log("DEAD NOW")
            this.dead = true
            if (this.onFire) {
                this.onFire = 0
                this.sprite.texture = burntEggText
            } else {
                this.sprite.texture = cutEggText
                if (randomInt(0,1)) {
                    this.sprite.scale.x *= -1
                }
            }
            
            // this.sprite.visible = false
        }
    }
    this.birth = function() {

    }
}
function Facehugger(home,homeEgg,posX,posY) {
    this.textureSheet = facehuggerSheet.clone();
    this.currentFrame = 0;
    this.textureSheet.frame = new PIXI.Rectangle(0, 0, 32, 16);
    this.sprite = new PIXI.Sprite(this.textureSheet);
    this.sprite.anchor.x = 0.5
    this.sprite.anchor.y = 0.5
    this.sprite.width = tileWidth*2
    this.sprite.height = tileWidth
    this.home = home
    this.homeEgg = homeEgg
    this.sprungAt = undefined
    this.velocity = {x:0,y:0}
    this.maxX = 10
    this.maxY = 10
    this.speed = (tileWidth/64)
    if (home.type==="plateau") {   
        this.sprite.x = home.floorSpan.startX+(posX*tileWidth)
        this.sprite.y = home.floorSpan.groundY // always on ground
        // console.log("FH placed " + this.sprite.x + " , " + this.sprite.y)
    }
    if (home.type==="cave") {
        this.sprite.x = home.posX+(posX*tileWidth)
        this.sprite.y = (home.posY+(home.screensHigh*viewHeight)-viewHeight)-(posY*tileWidth)-(this.sprite.height/2)-(tileWidth*11)
    }
    this.previousPosition = {x:this.sprite.x,y:this.sprite.y}
    home.container.addChildAt(this.sprite,home.container.children.length-1)
    // stage.addChild(this.sprite)
    aliens.push(this)

    

    this.changeFrame = function(targetFrame) {
        this.currentFrame = targetFrame
        this.textureSheet.frame = new PIXI.Rectangle(this.currentFrame*32, 0, 32, 16);
    }
    this.cycleLegs = function() {
        if (mod(5)) {
            var newFrame = this.currentFrame+1
            if (newFrame <= 3) {
                this.changeFrame(newFrame)
            } else {
                this.changeFrame(0)
            }
        }
    }
    this.spring = function() {
        this.sprungAt = counter
    }
    this.run = function(direction) {
        if (direction > 0 && this.sprite.scale.x < 0) {
            this.sprite.scale.x *= -1
        }
        if (direction < 0 && this.sprite.scale.x > 0) {
            this.sprite.scale.x *= -1
        }
        if (Math.abs(this.velocity.x+direction) <= this.maxX) {
            this.velocity.x += direction
        }
        // this.sprite.x += this.speed*direction
        this.cycleLegs()
    }
    this.placeInEgg = function() {
        this.sprite.rotation -= degToRad(45)
        this.changeFrame(4)
        this.sprite.x = this.homeEgg.sprite.x
        this.sprite.y = this.homeEgg.sprite.y-(this.homeEgg.sprite.height/4)
        this.previousPosition = {x:this.sprite.x,y:this.sprite.y}
        
    }
    this.touchingGround = function() {
        var touching = false;
        if (this.home.type==="cave") {
            var vis = 0
            for (var p=0;p<plateaus.length;p++) {
                var plat = plateaus[p]
                if (plat.container.visible) {
                    var centerDistanceX = Math.abs((plat.floorSpan.startX+(plat.container.width/2))-this.sprite.x)
                    // console.log("gr " + plat.floorSpan.groundY)
                    var floorDistance = (plat.floorSpan.groundY-(this.sprite.y))
                    // console.log("dist " + p + " " + floorDistance)
                    if (centerDistanceX < (plat.container.width/2) &&
                        floorDistance < 0 && floorDistance >= -(this.sprite.height/2)-(this.velocity.y*(tileWidth/64))) {
                        this.sprite.y = plat.floorSpan.groundY-(this.sprite.height/2)
                        this.sprite.tint = 0x00ff00
                        touching = true
                        this.velocity.y = 0
                        // console.log("HIT GROUND!!")
                    } else {
                        this.sprite.tint = 0xff0000
                        // console.log("dist " + floorDistance)
                    }
                }
            }
            
        } else {
            for (var p=0;p<plateaus.length;p++) {
                var plat = plateaus[p];
                if (this.sprite.x >= plat.floorSpan.startX && this.sprite.x <= plat.floorSpan.startX+(plat.floorSpan.span*tileWidth) && this.sprite.y+gravityStrength > plat.floorSpan.groundY-this.actualSize/2 && this.sprite.y-gravityStrength < plat.floorSpan.groundY-this.actualSize/2) {
                    touching = true;
                    if (this.thrown) {
                        this.sprite.scale.y *= -1;
    //                    this.flippedY *= -1;
                        this.thrown = false;
                    }
                    this.sprite.y = plat.floorSpan.groundY-this.actualSize/2;
                    this.standingOn = plat;
                    this.plateau = plat;
                }

            }
            for (var s=0;s<posts.length;s++) {
                var post = posts[s];
                if (this.sprite.x >= post.topPiece.x-tileWidth && this.sprite.x <= post.topPiece.x+tileWidth && this.sprite.y+gravityStrength >= post.topPiece.y-this.actualSize/2 && this.sprite.y <= post.topPiece.y-this.actualSize/2) {
                    touching = true;
                    if (this.thrown) {
                        this.sprite.scale.y *= -1;
                        this.flipped *= -1;
                        this.thrown = false;
                    }
                    player.standingOn = post;
                    this.sprite.y = post.topPiece.y-this.sprite.height/2;
                    this.standingOn = post;
                }
            }
            for (var m=0;m<mushroomBlocks.length;m++) {
                var mBlock = mushroomBlocks[m];
                if (this.sprite.x+(this.actualWidth/2) >= mBlock.sprite.x-(mBlock.sprite.width/2) && this.sprite.x-(this.actualWidth/2) <= mBlock.sprite.x+(mBlock.sprite.width/2) && this.sprite.y+gravityStrength >= mBlock.sprite.y-this.actualSize/2 && this.sprite.y <= mBlock.sprite.y-this.actualSize/2) {
                    touching = true;
                    if (this.thrown) {
                        this.sprite.scale.y *= -1;
                        this.flipped *= -1;
                        this.thrown = false;
                    }
                    this.sprite.y = mBlock.sprite.y-this.sprite.height/2;
                    this.standingOn = mBlock;

                }
            }
    //        for (var b=0;b<bombs.length;b++) {
    //            var bomb = bombs[b];
    //            if (this !== bomb && this.sprite.x >= bomb.sprite.x-tileWidth/2 && this.sprite.x <= bomb.sprite.x+tileWidth/2 && this.sprite.y+gravityStrength >= bomb.sprite.y-tileWidth && this.sprite.y <= bomb.sprite.y) {
    //                touching = true;
    //                this.sprite.y = bomb.sprite.y-tileWidth;
    //                this.thrown = false;
    //                this.standingOn = bomb;
    //            }
    //        }
            if (touching) {
                if (this.velocity.x !== 0) {
                    this.velocity.x = 0;
                }
                if (this.velocity.y !== 0) {
                    this.velocity.y = 0;
                }
            }
        }
        
        return touching;
    }
    this.applyVelocity = function() {
        this.sprite.x += this.velocity.x*this.speed
        this.sprite.y -= this.velocity.y*(tileWidth/64)

        
    }
    this.applyGravity = function() {
        this.sprite.y += gravityStrength
        // if (this.velocity.y > -this.maxY) {
        //     this.velocity.y--
        // }
    }
    this.hop = function() {
        this.velocity.y = this.maxY
    }
    if (homeEgg) {
        // this.placeInEgg()
    }
}
