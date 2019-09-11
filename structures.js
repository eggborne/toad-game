function Plateau(solid,posX,posY,height,width,imageSet,ledge,noSeams,noTop) {
    this.type = "plateau";
    this.contents = []
    this.bricks = []
    this.ledge = ledge;
    this.posX = posX;
    this.solid = solid;
    this.fading = "in";
    this.door = undefined
    this.cave = undefined
    this.homeCave = undefined
    this.large = false
    this.topless = false
    var large = (imageSet === largeEarthTextures || imageSet === largeStoneTextures)
    var tileSize = tileWidth
    this.posY = posY+height;
    if (large) {
        width /= 2
        height /= 2
        tileSize = tileWidth*2
        this.large = true
    }
    
    this.height = height;
    
    if (stage.y > window.innerHeight/2) {
        this.posY -= 1;
    }
    this.imageSet = imageSet;
    this.container = new PIXI.Container;
    if (noSeams) {
        this.leftTop = PIXI.Sprite.fromImage(imageSet.midTop)
        this.rightTop = PIXI.Sprite.fromImage(imageSet.midTop)
    }
    if (noTop) {
        this.topless = true
        this.leftTop = PIXI.Sprite.fromImage(imageSet.leftTrunk)
        this.rightTop = PIXI.Sprite.fromImage(imageSet.rightTrunk)
    }
    if (!noSeams && !noTop) {
        this.leftTop = PIXI.Sprite.fromImage(imageSet.leftTop)
        this.rightTop = PIXI.Sprite.fromImage(imageSet.rightTop)
        
    }
    this.bricks.push(this.leftTop,this.rightTop)
   
    this.leftTop.width = this.leftTop.height = this.rightTop.width = this.rightTop.height = tileSize;
    this.leftTop.x = posX*tileWidth;
    this.rightTop.x = this.leftTop.x+(width-1)*this.leftTop.width;
    // if (large) {
    //     this.leftTop.y = this.rightTop.y = ((tilesPerHeight+3)-(this.posY*2))*tileWidth;
    // } else {
        this.leftTop.y = this.rightTop.y = (tilesPerHeight-this.posY)*tileWidth;
    // }
    

    this.container.addChild(this.leftTop);
    this.container.addChild(this.rightTop);
    
    this.tintBricks = function(newColor) {
        for (var b=0;b<this.bricks.length;b++) {
            var brick = this.bricks[b]
            brick.tint = newColor
        }
    }

    for (var p=0;p<width-2;p++) {
        if (!noTop) {
            var middleTopPiece = PIXI.Sprite.fromImage(imageSet.midTop)
        } else {
            var middleTopPiece = PIXI.Sprite.fromImage(imageSet.midTrunk)
        }
        
        middleTopPiece.width = middleTopPiece.height = tileSize;
        middleTopPiece.x = this.leftTop.x + (p+1)*tileSize;
        middleTopPiece.y = this.leftTop.y;
        this.container.addChild(middleTopPiece);
        this.bricks.push(middleTopPiece)
        if (!ledge) {
            for (var k=0;k<height-1;k++) {
                var middleTrunkPiece = PIXI.Sprite.fromImage(imageSet.midTrunk)
                middleTrunkPiece.width = middleTrunkPiece.height = tileSize;
                middleTrunkPiece.x = this.leftTop.x + (p+1)*tileSize;
                middleTrunkPiece.y = this.leftTop.y + (k+1)*tileSize;

                this.container.addChild(middleTrunkPiece);
                this.bricks.push(middleTrunkPiece)
            }
        }
    }
    if (!ledge) {
        for (var s=0;s<height-1;s++) {
            if (!noSeams) {
                var leftTrunkPiece = PIXI.Sprite.fromImage(imageSet.leftTrunk)
                var rightTrunkPiece = PIXI.Sprite.fromImage(imageSet.rightTrunk)
            } else {
                var leftTrunkPiece = PIXI.Sprite.fromImage(imageSet.midTrunk)
                var rightTrunkPiece = PIXI.Sprite.fromImage(imageSet.midTrunk)
            }
            leftTrunkPiece.width = leftTrunkPiece.height = rightTrunkPiece.width = rightTrunkPiece.height = tileSize;

            leftTrunkPiece.x = this.leftTop.x;
            rightTrunkPiece.x = this.rightTop.x;
            leftTrunkPiece.y = rightTrunkPiece.y = this.leftTop.y+(s+1)*tileSize;
            this.container.addChild(leftTrunkPiece);
            this.container.addChild(rightTrunkPiece);
            this.bricks.push(leftTrunkPiece)
            this.bricks.push(rightTrunkPiece)

        }
    };
    this.wave = function() {
        if (mod(randomInt(8,12))) {
            for (var b=0;b<this.bricks.length;b++) {
                // console.log(brick)
                var brick = this.bricks[b]
                // console.log(brick.texture)
                if (randomInt(0,1) && brick.origTexture === seaTopText) {
                    if (brick.texture === seaTopText) {
                        brick.texture = seaTopText2
                    } else {
                        brick.texture = seaTopText
                    }
                } else if (randomInt(0,1) && brick.origTexture === seaMidText) {
                    if (brick.texture === seaMidText) {
                        brick.texture = seaMidText2
                    } else {
                        brick.texture = seaMidText
                    }
                }
            }
        }
    }
    // this.container.alpha = 0;
    this.hide = function() {
        this.container.visible = false
        // this.container.alpha = 0.5
        for (var c=0;c<this.contents.length;c++) {
            this.contents[c].container.visible = false
            // this.contents[c].container.alpha = 0.5
        }
    }
    this.show = function() {
        this.container.visible = true
        // this.container.alpha = 1
        for (var c=0;c<this.contents.length;c++) {
            if ((this.homeCave && this.homeCave === player.cave) || !this.homeCave) {
                this.contents[c].container.visible = true
            }
            // this.contents[c].container.alpha = 1
        }
    }
    this.fadeIn = function(speed) {
        this.container.alpha += speed;
        if (this.container.alpha >= 1) {
            this.container.alpha = 1;
            this.fading = undefined;
        }
    }
    this.onscreen = function() {
        var stagePos = stagePosition()
        var bottomEdge = this.floorSpan.groundY+(this.floorSpan.height*tileWidth)
        var on = false
        if (this.floorSpan.startX < stagePos.x+(viewWidth*1) &&
            this.floorSpan.startX+(this.floorSpan.span*tileWidth) > stagePos.x+(viewWidth*0) &&
            this.floorSpan.groundY <= (-stage.y)+viewHeight &&
            bottomEdge > (-stage.y)) {
            on = true  
        }
        if (this.moves && this.floorSpan.startX < stagePos.x+(viewWidth*1) &&
            this.floorSpan.startX+(this.floorSpan.span*tileWidth) > stagePos.x+(viewWidth*0)) {
            on = true  
        }
        // return true
        return on
    }
    plateaus.push(this);
    stage.addChildAt(this.container,0);
    if (large) {
        width *= 2
        height *= 2
    }
    this.floorSpan = {startX:this.leftTop.x,groundY:this.leftTop.y,span:width,height:height};
}
function Cave(name,plat,exitPlat,pattern) {
    this.name = name
    this.type = "cave"
    this.eggs = []
    var boundsArray = pattern.structure
    caves.push(this)
    plat.cave = this
    exitPlat.cave = this
    this.pattern = pattern
    this.plat = plat
    this.contents = []
    this.exitPlat = exitPlat
    this.earthBlocks = []
    this.doorways = []
    // console.log("mapping cave with viewwid " + viewWidth + " and height " + viewHeight)
    this.container = new PIXI.Container()
    this.bg = new PIXI.Sprite(pixelText)
    this.bgPanels = []
    this.bg.tint = 0x0000ff
    this.bg.visible = false
    this.posX = cavePosition.x
    this.posY = cavePosition.y
    var screensWide = boundsArray[0].length
    var screensHigh = boundsArray.length
    this.screensWide = screensWide
    this.screensHigh = screensHigh
    this.bg.width = screensWide*tilesPerWidth*tileWidth
    this.bg.height = screensHigh*viewHeight
    this.scrollLimit = {
        x: {
            min: cavePosition.x,
            max: cavePosition.x+this.bg.width
        },
        y: {
            min: cavePosition.y,
            max: cavePosition.y+this.bg.height
        }
    }
    var tilesWide = Math.round(this.bg.width/(tileWidth*2))
    var tilesHigh = Math.round(this.bg.height/(tileWidth*2))
    this.container.addChild(this.bg)
    var bgNeededX = Math.ceil(this.bg.width/(tileWidth*6))
    var bgNeededY = Math.ceil(this.bg.height/(tileWidth*6))
    for (var b=0;b<bgNeededX;b++) {
        for (var a=0;a<bgNeededY;a++) {
            var panel = new PIXI.Sprite(caveBGText)
            // panel.alpha = 0.1
            panel.width = panel.height = tileWidth*6
            panel.x = (tileWidth*2)+Math.round(this.bg.x+(panel.width*b)-(panel.width/2))
            panel.y = Math.round(this.bg.y+(panel.width*a))
            this.bgPanels.push(panel)
            this.container.addChild(panel)
        }
    }
    for (var w=0;w<this.screensWide;w++) {
        new EarthWall(this,this.posX+(viewWidth*w),this.posY,"bottom")
        new EarthWall(this,this.posX+(viewWidth*w),this.posY,"top")
        for (var h=0;h<this.screensHigh;h++) {
            var fill = this.pattern.structure[h][w]
            
            var noStart = h>0
            var noEnd = (h===this.screensHigh-1)
            
            if (w===0) {
                new EarthWall(this,this.posX+(viewWidth*w),this.posY+(viewHeight*h),"left",noStart,noEnd)
            }
            if (w===this.screensWide-1) {
                new EarthWall(this,this.posX+(viewWidth*w),this.posY+(viewHeight*h),"right",noStart,noEnd)
            }
            if (!fill) {
                var bottom = (h<(this.screensHigh-1) && this.pattern.structure[h+1][w] === 1) 
                var top = (h>0 && this.pattern.structure[h-1][w] === 1)  
                var left = (w>0 && this.pattern.structure[h][w-1] === 1) 
                var right = (w<(this.screensWide-1) && this.pattern.structure[h][w+1] === 1)
                new EarthScreen(this,[h,w],this.posX+(viewWidth*w),this.posY+(viewHeight*h),top,bottom,left,right)
            }
        }
    }
    this.topPos = -2
    this.leftPos = Math.round(cavePosition.x/(tileWidth))
    pattern.addLedges()

    this.container.x = this.posX
    this.container.y = this.posY
    console.log("cave cont placed at " + this.posX+" , " + this.posY)
    stage.addChildAt(this.container,0)
    
    // this.container.visible = false
    

    // cavePosition.x += this.bg.width

    this.removeBG = function() {
        for (var b=0;b<this.bgPanels.length;b++) {
            var panel = this.bgPanels[b]
            // panel.visible = false
        }
    }
    this.restoreBG = function() {
        for (var b=0;b<this.bgPanels.length;b++) {
            var panel = this.bgPanels[b]
            panel.visible = true
        }
    }
    this.hide = function() {
        this.container.visible = false
        // this.container.alpha = 0.5
        for (var c=0;c<this.contents.length;c++) {
            this.contents[c].container.visible = false
            // this.contents[c].container.alpha = 0.5
        }
    }

    this.hide()

    this.show = function() {
        this.container.visible = true
        // this.container.alpha = 1
        for (var c=0;c<this.contents.length;c++) {
            this.contents[c].container.visible = true
            // this.contents[c].container.alpha = 1
        }
    } 
    this.callCamera = function(doorwayIndex) {
        background.hideGround()
        background.hideClouds()
        this.container.visible = true
        player.cave = this
        console.log("logging " + player.cave.name)
        log("location",player.cave.name)
        if (rainField) {
            rainField.container.visible = false

        }
        if (lightningField) {
            lightningField.container.visible = false
        }
        
        stage.setChildIndex(player.sprite,stage.children.length-1)
        var targetDoorway = this.doorways[doorwayIndex]
        var sendPlayerX = this.posX+targetDoorway.sprite.x+(player.sprite.width/2*targetDoorway.flipped)
        
        var sendPlayerY = this.posY+targetDoorway.sprite.y+(player.sprite.height)
        player.sprite.x = sendPlayerX
        player.sprite.y = sendPlayerY
        player.sprite.alpha = 1
        player.lastPosition.x = player.sprite.x
        player.lastPosition.y = player.sprite.y
        // if (this.bg.width < viewWidth) {
        //     stage.x += (viewWidth-this.bg.width)/2
        //     $('#blinder-left').css('display','block')
        //     $('#blinder-right').css('display','block')
        // }
        enteringDoor = false
        if (this.bg.width > viewWidth) {
            // center door
            var sendStageX = -targetDoorway.sprite.x+(viewWidth/2)
        } else {
            // center cave, doesn't scroll
            var sendStageX = -this.posX
        }
        if (doorwayIndex === 0) {
            // bottom end
            var sendStageY = -this.posY-(this.bg.height-viewHeight)
        } else {
            // top end
            var sendStageY = -this.posY
        }
        // stage.x = sendStageX
        cameraToPlayerX()
        // stage.y = sendStageY
    }
}
function Door(plat,posX,posY) {  // leads to cave
    if (!posY) {
        posY = 0
    }
    this.partner = undefined
    this.container = new PIXI.Container()
    this.sprite = new PIXI.Sprite(redDoorText)
    this.hole = new PIXI.Sprite(redDoorText)
    this.hole.tint = 0x000000
    this.sprite.anchor.x = 1
    this.sprite.width = this.hole.width = tileWidth
    this.sprite.height = this.hole.height = tileWidth*2
    this.sprite.x = (plat.posX+posX+1)*tileWidth
    this.hole.x = (plat.posX+posX)*tileWidth
    this.sprite.y = this.hole.y = plat.floorSpan.groundY+((plat.floorSpan.height-2-posY)*tileWidth)
    this.opened = false
    this.opening = false
    this.closing = false
    this.suckDistance = 0
    this.container.addChild(this.hole)
    this.container.addChild(this.sprite)
    plat.container.addChild(this.container)
    if (!plat.door) {
        plat.door = this
    } else {
        plat.door2 = this
    }
    this.plat = plat
    this.posX = posX
    if (plat.large) {
        this.actualPosX = plat.posX+posX
        this.actualPosY = (plat.posY-plat.floorSpan.height)+posY
    } else {
        this.actualPosX = plat.posX+posX
        this.actualPosY = (plat.posY-plat.floorSpan.height)+posY
    }
    
    this.listenForPlayer = function() {
        if (Math.abs(player.sprite.x-(this.sprite.x-(this.sprite.width/2))) < (tileWidth/2) &&
            Math.abs(player.sprite.y-(this.sprite.y+this.sprite.height)) < (tileWidth)) {
            if (pressingUp) {
                // console.log("pushing open")
                this.opening = true
                this.suckDistance = (this.sprite.x-(this.sprite.width/2))-(player.sprite.x)
                player.doorEntered = this
                player.velocity.x = 0
                enteringDoor = true
            }
        }
    }
    
    this.open = function() {
        var increment = tileWidth/10
        var suckage = this.suckDistance/9
        if (!this.opened) {
            // console.log("opening?")
            if (this.sprite.width-(increment) > 0) {
                this.sprite.width -= increment
                player.sprite.x += suckage
            } else {
                this.opened = true
                this.opening = false
                // console.log("OPEN!")
                doorClosing = this
                // player.lastDoorwayPos.x = player.sprite.x
                // player.lastDoorwayPos.y = player.sprite.y
                // lastCameraPos.x = stage.x
                // lastCameraPos.y = stage.y
                setTimeout(function(){
                    doorClosing.closing = true
                },250)
                // player.sprite.x = (this.sprite.x-(this.sprite.width/2))
            }
        }
    }
    this.close = function(animate) {
        var increment = tileWidth/9
        if (this.opened) {
            // console.log("closing?")
            if (animate) {
                if (this.sprite.width+(increment) < tileWidth) {
                    this.sprite.width += increment
                } 
            } else {
                var targIndex = this.plat.cave.doorways.indexOf(this.partner)
                // if (this.plat.cave.plat === this.plat.cave.exitPlat) {
                //     targIndex = 0
                // }
                this.sprite.width = tileWidth
                this.opened = false
                this.closing = false
                // console.log("CLOSED!")
                enteringDoor = false
                player.doorEntered = undefined
                this.plat.cave.callCamera(targIndex)
            }
        }
    }
}
function Doorway(cave,posX,posY) {
    this.cave = cave
    this.partner = undefined
    this.sprite = new PIXI.Sprite(pixelText)
    // this.sprite.tint = 0xff0000
    this.sprite.alpha = 0
    this.sprite.width = tileWidth
    this.sprite.height = tileWidth*2
    this.sprite.x = posX
    this.sprite.y = posY
    this.shade = new PIXI.Sprite(doorwayText)
    this.shade.width = tileWidth*3
    this.shade.height = tileWidth*2
    this.shade.x = posX
    this.shade.y = posY
    this.opened = false
    this.opening = false
    this.closing = false
    this.suckDistance = 0
    this.flipped = 1
    cave.doorways.push(this)
    cave.container.addChild(this.shade)
    cave.container.addChild(this.sprite)
    this.flip = function() {
        this.sprite.scale.x *= -1
        this.shade.scale.x *= -1
        this.flipped = -1
    }
    this.listenForPlayer = function() {
        var yDist = Math.abs(player.sprite.y-(this.cave.container.y+this.sprite.y+this.sprite.height))
        if (Math.abs(player.sprite.x-(this.cave.container.x+this.sprite.x+(this.sprite.width/2*this.flipped))) < (tileWidth/2) &&
            yDist < (tileWidth)) {
                this.sprite.tint = 0x00ff00
            if (pressingUp) {
                this.opening = true
                this.suckDistance = (this.cave.container.x+this.sprite.x+(this.sprite.width/2*this.flipped))-(player.sprite.x)
                player.doorEntered = this
                
                player.velocity.x = 0
                enteringDoor = true
                background.showGround()
                background.showClouds()
            }
        } else {
            this.sprite.tint = 0xff0000
        }
    }
    
    this.open = function() {
        var increment = tileWidth/10
        var suckage = this.suckDistance/9
        if (!this.opened) {
            if (this.sprite.width-(increment) > 0) {
                this.sprite.width -= increment
                player.sprite.x += suckage
            } else {
                this.opened = true
                this.opening = false
                doorClosing = this
                setTimeout(function(){
                    
                    doorClosing.closing = true
                },250)
                // player.sprite.x = (this.sprite.x-(this.sprite.width/2))
            }
        }
    }
    this.close = function(animate) {
        var increment = tileWidth/9
        if (this.opened) {
            if (animate) {
                if (this.sprite.width+(increment) < tileWidth) {
                    this.sprite.width += increment
                } 
            } else {
                this.sprite.width = tileWidth
                this.opened = false
                this.closing = false
                enteringDoor = false
                player.doorEntered = undefined
                var targX = this.partner.sprite.x-(tileWidth/2)
                var targY = this.partner.sprite.y+(tileWidth*2)
                player.sprite.x = targX
                player.sprite.y = targY-(tileWidth/2)
                // stage.x = -targX+(viewWidth/2)
                var screenY = screenYForPosition(this.partner.sprite.y)
                console.log("screenY for exit door " + screenY)
        
                // var stageY = -this.partner.plat.floorSpan.groundY-(this.partner.plat.floorSpan.height*tileWidth)+((tilesPerHeight-3)*tileWidth)
                // var stageY = cameraToYLevel(screenY)
                // stage.y = stageY
                player.sprite.alpha = 1
                player.cave.container.visible = false
                player.cave = undefined
                log("location",player.area)  
                if (rainField) {
                    rainField.container.visible = true      
                    if (lightningField) {
                        lightningField.container.visible = true
                    }        
                }
                
                cameraToPlayerX()
                
                // setTimeout(function(){
                //     player.cave = undefined
                // },100)
                
                // $("#shade").css('transition','none')
                // $("#shade").css('opacity',((-player.screenOccupying().y)/(worldScreensHigh/2)))
                // starField.alphaToLevel((-player.screenOccupying().y))
            }
        }
    }
    
}
function ed209(posX,posY) {
    this.container = new PIXI.Container()

    // this.head.anchor.set(0.5)
    this.legs = new PIXI.Sprite.fromImage("legs1.png")
    this.legs.height = tileWidth*5
    this.legs.width = this.legs.height*(108/112) 
    // this.head.x += this.legs.width/2
    // this.head.y += this.head.height/3
    this.container.addChild(this.legs)
    this.container.x = posX
    this.container.y = posY-this.container.height
    this.cockpit = function() {
        return {x:this.container.x+(this.container.width/2),y:this.container.y+(tileWidth)}
    }
    stage.addChild(this.container)

    this.listenForPlayer = function() {
        var distX = Math.abs(this.container.x+(this.container.width/2)-player.sprite.x)
        var distY = player.sprite.y-(this.container.y)
        console.log("x " + distY)
        if (distX < this.container.width/2 && distY > 0 && distY < this.container.height/2 ) {
            if (!player.vehicle) {
                player.enterVehicle(this)
            }
        }
    }

}

function WaterfallArea(posX,posY,totalWidth,leftPlatWidth,rightPlatWidth,height,imageSet) {
    this.leftPlat = new Plateau(false,posX,posY,height,leftPlatWidth,imageSet)
    
    var waterWidth = totalWidth-(leftPlatWidth+rightPlatWidth)
    this.rightPlat = new Plateau(false,posX+leftPlatWidth+waterWidth,posY,height,rightPlatWidth,imageSet)
    this.waterfall = new Waterfall(posX+leftPlatWidth,posY-5,waterWidth,height+2)
    this.logs = []
    for (var g=0;g<10;g++) {
        if (g<5) {
            var xPos = posX+waterWidth+1
            var yPos = posY-(tileWidth*g)
        } else {
            var xPos = posX+waterWidth+5
            var yPos = posY-(tileWidth*(g-1))
        }
        var log = new Log(xPos,yPos,height+2,3,3)
        log.plat.waterfall = this.waterfall
        stage.setChildIndex(log.plat.container,stage.children.indexOf(this.waterfall.container))
    }

    

}
function Log(posX,posY,waterfallHeight,length,movement) {
    this.plat = new Plateau(false,posX,posY,1,length,logTextures,true)
    this.plat.moves = true
    this.plat.move = function() {
        this.container.y += movement*(tileWidth/64)
        this.floorSpan.groundY += movement*(tileWidth/64)
        if (player.standingOn === this) {
            player.sprite.y += movement*(tileWidth/64)
        }
        var upperLimit = (posY-waterfallHeight-1)*tileWidth
        var lowerLimit = (posY+1)*tileWidth
        console.log("lim " + lowerLimit)
        console.log("con " + this.container.y)
        if (movement < 0 && this.container.y < upperLimit) {
            this.container.y += waterfallHeight*tileWidth
            this.floorSpan.groundY += waterfallHeight*tileWidth
        }
        if (movement > 0 && this.container.y > lowerLimit) {
            this.container.y -= (waterfallHeight+1)*tileWidth
            this.floorSpan.groundY -= (waterfallHeight+1)*tileWidth
        }
        // this.container.y = Math.round(this.container.y)
    }
    
}
function Whale(posX,posY) {
    this.sprite = new PIXI.Sprite(whaleText)
    this.sprite.width = tileWidth*8
    this.sprite.height = tileWidth*2
    this.sprite.anchor.y = 1
    this.sprite.x = tileWidth*posX
    this.sprite.y = (tilesPerHeight-posY)*tileWidth

    whales.push(this)
    stage.addChild(this.sprite)
}