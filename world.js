
function apparentSpritePosition(sprite) {
    var offsetX = stage.x-window.innerWidth/2;
    var offsetY = stage.y-window.innerHeight/2+tileWidth;
    return {x:sprite.x+offsetX,y:sprite.y+offsetY};
}
function apparentScreenPosition(posX,posY) {
    var actualX = posX+(tilesPerWidth*player.screenOccupying().x);
    var actualY = -(posY+(tilesPerHeight*player.screenOccupying().y));
    return {x:actualX,y:actualY};
}

function sectorDiscovered(secX,secY) {
    var discovered = false;
    var targetSector = {x:secX,y:secY};
    for (var s=0;s<progress.length;s++) {
        var sector = progress[s];
        if (secX === sector.x && secY === sector.y) {
            discovered = true;
        }
    }
    return discovered;
}
function stagePosition() {
    var actualX = Math.abs(stage.x)
    var actualY = Math.abs(stage.y)
    return {screenX:Math.floor(actualX/(tilesPerWidth*tileWidth)),screenY:Math.floor(actualY/(tilesPerHeight*tileWidth)),x:actualX,y:actualY}
}
function screenYForPosition(posY) {
    return -Math.floor(posY/viewHeight)
}


function GrassTuft(plateau,posX,containedItem) {
    this.type = "tuft";
    this.textureSheet = grassTuftSheet;
    this.currentFrame = 0;
    this.textureSheet.frame = new PIXI.Rectangle(this.currentFrame*49, 0, 48, 48);
    this.sprite = new PIXI.Sprite(this.textureSheet);
    this.sprite.anchor.x = 0;
    this.sprite.anchor.y = 1;
    this.sprite.width = this.sprite.height = tileWidth;
    this.sprite.x = plateau.leftTop.x + (posX*tileWidth);
    this.sprite.y = plateau.leftTop.y;
    this.owner = plateau;


    plateau.container.addChild(this.sprite);
    this.beingPlucked = false;

    this.giveUpContents = function() {
        this.fruit = new containedItem("large");
        stage.addChild(this.fruit.sprite);
    }

    this.wave = function() {
        if (mod(windSpeed)) {
            if (this.currentFrame < 6) {
                this.currentFrame++;

            } else {
                this.currentFrame = 0;
            }
            this.textureSheet.frame = new PIXI.Rectangle(this.currentFrame*49, 0, 48, 48);
        }
    }
    tufts.push(this);
}
function Cherry(plateau,posX,posY) {
    this.plat = plateau
    this.textureSheet = cherrySheet;
    this.currentFrame = 0;
    this.textureSheet.frame = new PIXI.Rectangle(this.currentFrame*49, 0, 48, 48);
    this.sprite = new PIXI.Sprite(this.textureSheet);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0;
    this.sprite.width = this.sprite.height = tileWidth;
    this.sprite.x = (plateau.floorSpan.startX+(tileWidth/2))+(posX*tileWidth)
    this.sprite.y = plateau.floorSpan.groundY-(posY*tileWidth)
    // stage.addChild(this.sprite);
    plateau.container.addChild(this.sprite);

    this.wave = function() {
        if (mod(cherrySpeed)) {
            if (this.currentFrame < 5) {
                this.currentFrame++;

            } else {
                this.currentFrame = 0;
            }
            this.textureSheet.frame = new PIXI.Rectangle(this.currentFrame*49, 0, 48, 48);
        }
    }
    cherries.push(this);
}

function MushroomBlock(plateau,posX,posY) {
    this.type = "mushroomBlock";
    this.sprite = new PIXI.Sprite.fromImage("mushroomblock.png");
    this.sprite.width = this.sprite.height = tileWidth;
    this.actualWidth = this.sprite.width;
    this.actualHeight = this.sprite.height;
    this.sprite.x = plateau.floorSpan.startX+(posX*tileWidth)+tileWidth/2;
    this.sprite.y = plateau.floorSpan.groundY-(posY*tileWidth)-tileWidth;
    this.sprite.anchor.x = 0.5;
    this.posX = posX;
    this.posX = posY;
    this.plateau = plateau;
    this.thrown = false;
    this.tossDirection = undefined;
    this.velocity = {x:0,y:0};
    this.standingOn = undefined;
    this.flippedX = 1;

    // stage.addChild(this.sprite);
    plateau.container.addChild(this.sprite);
    mushroomBlocks.push(this);
//    this.fly = function() {
//        if (counter-player.threw < 5) {
//            this.sprite.x -= tileWidth/5*this.tossDirection;
//        } else {
//            if (!this.touchingGround()) {
//                this.applyGravity();
//            }
//        }
//    }
    this.fly = function() {
        if (this.tossDirection === undefined) {
            this.sprite.x += tileWidth*(this.velocity.x/48);
            this.sprite.y -= tileWidth*(this.velocity.y/48);
            if (this.velocity.x > 0) {
                this.velocity.x -= 0.05;
            } else if (this.velocity.x < 0) {
                this.velocity.x += 0.05;
            }
            if (this.velocity.y > 0) {
                this.velocity.y -= 1;
            }
            if (!this.touchingGround()) {
                this.applyGravity();
            }
        } else {
            if (counter-player.threw < 5) {
                // this.sprite.x -= tileWidth/5*this.tossDirection;
            } else {
                if (!this.touchingGround()) {
                    this.applyGravity();
                }
            }
        }


    }

    this.touchingGround = function() {

        var touching = false;
        var grav = 0;

        for (var p=0;p<plateaus.length;p++) {
            var plat = plateaus[p];
            if (this.sprite.x >= plat.floorSpan.startX && this.sprite.x <= plat.floorSpan.startX+(plat.floorSpan.span*tileWidth) && this.sprite.y+gravityStrength > plat.floorSpan.groundY-tileWidth && this.sprite.y <= plat.floorSpan.groundY-tileWidth) {
                touching = true;
                this.standingOn = plat;
                this.sprite.y = plat.floorSpan.groundY-this.sprite.height;
            }
        }
        for (var s=0;s<posts.length;s++) {
            var post = posts[s];
            if (this.sprite.x >= post.topPiece.x-tileWidth/2 && this.sprite.x <= post.topPiece.x+tileWidth/2 && this.sprite.y+gravityStrength >= post.topPiece.y-tileWidth && this.sprite.y <= post.topPiece.y) {
                touching = true;
                this.standingOn = post;
                this.sprite.y = post.topPiece.y-tileWidth;
            }
        }
        for (var m=0;m<mushroomBlocks.length;m++) {
            var mBlock = mushroomBlocks[m];
            if (this !== mBlock && this.sprite.x >= mBlock.sprite.x-tileWidth/2 && this.sprite.x <= mBlock.sprite.x+tileWidth/2 && this.sprite.y+gravityStrength >= mBlock.sprite.y-tileWidth && this.sprite.y <= mBlock.sprite.y-tileWidth) {
                touching = true;
                this.standingOn = mBlock;
                this.sprite.y = mBlock.sprite.y-this.sprite.height;
                this.sprite.x = mBlock.sprite.x;
                this.tossDirection = undefined;
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        }
        for (var b=0;b<bombs.length;b++) {
            var bomb = bombs[b];
            if (this !== bomb && this.sprite.x >= bomb.sprite.x-tileWidth/2 && this.sprite.x <= bomb.sprite.x+tileWidth/2 && this.sprite.y+gravityStrength >= bomb.sprite.y-tileWidth && this.sprite.y <= bomb.sprite.y) {
                touching = true;
                this.standingOn = bomb;
                this.sprite.y = bomb.sprite.y-tileWidth;
            }
        }
        if (touching) {
            this.thrown = false;
        } else {
            this.standingOn = undefined;
        }
        return touching;
    }
    this.applyGravity = function() {
        this.sprite.y += gravityStrength;
    }
}
function Vegetable(size) {
    this.type = "vegetable";
    if (size === "large") {
        this.sprite = new PIXI.Sprite.fromImage("veglarge.png");
    };
    this.sprite.width = this.sprite.height = tileWidth;
    this.actualWidth = this.sprite.width;
    this.actualHeight = this.sprite.height;
    this.sprite.anchor.x = 0.5;
//    stage.addChild(this.sprite);
//    this.sprite.visible = false;
    this.throwAngle = undefined;
    this.velocity = {x:0,y:0};
    this.died = undefined;
    vegetables.push(this);

    this.fly = function() {
        this.sprite.x += tileWidth*(this.velocity.x/48);
        this.sprite.y -= tileWidth*(this.velocity.y/48);
        this.applyGravity();
        if (this.velocity.x > 0) {
            this.velocity.x -= 0.05;
        } else if (this.velocity.x < 0) {
            this.velocity.x += 0.05;
        }
        if (this.velocity.y > 0) {
            this.velocity.y -= 1;
        }
        if (this.sprite.y-player.sprite.y >= window.innerHeight) {
            vegetables.splice(vegetables.indexOf(this),1);
            stage.removeChild(this.sprite);
        }

//        }
    }
    this.applyGravity = function() {
        this.sprite.y += gravityStrength;
    }
}
function Bomb() {
    this.type = "bomb";
    this.sprite = new PIXI.Sprite.fromImage("bomb.png");
    this.sprite.width = this.sprite.height = tileWidth;
    this.actualWidth = this.sprite.width;
    this.actualHeight = this.sprite.height;
    this.sprite.anchor.x = 0.5;
    this.throwAngle = undefined;
    this.velocity = {x:0,y:0};
    this.thrown = false;
    this.litFuseAt = undefined;
    bombs.push(this);
    this.fly = function() {
        this.sprite.x += tileWidth*(this.velocity.x/48);
        this.sprite.y -= tileWidth*(this.velocity.y/48);
        if (!this.touchingGround()) {
            this.applyGravity();
        }
        if (this.velocity.x > 0) {
            this.velocity.x -= 0.05;
        } else if (this.velocity.x < 0) {
            this.velocity.x += 0.05;
        }
        if (this.velocity.y > 0) {
            this.velocity.y -= 1;
        }
    }
    this.touchingGround = function() {
        var touching = false;
        for (var p=0;p<plateaus.length;p++) {
            var plat = plateaus[p];
            if (this.sprite.x >= plat.floorSpan.startX && this.sprite.x <= plat.floorSpan.startX+(plat.floorSpan.span*tileWidth) && this.sprite.y+gravityStrength >= plat.floorSpan.groundY-tileWidth && this.sprite.y <= plat.floorSpan.groundY-tileWidth) {
                touching = true;
                this.sprite.y = plat.floorSpan.groundY-tileWidth;
                this.thrown = false;
            }
        }
        for (var s=0;s<posts.length;s++) {
            var post = posts[s];
            if (this.sprite.x >= post.topPiece.x-tileWidth/2 && this.sprite.x <= post.topPiece.x+tileWidth/2 && this.sprite.y+gravityStrength >= post.topPiece.y-tileWidth && this.sprite.y <= post.topPiece.y) {
                touching = true;
                player.standingOn = post;
                this.sprite.y = post.topPiece.y-tileWidth;
                if (!player.crouching && player.carrying) {
                    player.carrying.sprite.y = this.sprite.y-this.carryingSpot;
                }
            }
        }
        for (var m=0;m<mushroomBlocks.length;m++) {
            var mBlock = mushroomBlocks[m];
            if (this !== mBlock && this.sprite.x >= mBlock.sprite.x-tileWidth/2 && this.sprite.x <= mBlock.sprite.x+tileWidth/2 && this.sprite.y+gravityStrength >= mBlock.sprite.y-tileWidth && this.sprite.y <= mBlock.sprite.y-tileWidth) {
                touching = true;
                this.sprite.y = mBlock.sprite.y-tileWidth;
                this.sprite.x = mBlock.sprite.x;
                this.thrown = false;
            }
        }
        for (var b=0;b<bombs.length;b++) {
            var bomb = bombs[b];
            if (this !== bomb && this.sprite.x >= bomb.sprite.x-tileWidth/2 && this.sprite.x <= bomb.sprite.x+tileWidth/2 && this.sprite.y+gravityStrength >= bomb.sprite.y-tileWidth && this.sprite.y <= bomb.sprite.y) {
                touching = true;
                this.sprite.y = bomb.sprite.y-tileWidth;
            }
        }
        return touching;
    }
    this.applyGravity = function() {
        this.sprite.y += gravityStrength;
    }
    this.flash = function() {
        if (this.sprite.tint === 0xffffff) {
            this.sprite.tint = 0xff0000;
        } else {
            this.sprite.tint = 0xffffff;
        };
    }
    this.explode = function() {
        playSound(bombExplodeSound);
        var explosion = new PIXI.Sprite.fromImage("explosion.png");
        explosion.width = explosion.height = tileWidth*2.5;
        explosion.anchor.set(0.5);
        explosion.x = this.sprite.x;
        explosion.y = this.sprite.y+this.sprite.height/2;
        explosion.scale.x = explosion.scale.y = 0;
        explosion.wentOffAt = counter;
        if (player.carrying === this) {
            player.carrying = undefined;
            player.changeFrame(0)
        }
        bombs.splice(bombs.indexOf(this),1);
        explosionSprites.push(explosion);
        stage.removeChild(this.sprite)
        stage.addChild(explosion);
    }
}

function Ladder(plateau1,plateau2,startPosX) {
    this.type = "ladder";
    plateau2.contents.push(this)
    this.container = new PIXI.Container();
    this.base = new PIXI.Sprite.fromImage("ladder.png");
    this.topSection = new PIXI.Sprite.fromImage("ladder.png");
    this.base.anchor.y = this.topSection.anchor.y = 1;
    this.base.width = this.base.height = this.topSection.width = this.topSection.height = tileWidth;
    this.posX = (plateau1.posX+startPosX);
    this.base.x = this.topSection.x = this.posX*tileWidth;
    this.base.y = (tilesPerHeight-(plateau1.posY))*tileWidth;
    this.topAttached = plateau2;

    var midsNeeded = plateau2.posY-plateau1.posY;
    for (var m=0;m<midsNeeded;m++) {
        var section = new PIXI.Sprite.fromImage("ladder.png");
        section.anchor.x = 0;
        section.anchor.y = 1;
        section.width = section.height = tileWidth;
        section.x = this.posX*tileWidth;
        section.y = ((tilesPerHeight-plateau1.posY)-m-1)*tileWidth
        this.container.addChild(section)
    }

    this.topSection.y = this.base.y-((midsNeeded+1)*tileWidth);

    this.container.addChild(this.base);
    this.container.addChild(this.topSection);
    if (player) {
        var playerIndex = stage.children.indexOf(player.sprite);
    } else {
        var playerIndex = stage.children.length;
    }
    stage.addChildAt(this.container,playerIndex-1);

    climbables.push(this);
}
function Chain(plateau,startPosX,length) {
    this.type = "chain";
    this.container = new PIXI.Container();
    this.base = new PIXI.Sprite.fromImage("chainend.png");
    this.topSection = new PIXI.Sprite.fromImage("chainpiece.png");
    this.base.anchor.y = this.topSection.anchor.y = 1;
    this.base.width = this.base.height = this.topSection.width = this.topSection.height = tileWidth;
    this.posX = startPosX;
    this.base.x = this.topSection.x = (plateau.posX+this.posX)*tileWidth;
    this.topAttached = plateau;
    this.topSection.y = plateau.floorSpan.groundY+(tileWidth*2);
    this.owner = plateau
    this.homeCave = this.owner.homeCave
    plateau.contents.push(this)

    for (var m=0;m<length-2;m++) {
        var section = new PIXI.Sprite.fromImage("chainpiece.png");
        section.anchor.x = 0;
        section.anchor.y = 1;
        section.width = section.height = tileWidth;
        section.x = (plateau.posX+this.posX)*tileWidth;
        section.y = this.topSection.y+((m+1)*tileWidth)
        this.container.addChild(section)
    }

    this.base.y = plateau.floorSpan.groundY+((length+1)*tileWidth)

    this.container.addChild(this.base);
    this.container.addChild(this.topSection);
    if (player) {
        var playerIndex = stage.children.indexOf(player.sprite);
    } else {
        var playerIndex = stage.children.length;
    }
    stage.addChildAt(this.container,playerIndex-1);
    // plateau.container.addChild(this.container);
    if (length > plateau.floorSpan.height) {
        plateau.floorSpan.height += (length-plateau.floorSpan.height)
    }

    climbables.push(this);
}

function Vine(plateau1,plateau2,startPosX) {
    this.type = "vine";
    plateau2.contents.push(this)
    this.container = new PIXI.Container();
    this.baseSheet = vineBaseSheet;
    this.midSheet = vineMidSheet;
    this.topSection = new PIXI.Sprite.fromImage("vinetop.png");
    this.currentFrame = 0;
    this.baseSheet.frame = this.midSheet.frame = new PIXI.Rectangle(this.currentFrame*49, 0, 48, 48);
    this.base = new PIXI.Sprite(this.baseSheet);
    this.base.anchor.y = this.topSection.anchor.y = 1;
    this.base.width = this.base.height = this.topSection.width = this.topSection.height = tileWidth;
    this.posX = (plateau1.posX+startPosX);
    this.base.x = this.topSection.x = this.posX*tileWidth;
    this.base.y = (tilesPerHeight-plateau1.posY)*tileWidth;
    this.topAttached = plateau2;


    this.midsection = [];
    
    var midsNeeded = plateau2.posY-plateau1.posY;
    // if (plateau2.large) {
    //     midsNeeded *= 2
    // }
    console.log("plat1 posY " + plateau1.posY + " - plat2 posY " + plateau2.posY + " - midsneeded " + midsNeeded)
    for (var m=0;m<midsNeeded;m++) {
        var section = new PIXI.Sprite(this.midSheet);
        section.anchor.x = 0;
        section.anchor.y = 1;
        section.width = section.height = tileWidth;
        section.x = this.posX*tileWidth;
        section.y = ((tilesPerHeight-plateau1.posY)-m-1)*tileWidth

        this.midsection.push(section);
        this.container.addChild(section)
    }

    this.topSection.y = this.midsection[midsNeeded-1].y-tileWidth;

    this.container.addChild(this.base);
    this.container.addChild(this.topSection);
    if (player) {
        var playerIndex = stage.children.indexOf(player.sprite);
    } else {
        var playerIndex = stage.children.length;
    }
    stage.addChildAt(this.container,playerIndex-1);

    climbables.push(this);

    this.wave = function() {
        if (mod(windSpeed)) {
            if (this.currentFrame < 5) {
                this.currentFrame++;

            } else {
                this.currentFrame = 0;
            }
            this.baseSheet.frame = new PIXI.Rectangle(this.currentFrame*49, 0, 48, 48);
            this.midSheet.frame = new PIXI.Rectangle(this.currentFrame*49, 0, 48, 48);
        }
    }

}

function Post(plateau,posX,height) {
    this.type = "post";
    this.container = new PIXI.Container();
    var xSpot = plateau.floorSpan.startX+(posX*tileWidth)+tileWidth/2;
    this.topPiece = new PIXI.Sprite.fromImage("posttop.png");
    this.topPiece.width = this.topPiece.height = tileWidth;
    this.topPiece.anchor.x = 0.5;
    this.topPiece.x = xSpot;
    this.topPiece.y = plateau.floorSpan.groundY-(tileWidth*height);
    this.container.addChild(this.topPiece);
    for (var p=0;p<height-1;p++) {
        var piece = new PIXI.Sprite.fromImage("postpiece.png");
        piece.anchor.x = this.topPiece.anchor.x;
        piece.width = piece.height = tileWidth;
        piece.x = xSpot;
        piece.y = plateau.floorSpan.groundY-(tileWidth*(p+1));
        this.container.addChild(piece);
    }
    this.floorSpan = {startX:this.topPiece.x,groundY:this.topPiece.y,span:height};
    posts.push(this);
    stage.addChild(this.container);
}

function Bullet(owner) {
    this.owner = owner;
    this.speed = owner.bulletSpeed;
    this.direction = owner.flippedX;
    this.sprite = PIXI.Sprite.fromImage("greybullet.png");
    this.sprite.anchor.set(0.5);
    this.sprite.height = this.sprite.width = tileWidth/3.5;
    this.sprite.x = this.owner.sprite.x-this.owner.sprite.width*0.5;
    this.sprite.y = this.owner.sprite.y+this.owner.sprite.height*0.15;
    bullets.push(this);
    stage.addChild(this.sprite);

    this.fly = function() {
        this.sprite.x += this.speed*this.direction;
    }
}

HeartDisplay = function() {
    this.container = new PIXI.Container();

    this.heart1 = PIXI.Sprite.fromImage("redheart.png");
    this.heart2 = PIXI.Sprite.fromImage("redheart.png");
    
    this.heart1.width = this.heart1.height = this.heart2.width = this.heart2.height = tileWidth;
    this.heart1.x = this.heart2.x = tileWidth;
    this.heart1.y = tileWidth;
    this.heart2.y = this.heart1.y+tileWidth*1.5;
    
    this.container.addChild(this.heart1);
    this.container.addChild(this.heart2);

    // this.coinSymbol = new PIXI.Sprite(coinText)
    // this.coinSymbol.width = this.coinSymbol.height = tileWidth
    // this.coinSymbol.x = tileWidth
    // this.coinSymbol.y = viewHeight-(tileWidth*1.5)
    // this.container.addChild(this.coinSymbol)
    // this.coinsBacking = new PIXI.Sprite(pixelText)
    // this.coinsBacking.anchor.y = 0.5
    // this.coinsBacking.tint = 0x000000
    // this.coinsBacking.alpha = 0.4
    // this.coinsBacking.width = viewWidth
    // this.coinsBacking.height = tileWidth
    // this.coinCount = new PIXI.Text("",dialogueStyle)
    // this.coinCount.anchor.y = 0.5
    // this.coinCount.x = tileWidth/2
    
    // this.coinsBacking.x = 0
    // this.coinsBacking.y = viewHeight-(this.coinsBacking.height/2)
    // this.coinCount.y = this.coinsBacking.y
    // this.container.addChild(this.coinsBacking)
    // this.container.addChild(this.coinCount)

    stage.addChild(this.container);

    this.addContainer = function() {
        this.heart3 = PIXI.Sprite.fromImage("redheart.png");
        this.heart3.width = this.heart3.height = tileWidth
        this.heart3.x = tileWidth
        this.heart3.y = this.heart2.y+tileWidth*1.5;
        this.container.addChild(this.heart3);
    }


    this.change = function(amount) {
        this.heart1.visible = this.heart2.visible = this.heart3.visible = false;
        for (var h=0;h<amount;h++) {
            this.container.children[h].visible = true;
        }
    }
}
function Segment(owner) {
    this.direction = player.flippedX;
    this.sprite = PIXI.Sprite.fromImage("greybullet.png");
    this.sprite.width = this.sprite.height = owner.spout.width;
    this.sprite.anchor.set(0.5);
    var tip = owner.worldKnobTip();
    this.sprite.x = tip.x;
    this.sprite.y = tip.y;
    this.launchAngle = owner.spoutContainer.rotation;
    this.sprite.rotation = this.launchAngle
    stage.addChild(this.sprite);
    owner.emissions.push(this)
    this.velocity = {x:0,y:0};
    this.firedAt = undefined;
    this.blocked = false;
    this.actualWidth = this.sprite.width;
    this.actualSize = this.sprite.height;
    this.standingOn = undefined;

    this.distanceFromHome = function() {
        return Math.abs(distanceFromABtoXY(owner.worldKnobTip().x,owner.worldKnobTip().y,this.sprite.x,this.sprite.y))
    }

    this.touchingSprite = function(other) {
        var touching = false;
        var touchDistanceX = (this.sprite.width/2)+(other.sprite.width/2);
        var touchDistanceY = (this.sprite.height/2)+(other.sprite.height/2);
        var intendedX = this.sprite.x+this.velocity.x/2;
        var intendedY = this.sprite.y-this.velocity.y/2;
        var intendedOtherX = other.sprite.x+other.velocity.x/2
        var intendedOtherY = other.sprite.y+other.velocity.y/2
        var distance = distanceFromABtoXY(intendedX,intendedY,intendedOtherX,intendedOtherY);
        if (this !== other) {
            if (Math.abs(intendedX-intendedOtherX) <= touchDistanceX
                && Math.abs(intendedY-intendedOtherY) <= touchDistanceY) {
                if (this.velocity.y > other.velocity.y) { // means it must be under it?
                    other.velocity.y = this.velocity.y;
                    this.velocity.y = 0;
                }
                if (Math.abs(this.velocity.x) > Math.abs(other.velocity.x)) { // moving left/right faster?
                    other.velocity.x += this.velocity.x;
                    this.velocity.x = 0;
                }
                if (this.sprite.y < other.sprite.y && other.standingOn && !this.standingOn) {
                    this.sprite.y = other.sprite.y-touchDistanceY;
                    this.standingOn = other;
                } else {

                }
                touching = true;
            }
        }
//        if (this !== other && distance <= (this.sprite.width/2)+(other.sprite.width/2)) {
//            touching = true;
//
//        }
        return touching;
    }
    this.checkForGround = function() {
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
        if (this.velocity.y > 0) {
            touching = false;
        }
        if (touching) {
            if (this.velocity.x !== 0) {
//                this.velocity.x = 0;
            }
            if (this.velocity.y !== 0) {
                this.velocity.y = 0;
            }
        } else {
            this.standingOn = undefined;
        }

        return touching;
    }

    this.applyGravity = function() {
        if (this.velocity.y-0.5 >= freefallVelocity) {
            this.velocity.y -= 0.5;
        }
        if (this.standingOn) {
            if (this.velocity.x > 0) {
                this.velocity.x -= 1
            } else if (this.velocity.x < 0) {
                this.velocity.x += 1
            }
            if (Math.abs(this.velocity.x) < 1) {
                this.velocity.x = 0;
            }
        }
    }
}
function Background() {
    var bgWidth = Math.round(tileWidth*2)
    var treeWidth = Math.round(tileWidth*3)
    var bgHeight = Math.round(bgWidth*(80/32))
    var treeHeight = Math.round(treeWidth*(80/48))
    var bgPerWidth = Math.ceil(viewWidth/bgWidth)+1
    var treesPerWidth = Math.ceil(viewWidth/treeWidth)
    this.sky = new PIXI.Sprite(skyBGText)

    this.sky.width = viewWidth*2
    this.sky.height = viewHeight

    this.bg1 = new PIXI.Container()
    this.bg15 = new PIXI.Container()
    this.bg2 = new PIXI.Container()
    this.bg3 = new PIXI.Container()
    this.bg4 = new PIXI.Container()
    this.clouds1 = new PIXI.Container()
    this.clouds2 = new PIXI.Container()
    this.scrollFactors = [10,7,5,3,2]
    this.layers = []
    this.layers.push(this.bg1,this.bg15,this.bg2,this.bg3,this.bg4)
    this.clouds = []
    this.clouds.push(this.clouds1,this.clouds2)
    var cloud1 = new PIXI.Sprite(smallCloudText)
    var cloud2 = new PIXI.Sprite(largeCloudText)
    cloud1.width = Math.round(18.75*tileWidth)
    cloud1.height = Math.round(cloud1.width*(3/4))
    cloud2.width = Math.round(12.5*tileWidth)
    cloud2.height = Math.round(cloud2.width*(2/3))
    cloud2.x = viewWidth
    cloud2.y = -tileWidth*3
    // this.clouds1.alpha = 0.5
    // this.clouds2.alpha = 0.3
    this.clouds1.addChild(cloud1)
    this.clouds2.addChild(cloud2)
    for (var w=0;w<bgPerWidth;w++) {
        var bg1 = new PIXI.Sprite(rockBG1Text)
        var bg15 = new PIXI.Sprite(largeTreeBGText)
        var bg2 = new PIXI.Sprite(plantBG2Text)
        var bg3 = new PIXI.Sprite(treeBG3Text)
        var bg4 = new PIXI.Sprite(treeBG3Text)
        // if (w%2 !== 0) {
        //     bg1.tint = 0xaa0000
        // }
        bg1.width = bgWidth
        bg1.height = bgHeight
        bg1.x = tileWidth*2*w
        bg1.y = tileWidth*6
        bg2.width = bgWidth
        bg2.height = bgHeight
        bg2.x = tileWidth*2*w
        bg2.y = tileWidth*6
        if (randomInt(0,3)) {
            var randHeight = randomInt(-3,3)
            bg3.width = bgWidth
            bg3.height = bgHeight
            bg3.x = bgWidth*w
            bg3.y = tileWidth*((24+randHeight)/4)
            bg3.alpha = 0.9
            bg3.extra = randHeight
            this.bg3.addChild(bg3)
        }
        if (randomInt(0,3)) {
            var randHeight = randomInt(-3,2)
            bg4.width = bgWidth
            bg4.height = bgHeight
            bg4.x = bgWidth*w
            bg4.y = tileWidth*((24+randHeight)/4)-(tileWidth*1.5)
            bg4.alpha = 0.9
            bg4.extra = randHeight
            this.bg4.addChild(bg4)
        }
        if (w<=treesPerWidth && !randomInt(0,1)) {
            var randHeight = randomInt(-3,3)
            bg15.width = treeWidth
            bg15.height = treeHeight
            bg15.x = treeWidth*w
            bg15.y = tileWidth*((24+randHeight)/4)
            bg15.extra = randHeight
            this.bg15.addChild(bg15)
        }
        
        this.bg1.addChild(bg1)
        this.bg2.addChild(bg2)
        
        
    }
    this.hideGround = function() {
        this.sky.visible = false
        for (var y=0;y<this.layers.length;y++) {
            var layer = this.layers[y]
            layer.visible = false
        }
    }
    this.hideClouds = function() {
        for (var c=0;c<this.clouds.length;c++) {
            var cloudLayer = this.clouds[c]
            cloudLayer.visible = false
        }
    }
    this.showClouds = function() {
        for (var c=0;c<this.clouds.length;c++) {
            var cloudLayer = this.clouds[c]
            cloudLayer.visible = true
        }
    }
    this.showGround = function() {
        this.sky.visible = true
        for (var y=0;y<this.layers.length;y++) {
            var layer = this.layers[y]
            layer.visible = true
        }
    }
    // stage.addChildAt(this.sky,0)
    // stage.addChildAt(this.clouds2,1)
    // stage.addChildAt(this.clouds1,2)
    stage.addChildAt(this.bg4,3)
    // if (rainField) {
    //     stage.setChildIndex(rainField.container2,4)
    // }
    stage.addChildAt(this.bg3,5)
    
    stage.addChildAt(this.bg2,6)
    // if (rainField) {
    //     stage.setChildIndex(rainField.container3,7)
    // }
    stage.addChildAt(this.bg15,8)
    stage.addChildAt(this.bg1,9)
    
    this.tintAll = function(color) {
        for (var y=0;y<this.layers.length;y++) {
            var layer = this.layers[y]
            
            for (var b=0;b<layer.children.length;b++) {
                var bg = layer.children[b]
                bg.tint = color
            }
        }
    }

    this.moveLayers = function(moveAmount) {
        for (var y=0;y<this.layers.length;y++) {
            var layer = this.layers[y]
            if (y !== 1) {
                var secWidth = bgWidth
            } else {
                var secWidth = treeWidth
            }
            for (var b=0;b<layer.children.length;b++) {
                var bg = layer.children[b]
                // if (!bg.extra) {
                    var extra = 0
                // } else {
                    // var extra = bg.extra
                // }
                
                bg.x += (moveAmount/this.scrollFactors[y])+extra
                if (moveAmount > 0 && stagePosition().x-bg.x > secWidth) {
                    bg.x += secWidth*bgPerWidth
                    // layer.setChildIndex(bg,layer.children.length-1)
                }
                if (moveAmount < 0 && stagePosition().x-bg.x < -viewWidth) {
                    bg.x -= secWidth*bgPerWidth
                    // layer.setChildIndex(bg,0)
                }
            }       
        }
        for (var y=0;y<this.clouds.length;y++) {
            var layer = this.clouds[y]
            for (var c=0;c<layer.children.length;c++) {
                var cloud = layer.children[c]
                var factor = (1.5-(y/10))
                cloud.x += moveAmount/factor
                if (moveAmount > 0 && stagePosition().x-cloud.x > cloud.width) {
                    cloud.x += viewWidth*2.5
                    // layer.setChildIndex(bg,layer.children.length-1)
                }
                // if (moveAmount < 0 && stagePosition().x-bg.x < -viewWidth) {
                //     bg.x -= secWidth*bgPerWidth
                //     // layer.setChildIndex(bg,0)
                // }
            }       
        }
        if (moveAmount > 0 && stagePosition().x-this.sky.x > viewWidth) {
            this.sky.x += this.sky.width-viewWidth
        }
        if (moveAmount < 0 && stagePosition().x-this.sky.x < 0) {
            this.sky.x -= this.sky.width-viewWidth
        }
    }

    
    
    
}
function Waterfall(posX,posY,width,height) {
    
    this.type = "waterfall"
    this.hasLog = false
    this.container = new PIXI.Container()
    this.logContainer = new PIXI.Container()
    this.segments = []
    this.currentFrame = {x:0,y:0};
    if (!height) {
        var heightNeeded = Math.round((viewHeight-posY)/tileWidth)-3
    } else {
        var heightNeeded = height
    }
    for (var h=0;h<heightNeeded;h++) {
        
        this.textureSheet = waterfallSheet
        this.textureSheet.frame = new PIXI.Rectangle((this.currentFrame.x*16)+this.currentFrame.x, (this.currentFrame.y*16)+this.currentFrame.y, 16, 16);
        for (var w=0;w<width;w++) {
            
            if (h > 0) {
                this.textureSheet.frame = new PIXI.Rectangle(0, 17, 16, 16);
            }            
            var segSprite = new PIXI.Sprite(this.textureSheet)
            segSprite.sheet = this.textureSheet
            segSprite.width = segSprite.height = tileWidth
            
            segSprite.x = (posX+w)*tileWidth
            segSprite.y = (posY+h)*tileWidth
            this.container.addChild(segSprite)
            this.segments.push(segSprite)
        }
    }
    this.floorSpan = {startX:posX,groundY:viewHeight,span:width,height:heightNeeded};
    plateaus.push(this)
    
    this.changeFrame = function(targetFrameX,targetFrameY) {
        this.currentFrame = {x:targetFrameX,y:targetFrameY}
        this.textureSheet.frame = new PIXI.Rectangle((this.currentFrame.x*16)+this.currentFrame.x, (this.currentFrame.y*16)+this.currentFrame.y, 16, 16);
    }
    this.flow = function() {
        if (mod(5)) {
            this.currentFrame.x++
            if (this.currentFrame.x > 7) {
                this.currentFrame.x = 0
            }
            for (var s=0;s<this.segments.length;s++) {
                var segment = this.segments[s]
                var textureSheet = waterfallSheet.clone();
                if (s < width) {
                    this.currentFrame.y = 0
                } else {
                    this.currentFrame.y = 1
                }
                textureSheet.frame = new PIXI.Rectangle((this.currentFrame.x*16)+this.currentFrame.x, (this.currentFrame.y*16)+this.currentFrame.y, 16, 16);
                segment.texture = textureSheet
    
            }
        }
    }
    stage.addChild(this.container)
}

function ledgeStairs(startX,startY,endX,endY,averageLength,averageGap,imageSet) {
    var spaceX = Math.ceil((endX-startX+2)/tileWidth)
    var spaceY = Math.ceil((endY-startY)/tileWidth)
    var screensHigh = Math.floor(spaceY/tilesPerHeight)
    var ledgesNeeded = Math.ceil(spaceX/averageLength)
    var perScreenY = Math.floor(ledgesNeeded/(screensHigh-1))-1
    var lastX = startX
    var lastY = startY
    var lastLedge = undefined
    for (var g=0;g<ledgesNeeded;g++) {
        var len = averageLength+randomInt(-1,1)
        var posX = lastX+averageLength
        var posY = lastY+averageGap
        // if (g>0 && g%(perScreenY) === 0) {
        //     posX = lastX
        //     posY += 4
        // }
        if (g>0 && (posY%tilesPerHeight) < 3) {
            
            // newLedge.container.children[0].tint = 0xff0000
            posY+=3
            posX-=2
            var newLedge = new Plateau(false,posX,posY,0,len,imageSet,true)
            new Chain(newLedge,1,averageGap+6)
        } else {
            var newLedge = new Plateau(false,posX,posY,0,len,imageSet,true)
        }
       
        
        if ((posY%tilesPerHeight) < 3) {
            
            
        }
        // if (g>0 && g%(perScreenY) === 0) {
        //     new Chain(newLedge,3,averageGap+4)
        // }
        stage.setChildIndex(newLedge.container,stage.children.length-1)
        lastX = posX
        lastY = posY
        lastLedge = newLedge
    }
}
function Tree(plat,posX) {
    this.sprite = new PIXI.Sprite(foregroundTreeText)
    this.sprite.width = tileWidth
    this.sprite.height = tileWidth*4
    this.sprite.anchor.y = 1
    this.sprite.x = plat.posX+(posX*tileWidth)
    this.sprite.y = plat.floorSpan.groundY
    plat.container.addChild(this.sprite)
}



function EarthScreen(cave,structureIndexArray,screenX,screenY,top,bottom,left,right) {
    this.cave = cave
    this.caveCoordX = structureIndexArray[1]
    this.caveCoordY = structureIndexArray[0]
    var xNeeded = tilesPerWidth/2
    var yNeeded = tilesPerHeight/2
    var blockSize = tileWidth*2
    var xStart = screenX
    var yStart = screenY-viewHeight
    console.log('ystart ' + yStart)
    for (var w=0;w<xNeeded;w++) {
        for (var h=0;h<yNeeded;h++) {            
            new EarthBlock(xStart+(blockSize*w),yStart+(blockSize*h),this.cave,"midTrunk")
            if (top && h===0) {
                if (w===0 && cave.pattern.structure[this.caveCoordY][this.caveCoordX-1] === 1) {
                    new EarthBlock(xStart+(blockSize*(w-1)),yStart+(blockSize*(h-1)),this.cave,"leftTop")
                }
                if (w===xNeeded-1 && cave.pattern.structure[this.caveCoordY][this.caveCoordX+1] === 1) {
                    new EarthBlock(xStart+(blockSize*(w+1)),yStart+(blockSize*(h-1)),this.cave,"rightTop")
                }
                var newBlock = new EarthBlock(xStart+(blockSize*w),yStart+(blockSize*(h-1)),this.cave,"midTop")
            }
            if (bottom && h===yNeeded-1) {
                var newBlock = new EarthBlock(xStart+(blockSize*w),yStart+(blockSize*(yNeeded)),this.cave,"midBottom")
            }
            if (left && w===0) {
                var newBlock = new EarthBlock(xStart+(blockSize*(w-1)),yStart+(blockSize*h),this.cave,"leftTrunk")
            }
            if (right && w===xNeeded-1) {
                var newBlock = new EarthBlock(xStart+(blockSize*(xNeeded)),yStart+(blockSize*h),this.cave,"rightTrunk")
            }
            
        }
    }
}
function SideLedge(cave,side,posY,width,height,noBottom,noSides) {
    if (side==="left") {
        var orientation = "right"
    } else {
        var orientation = "left"
    }
    for (var b=0;b<width;b++) {
        for (var h=0;h<height;h++) {
            if (b===0) {
                // left end
                var type = "midTrunk"
            } else if (b===width-1) {
                // right end
                if (h===0) {
                    // top side
                    if (height>1) {
                        var type = orientation+"Top"
                    } else {
                        var type = orientation+"Ledge"
                    }
                } else if (!noBottom && h===height-1) {
                    // bottom side
                    var type = orientation+"Bottom"
                } else {
                    if (!noBottom) {
                        var type = orientation+"Trunk"
                    } else {
                        var type = "midTrunk"
                    }
                    // middle side
                   
                }
            } else {
                // middle (horiz)
                if (h===0) {
                    // top middle
                    if (height>1) {
                        var type = "midTop"
                    } else {
                        var type = "midLedge"
                    }
                } else if (h===height-1) {
                    // bottom middle
                    var type = "midBottom"
                } else {
                    // middle
                    var type = "midTrunk"

                }
            }
            if (side==="left") {
                var xPos = cave.bg.x+(tileWidth*2*b)
                var yPos = cave.bg.y+(tileWidth*posY)+(tileWidth*2*h)
            } else {
                var xPos = (cave.bg.x+cave.bg.width-(tileWidth*2))-(tileWidth*2*b)
                var yPos = cave.bg.y+(tileWidth*posY)+(tileWidth*2*h)
            }
            var block = new EarthBlock(xPos,yPos,cave,type)
            
        }
        
    }
}
function EarthLedge(cave,posX,posY,width,height,noBottom) {
    for (var b=0;b<width;b++) {
        for (var h=0;h<height;h++) {
            var type
            if (b===0) {
                if (h===0) {
                    if (height>1) {
                        type = "leftTop"
                    } else {
                        type = "leftLedge"
                    }
                } else if (h===height-1) {
                    if (noBottom) {
                        type = "midTrunk"
                    } else {
                        type = "leftBottom"
                    }
                } else {
                    type = "leftTrunk"
                }
            } else if (b===width-1) {
                if (h===0) {
                    if (height>1) {
                        type = "rightTop"
                    } else {
                        type = "rightLedge"
                    }
                } else if (h===height-1) {
                    if (noBottom) {
                        type = "midTrunk"
                    } else {
                        type = "rightBottom"
                    }
                } else {
                    type = "rightTrunk"
                }
            } else {
                if (h===0) {
                    if (height>1) {
                        type = "midTop"
                    } else {
                        type = "midLedge"
                    }
                } else if (h===height-1) {
                    if (noBottom) {
                        type = "midTrunk"
                    } else {
                        type = "midBottom"
                    }
                } else {
                    type = "midTrunk"
                }
            }
            var xPos = cave.bg.x+(tileWidth*posX)+(tileWidth*2*b)
            var yPos = cave.bg.y+(tileWidth*posY)+(tileWidth*2*h)
            var block = new EarthBlock(xPos,yPos,cave,type)
        }
        
    }
}
function EarthWall(cave,posX,posY,side,noStart,noEnd) {
    var caveTop = (posY-(viewWidth/2)-(6*tileWidth))
    // var caveFloor = (cave.posY)-viewHeight+((tileWidth*2)*(tilesPerHeight-1))
    var caveFloor = cave.posY+((cave.screensHigh-1)*viewHeight)-(tileWidth*2)
    if (side === "left") {
        for (var b=0;b<tilesPerHeight/2;b++) {
            if (noStart || b > 0) {
                if (noEnd && (tilesPerHeight/2)-b <= 1) {
                    var type = "midTrunk"
                } else {
                    var type = "rightTrunk"
                }
            } else {
                var type = "midTrunk"
            }
            var xSpot = posX
            var ySpot = caveTop+(tileWidth*2*b)
            var block = new EarthBlock(xSpot,ySpot,cave,type)
        }
    }
    if (side === "right") {
        for (var b=0;b<tilesPerHeight/2;b++) {
            if (noStart || b > 0) {
                if (noEnd && (tilesPerHeight/2)-b <= 1) {
                    var type = "midTrunk"
                } else {
                    var type = "leftTrunk"
                }
            } else {
                var type = "midTrunk"
            }
            var xSpot = posX+(viewWidth-(tileWidth*2))
            var ySpot = caveTop+(tileWidth*2*b)
            var block = new EarthBlock(xSpot,ySpot,cave,type)
        }
    }
    if (side === "top") {
        var type = "midBottom"
        for (var b=0;b<tilesPerWidth/2;b++) {
            
            var xSpot = posX+(tileWidth*2*b)
            var ySpot = caveTop
            var block = new EarthBlock(xSpot,ySpot,cave,type)
        }
    }
    if (side === "bottom") {
        var type = "midTop"
        for (var b=0;b<tilesPerWidth/2;b++) {
            
            var xSpot = posX+(tileWidth*2*b)
            var ySpot = caveFloor
            var block = new EarthBlock(xSpot,ySpot,cave,type)
        }
    }
}
function EarthBlock(posX,posY,cave,type) {
    this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage(largeEarthTextures[type]))
    this.sprite.width = this.sprite.height = tileWidth*2
    this.sprite.x = posX
    this.sprite.y = posY
    this.standable = false
    this.type = type
    if (type === "midTop" || type === "leftTop" || type === "rightTop" || type === "midLedge" || type === "leftLedge"|| type === "rightLedge") {
        this.standable = true
    }
    cave.container.addChild(this.sprite)
    if (type !== "midTrunk") {
        cave.earthBlocks.push(this)
    }

}

function Speedboat(posX,posY) {
    this.container = new PIXI.Container()
    this.sprite = new PIXI.Sprite(speedboatText)
    this.sprite.width = tileWidth*8
    this.sprite.height = tileWidth*2
    this.sprite.x = posX
    this.sprite.y = posY-this.sprite.height

    this.container.addChild(this.sprite)
    stage.addChild(this.container)

    this.listenForPlayer = function() {
        var boatCenterX = this.sprite.x
        var boatCenterY  = this.sprite.x+(this.sprite.width/2)
        var xDist = boatCenterX-player.sprite.x
        var yDist = ((this.sprite.y+this.sprite.height/2)-player.sprite.y)
        // console.log("ydist " + xDist)
        if (xDist < 0 && xDist > -this.sprite.width/2 && yDist < this.sprite.height) {
            this.sprite.tint = 0x00ff00
        }
    }

    vehicles.push(this)
}

