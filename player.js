function Player(posX,posY) {
    this.approachingNPC = undefined
    this.weapon = undefined
    this.textureSheet = toadSheet1;
    this.crouchSheet = crouchSheet;
    this.crouchFrame = 0;
    this.currentFrame = 0;
    this.textureSheet.frame = new PIXI.Rectangle(this.currentFrame, 0, 48, 81);
    this.crouchSheet.frame = new PIXI.Rectangle(this.crouchFrame, 0, 48, 48);
    this.sprite = new PIXI.Sprite(this.textureSheet);
    this.crouchSprite = new PIXI.Sprite(this.crouchSheet);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.WHRatio = this.sprite.width/this.sprite.height;
    this.sprite.width = this.origWidth = Math.ceil(tileWidth);
    this.actualWidth = this.sprite.width;
    this.sprite.height = this.origHeight = this.sprite.width/this.WHRatio;
    this.sprite.x = posX
//    this.sprite.y = plateau1.floorSpan.groundY;
    this.sprite.y = posY
    this.standingHeight = this.sprite.height;
    this.speed = tileWidth/18;
    this.origSpeed = this.speed;
    // this.runSpeed = tileWidth/12;
    this.runSpeed = tileWidth/4;
    this.striding = "right";
    this.flippedX = -1;
    this.flippedY = 1;
    this.sprite.scale.x *= this.flippedX;
    this.crouching = false;
    this.climbing = false;
    // this.velocity = {x:0,y:0,maxX:48,maxY:15};
    this.velocity = {x:0,y:0,maxX:48,maxY:16};
    this.lastVelocity = this.velocity;
    this.lastPosition = {x:this.sprite.x,y:this.sprite.y};
    this.lastJumped = -99;
    this.lastPlucked = -99;
    this.grabbedVine = -99;
    this.inertiaX = 3;
    this.legCycleRate = 6;
    this.chargeTime = 60;
    this.pluckTime = 7;
    this.uprootTime = 7;
    this.beganPluck = -99;
    this.plucking = undefined;
    this.threw = -99;
    this.crouchCharge = 0;
    this.leapChargeBonus = 9;
    this.carryingSpot = this.sprite.height*1.4;
    this.blocked = false;
    this.doorEntered = undefined
    this.cave = undefined
    this.lastDoorwayPos = {x:0,y:0}

    this.immune = false;
    this.hearts = 2;

    this.coins = 2000

    this.hit = -99;

    this.turrets = [];

    this.standingOn = undefined;

    this.carrying = undefined;

    this.area = "Overworld"

    stage.addChild(this.sprite);

    this.screenPosition = function() {
        var actualX = (this.sprite.x)+stage.x;
        var actualY = (this.sprite.y)+stage.y;
        return {x:actualX,y:actualY};
    }
    this.updateCoinCount = function() {
        // heartDisplay.coinCount.text = "$"+this.coins
        $("#coins").html("$"+this.coins)
    }
    this.changeFrame = function(targetFrame) {
        
        if (!player.crouching) {
            this.textureSheet.frame = new PIXI.Rectangle(targetFrame*49, 0, 48, 81);
        } else {
            this.crouchSheet.frame = new PIXI.Rectangle(targetFrame*49, 0, 48, 48);
        }
        this.currentFrame = targetFrame
    }

    this.screenOccupying = function() {
        var screenX = Math.floor(this.sprite.x/tileWidth/tilesPerWidth);
        var screenY = Math.floor((this.sprite.y-this.sprite.height/2)/tileWidth/tilesPerHeight);
        return {x:screenX,y:screenY};
    }

    this.placeCargo = function() {
        if (this.carrying) {
        if (this.carrying.type === "enemy" && this.carrying.species !== "ostrich") {
            this.carrying.sprite.y = (this.sprite.y-this.carryingSpot)-(this.carrying.sprite.height/2);
        } else {
            this.carrying.sprite.y = this.sprite.y-this.carryingSpot;
        }
        };
    }

    this.enterVehicle = function(vehicle) {
        this.vehicle = vehicle
        this.sprite.x = vehicle.cockpit().x
        this.sprite.y = vehicle.cockpit().y
    }

    this.toppedClimbable = function() {
        if (this.climbing) {
            return this.sprite.y === this.climbing.topAttached.floorSpan.groundY;
        };
    }

    this.reactToHit = function(hittingSprite) {
        playSound(playerDamageSound);

        this.immune = true;
        this.hit = counter;
        if (this.velocity.y === 0) {
            this.velocity.y += 12;
        };
        if ((player.flippedX)*(player.sprite.x-hittingSprite.x) > 0) {
            this.velocity.x = 12*this.flippedX;
        } else {
            this.velocity.x = -12*this.flippedX;
        }
        this.hearts--;
        heartDisplay.change(this.hearts)
    }

    this.cycleLegs = function() {
        var prevFrame = this.currentFrame;
        if (!this.carrying) {
            var startingFrame = 0;
            var endingFrame = 2;
        } else {
            var startingFrame = 3;
            var endingFrame = 5;
        }
        if (this.striding === "right") {
            if (this.currentFrame < endingFrame) {
                this.currentFrame++;
            } else {
                this.currentFrame--;
                this.striding = "left";
            }
        } else {
            if (this.currentFrame > startingFrame) {
                this.currentFrame--;
                this.textureSheet.frame = new PIXI.Rectangle(this.currentFrame*49, 0, 48, 81);
            } else {
                this.currentFrame++;
                this.striding = "right";
            }
        }
        if (this.currentFrame === 8) {
            this.currentFrame = startingFrame;
        }
        if (this.currentFrame === 5 && !player.carrying) {
            this.currentFrame = 0;
        }
        if (!player.crouching) {
            this.textureSheet.frame = new PIXI.Rectangle(this.currentFrame*49, 0, 48, 81);
        }
    }

    this.checkForCherries = function() {
        for (var c=0;c<cherries.length;c++) {
            var cherry = cherries[c];
            var cherryX = cherry.plat.container.x+cherry.sprite.x
            var cherryY = cherry.plat.container.y+cherry.sprite.y

            if (this.sprite.y > cherryY && this.sprite.y < cherryY+tileWidth+this.sprite.height && this.sprite.x < cherryX+tileWidth/2 && player.sprite.x > cherryX-tileWidth/2) {
                playSound(cherrySound);
                cherries.splice(c,1);
                cherry.plat.container.removeChild(cherry.sprite);
                if (this.jetpack) {
                    if (this.jetpack.fuel+100 <= this.jetpack.maxFuel) {
                        this.jetpack.fuel += 100
                    } else {
                        this.jetpack.fuel = this.jetpack.maxFuel
                    }
                    this.jetpack.updateGasMeter()  
                }
            }
        }
    }
    this.checkForBlockages = function() {
        var blocked = false;
        if (player.cave) {
            var cave = player.cave
            for (var b=0;b<cave.earthBlocks.length;b++) {
                
                var block = cave.earthBlocks[b]
                var blockX = cave.posX+block.sprite.x
                var blockY = cave.posY+block.sprite.y
                
                if (this.standingOn !== block && this.sprite.y > blockY && this.sprite.y < blockY+block.sprite.height+this.sprite.height && this.sprite.x-(this.actualWidth/2) <= blockX+block.sprite.width && this.sprite.x >= blockX-(this.actualWidth/2)) {
                    if ((this.flippedX === 1 && blockX < this.sprite.x) || (this.flippedX === -1 && blockX > this.sprite.x) ) {
                        blocked = true;
                        // block.sprite.tint = 0x00ff00
                    }
                }
            }
        }
        for (var p=0;p<plateaus.length;p++) {
            var plat = plateaus[p];
            if (plat.container.visible && plat.solid && this.standingOn !== plat && this.sprite.x+(this.speed*(this.velocity.x/10)) >= plat.leftTop.x-this.actualWidth/2 && this.sprite.x+(this.speed*(this.velocity.x/10)) <= plat.rightTop.x+tileWidth+this.actualWidth/2 && this.sprite.y > plat.floorSpan.groundY) {
                blocked = true;

            }
        }
        for (var n=0;n<mushroomBlocks.length;n++) {
            var block = mushroomBlocks[n];
            if (this.carrying !== block && this.standingOn !== block && this.sprite.y > block.sprite.y && this.sprite.y < block.sprite.y+block.sprite.height+this.sprite.height && this.sprite.x <= block.sprite.x+tileWidth && this.sprite.x >= block.sprite.x-tileWidth) {
                if ((this.flippedX === 1 && block.sprite.x < this.sprite.x) || (this.flippedX === -1 && block.sprite.x > this.sprite.x) ) {
                    blocked = true;
                }
            }
        }
        for (var p=0;p<posts.length;p++) {
            var post = posts[p];
//            if (this.standingOn !== post && this.sprite.y > post.topPiece.y && this.sprite.y-this.sprite.height < post.topPiece.y+(post.topPiece.height*post.floorSpan.span) && this.sprite.x+(this.speed*(this.velocity.x/10)) <= post.topPiece.x+tileWidth && this.sprite.x+(this.speed*(this.velocity.x/10)) >= post.topPiece.x-tileWidth) {
            if (this.standingOn !== post && this.sprite.y > post.topPiece.y && this.sprite.y-this.sprite.height < post.topPiece.y+(post.topPiece.height*post.floorSpan.span) && this.sprite.x <= post.topPiece.x+tileWidth && this.sprite.x >= post.topPiece.x-tileWidth) {
                if ((this.flippedX === 1 && post.topPiece.x < this.sprite.x) || (this.flippedX === -1 && post.topPiece.x > this.sprite.x) ) {
                    blocked = true;
                }
            }
        }

        this.blocked = blocked;
    }
    this.checkForEnemies = function() {
        for (var n=0;n<enemies.length;n++) {
            var enemy = enemies[n];
            if (enemy.velocity.y === 0 && !enemy.died && counter-this.threw > 15 && this.carrying !== enemy && this.standingOn !== enemy && player.sprite.y > enemy.sprite.y && this.sprite.y < enemy.sprite.y+enemy.sprite.height+this.sprite.height && this.sprite.x < enemy.sprite.x+tileWidth && this.sprite.x > enemy.sprite.x-tileWidth) {
                this.reactToHit(enemy.sprite);
            }
        }
        for (var b=0;b<bullets.length;b++) {
            var bullet = bullets[b];
            if (this.sprite.y > bullet.sprite.y && this.sprite.y < bullet.sprite.y+bullet.sprite.height+player.sprite.height && this.sprite.x < bullet.sprite.x+bullet.sprite.width/2 && this.sprite.x > bullet.sprite.x-bullet.sprite.width/2) {
                this.reactToHit(bullet.sprite);
                bullets.splice(b,1);
                stage.removeChild(bullet.sprite);
            }
        }
        for (var e=0;e<explosionSprites.length;e++) {
            var explosion = explosionSprites[e];
            if (this.sprite.x < explosion.x+explosion.width && this.sprite.x > explosion.x-explosion.width && this.sprite.y < explosion.y+explosion.height/2+this.sprite.height && this.sprite.y > explosion.y-explosion.height/2) {
                this.reactToHit(explosion);
            }
        }
    }
    this.leap = function(power) {
        if (player.charged) {
            this.velocity.y = this.velocity.maxY+this.leapChargeBonus;

            player.crouchCharge = 0;
            player.crouchFrame = 0;
            player.changeFrame(player.crouchFrame);
            player.charged = false;
            player.crouching = false;
            if (player.turrets.length > 0 || player.carrying) {
                player.placeCargo();
            }
            player.sprite.texture = player.textureSheet;
            player.changeFrame(player.currentFrame);
            player.sprite.height = player.standingHeight;
            player.sprite.scale.x *= player.flippedX;
        } else {
            if (!power) {
                this.velocity.y = this.velocity.maxY;
            } else {
                this.velocity.y = power;
            }
        }
        if (player.climbing) {
            player.climbing = false;
        }
        this.lastJumped = counter;
    }
    this.land = function() {
        this.velocity.y = 0;
        if (!this.carrying) {
            this.currentFrame = 0;
        } else {
            this.currentFrame = 3;
        }
        this.changeFrame(this.currentFrame);
    }
    this.applyGravity = function() { // changes velocity according to its history (reverses at apex)
        this.sprite.y += gravityStrength;
        if (this.carrying) {
            this.carrying.sprite.y += gravityStrength;
        }
        if (player.turrets.length > 0) {
            player.turrets[0].container.y += gravityStrength;
        }
    }

    this.pluckGrass = function(tuft) {
        if (pressedBAt === counter || rightClicked === counter) {
            playSound(pluckSound);
            this.currentFrame = 8;
            this.changeFrame(this.currentFrame)
            this.beganPluck = counter;
            tuft.beingPlucked = true;
            this.plucking = tuft;
            this.standingOn = undefined;
        } else if (counter-this.beganPluck === this.pluckTime) {
            this.plucking.giveUpContents();
            this.carrying = this.plucking.fruit;
            this.carrying.sprite.x = this.sprite.x;
//            this.placeCargo();
            this.carrying.sprite.y = this.sprite.y-(this.carryingSpot*0.3);
            this.plucking = undefined;
            this.lastPlucked = counter;
//            this.land();
            tuft.beingPlucked = false;
            tufts.splice(tufts.indexOf(tuft),1);
            tuft.owner.container.removeChild(tuft.sprite);
        }

    }

    this.liftBlock = function(block) {
        if (pressedBAt === counter || rightClicked === counter) {
            playSound(pluckSound);

            stage.removeChild(block.sprite);
            stage.addChild(block.sprite);
//            player.carrying = block;
            this.standingOn = undefined;
            this.currentFrame = 8;
            this.changeFrame(this.currentFrame)
            this.beganPluck = counter;
            this.plucking = block;
//            this.sprite.x = this.plucking.sprite.x;
        } else if (counter-this.beganPluck === this.pluckTime) {
            this.carrying = block;
            if (this.carrying.type === "enemy") {
                this.carrying.sprite.scale.y *= -1;
                this.carrying.flippedY *= -1;
                this.carrying.sprite.y = this.sprite.y+(this.carrying.sprite.height/2);
            } else {
                this.carrying.sprite.y = this.sprite.y+(this.carrying.sprite.height/2);
            }

            this.carrying.sprite.x = this.sprite.x;

            this.plucking = undefined;
            this.lastPlucked = counter;
        }

    }

    this.standingOnTuft = function() {
        var onTuft = undefined;
        for (var t=0;t<tufts.length;t++) {
            var tuft = tufts[t];
//            if (player.standingOnGround()) {
                if (player.sprite.y === tuft.sprite.y && player.sprite.x >= tuft.sprite.x && player.sprite.x <= tuft.sprite.x+tuft.sprite.width) {
                    onTuft = tuft;
                }
//            }
        }
        return onTuft;

    }
    this.standingByVine = function() {
        var byVine = undefined;
        for (var v=0;v<climbables.length;v++) {
            var vine = climbables[v];
            if (vine.container.visible) {
                if (!player.carrying && player.sprite.y <= vine.base.y && player.sprite.y >= vine.topSection.y && player.sprite.x >= vine.base.x && player.sprite.x <= vine.base.x+vine.base.width) {
                    byVine = vine;
                }
            }
        }
        return byVine;

    }

    this.touching = function(obj) {
        var touching = false;
        var xDistance = Math.abs(this.sprite.x-obj.x);
        var yDistance = Math.abs(this.sprite.y-obj.y);
        if (xDistance <= (obj.width/2)+(player.width/2) ) {

        }
    }

    this.standingOnGround = function() {
        var onGround = false;
        if (player.cave) {
            var cave = player.cave
            for (var b=0;b<cave.earthBlocks.length;b++) {
                var block = cave.earthBlocks[b]
                if (block.standable) {
                    var blockX = cave.posX+block.sprite.x
                    var blockY = cave.posY+block.sprite.y
                    if (this.sprite.x >= blockX && this.sprite.x <= blockX+block.sprite.width && 
                        this.sprite.y+gravityStrength > blockY && this.sprite.y < blockY+(tileWidth*2) ) {
                        onGround = true;
                        player.standingOn = block;
                        if (counter-player.lastPlucked > player.uprootTime && !this.climbing) {
                            this.sprite.y = blockY
                        }
                    }
                }
            }
        }
        
        for (var p=0;p<plateaus.length;p++) {
            var plat = plateaus[p];
            if (!plat.topless && plat.container.visible && this.sprite.x >= plat.floorSpan.startX && this.sprite.x <= plat.floorSpan.startX+(plat.floorSpan.span*tileWidth) && this.sprite.y+gravityStrength >= plat.floorSpan.groundY && this.sprite.y <= plat.floorSpan.groundY) {
                onGround = true;
                player.standingOn = plat;
                if (counter-player.lastPlucked > player.uprootTime && !this.climbing) {
                    this.sprite.y = plat.floorSpan.groundY;
                }

            }
        }
        for (var m=0;m<mushroomBlocks.length;m++) {
            var mBlock = mushroomBlocks[m];
            if (!mBlock.thrown && this.carrying !== mBlock && this.sprite.x >= mBlock.sprite.x-tileWidth && this.sprite.x <= mBlock.sprite.x+tileWidth && this.sprite.y+gravityStrength >= mBlock.sprite.y && this.sprite.y <= mBlock.sprite.y) {
                onGround = true;
                player.standingOn = mBlock;
                this.sprite.y = mBlock.sprite.y;

            }
        }
        for (var s=0;s<posts.length;s++) {
            var post = posts[s];
            if (this.sprite.x >= post.topPiece.x-(post.topPiece.width) && this.sprite.x <= post.topPiece.x+(post.topPiece.width) && this.sprite.y+gravityStrength >= post.topPiece.y && this.sprite.y <= post.topPiece.y) {
                onGround = true;
                player.standingOn = post;
                this.sprite.y = post.topPiece.y;

            }
        }
        for (var n=0;n<enemies.length;n++) {
            var enemy = enemies[n];
            if (!enemy.thrown && !enemy.died && this.carrying !== enemy && this.sprite.x >= enemy.sprite.x-tileWidth/1 && this.sprite.x <= enemy.sprite.x+tileWidth/1 && this.sprite.y+gravityStrength >= enemy.sprite.y-enemy.sprite.height/2 && this.sprite.y <= enemy.sprite.y-enemy.sprite.height/2) {
                if (enemy.liftable) {
                    onGround = true;
                    player.standingOn = enemy;
                    this.sprite.y = enemy.sprite.y-enemy.sprite.height/2;
                } else {
                    player.reactToHit(enemy.sprite)
                }


            }
        }
        for (var b=0;b<bombs.length;b++) {
            var bomb = bombs[b];
            if (!bomb.thrown && this.carrying !== bomb && this.sprite.x >= bomb.sprite.x-tileWidth/2 && this.sprite.x <= bomb.sprite.x+tileWidth/2 && this.sprite.y+gravityStrength >= bomb.sprite.y && this.sprite.y <= bomb.sprite.y) {
                onGround = true;
                player.standingOn = bomb;
                this.sprite.y = bomb.sprite.y;

            }
        }

        if (onGround && this.turrets.length >0) {
            this.turrets[0].container.y = this.sprite.y-this.turrets[0].homeSpot;
            if (this.crouching) {
                this.turrets[0].container.y += tileWidth/2;
            }
        }
        if (onGround) {
            
        }
        // if (pressingAButton && player.jetpack) {
        //     onGround = false
        // }
        return onGround;
    }

}

function checkForInputs() {
    
    // if (pressingBButton) {
    //     player.speed = player.runSpeed;
        
    // } else {
        // if (player.speed !== player.origSpeed) {
        //     player.speed = player.origSpeed;
        // }
    // }

    if (((!player.plucking && !player.crouching) || (!player.standingOn))  && pressingLeft) {
        var factor = 32
        if (!player.standingOn) {
            factor = 24
        }
        if (player.climbing) {
            factor = 48
        }
        if (player.sprite.scale.x > 0 && Math.abs(player.velocity.x) < player.velocity.maxX) {
            
            player.velocity.x -= (player.velocity.maxX/factor)
        }
        if (player.blocked && player.flippedX === 1) {
            player.velocity.x = 0;
        }
        if (player.sprite.scale.x < 0) {
            player.flippedX *= -1;
            player.sprite.scale.x *= -1;
            if (player.carrying) {
                player.carrying.sprite.scale.x *= -1
                if (player.carrying.flippedX) {
                    player.carrying.flippedX *= -1;
                }
            };
            player.velocity.x = 0;
        }
    } else if (((!player.plucking && !player.crouching) || (!player.standingOn)) && pressingRight) {
        var factor = 32
        if (!player.standingOn) {
            factor = 24
        }
        if (player.climbing) {
            factor = 48
        }
        if (player.sprite.scale.x < 0 && Math.abs(player.velocity.x) < player.velocity.maxX) {
            player.velocity.x += (player.velocity.maxX/factor)
            
        }
        if (player.blocked && player.flippedX === -1) {
            player.velocity.x = 0;
        }
        if (player.sprite.scale.x > 0) {
            player.flippedX *= -1;
            player.sprite.scale.x *= -1;
            if (player.carrying) {
                player.carrying.sprite.scale.x *= -1
                if (player.carrying.flippedX) {
                    player.carrying.flippedX *= -1;
                }
            };
            player.velocity.x = 0;
        }
    } else {
        if (!player.blocked && player.velocity.x+player.inertiaX <= 0) {
            player.velocity.x += player.inertiaX;
        } else if (!player.blocked && player.velocity.x-player.inertiaX > 0) {
            player.velocity.x -= player.inertiaX;
        } else {
            player.velocity.x = 0;
        }
    }
    if (pressingDown) {
        
        if (!player.crouching && player.standingByVine()) {
            var vine = player.standingByVine();
            if (player.sprite.y !== vine.base.y) {
            if (!player.climbing) {
                player.climbing = vine;
                player.currentFrame = 6;
                player.changeFrame(player.currentFrame);
            }
            };
        }
        if (player.climbing) {

            if (player.climbing.base.y-player.sprite.y < tileWidth/2) {
                player.climbing = false;
            } else {
                player.sprite.y += tileWidth/6;
            }
        } else {
            player.crouchCharge++;
            if (!player.crouching && pressedDownAt === counter) {
                player.crouching = true;
                player.sprite.texture = player.crouchSheet;
                player.crouchFrame = 0;
                if (player.carrying) {
                    player.crouchFrame = 1;
                    player.carrying.sprite.y += tileWidth/2;
                }
                if (player.turrets.length > 0) {
                    player.turrets[0].container.y += tileWidth/2;
                }

                player.changeFrame(player.crouchFrame);
                player.sprite.height = player.sprite.width;
                player.sprite.scale.x *= player.flippedX;
            }
            if (player.crouching && player.crouchCharge >= player.chargeTime) {
                if (player.crouchCharge === player.chargeTime) {
                    player.charged = true;
                    player.crouchFrame = 2;
                    player.changeFrame(player.crouchFrame);
                }
                if (counter % 2 === 0) {
                    if (player.crouchFrame === 2) {
                        player.crouchFrame = 3;
                        player.changeFrame(player.crouchFrame);
                    } else {
                        player.crouchFrame = 2;
                        player.changeFrame(player.crouchFrame);
                    }
                }
            }

        };
    }
    if (releasedDownAt === counter) {
        player.crouchCharge = 0;
        player.crouchFrame = 0;
        player.changeFrame(player.crouchFrame);
        player.charged = false;
        player.crouching = false;
        if (player.carrying) {
            player.placeCargo();
        }
        if (player.jetpack) {
            player.jetpack.sprite.visible = true
        }
//        if (player.turrets.length > 0) {
//            player.turrets[0].container.y -= player.sprite.height/2;
//        }

        player.sprite.texture = player.textureSheet;
        player.changeFrame(player.currentFrame);
        player.sprite.height = player.standingHeight;
        player.sprite.scale.x *= player.flippedX;
    }
    if (!shopDisplay.container.visible && !player.plucking && pressingBButton && counter-player.lastJumped < 9) {
        if (player.velocity.y < player.velocity.maxY) {
            player.velocity.y++;
        }
    }

    if (pressingUp) {
        var vine = player.standingByVine();
        if (!player.climbing && vine) {
            if (player.sprite.y-vine.topSection.y > player.sprite.height && !player.climbing) {
                player.grabbedVine = counter;
                player.velocity.x = 0;
                player.climbing = player.standingByVine();
                player.currentFrame = 6;
                player.changeFrame(player.currentFrame);
//                 if (player.jetpack) {
//                     player.jetpack.sprite.texture = jetpackBackText
//                     stage.setChildIndex(player.jetpack.container,stage.children.indexOf(player.sprite)+1)
// a                }
            };
        }
        if (player.climbing) {
            if (counter % 10 === 0) {
                playSound(cherrySound);
                player.flippedX *= -1;
                player.sprite.scale.x *= -1;
            }
            if (player.climbing.type !== "chain") {
            if (player.sprite.y-tileWidth/10 < player.climbing.topAttached.floorSpan.groundY) {
                player.sprite.y = player.climbing.topAttached.floorSpan.groundY;
            } else {
                player.sprite.y -= tileWidth/10
            }
            } else { // extends above top ledge
                if (player.sprite.y-tileWidth/10 < player.climbing.topSection.y+player.climbing.topSection.height/2) {
                    player.sprite.y = player.climbing.topSection.y+player.climbing.topSection.height/2;
                } else {
                    player.sprite.y -= tileWidth/10
                }
            }
        } else {
            // if (player.approachingNPC) {
            //     if (!activeDBox) {
            //         box.open(player.approachingNPC)
            //     }
            // }
        }
    }


    // plucking grass

    // if (pressedBAt === counter) {
    //     if (player.carrying && !player.crouching && counter-player.lastPlucked > (player.pluckTime+player.uprootTime)) {
    //         player.carrying.thrown = true;

    //         playSound(throwSound);
    //         if (player.carrying.type === "mushroomBlock") {
    //             if (player.velocity.x === 0) {
    //                 player.carrying.tossDirection = player.flippedX;
    //             } else {
    //                 player.carrying.velocity.x = (player.velocity.x/3)+7*(-player.flippedX);
    //                 player.carrying.velocity.y = 16;
    //             }
    //         }
    //         if (player.carrying.type === "bomb") {
    //             player.carrying.velocity.x = (player.velocity.x/3)+8*(-player.flippedX);
    //             player.carrying.velocity.y = 16;
    //         } else if (player.carrying.type === "vegetable") {
    //             player.carrying.velocity.x = (player.velocity.x/3)+9*(-player.flippedX);
    //             player.carrying.velocity.y = 16;
    //         } else if (player.carrying.type === "enemy") {

    //             player.carrying.velocity.x = (player.velocity.x/3)+12*(-player.flippedX);
    //             player.carrying.velocity.y = 14;
    //         }
    //         if (player.flippedX === 1) {
    //             player.carrying.throwAngle = degToRad(180);
    //         } else {
    //             player.carrying.throwAngle = degToRad(0);
    //         }
    //         player.currentFrame = 9;
    //         player.changeFrame(player.currentFrame);
    //         player.carrying = undefined;
    //         player.threw = counter;
    //     } else if (!player.crouching && player.standingOnTuft() && !pressingLeft&& !pressingRight && !player.plucking) {
    //         var potentialTuft = player.standingOnTuft();
    //         player.velocity.x = 0;
    //         if (!player.crouching && player.velocity.x === 0 && potentialTuft) {
    //             player.pluckGrass(potentialTuft);
    //         };
    //     } else if (!player.crouching && player.standingOn && (player.standingOn.type === "mushroomBlock" || player.standingOn.type === "bomb"|| player.standingOn.type === "enemy")) {
    //         player.liftBlock(player.standingOn);
        // } else if (player.approachingNPC) {
        //     if (!activeDBox) {
        //         box.open(player.approachingNPC)
        //     }
        // }
    // }
    if (!shopDisplay.container.visible) {
        if (player.sword) {
            if (pressingYButton) {
                player.sword.chargeTime += 1
                if (player.sword.chargeTime === 25) {
                    player.sword.windingUp = true
                }
            }
            if (pressedYAt===counter) {
                player.sword.striking = true
            }
            if (releasedYAt===counter) {
                if ((player.sword.chargeTime >= player.sword.chargeMax)) {
                    player.sword.striking = true
                    
                    player.sprite.tint = 0xffffff
                }
            }
        }
        if (player.jetpack) {
            if (pressedAAt===counter) {
                player.jetpack.boosting = true
            }
            if (releasedAAt===counter) {
                player.jetpack.boosting = false
                player.jetpack.flame.alpha = 0
            }
        }
        if (player.flamethrower) {
            
            if (pressingXButton) {
                player.flamethrower.fire()
            }
            if (pressedXAt===counter) {
                player.flamethrower.firing = true
            }
            if (releasedXAt===counter) {
                player.flamethrower.firing = false
            }
            if (pressingUp && (!this.climbing && !this.standingByVine)) {
                player.flamethrower.sprite.rotation = degToRad(90*player.flippedX)
            }
            if (pressingUpRight) {
                player.flamethrower.sprite.rotation = degToRad(45*player.flippedX)
            }
            if (pressingUpLeft) {
                player.flamethrower.sprite.rotation = degToRad(45*player.flippedX)
            }
        }
    }
    if (pressedYAt===counter || pressedYAt===counter) {
        if (player.approachingNPC) {
            if (!activeDBox) {
                showOKExitSymbols()
                box.open(player.approachingNPC)
                console.log("OPENING INITAL TIME!!")
            }
        }
    }

}

function Turret() {
    this.container = new PIXI.Container();
    this.spoutContainer = new PIXI.Container();

    this.emissions = [];
    this.ring = new PIXI.Sprite(ringText);
    this.spout = new PIXI.Sprite(turretText);
    this.ring.width = this.ring.height = tileWidth;
    this.spout.height = tileWidth;
    this.spout.width = this.spout.height/2;
    this.ring.anchor.set(0.5);
    this.spout.anchor.x = 0.5;
    this.spout.anchor.y = 1;
    this.homeSpot = this.ring.height/2+(player.sprite.height/2.5);
    this.container.x = player.sprite.x;
    this.container.y = player.sprite.y-this.homeSpot;
    this.spoutContainer.addChild(this.spout);
//    this.spoutContainer.x -= this.spoutContainer.width/2;
//    this.spoutContainer.y -= this.ring.height;
    this.container.addChild(this.ring);
    this.container.addChild(this.spoutContainer);
    this.spoutContainer.pivot.y = this.spoutContainer.y+(this.ring.height/2)
    this.firepower = 9;
    this.emissionLimit = 12;
//    this.spoutContainer.y = this.ring.y-(this.ring.height/2);
    player.turrets.push(this);
    stage.addChild(this.container);

    this.worldKnobTip = function() {
        return pointAtAngle(this.container.x,this.container.y,this.spoutContainer.rotation-Math.PI/2,this.spout.height+(this.ring.height/2))
    }
    this.knobTip = function() {
        return pointAtAngle(this.spoutContainer.x,this.spoutContainer.y,this.spoutContainer.rotation-Math.PI/2,this.spout.height+this.ring.width/2)
    }

    this.pointToAngle = function(angle) {

        this.spoutContainer.rotation = angle;
    }
    this.emitSegment = function() {

        var tipDistanceX = this.worldKnobTip().x-this.container.x;
        var tipDistanceY = this.worldKnobTip().y-this.container.y;
        var velocityX = (tipDistanceX/tileWidth)*this.firepower;
        var velocityY = -(tipDistanceY/tileWidth)*this.firepower;
        if (this.emissions.length > 0) {
            var attachedLink = this.emissions[this.emissions.length-1];
//            velocityX += attachedLink.velocity.x;
//            velocityY += attachedLink.velocity.y;
        }
        var link = new Segment(this);
        link.velocity.x = velocityX;
        link.velocity.y = velocityY;
        link.firedAt = counter;

    }
    this.advanceSegment = function() {
        if (this.emissions.length === 0) {
            this.emitSegment();

        } else if (this.emissions.length >= 1) {
            var attachedLink = this.emissions[this.emissions.length-1];
            if (counter % 1 === 0) {
                this.emitSegment();

            }
        }
    }
}
function Sword(type) {
    player.sword = this
    
    this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage("assets/"+type+".png")) 
    var hwRatio = this.sprite.height/this.sprite.width
    this.sprite.height = this.origHeight = tileWidth*2
    this.sprite.width = this.origWidth = this.sprite.height/hwRatio
    this.sprite.anchor.x = 0.5
    this.sprite.anchor.y = 0.8
    this.sprite.x = player.sprite.x-(player.sprite.height*0.2*player.flippedX)
    this.sprite.y = player.sprite.y-(player.sprite.height*0.42)
    
    this.strikeSpeed = 36
    this.angle = this.idleAngle = 14
    this.sprite.rotation = degToRad(this.angle*player.flippedX)
    this.downLimit = -160
    this.upLimit = 36
    this.windingUp = false
    this.striking = false
    this.chargeTime = 0
    this.chargeMax = 30
    this.hitKnobs = []
    this.damage = 200
    this.damagedAt = -99
    for (var k=0;k<3;k++) {
        var knob = new PIXI.Sprite(sphereText)
        knob.width = knob.height = this.sprite.width*0.6
        knob.tint = 0xff0000
        knob.anchor.set(0.5)
        knob.alpha = 0
        this.hitKnobs.push(knob)
        stage.addChild(knob)
    }
    this.displaySymbol = function() {
        $("#y-symbol").css({
            'background-image':'url("assets/'+type+'.png")',
            'background-size':items[type].previewBGSize+'px'
        })
    }

    this.followPlayer = function() {
        if (!player.climbing) {
            this.sprite.x = player.sprite.x-(player.sprite.height*0.26*player.flippedX)
            this.sprite.rotation = degToRad(this.angle*player.flippedX)
        } else {
            this.sprite.x = player.sprite.x-(player.sprite.height*0.26)
            this.sprite.rotation = degToRad(this.angle)
        }
        this.sprite.y = player.sprite.y-(player.sprite.height*0.44)
        this.hilt = pointAtAngle(this.sprite.x,this.sprite.y,this.sprite.rotation-degToRad(90),this.sprite.height*(0.2))
        this.tip = pointAtAngle(this.sprite.x,this.sprite.y,this.sprite.rotation-degToRad(90),this.sprite.height*(0.7))
        // console.log(this.tip)
        for (var k=0;k<this.hitKnobs.length;k++) {
            var knob = this.hitKnobs[k]
            // var newSpot = pointAtAngle(this.tip.x,this.tip.y,this.sprite.rotation-degToRad(90),knob.width*k)
            if (k==0) {
                var newSpot = this.hilt
            } else if (k===2) {
                var newSpot = this.tip
            } else {
                var newSpot = pointAtAngle(this.sprite.x,this.sprite.y,this.sprite.rotation-degToRad(90),this.sprite.height*(0.5))
            }
            knob.x = newSpot.x
            knob.y = newSpot.y
        }
    }

    this.windUp = function(speed,limit) {
        if (this.angle+speed <= limit) {
            this.angle += speed
        } else {
            this.angle = limit
            this.windingUp = false
            
            if (this.chargeTime>=this.chargeMax) {
                // this.sprite.width = this.origWidth
                // this.sprite.height = this.origHeight
                // this.downLimit = -160
                this.chargeTime = 0
            }
            if (limit === this.idleAngle) {
                this.chargeTime = 0
                player.sprite.tint = 0xffffff
            } else {
                // this.sprite.width = this.origWidth*1.25
                // this.sprite.height = this.origHeight*1.5
            }
            
            
        }
    }
    this.strike = function(speed,limit) {
        if (this.chargeTime>=this.chargeMax) {
            speed = 18
            
            // this.downLimit = -140
           
        }
        if (this.angle-speed >= limit) {
            this.angle -= speed
        } else {
            this.angle = limit
            this.striking = false
        }
    }
    this.checkForSlicables = function() {
        for (var e=0;e<eggs.length;e++) {
            var egg = eggs[e]
            if (!egg.dead && egg.home.container.visible) {
                for (var k=0;k<this.hitKnobs.length;k++) {
                    var knob = this.hitKnobs[k]
                    var dist = distanceFromABtoXY(knob.x,knob.y,egg.centerPoint.x,egg.centerPoint.y)
                    if (dist < (egg.sprite.width/2)+(knob.width/2)) {
                        egg.damagedAt = counter
                        egg.damage(this.damage)
                        // if (!egg.dead) {
                            this.striking = false
                            this.windingUp = true
                            this.chargeTime = 0
                        // }
                    }
                }
            }
        }
    }
    
    stage.addChildAt(this.sprite,stage.children.indexOf(player.sprite))
}
function Jetpack() {
    player.jetpack = this
    
    this.container = new PIXI.Container()
    this.sprite = new PIXI.Sprite(jetpackText)
    this.sprite.anchor.x = 0.5
    this.sprite.width = tileWidth*1.1
    this.sprite.height = tileWidth*1.1
    this.flame = new PIXI.Sprite(jetflameText)
    this.flame.width = tileWidth
    this.flame.height = tileWidth*2
    this.flame.anchor.x = 0.5
    this.flame.alpha = 0
    this.boosting = false
    this.sprite.anchor.x = 0.5
    this.container.addChild(this.flame)
    this.container.addChild(this.sprite)
    this.fuel = this.maxFuel = 1000
    this.rechargeRate = 10

    this.gasMeter = new PIXI.Container()
    this.gasMeter.alpha = 0.7
    heartDisplay.container.addChild(this.gasMeter)
    this.gasMeter.x = heartDisplay.heart1.x
    this.gasMeter.y = heartDisplay.heart1.y+(heartDisplay.heart1.height*5)
    for (var b=0;b<15;b++) {
        var bar = new PIXI.Sprite(pixelText)
        bar.tint = 0x00ff00
        bar.width = tileWidth/2
        bar.height = tileWidth/6
        bar.x = bar.width/2
        bar.y = (b*bar.height*2)
        
        this.gasMeter.addChild(bar)
    }

    stage.addChildAt(this.container,stage.children.indexOf(player.sprite))
    this.displaySymbol = function() {
        $("#a-symbol").css({
            'background-image':'url("assets/jetpackback.png")',
            'background-size':(tileWidth)+'px'
        })
    }
    this.followPlayer = function() {
        this.container.x = player.sprite.x
        this.container.y = player.sprite.y-(player.sprite.height*0.7)
        if ((this.sprite.scale.x > 0 && player.sprite.scale.x > 0) || (this.sprite.scale.x < 0 && player.sprite.scale.x < 0)) {
            this.sprite.scale.x *= -1
            this.flame.scale.x *= -1
        }
        if (!player.climbing) {
            if (this.sprite.texture === jetpackBackText) {
                this.sprite.texture = jetpackText
                stage.setChildIndex(this.container,stage.children.indexOf(player.sprite))
                // console.log("changed texture to side")
            }
        } else {
            if (this.sprite.texture !== jetpackBackText) {
                this.sprite.texture = jetpackBackText
                stage.setChildIndex(this.container,stage.children.indexOf(player.sprite)+1)
                // console.log("changed texture to back")
            }
        }
        if (player.crouching) {
            // if (!player.climbing && player.jetpack && player.jetpack.sprite.visible) {
                this.sprite.visible = false
            // }
        }
        
        // this.sprite.rotation = degToRad(this.angle*player.flippedX)
    }

    this.boost = function() {
        if (this.fuel > 0) {
            this.fuel--
            this.boosting = true
            if (mod(2)) {
                this.flame.alpha = 0.1
            } else {
                this.flame.alpha = 1
            }
            player.leap(12)
            // console.log("boosting!")
            if (this.fuel===0) {
                
            }
            this.updateGasMeter()
        }
    }
    this.updateGasMeter = function() {
        var litBars = Math.round((this.fuel/this.maxFuel)*this.gasMeter.children.length)
        // console.log(this.fuel + " fuel,a should light " + litBars)
        for (var b=0;b<this.gasMeter.children.length;b++) {
            var bar = this.gasMeter.children[b]
            if (b>=(this.gasMeter.children.length-litBars)) {
                bar.alpha = 1
                bar.tint = 0x00ff00
            } else {
                bar.tint = 0xff0000
                bar.alpha = 0.5
            }
        }
    }
    this.displaySymbol()

}
function Coin() {
    this.textureSheet = coinSheet.clone();
    this.currentFrame = 0;
    this.textureSheet.frame = new PIXI.Rectangle(0, 0, 16, 16);
    this.sprite = new PIXI.Sprite(this.textureSheet);
    // this.sprite.anchor.x = 0.5
    this.sprite.anchor.y = 0.5
    this.sprite.width = this.sprite.height = tileWidth*2
}
function Flamethrower() {
    player.flamethrower = this
    
    this.sprite = new PIXI.Sprite(flamethrowerText)
    this.sprite.anchor.x = 0.2
    this.sprite.anchor.y = 0.5
    this.sprite.width = tileWidth*2
    this.sprite.height = tileWidth
    this.tipPosition = {}
    this.shoulderX = -player.sprite.width*0.05
    this.shoulderY = player.sprite.height*0.32
    this.damage = 1
    
    this.firing = false
    this.flames = new PIXI.Container()

    stage.addChildAt(this.sprite,stage.children.indexOf(player.sprite)+1)
    this.displaySymbol = function() {
        $("#x-symbol").css({
            'background-image':'url("assets/flamethrower.png")',
            'background-size':(tileWidth*1.5)+'px'
        })
    }
    this.followPlayer = function() {
        if (this.sprite.scale.x < 0) {
            this.sprite.scale.x *= -1
        }
        this.sprite.x = player.sprite.x-(this.shoulderX*player.flippedX)
        this.sprite.y = player.sprite.y-this.shoulderY
        if ((!pressingUp && !pressingUpLeft && !pressingUpRight) && this.sprite.rotation !== 0) { // must have just been climbing or aiming up
            this.sprite.rotation = 0
            if (this.sprite.y !== player.sprite.y-this.shoulderY) {
                this.sprite.y = player.sprite.y-this.shoulderY
            }
        }
        if (player.climbing) {
            if (this.sprite.scale.x > 0) {
                this.sprite.scale.x *= -1
            }
            // stage.setChildIndex(this.sprite,stage.children.indexOf(player.sprite)+1)
            this.sprite.x = player.sprite.x
            this.sprite.y = player.sprite.y-(player.sprite.height*0.6)
            this.sprite.rotation = degToRad(90)
        } else {
            if ((this.sprite.scale.x > 0 && player.sprite.scale.x > 0) || (this.sprite.scale.x < 0 && player.sprite.scale.x < 0)) {
                this.sprite.scale.x *= -1
            }
        }
        // stage.setChildIndex(this.sprite,stage.children.indexOf(player.sprite)+1)
        var startDistance = this.sprite.width/1.2
        startDistance += randomInt(0,2)*tileWidth/32
        tipPos = pointAtAngle(this.sprite.x,this.sprite.y-(this.sprite.height/6),this.sprite.rotation,-((startDistance)*player.flippedX))
        this.tipPosition.x = tipPos.x
        this.tipPosition.y = tipPos.y
        // this.tipPosition.x = this.sprite.x-((this.sprite.width/1.9)*player.flippedX)
        // this.tipPosition.y = this.sprite.y-(this.sprite.height/7.8)
        if (!this.firing) {
            var pilot = new Flame(tileWidth/12,2,false)
            pilot.fireTime = counter
            pilot.sprite.x = this.tipPosition.x+(tileWidth/8*player.flippedX)
            pilot.sprite.y = this.tipPosition.y
        }
    }
    this.fire = function() {
        var size = (tileWidth/5)+(randomInt(-4,4)*(tileWidth/48))
        var longevity = 6
        var flame = new Flame(size,longevity,true)
        flame.sprite.x = this.tipPosition.x
        flame.sprite.y = this.tipPosition.y
        flame.flyAngle = this.sprite.rotation+degToRad(randomInt(-5,5))
        flame.fireTime = counter
        size = (tileWidth/5)+(randomInt(-4,4)*(tileWidth/48))
        var flame = new Flame(size,longevity,true)
        flame.sprite.x = this.tipPosition.x
        flame.sprite.y = this.tipPosition.y
        flame.flyAngle = this.sprite.rotation+degToRad(randomInt(-5,5))
        flame.fireTime = counter
        size = (tileWidth/5)+(randomInt(-4,4)*(tileWidth/48))
        var flame = new Flame(size,longevity,true)
        flame.sprite.x = this.tipPosition.x
        flame.sprite.y = this.tipPosition.y
        flame.flyAngle = this.sprite.rotation+degToRad(randomInt(-5,5))
        flame.fireTime = counter
        size = (tileWidth/5)+(randomInt(-4,4)*(tileWidth/48))
        var flame = new Flame(size,longevity,true)
        flame.sprite.x = this.tipPosition.x
        flame.sprite.y = this.tipPosition.y
        flame.flyAngle = this.sprite.rotation+degToRad(randomInt(-5,5))
        flame.fireTime = counter
    }
    // this.displaySymbol()

}
function Flame(size,longevity,isProjectile) {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    this.sprite = new PIXI.Sprite(flameText)
    this.sprite.blendMode = 1
    this.sprite.width = this.sprite.height = size
    this.sprite.anchor.set(0.5)
    this.fireTime = -99
    this.fireDirection = player.flippedX
    if (isProjectile) {
        this.isProjectile = true
        this.riseRate = (tileWidth/32)+(randomInt(-1,1)*(tileWidth/100))
    } else {
        this.isProjectile = false
        this.riseRate = (tileWidth/16)+(randomInt(-1,1)*(tileWidth/64))
    }
    this.xForce = (tileWidth/4)+(randomInt(0,4)*(tileWidth/32))
    this.longevity = longevity
    this.flyAngle = 0
    this.sprite.alpha = 1-(randomInt(0,10)/100)
    this.sprite.rotation = degToRad(randomInt(0,89))
    flames.push(this)
    stage.addChildAt(this.sprite,stage.children.length-1)
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.animate = function() {
        var sinceFired = counter-this.fireTime
        this.sprite.rotation += degToRad(15)
        if (this.isProjectile) {
            this.sprite.width += tileWidth/32
            this.sprite.height += tileWidth/32
            var newPos = pointAtAngle(this.sprite.x,this.sprite.y,this.flyAngle,-(this.xForce-(player.speed*player.flippedX*(player.velocity.x/10)))*this.fireDirection)
            if (sinceFired > 0) {
                this.sprite.x = newPos.x
                this.sprite.y = newPos.y  
                if (sinceFired > randomInt(2,4)) {
                    this.sprite.y -= sinceFired*this.riseRate
                }
            }
        } else {
            this.sprite.width -= tileWidth/32
            this.sprite.height -= tileWidth/32
        }
        if (sinceFired > 0) {
            this.sprite.y -= this.riseRate
        }
        
        if (this.fading) {
            if (this.sprite.alpha-0.2 >= 0) {
                this.sprite.alpha -= 0.2
            } else {
                this.sprite.visible = false
            }
            
        }
        if (sinceFired === this.longevity) {
            this.fading = true
        }
        
    }
    this.checkForFlammables = function() {
        for (var e=0;e<eggs.length;e++) {
            var egg = eggs[e]
            if (!egg.dead && egg.home.container.visible) {
                var xDiff = Math.abs(this.sprite.x-egg.centerPoint.x)
                var yDiff = Math.abs((this.sprite.y)-(egg.centerPoint.y-(egg.sprite.height/2)))
                if (xDiff < (egg.sprite.width/2) && yDiff < (egg.sprite.height/2)) {
                    if (egg.onFire < egg.maxFlames) {
                        egg.onFire += 1
                    }
                    egg.damage(player.flamethrower.damage)
                }
            }
        }
    }
}