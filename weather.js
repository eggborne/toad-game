backgroundTints = [
    0xffffff,
    0xeeeeee,
    0xdddddd,
    0xcccccc,
    0xbbbbbb,
    0xaaaaaa,
    0x999999,
    0x888888,
    0x777777,
    0x555555,
]
function LightningField() {
    this.container = new PIXI.Container()
    this.bg = new PIXI.Sprite(pixelText)
    this.bg.width = viewWidth
    this.bg.height = viewHeight
    this.bg.tint = 0xffffbb
    this.container.addChild(this.bg)
    this.container.visible = false
    stage.addChild(this.container)
    this.flash = function(duration) {
        this.container.x = -stage.x
        this.container.y = -stage.y
        var sinceStruck = counter-lightningStruckAt
        if (sinceStruck%1 === 0 && !randomInt(0,3)) {
            if (this.container.visible) {
                this.container.visible = false
            } else {
                this.container.visible = true
                this.container.alpha = randomInt(10,40)/100
            }
            
        }
        if (sinceStruck >= duration) {
            this.container.visible = false
            lightningStruckAt = undefined
        }
    }
}
function RainField(thickness) {
    this.layers = []
    this.drops = 0
    this.dropSprites = []
    this.container = new PIXI.Container()
    this.stopping = false
    this.stopped = true
    this.fallSpeed = tileWidth/3
    this.changeSpeed = 1
    this.containers = [background.bg4,background.bg2,stage,this.container]
    this.homeY = 0
    this.spawnDrop = function() {
        var drop = new PIXI.Sprite(pixelText)
        // drop.spawnAsBitmap = true
        drop.tint = 0xada8ff
        // drop.tint = 0xcdc8ff
        drop.width = tileWidth/32
        drop.height = tileWidth/2
        drop.x = randomInt(0,viewWidth)
        drop.y = randomInt(this.homeY-viewHeight,this.homeY-drop.height)
        drop.speedBoost = randomInt(0,3)*(tileWidth/16)
        
        drop.contIndex = randomInt(0,3)
        drop.alpha = 0.5+(drop.contIndex*0.1)
        drop.container = this.containers[drop.contIndex]
        drop.container.addChildAt(drop,drop.container.children.length)
        this.dropSprites.push(drop)
        this.drops++
    }
    this.removeDrop = function() {
        this.dropSprites[0].container.removeChild(this.dropSprites[0])
        this.dropSprites.splice(0,1)
        // this.container.removeChild(this.container.children[0])
        this.drops--
        if (!this.drops) {
            this.stopped = true
        }
        console.log("removing, now " + this.drops)
    }
    this.dropsToLevel = function() {
        if (player.screenOccupying().y > -rainOriginY) {
            var rainForLevel = startingRain+(-player.screenOccupying().y*rainPerLevel)
        } else {
            rainForLevel = 0
        }
        if (mod(this.changeSpeed) && this.container.children.length < rainForLevel && this.container.children.length < 500) {
            this.spawnDrop()
        }
        if (mod(this.changeSpeed) && this.container.children.length > rainForLevel) {
            this.removeDrop()
        }
    }
    this.animate = function() {
        for (var y=0;y<this.dropSprites.length;y++) {
            var drop = this.dropSprites[y]
            drop.y += this.fallSpeed+drop.speedBoost
            if (drop.y > (this.homeY+viewHeight)) {
                drop.x = randomInt(0,viewWidth)
                drop.y -= (viewHeight+(drop.height*2))
            }
            
            if (stage.x < (-drop.x) ) {
                drop.x += viewWidth
            }
            if (stage.x-viewWidth > (-drop.x) ) {
                drop.x -= viewWidth
            }
            
        }
        
        if (!this.stopped) {
            // this.dropsToLevel(this.changeSpeed)
        }
    }
    for (var d=0;d<thickness;d++) {
        this.spawnDrop()
    }
    stage.addChildAt(this.container,stage.children.length-1)
    // stage.addChild(this.container2)
    // stage.addChild(this.container3)
}
function StarField(thickness) {
    this.container = new PIXI.Container()
    
    this.spawnStar = function() {
        var star = new PIXI.Sprite(pixelText)
        // drop.spawnAsBitmap = true
        star.tint = 0xffffff
        var randSize = tileWidth/(randomInt(140,160)/10)
        star.width = star.height = randSize
        star.x = randomInt(0,viewWidth)
        star.y = randomInt(0,viewHeight)
        star.alpha = 1-(randomInt(0,4)*0.2)
        this.container.addChild(star)
    }
    
    this.animate = function(speed) {
        if (mod(speed)) {
            for (var d=0;d<this.container.children.length;d++) {
                if (!randomInt(0,10)) {
                    var star = this.container.children[d]
                    star.alpha = 1-(randomInt(0,4)*0.2)
                }
            }
        }
        
    }
    this.alphaToLevel = function(level) {
        var starsAlpha = (level-2)/(worldScreensHigh/2)
        
        if (starsAlpha > 1) {
            starsAlpha = 1
        }
        if (starsAlpha < 0) {
            starsAlpha = 0
        }
        console.log("star alpha = " + starsAlpha)
        starField.container.alpha = starsAlpha
    }
    for (var d=0;d<thickness;d++) {
        this.spawnStar()
    }
    stage.addChildAt(this.container,0)
    this.container.alpha = 0
}
function advanceTime() {
    var ampm = " AM"
    currentTime++
    if (currentTime >= 600 && currentTime < 1700) {
        if (starField.container.alpha) {
            starField.container.alpha = 0
        }
        var bgTintIndex = 0
        // $(document.body).css({
        //     backgroundColor: "#7EC0EE"
        // })
        // console.log("DAY ------------------------- " + currentTime)
    } else {
        if (currentTime > 2100 || currentTime < 530) {
            
            if (starField.container.alpha!==1) {
                starField.container.alpha = 1
            }
            var bgTintIndex = 9
            // console.log("NIGHT ------------------------- " + currentTime)
        } else if (currentTime >= 530 && currentTime < 630) {
            if (starField.container.alpha!==0.2) {
                starField.container.alpha = 0.3
            }
            var bgTintIndex = 4
            // console.log("SUNRISE ------------------------- " + currentTime)
        } else {
            if (starField.container.alpha!==0.2) {
                starField.container.alpha = 0.3
            }
            var bgTintIndex = 4
            // $(document.body).css({
            //     backgroundColor: "rgb(255, 188, 255)"
            // })
            // console.log("SUNSET ------------------------- " + currentTime)
        }
    }
    plateauTint = backgroundTints[bgTintIndex]
    for (var p=0;p<plateaus.length;p++) {
        var plateau = plateaus[p];
        if (plateau.container.visible) {
            plateau.tintBricks(plateauTint)
            // for (var c=0;c<plateau.container.children.length;c++) {
            //     var item = plateau.container.children[c]
            //     item.tint = plateauTint
            // }
        }
    }
    // console.log("using index " + bgTintIndex + " at time " + currentTime)

    var timeString = currentTime.toString()
    var nextToLast = timeString[timeString.length-2]
    // console.log("ntl " + nextToLast)
    if (nextToLast === "6") {
        currentTime -= 60
        currentTime += 100
        if (currentTime===2500) {
            currentTime = 100
        }
        timeString = currentTime.toString()
    }
 
    if (currentTime >= 1300) {
        timeString = (currentTime-1200).toString()
        
    }
    if (currentTime >= 1200) {
        ampm = " PM"
        
    }
    if (timeString.length < 4) {
        if (timeString.length===3) {
            timeString = "0"+timeString
        } else if (timeString.length===2) {
            timeString = "00"+timeString
        } else if (timeString.length===1) {
            timeString = "000"+timeString
        }
    }
    if ((timeString[2]==1 && timeString[3]==5) ||
        (timeString[2]==3 && timeString[3]==0) ||
        (timeString[2]==0 && timeString[3]==0) ||
        (timeString[2]==4 && timeString[3]==5)) {
        if (timeString[0] !== "0") {
            log('time',timeString[0]+timeString[1]+":"+timeString[2]+timeString[3]+ampm)
        } else {
            log('time',timeString[1]+":"+timeString[2]+timeString[3]+ampm)
        }
    }
    $("#shade").css('opacity',bgTintIndex/10)
    
    background.tintAll(backgroundTints[bgTintIndex])
    
}