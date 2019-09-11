fullScreen = false;
framerate = 60;
timeSinceLastDrawn = 0;
HWRATIO = window.innerHeight/window.innerWidth;
bgColor = 0x528CA5;
isTouchDevice = 'ontouchstart' in document.documentElement;
cursor = {x:undefined,y:undefined};
cursorAtLastFrame = null;
gameInitiated = false;
var pressingAButton, pressingLShift, pressingUp, pressingLeft, pressingUpLeft, pressingUpRight, pressingDownLeft, pressingDownRight, pressingB, pressingDown, pressingB, pressingYButton, pressingXButton, pressingZ, pressingRight, pressingQ, releasedDownAt;
pressedAAt = pressedQAt = pressedDownAt = pressedXAt = pressedBAt = pressedYAt = releasedLeftAt = releasedRightAt = releasedYAt = releasedXAt = releasedAAt = releasedBAt = releasedSpaceAt = -1;
incomingMenu = undefined;
movingToNewScreen = false;
landedOnNewScreen = undefined;
lastEndTouch = undefined
lastTouchPos = undefined
oldStagePosition = {}
PIXI.utils.skipHello()
screens = [];
progress = [];
enteringDoor = false
doorClosing = undefined
caves = []
vehicles = []
npcs = []
eggs = []
aliens = []
flames = []
whales = []
boughtItems = []
lastCameraPos = {x:0,y:0}
lightningStruckAt = undefined
lightningDuration = randomInt(30,100)
lightningFrequency = randomInt(500,1000)
activeDBox = undefined
currentTime = 1400

// var darkenMatrix =  [
//     1,0,0,-0.25,
//     0,1,0,-0.25,
//     0,0,1,-0.25,
//     0,0,0,1
// ];
// darkenFilter = new PIXI.filters.ColorMatrixFilter();
// darkenFilter.matrix = darkenMatrix;

gameOverMusic = new Howl({
    src: ['assets/sounds/game_over.wav'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
selectSound = cherrySound = new Howl({
    src: ['assets/sounds/cherry.wav'],
    volume:0.8,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
jumpSound = new Howl({
    src: ['assets/sounds/jump.ogg'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
pluckSound = new Howl({
    src: ['assets/sounds/plucking.wav'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
enemyHitSound = new Howl({
    src: ['assets/sounds/enemy_hit.wav'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
bombExplodeSound = new Howl({
    src: ['assets/sounds/enemy_hit.wav'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
growSound = new Howl({
    src: ['assets/sounds/growing.wav'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
shrinkSound = new Howl({
    src: ['assets/sounds/shrinking.wav'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
playerDamageSound = new Howl({
    src: ['assets/sounds/player_damage.wav'],
    volume:1,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});
throwSound = new Howl({
    src: ['assets/sounds/throwing.wav'],
    volume:0.6,
    playing: false,
    onplay: function() {this.playing = true},
    onend: function() {this.playing = false}
});

function playSound(sound) {
    // if (!sound.playing) {
        // sound.play();
    // }
}


lastDrawn = undefined;

soundOn = true;
musicOn = true;

windSpeed = 10;
cherrySpeed = 10;

freefallVelocity = -12;

if (isTouchDevice) {
    tilesPerHeight = 14;
} else {
    tilesPerHeight = 14;
}

if (window.innerWidth >= window.innerHeight) {
    shorterDimension = window.innerHeight;
    longerDimension = window.innerWidth;
    viewWidth = window.innerHeight*(16/14)
    viewHeight = window.innerHeight
    landscape = true
} else {
    shorterDimension = window.innerWidth;
    longerDimension = window.innerHeight;
    viewWidth = window.innerWidth
    viewHeight = window.innerWidth*(14/16)
    landscape = false
}



tileWidth = Math.abs(viewHeight/tilesPerHeight);
// tilesPerWidth = Math.ceil(window.innerWidth/tileWidth);
tilesPerWidth = 16
pieceSize = Math.round(tileWidth*2.2)
//tileWidth = shorterDimension/tilesPerHeight;
//tilesPerWidth = Math.ceil(longerDimension/tileWidth);
counter = 0;

dialogueStyle.fontSize = dialogueStyle2.fontSize = Math.round(tileWidth/2.1)+'px'

gravityStrength = tileWidth/3.5;
// gravityStrength = tileWidth/20;

floorLevel = viewHeight-(tileWidth*4)
plateauTint = 0xffffff
plateaus = [];
tufts = [];
cherries = [];
climbables = [];
mushroomBlocks = [];
posts = [];
vegetables = [];
bombs = [];
explosionSprites = [];
enemies = [];
bullets = [];
waterfalls = []
floorPlats = []
cavePosition = {x:0,y:viewHeight}

// scrollMax = {left:window.innerWidth/2,right:window.innerWidth*1.5}
worldScreensWide = 32
worldScreensHigh = 32
worldScrollLimit = {
    x: {
        min: 0,
        max: viewWidth*worldScreensWide
    },
    y: {
        min: 0,
        max: 0
    }
}
player = undefined
function setOptions() {

}
function log(divID,msg) {
    // console.log("printing " + msg)
    document.getElementById(divID).innerHTML = msg
}


function sizeStage(outerX,outerY) {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    PIXI.settings.RESOLUTION = window.devicePixelRatio
    renderer = PIXI.autoDetectRenderer({ 
        width:viewWidth,
        height:viewHeight,
        autoResize: true,
        powerPreference: 'high-performance',
        roundPixels: true,
        // backgroundColor:bgColor,
        transparent:true
    });

    // renderer.plugins.interaction.interactionFrequency = 1;
    stage = new PIXI.Container();
    
    // stage.pivot.x = stage.x = viewWidth/2;
    // stage.pivot.y = stage.y = viewHeight/2;
    // stage.interactive = true;
    // stage.width = outerX;
    // stage.height = outerY;
    // document.body.appendChild(renderer.view);
    document.getElementById('game-canvas').appendChild(renderer.view);
    if (isTouchDevice) {
        
        dPadPieces = ['nes-center','nes-up','nes-down','nes-left','nes-right','nes-up-left','nes-up-right','nes-down-left','nes-down-right']
        var centerX = Math.round((pieceSize*1.42))
        var centerY = Math.round((viewHeight+((window.innerHeight-viewHeight)/2)-(pieceSize/2)))
        var buttonSize = tileWidth*3
        var buttonX = (window.innerWidth)-buttonSize*2.5
        if (landscape) {
            centerX = Math.round((pieceSize*1.25))
            centerY = Math.round(window.innerHeight-pieceSize*2.25)
            buttonX = Math.round(window.innerWidth-(buttonSize*2.4))
            $('#nes-panel').css('opacity','0.7')
            var extra = (window.innerWidth-(tilesPerWidth*tileWidth))/2
            $('#blinder-left').css('width',extra+'px')
            $('#blinder-right').css('width',extra+'px')
            $('#blinder-right').css('left',(window.innerWidth-extra)+'px')
            $('#game-canvas').css('left',extra+'px') 
        }
        var buttonY = Math.round(centerY+(pieceSize*2)-buttonSize)
        $("#nes-panel").css({
            height:(window.innerHeight-viewHeight)*0.98+'px',
            // height:(pieceSize*5)+'px',
            top:viewHeight+'px',
            fontSize:(tileWidth/1.5)+'px'
            
            // top:(viewHeight+centerX-(pieceSize/2))+'px'
        })
        $("#nes-back").css({
            height:(window.innerHeight-viewHeight)+'px',
            top:viewHeight+'px',
        })
        dPadPositions = [
            {
                name:'nes-center',top:centerY, left:centerX
            },
            {
                name:'nes-up',top:centerY-pieceSize, left:centerX,
                touchOn:function(){
                    pressUp()
                },
                touchOff:function(){
                    releaseUp()
                }
            },
            {
                name:'nes-down',top:centerY+pieceSize, left:centerX,
                touchOn:function(){
                    pressDown()
                },
                touchOff:function(){
                    releaseDown()
                }
            },
            {
                name:'nes-left',top:centerY, left:centerX-pieceSize,
                touchOn:function(){
                    pressLeft()
                },
                touchOff:function(){
                    releaseLeft()
                }
            },
            {
                name:'nes-right',top:centerY, left:centerX+pieceSize,
                touchOn:function(){
                    pressRight()
                },
                touchOff:function(){
                    releaseRight()
                }
            },
            {
                name:'nes-up-left',top:centerY-pieceSize, left:centerX-pieceSize,
                touchOn:function(){
                    pressUpLeft()
                },
                touchOff:function(){
                    releaseUpLeft()
                }
            },
            {
                name:'nes-up-right',top:centerY-pieceSize, left:centerX+pieceSize,
                touchOn:function(){
                    pressUpRight()
                },
                touchOff:function(){
                    releaseUpRight()
                }
            },
            {
                name:'nes-down-left',top:centerY+pieceSize, left:centerX-pieceSize,
                touchOn:function(){
                    pressDownLeft()
                },
                touchOff:function(){
                    releaseDownLeft()
                }
            },
            {
                name:'nes-down-right',top:centerY+pieceSize, left:centerX+pieceSize,
                touchOn:function(){
                    pressDownRight()
                },
                touchOff:function(){
                    releaseDownRight()
                }
            }
        ]
        $("#nes-panel").html('<div class="nes-piece" id="nes-center"></div><div class="nes-piece" id="nes-up"></div><div class="nes-piece" id="nes-down"></div><div class="nes-piece" id="nes-left"></div><div class="nes-piece" id="nes-right"></div><div class="nes-piece" id="nes-up-left"></div><div class="nes-piece" id="nes-up-right"></div><div class="nes-piece" id="nes-down-left"></div><div class="nes-piece" id="nes-down-right"></div><div class="nes-piece" id="b-button"></div><div class="nes-piece" id="a-button"></div><div class="nes-piece" id="y-button"></div><div class="nes-piece" id="x-button"></div><div id="y-symbol"></div><div id="x-symbol"></div><div id="b-symbol"></div><div id="a-symbol"></div><div id="y-label"></div><div id="x-label"></div><div id="b-label"></div><div id="a-label"></div><div class="nes-piece" id="map-button"></div>')
        
        for (var d=0;d<dPadPieces.length;d++) {
            var pieceName = dPadPieces[d]
            var pos = dPadPositions[d]
            if (d<5) {
                
            } else {
                $("#"+pieceName).css({
                    'display':'none'
                })
            }
            
            $("#"+pieceName).css({
                width:pieceSize+'px',
                height:pieceSize+'px',
                top:pos.top+'px',
                left:pos.left+'px'
            })
        }
    
        $("#a-button").css({
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:buttonY+'px',
            left:(buttonX+(buttonSize*1.2))+'px',
        })
        $("#a-button").on('touchstart',function(){
            pressAButton()
        })
        $("#a-button").on('touchend',function(){
            releaseAButton()
        })
        $("#a-button").on('touchendoutside',function(){
            releaseAButton()
        })
        $("#b-button").css({
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:buttonY+'px',
            left:buttonX+'px'
        })
        $("#b-button").on('touchstart',function(){
            pressBButton()
        })
        $("#b-button").on('touchend',function(){
            releaseBButton()
        })
        $("#b-button").on('touchendoutside',function(){
            releaseBButton()
        })

        $("#y-button").css({
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:(buttonY-(buttonSize*1.1))+'px',
            left:buttonX+'px'
        })
        $("#y-button").on('touchstart',function(){
            pressYButton()
        })
        $("#y-button").on('touchend',function(){
            releaseYButton()
        })
        $("#y-button").on('touchendoutside',function(){
            releaseYButton()
        })

        $("#x-button").css({
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:(buttonY-(buttonSize*1.1))+'px',
            left:(buttonX+(buttonSize*1.2))+'px'
        })
        $("#x-button").on('touchstart',function(){
            pressXButton()
        })
        $("#x-button").on('touchend',function(){
            releaseXButton()
        })
        $("#x-button").on('touchendoutside',function(){
            releaseXButton()
        })
        $("#y-symbol").css({
            // backgroundSize:(tileWidth/2)+'px',
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:(buttonY-(buttonSize*1.1))+'px',
            left:buttonX+'px'
        })
        $("#x-symbol").css({
            // backgroundSize:(tileWidth)+'px',
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:(buttonY-(buttonSize*1.1))+'px',
            left:(buttonX+(buttonSize*1.2))+'px'
        })
        $("#b-symbol").css({
            backgroundSize:(tileWidth*0.8)+'px',
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:buttonY+'px',
            left:buttonX+'px'
        })
        $("#a-symbol").css({
            // backgroundSize:(tileWidth)+'px',
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:buttonY+'px',
            left:(buttonX+(buttonSize*1.2))+'px'
        })
        $("#y-label").css({
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:(buttonY-(buttonSize*1.1))+'px',
            left:buttonX+'px',
            'line-height':(buttonSize*1.05)+'px',
            'font-size':(tileWidth/2.2)+'px'
        })
        $("#x-label").css({
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:(buttonY-(buttonSize*1.1))+'px',
            left:(buttonX+(buttonSize*1.2))+'px',
            'line-height':(buttonSize*1.05)+'px',
            'font-size':(tileWidth/2.2)+'px'
        })
        $("#b-label").css({
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:buttonY+'px',
            left:buttonX+'px',
            'line-height':(buttonSize*1.05)+'px',
            'font-size':(tileWidth/2.2)+'px'
        })
        $("#a-label").css({
            width:buttonSize+'px',
            height:buttonSize+'px',
            top:buttonY+'px',
            left:(buttonX+(buttonSize*1.2))+'px',
            'line-height':(buttonSize*1.05)+'px',
            'font-size':(tileWidth/2.2)+'px'
        })

        $("#map-button").on('touchstart',function(){
            toggleMap()
            $("#map-button").css('transform','scale(0.95,0.95)')
        })
        $("#map-button").on('touchend',function(){
            
            $("#map-button").css('transform','none')
        })
        var topSpace = (centerY-pieceSize)-viewHeight
        var logFontSize = (tileWidth/2.5)
        if (!landscape) {
            var barY = viewHeight-tileWidth
            if (topSpace < tileWidth*2) {
                var logY = viewHeight-(tileWidth*1.5)
            } else {
                var logY = viewHeight+(tileWidth*0.5)
            }
        } else {
            var barY = 0
            var logY = tileWidth*1.5
        }
        if (landscape) {
            
        } else {
            
        }
        $("#map-button").css({
            width:buttonSize+'px',
            height:Math.round(buttonSize/1.5)+'px',
            top:logY+'px',
            left:(buttonX+(buttonSize*1.2))+'px'
        })
        var infoShadow = (tileWidth/24) + 'px ' + (tileWidth/24) + 'px ' + (tileWidth/24) + 'px ' + ' black'
        console.log("space above dPad " + topSpace)
        $("#location").css({
            fontSize:logFontSize+'px',
            height:tileWidth+'px',
            top:barY+'px',
            left:(-tileWidth/4)+'px',
            lineHeight:tileWidth+'px',
            textShadow: infoShadow
            
        })
        $("#coins").css({
            fontSize:logFontSize+'px',
            height:tileWidth+'px',
            top:barY+'px',
            lineHeight:tileWidth+'px',
            left:(tileWidth/2)+'px',
            textShadow: infoShadow
        })
        $("#time").css({
            fontSize:logFontSize+'px',
            height:tileWidth+'px',
            top:barY+'px',
            lineHeight:tileWidth+'px',
            right:(tileWidth/2)+'px',
            textShadow: infoShadow
        })
        function copyTouch(touch,startSpot) {
            return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY, startSpot:startSpot };
        }
        function ongoingTouchIndexById(idToFind) {
            for (var i = 0; i < ongoingTouches.length; i++) {
                var id = ongoingTouches[i].identifier;
                
                if (id == idToFind) {
                    return i;
                }
            }
            return -1;    // not found
        }
        // startTouch = undefined
        // currentTouch = undefined
        ongoingTouches = []
        lastEndTouchSpot = {}
        removedTouchAt = -99
        lastLiftedTouch = undefined
        distX = undefined
        distY = undefined
        var el = document.getElementById('nes-panel');
        el.addEventListener("touchstart", handleStart, false)
        el.addEventListener("touchend", handleEnd, false);
        // el.addEventListener("touchcancel", handleCancel, false);
        el.addEventListener("touchmove", handleMove, false);

        $("#b-symbol").addClass("jump")
    }
    
    function handleStart(evt) {
        evt.preventDefault();
        var el = document.getElementById("nes-panel");
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]));
        }
        // log(touches[touches.length-1])
        // log("start " + touches[touches.length-1].pageX + ", " + touches[touches.length-1].pageY)
    }
    function handleMove(evt) {
        evt.preventDefault();
        var el = document.getElementById("nes-panel");
        var touches = evt.changedTouches;
        
        for (var i = 0; i < touches.length; i++) {
            var idx = ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {

            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
            }
            // var newTouch = touches[i]
            // if (touchOverElement(newTouch,"#a-button")) {
            //     if (!pressingAButton) {
            //         // pressAButton()
            //     }
            // } else {
            //     if (pressingAButton) {

            //         // releaseAButton()
            //     }
            // }
            // if (touchOverElement(newTouch,"#b-button")) {
            //     if (!pressingBButton) {
            //         // pressBButton()
            //     }
            // } else {
            //     if (pressingBButton) {
            //         // releaseBButton()
            //     }
            // }
        }
        // log("move " + touches[touches.length-1].pageX + ", " + touches[touches.length-1].pageY)
      }
      function handleEnd(evt) {
        evt.preventDefault();
        var el = document.getElementById("nes-panel");
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
          var idx = ongoingTouchIndexById(touches[i].identifier);
             
          if (idx >= 0) {
            removedTouchAt = counter
            // log("end " + touches[i].pageX + ", " + touches[i].pageY)
            lastLiftedTouch = touches[i]
            lastEndTouchSpot = {x:touches[i].pageX,y:touches[i].pageY}
            ongoingTouches.splice(idx, 1);  // remove it; we're done
            var clientX = touches[i].clientX
            var clientY = touches[i].clientY
            if (touchOverElement(touches[i],"#a-button")) {
                if (pressingAButton) {
                    releaseAButton()
                }
            }
            if (touchOverElement(touches[i],"#b-button")) {
                if (pressingBButton) {
                    releaseBButton()
                }
            }
          }
        }
      }
}
// PIXI.loader.add('assets/mechsheet.json')
if (isTouchDevice) {
    toadSheet1 = PIXI.Texture.fromImage("assets/toadsheet1.png");
    sizeStage(window.innerWidth,window.innerHeight);

} else {
    sizeStage(window.innerWidth,window.innerHeight);
    toadSheet1 = PIXI.Texture.fromImage("assets/toadsheet1.png");
}

// mechSheet1 = PIXI.Texture.fromImage("assets/mechsheet.png");



treeImages = {
    leftTop:"treelefttop.png",
    midTop:"treemidtop.png",
    rightTop:"treerighttop.png",
    leftTrunk:"treelefttrunk.png",
    midTrunk:"treemidtrunk.png",
    rightTrunk:"treerighttrunk.png"
}
greenHillImages = {
    leftTop:"greenhilllefttop.png",
    midTop:"greenhillmidtop.png",
    rightTop:"greenhillrighttop.png",
    leftTrunk:"greenhilllefttrunk.png",
    midTrunk:"greenhillmidtrunk.png",
    rightTrunk:"greenhillrighttrunk.png"
}
greenGrassImages = {
    leftTop:"greengrasslefttop.png",
    midTop:"greengrassmidtop.png",
    rightTop:"greengrassrighttop.png",
    leftTrunk:"greengrasslefttrunk.png",
    midTrunk:"greengrassmidtrunk.png",
    rightTrunk:"greengrassrighttrunk.png"
}
tanStoneTileImages = {
    leftTop:"tanstonetile.png",
    midTop:"tanstonetile.png",
    rightTop:"tanstonetile.png",
    leftTrunk:"tanstonetile.png",
    midTrunk:"tanstonetile.png",
    rightTrunk:"tanstonetile.png"
}

plateauImages = [treeImages,greenHillImages,greenGrassImages,tanStoneTileImages]
enemyTypes = ["shyGuy","ostrich","spitter"]

pixelText = PIXI.Texture.fromImage("assets/pixel.bmp");
// okSymbolText = PIXI.Texture.fromImage("assets/oksymbol.png");
// exitSymbolText = PIXI.Texture.fromImage("assets/exitsymbol.png");
// talkSymbolText = PIXI.Texture.fromImage("assets/talksymbol.png");
// talkSymbolText = PIXI.Texture.fromImage("assets/talksymbol.png");
sphereText = PIXI.Texture.fromImage("assets/spheroid.png");
turretText = PIXI.Texture.fromImage("assets/turret2.png");
ringText = PIXI.Texture.fromImage("assets/ring.png");
speedboatText = PIXI.Texture.fromImage("assets/speedboat.png");
spaceshipText = PIXI.Texture.fromImage("assets/spaceship.png");
coinText = PIXI.Texture.fromImage("assets/coin.png");
burntEggText = PIXI.Texture.fromImage("assets/burntegg.png");
cutEggText = PIXI.Texture.fromImage("assets/cutegg.png");
numeralSheet = PIXI.Texture.fromImage("assets/numeralsheet2.png");
crouchSheet = PIXI.Texture.fromImage("assets/crouchsheet.png");
vineBaseSheet = PIXI.Texture.fromImage("assets/vinebasesheet.png");
vineMidSheet = PIXI.Texture.fromImage("assets/vinemidsheet.png");
cherrySheet = PIXI.Texture.fromImage("assets/cherrysheet.png");
grassTuftSheet = PIXI.Texture.fromImage("assets/grasstuftsheet.png");
drillSheet = PIXI.Texture.fromImage("assets/drillsheet.png");
coinSheet = PIXI.Texture.fromImage("assets/coinsheet.png");
eggSheet = PIXI.Texture.fromImage("assets/eggsheet.png");
facehuggerSheet = PIXI.Texture.fromImage("assets/facehuggersheet.png");
seaTopText = PIXI.Texture.fromImage("assets/seatop.png");
seaTopText2 = PIXI.Texture.fromImage("assets/seatop2.png");
seaMidText = PIXI.Texture.fromImage("assets/seamid.png");
seaMidText2 = PIXI.Texture.fromImage("assets/seamid2.png");
whaleText = PIXI.Texture.fromImage("assets/whale.png");

waterfallSheet = PIXI.Texture.fromImage("assets/waterfallsheet.png");
// nesPanelSheet = PIXI.Texture.fromImage("assets/nespanelsheet.png");
rockBG1Text = PIXI.Texture.fromImage("assets/rockbg1.png");
plantBG2Text = PIXI.Texture.fromImage("assets/plantbg2.png");
treeBG3Text = PIXI.Texture.fromImage("assets/treebg3.png");
largeTreeBGText = PIXI.Texture.fromImage("assets/largetreebg.png");
smallCloudText = PIXI.Texture.fromImage("assets/cloud32.png");
largeCloudText = PIXI.Texture.fromImage("assets/cloud43.png");
logLeftEndText = PIXI.Texture.fromImage("assets/logleftend.png");
logMiddleText = PIXI.Texture.fromImage("assets/logmiddle.png");
logRightEndText = PIXI.Texture.fromImage("assets/logrightend.png");
foregroundTreeText = PIXI.Texture.fromImage("assets/foregroundtree.png");
redDoorText = PIXI.Texture.fromImage("assets/reddoor.png");
doorwayText = PIXI.Texture.fromImage("assets/doorway.png");
caveBGText = PIXI.Texture.fromImage("assets/cavebg.png");
skyBGText = PIXI.Texture.fromImage("assets/skybg.png");
littleToadText = PIXI.Texture.fromImage("assets/littletoad.png");
fishmanText = PIXI.Texture.fromImage("assets/fishman.png");
fishMerchantText = PIXI.Texture.fromImage("assets/fishmerchant.png");
fishmanSleepingText = PIXI.Texture.fromImage("assets/fishmansleeping.png");
caretText = PIXI.Texture.fromImage("assets/caret.png");
stickText = PIXI.Texture.fromImage("assets/stick.png");
daggerText = PIXI.Texture.fromImage("assets/dagger.png");
jetpackText = PIXI.Texture.fromImage("assets/jetpack.png");
jetpackBackText = PIXI.Texture.fromImage("assets/jetpackback.png");
jetflameText = PIXI.Texture.fromImage("assets/jetflame.png");
flamethrowerText = PIXI.Texture.fromImage("assets/flamethrower.png");
flameText = PIXI.Texture.fromImage("assets/flameparticle.png");

largeEarthTextures = {
    leftTop:"assets/largeearthlefttop.png",
    midTop:"assets/largeearthmidtop.png",
    rightTop:"assets/largeearthrighttop.png",
    leftTrunk:"assets/largeearthleftside.png",
    midTrunk:"assets/largeearthmidtrunk.png",
    rightTrunk:"assets/largeearthrightside.png",
    leftBottom:"assets/largeearthleftbottom.png",
    midBottom:"assets/largeearthbottom.png",
    rightBottom:"assets/largeearthrightbottom.png",

    leftLedge:"assets/largeearthledgeleft.png",
    rightLedge:"assets/largeearthledgeright.png",
    midLedge:"assets/largeearthledgemid.png",
}
largeStoneTextures = {
    leftTop:"assets/largestonelefttop.png",
    midTop:"assets/largestonemidtop.png",
    rightTop:"assets/largestonerighttop.png",
    leftTrunk:"assets/largestonelefttrunk.png",
    midTrunk:"assets/largestonemidtrunk.png",
    rightTrunk:"assets/largestonerighttrunk.png",
    leftBottom:"assets/largestonelefttrunk.png",
    midBottom:"assets/largestonemidtrunk.png",
    rightBottom:"assets/largestonerighttrunk.png",

    leftLedge:"assets/largestonelefttop.png",
    rightLedge:"assets/largestonerighttop.png",
    midLedge:"assets/largestonemidtop.png",
}
logTextures = {
    leftTop:"assets/logleftend.png",
    midTop:"assets/logmiddle.png",
    rightTop:"assets/logrightend.png",
    leftTrunk:"assets/logleftend.png",
    midTrunk:"assets/logmiddle.png",
    rightTrunk:"assets/logrightend.png",
    leftBottom:"assets/logleftend.png",
    midBottom:"assets/logmiddle.png",
    rightBottom:"assets/logrightend.png",
}
brownBrickTextures = {
    leftTop:"assets/brownbricklefttop.png",
    midTop:"assets/brownbrickmidtop.png",
    rightTop:"assets/brownbrickrighttop.png",
    leftTrunk:"assets/brownbricklefttrunk.png",
    midTrunk:"assets/brownbrickblock.png",
    rightTrunk:"assets/brownbrickrighttrunk.png",
    leftBottom:"assets/brownbricklefttrunk.png",
    midBottom:"assets/brownbrickmidtrunk.png",
    rightBottom:"assets/brownbrickrighttrunk.png",
}
waterTextures = {
    leftTop:"assets/watertop.png",
    midTop:"assets/watertop.png",
    rightTop:"assets/watertop.png",
    leftTrunk:"assets/watermid.png",
    midTrunk:"assets/watermid.png",
    rightTrunk:"assets/watermid.png",
    leftBottom:"assets/watermid.png",
    midBottom:"assets/watermid.png",
    rightBottom:"assets/watermid.png",
}
seaTextures = {
    leftTop:"assets/seatop.png",
    midTop:"assets/seatop.png",
    rightTop:"assets/seatop.png",
    leftTrunk:"assets/seamid.png",
    midTrunk:"assets/seamid.png",
    rightTrunk:"assets/seamid.png",
    leftBottom:"assets/seamid.png",
    midBottom:"assets/seamid.png",
    rightBottom:"assets/seamid.png",
}
items = {
    stick:{
        name:"stick",
        displayText:PIXI.Texture.fromImage("assets/stick.png"),
        previewBGSize:(tileWidth/6),
        description:"Beat your enemies senseless.",
        price:40,
        purchaseAction:function() {
            console.log("purchased sword!")
            player.coins -= 40
            player.updateCoinCount()
            boughtItems.push(new Sword('stick'))
        }
    },
    dagger:{
        name:"dagger",
        displayText:PIXI.Texture.fromImage("assets/dagger.png"),
        previewBGSize:(tileWidth/2),
        description:"Cut enemies and foliage. Charge for power attack.",
        price:80,
        purchaseAction:function() {
            console.log("purchased sword!")
            player.coins -= 80
            player.updateCoinCount()
            boughtItems.push(new Sword('dagger'))
        }
    },
    heartContainer:{
        name:"heartContainer",
        displayText:PIXI.Texture.fromImage("assets/redheart.png"),
        description:"A permanent extra health container.",
        price:100,
        purchaseAction:function() {
            console.log("new Heart!")
            player.coins -= 100
            player.updateCoinCount()
            heartDisplay.addContainer()
        }
    },
    jetpack:{
        name:"jetpack",
        displayText:PIXI.Texture.fromImage("assets/jetpackback.png"),
        description:"Fly through the air with the greatest of ease.",
        price:500,
        purchaseAction:function() {
            console.log("purchased jet pack!")
            player.coins -= 500
            player.updateCoinCount()
            boughtItems.push(new Jetpack())
        }
    },
    flamethrower:{
        name:"flamethrower",
        displayText:PIXI.Texture.fromImage("assets/flamethrower.png"),
        description:"Burn your problems to a crisp.",
        price:1000,
        purchaseAction:function() {
            console.log("purchased flamethrower!")
            player.coins -= 1000
            player.updateCoinCount()
            boughtItems.push(new Flamethrower())
        }
    }
}

setOptions();

bonus = undefined;

cursor = {x:undefined,y:undefined};
cursorAtLastFrame = null;
startingFingerDistance = 0;
fingerOnScreen = false
pinched = 0;
LMBDown = RMBDown = false;
clicked = rightClicked = -1;
doubleTapping = false;
touchedAt = -99
pressedJumpAt = pressedShootAt = releasedJumpAt = releasedShootAt = releasedUpAt = -99
pressingJump = false
pressingBButton = false
clickedAt = rightClickedAt = pressedShiftAt = pressed1At = pressed2At = pressed3At = pressed4At = pressed5At = pressedTabAt = pressedUpAt = pressedLeftAt = pressedRightAt = pressedQAt = pressedEAt = -99

LMBDown = RMBDown = pressingUp = pressingAButton = pressingDown = pressingLeft = pressingRight = pressingE = pressingQ = false
pressingDirections = []
cursor = {x:0,y:0}
touches = []


mousedown = false;

characters = {
    littleToad1:{texture:littleToadText},
    littleToad2:{texture:littleToadText},
    littleToad3:{texture:littleToadText},
    littleToad4:{texture:littleToadText},
    littleToad5:{texture:littleToadText},
    fishman1:{texture:fishmanText},
    fishman2:{texture:fishmanText},
    fishMerchant:{texture:fishMerchantText,items:['stick','jetpack','flamethrower'],}

}

if (isTouchDevice) {

    stage.onDragStart = function(event)
    {
        var e = event || window.event;
        this.data = e.data;
        if (true) {
            fingerOnScreen = true
            var touch = {
                id: this.data.identifier || 0,
                pos: this.data.getLocalPosition(this)
            }
            if (touches.indexOf(touch) === -1) {
                touches.push(touch);
            }
            touchedAt = counter
        }
    }
    stage.onDragMove = function(event)
    {
        var e = event || window.event;
        this.data = e.data;
        for (var i=0; i < touches.length; i++) {
            if(touches[i].id === (this.data.identifier || 0)) {
                touches[i].pos = this.data.getLocalPosition(this)
            }
        };
    }
    stage.onDragEnd = function (event)
    {
        var e = event || window.event;
        this.data = e.data;
        for (var i=0;i<touches.length;i++) {
            if (touches[i].id === (this.data.identifier || 0)) {
                touches.splice(i,1);
            }
        };
        if (touches.length === 0) {
            pressingDirections = []
            fingerOnScreen = false
        }
    }

    stage.on("touchstart",stage.onDragStart);
    stage.on("touchmove",stage.onDragMove);
    stage.on("touchend",stage.onDragEnd);
}

stage.shifted = 0


// stage.scale.y = 0;
var floorY = 3

function connectPlateaus(plat1,plat2,depth,addLog) {
    // var diff = (plat2.posX-(plat1.posX+(plat1.floorSpan.span-plat1.posX)))
    var diff = (plat2.posX-(plat1.posX+(plat1.floorSpan.span)))
    console.log("plat diff " + diff)
    var startX = plat1.floorSpan.startX+(plat1.floorSpan.span*tileWidth)
    var startY = plat1.floorSpan.groundY+(tileWidth*depth)
    var waterfall = new Waterfall(startX,startY,diff,3)
    
    if (addLog) {
        waterfall.hasLog = true
        for (var g=0;g<diff+2;g++) {
            if (g===0) {
                var logSegment = new PIXI.Sprite(logLeftEndText)
                waterfall.leftTop = logSegment
            } else if (g===diff+1) {
                
                var logSegment = new PIXI.Sprite(logRightEndText)
                waterfall.rightTop = logSegment
            } else {
                var logSegment = new PIXI.Sprite(logMiddleText)
            }
            logSegment.width = logSegment.height = tileWidth
            logSegment.x = (startX-tileWidth)+(tileWidth*g)
            logSegment.y = startY-((depth+1)*tileWidth)
            waterfall.logContainer.addChild(logSegment)
            
        }
        waterfall.container.addChild(waterfall.logContainer)
        waterfall.floorSpan.span += 2
        waterfall.floorSpan.startX = (startX-tileWidth)
        waterfall.floorSpan.groundY = logSegment.y

        console.log("adding " + diff)
        plat1.contents.push(waterfall)
        plat1.floorSpan.span += diff
        if (addLog) {
            plat1.floorSpan.span += 1
        }
        
    }
}

function platLevelY(level) {
    return floorY+(level*tilesPerHeight)
}
function createSea(startPos,screensWide) {
    for (var s=0;s<screensWide;s++) {
        var xSpot = (startPos+s)*tilesPerWidth

        var plat = new Plateau(false,xSpot,0,platLevelY(0)+1,tilesPerWidth,seaTextures,false,true);
        plat.type = "sea"

        for (var b=0;b<plat.bricks.length;b++) {
            var brick = plat.bricks[b]
            // console.log(brick.texture)
            brick.origTexture = brick.texture
        }
    }
}
function createFloor(startPos,screensWide) {
    
    for (var s=0;s<screensWide;s++) {
        if (s > 10) {
            // var xSpot = ((startPos+s+randomInt(0,6))*tilesPerWidth)
            // var randPlat = new Plateau(false,xSpot,floorPlats[0].posY,randomInt(3,tilesPerHeight),randomInt(4,tilesPerWidth),greenHillImages);
        }
        var xSpot = (startPos+s)*tilesPerWidth
        var plat = new Plateau(false,xSpot,0,platLevelY(0),tilesPerWidth,greenGrassImages,false,true);

        // for (var r=0;r<tilesPerWidth/2;r++) {
        //     if (!randomInt(0,2)) {
        //         new Tree(plat,plat.posX+Math.floor(r)-1)
        //     }
        // }
        floorPlats.push(plat)
        // plat.container.alpha = 0.2
    }
    
}
startingRain = randomInt(150,250)
startingRain = 0
rainOriginY = 5
rainPerLevel = 40
var rainField, starField, lightningField, speedBoat
areaLimits = {
    "Overworld - Village": {
        x:{min:0,max:tilesPerWidth*tileWidth*13},
        y:{min:0,max:tilesPerHeight*tileWidth*16}
    },
    "Overworld - Eastern Sea": {
        x:{min:tilesPerWidth*tileWidth*13,max:tilesPerWidth*tileWidth*26},
        y:{min:0,max:tilesPerHeight*tileWidth*16}
    },
    "Overworld - Guru's Tower": {
        x:{min:tilesPerWidth*tileWidth*26,max:tilesPerWidth*tileWidth*worldScreensWide},
        y:{min:0,max:tilesPerHeight*tileWidth*16}
    }
}
function init() {
    
    spaceship = new PIXI.Sprite(spaceshipText)
    stage.addChild(spaceship)
    spaceship.visible = false
    starField = new StarField(100)
    // lightningField = new LightningField()
    for (var h=0;h<worldScreensHigh;h++) {
        var leftSidePlat = new Plateau(true,0,platLevelY(h),tilesPerHeight,1,greenGrassImages,false,false,true);
        var rightSidePlat = new Plateau(true,(worldScreensWide*tilesPerWidth)-1,platLevelY(h),tilesPerHeight,1,greenGrassImages,false,false,true);
        if (h<15) {
            var rightSideCityWall = new Plateau(false,tilesPerWidth*12,platLevelY(h),tilesPerHeight,1,brownBrickTextures,false,false,true);
            if (h<12) {
                var topCityWall = new Plateau(true,h*tilesPerWidth,platLevelY(15),1,tilesPerWidth,brownBrickTextures,false,false,true);
            }
        }
    }
    createFloor(0,12)
    shorePlat1 = new Plateau(true,tilesPerWidth*12,0,4,tilesPerWidth,greenGrassImages);
    shorePlat2 = new Plateau(true,tilesPerWidth*(worldScreensWide-6),0,4,tilesPerWidth,greenGrassImages);
    // sea = new Waterfall(tilesPerWidth*13,tilesPerHeight-4,tilesPerWidth*(worldScreensWide-19),4)
    createSea(13,13)
    createFloor((worldScreensWide-5),5)

    towerLevel1Base = new Plateau(false,shorePlat2.posX+(tilesPerWidth),platLevelY(0),tilesPerHeight,tilesPerWidth*4,largeStoneTextures,false,false,true)
    towerLevel1Seg2 = new Plateau(false,shorePlat2.posX+(tilesPerWidth),platLevelY(1),tilesPerHeight,tilesPerWidth*4,largeStoneTextures,false,false,true)
    towerLevel1Top = new Plateau(false,shorePlat2.posX+(tilesPerWidth),platLevelY(2),tilesPerHeight,tilesPerWidth*4,largeStoneTextures)
    
    towerLevel2BaseLeft = new Plateau(false,shorePlat2.posX+(tilesPerWidth*1.5),platLevelY(3),tilesPerHeight,tilesPerWidth,largeStoneTextures,false,false,true)
    towerLevel2BaseRight = new Plateau(false,shorePlat2.posX+(tilesPerWidth*3.5),platLevelY(3),tilesPerHeight,tilesPerWidth,largeStoneTextures,false,false,true)
    
    towerLevel2Seg2Left = new Plateau(false,shorePlat2.posX+(tilesPerWidth*1.5),platLevelY(4),tilesPerHeight,tilesPerWidth,largeStoneTextures,false,false,true)
    towerLevel2Seg2Right = new Plateau(false,shorePlat2.posX+(tilesPerWidth*3.5),platLevelY(4),tilesPerHeight,tilesPerWidth,largeStoneTextures,false,false,true)

    towerLevel2TopLeft = new Plateau(false,shorePlat2.posX+(tilesPerWidth*1.5),platLevelY(5),tilesPerHeight,tilesPerWidth,largeStoneTextures)
    towerLevel2TopRight = new Plateau(false,shorePlat2.posX+(tilesPerWidth*3.5),platLevelY(5),tilesPerHeight,tilesPerWidth,largeStoneTextures)
    // towerLevel2.tintBricks(0xdddddd)
    towerLevel3Base = new Plateau(false,shorePlat2.posX+(tilesPerWidth*2),platLevelY(6),tilesPerHeight,tilesPerWidth*2,largeStoneTextures,false,false)
    towerLevel3Top = new Plateau(false,shorePlat2.posX+(tilesPerWidth*2),platLevelY(7),tilesPerHeight,tilesPerWidth*2,largeStoneTextures)
    // towerLevel3.tintBricks(0xbbbbbb)
    towerLevel4Base = new Plateau(false,shorePlat2.posX+(tilesPerWidth*2.5),platLevelY(8),tilesPerHeight,tilesPerWidth,largeStoneTextures,false,false,true)
    towerLevel4Top = new Plateau(false,shorePlat2.posX+(tilesPerWidth*2.5),platLevelY(9),tilesPerHeight,tilesPerWidth,largeStoneTextures)
    // towerLevel4.tintBricks(0x999999)
    towerLevel5Base = new Plateau(false,shorePlat2.posX+(tilesPerWidth*2.75),platLevelY(10),tilesPerHeight,tilesPerWidth/2,largeStoneTextures,false,false,true)
    towerLevel5Seg2 = new Plateau(false,shorePlat2.posX+(tilesPerWidth*2.75),platLevelY(11),tilesPerHeight,tilesPerWidth/2,largeStoneTextures,false,false,true)
    towerLevel5Top = new Plateau(false,shorePlat2.posX+(tilesPerWidth*2.75),platLevelY(12),tilesPerHeight,tilesPerWidth/2,largeStoneTextures)
    // towerLevel5.tintBricks(0x777777)
   
    // seaLedge = new Plateau(true,tilesPerWidth*13,4,1,tilesPerWidth*(worldScreensWide-19),tanStoneTileImages)

    level2Plat0 = new Plateau(false,shorePlat2.posX+18,platLevelY(7)+11,3,8,greenHillImages)
    level2Plat1 = new Plateau(false,shorePlat2.posX+8,platLevelY(7)+11,3,8,greenHillImages)
    level2Plat2 = new Plateau(false,shorePlat2.posX-2,platLevelY(7)+11,3,8,greenHillImages)
    level2Plat3 = new Plateau(false,shorePlat2.posX-12,platLevelY(7)+11,3,8,greenHillImages)
    level2Plat4 = new Plateau(false,shorePlat2.posX-22,platLevelY(7)+11,3,8,greenHillImages)
    level2Plat5 = new Plateau(false,shorePlat2.posX-32,platLevelY(7)+11,3,8,greenHillImages)
    level2Plat6 = new Plateau(false,shorePlat2.posX-42,platLevelY(7)+11,3,8,greenHillImages)


    largePlat = new Plateau(false,83,floorY,8,tilesPerWidth*2,brownBrickTextures);
    largePlat.tintBricks(0xffeeff)
    
    
    tallPlat = new Plateau(false,103,floorY,tilesPerHeight,tilesPerWidth*2,greenGrassImages);
    largePlat2 = new Plateau(false,76,floorY,tilesPerHeight,18,greenGrassImages);

    
    // new Door(largePlat2,6)

    plateau2 = new Plateau(false,13,floorPlats[0].posY,tilesPerHeight,tilesPerWidth*3,greenHillImages);
    // plateau6 = new Plateau(false,32,floorPlats[0].posY,tilesPerHeight,8,greenHillImages);
    longPlateau = new Plateau(false,140,platLevelY(0),tilesPerHeight-6,tilesPerWidth*3,greenHillImages);
    longPlateauLevel2 = new Plateau(false,110+(tilesPerWidth*3),longPlateau.posY,tilesPerHeight-6,tilesPerWidth-3,greenHillImages);

    // new WaterfallArea(96,platLevelY(0),27,10,7,tilesPerHeight,greenHillImages)

    // plateau62 = new Plateau(false,76,floorPlats[0].posY,tilesPerHeight+2,24,greenHillImages);
   

    plat1Level2 = new Plateau(false,13,platLevelY(1),5,tilesPerWidth*3,treeImages);
    skyLedge1 = new Plateau(false,58,platLevelY(3),0,33,tanStoneTileImages,true);
    
    plateau4 = new Plateau(false,68,skyLedge1.posY,(tilesPerHeight),22,treeImages);
    plateau45 = new Plateau(false,70,plateau4.posY,tilesPerHeight*2,13,greenGrassImages);
    plateau5 = new Plateau(false,79,plateau4.posY,6,8,greenGrassImages);
    stage.setChildIndex(plateau5.container,stage.children.indexOf(plateau45.container)+1)
    plateauStone = new Plateau(false,73,plateau45.posY,4,5,tanStoneTileImages);

    skyLedge2 = new Plateau(false,58,platLevelY(12),1,22,greenGrassImages,true);

    skyTower = new Plateau(false,60,skyLedge2.posY,tilesPerHeight*2,18,tanStoneTileImages);
    skyTowerLevel2 = new Plateau(false,66,skyTower.posY,6,8,greenGrassImages);

    fishStore = new Plateau(false,shorePlat1.posX+4,platLevelY(0)+1,8,12,logTextures)

    // towerBase = new Plateau(false,shorePlat2.posX+(tilesPerWidth),platLevelY(0),tilesPerHeight*4,tilesPerWidth*9,tanStoneTileImages)
    // towerLevel2 = new Plateau(false,shorePlat2.posX+(tilesPerWidth*2),platLevelY(4),tilesPerHeight*5,tilesPerWidth*7,tanStoneTileImages)
    // towerLevel2.tintBricks(0x226622)
    // towerLevel3 = new Plateau(false,shorePlat2.posX+(tilesPerWidth*3),platLevelY(9),tilesPerHeight*6,tilesPerWidth*5,tanStoneTileImages)
    // towerLevel4 = new Plateau(false,shorePlat2.posX+(tilesPerWidth*4),platLevelY(15),tilesPerHeight*6,tilesPerWidth*3,tanStoneTileImages)
    // towerLevel4.tintBricks(0x226622)
    // towerLevel5 = new Plateau(false,shorePlat2.posX+(tilesPerWidth*5),platLevelY(21),tilesPerHeight*7,tilesPerWidth*1,tanStoneTileImages)
    // towerPeak = new Plateau(false,shorePlat2.posX+(tilesPerWidth*4),platLevelY(28),tilesPerHeight*2,tilesPerWidth*3,tanStoneTileImages)
    // towerPeak.tintBricks(0x226622)
    // new Door(towerPeak,tilesPerWidth*1.5)
    // new Vine(floorPlats[19],towerBase,20)
    // new Vine(towerBase,towerLevel2,20)
    // new Vine(towerLevel2,towerLevel3,20)
    // new Vine(towerLevel3,towerLevel4,20)
    // new Vine(towerLevel4,towerLevel5,20)

    new GrassTuft(skyTowerLevel2,6,Vegetable)

    new Chain(skyLedge2,12,82)

    new Door(plateau2,8)
    new Door(plat1Level2,(tilesPerWidth*3)-5)

    new Door(largePlat,5)
    new Door(largePlat,(tilesPerWidth*2)-3)
    
    new Door(plateau4,2)
    new Door(plateau5,6)
    new Door(plateau45,7)
    new Door(plateauStone,2)

    new Door(longPlateau,3)
    new Door(longPlateauLevel2,8)

    new Door(skyTower,14)
    new Door(skyTowerLevel2,6)

    new Door(largePlat2,3)
    new Door(largePlat2,15,8)

    new Door(fishStore,2)

    new Door(towerLevel1Base,12)
    new Door(towerLevel1Top,towerLevel1Top.floorSpan.span-6,tilesPerHeight-9)

    var towerLedge1 = new Plateau(false,towerLevel1Top.posX+towerLevel1Top.floorSpan.span-8,towerLevel1Top.posY-10,1,8,largeStoneTextures)
    stage.setChildIndex(towerLedge1.container,stage.children.length-1)
    new Vine(towerLedge1,towerLevel1Top,5)

    new Door(towerLevel2BaseRight,Math.ceil(tilesPerWidth/2))
    new Door(towerLevel2TopRight,Math.ceil(tilesPerWidth/2))

    var towerLedge2 = new Plateau(false,towerLevel2TopLeft.posX+tilesPerWidth-12,towerLevel2TopRight.posY-15,1,tilesPerWidth+24,largeStoneTextures)
    stage.setChildIndex(towerLedge2.container,stage.children.length-1)
    new Vine(towerLedge1,towerLevel1Top,5)

    new Door(towerLevel2BaseLeft,Math.floor(tilesPerWidth/2)-1)
    new Door(towerLevel3Base,2)
    new Door(towerLevel3Top,towerLevel3Top.floorSpan.span-3)

    new Vine(towerLedge2,towerLevel2TopLeft,3)


    // new Door(towerLevel1,12)
    // new Door(towerLevel1Top,towerLevel1.floorSpan.span-6,towerLevel1Top.posY)



    // console.log("door posX " + towerLevel1.door2.actualPosX)
    // console.log("door posY " + towerLevel1.door2.actualPosY)
    // var ledge1 = new Plateau(false,towerLevel1.door2.actualPosX-2,towerLevel1.posY-9,1,8,brownBrickTextures)
    // stage.setChildIndex(ledge1.container,stage.children.length-1)
    // new Vine(ledge1,towerLevel1,5)


    // new Door(towerLevel2,12)
    // new Door(towerLevel2,towerLevel2.floorSpan.span-6,towerLevel2.floorSpan.height-8)


    // console.log("door posX " + towerLevel1.door2.actualPosX)
    // console.log("door posY " + towerLevel1.door2.actualPosY)
    // var ledge2 = new Plateau(false,towerLevel2.door2.actualPosX-2,towerLevel2.posY-9,1,8,brownBrickTextures)
    // stage.setChildIndex(ledge2.container,stage.children.length-1)
    // new Vine(ledge2,towerLevel2,5)

    cave1 = new Cave("Cave 1",plateau2,plat1Level2,cavePatterns[0])
    cave2 = new Cave("Bonus Chance Casino",largePlat,largePlat,cavePatterns[1])
    
    topCave = new Cave("topCave",plateau4,plateau5,cavePatterns[2])
    topCave2 = new Cave("topCave2",plateau45,plateauStone,cavePatterns[3])
    cave3 = new Cave("Large Cave",longPlateau,longPlateauLevel2,cavePatterns[4])
    highCave = new Cave("highCave",skyTower,skyTowerLevel2,cavePatterns[5])
    tallCave = new Cave("Tavern",largePlat2,largePlat2,cavePatterns[6])

    storeCave = new Cave("Fish Merchant's Shop",fishStore,fishStore,cavePatterns[7])

    towerCave1 = new Cave("Guru's Tower - 1",towerLevel1Base,towerLevel1Top,cavePatterns[8])

    towerCave2Right = new Cave("Guru's Tower East - 2",towerLevel2BaseRight,towerLevel2TopRight,cavePatterns[9])
    towerCave2Left = new Cave("Guru's Tower West - 2",towerLevel2BaseLeft,towerLevel2BaseLeft,cavePatterns[10])
    towerCave3 = new Cave("Guru's Tower - 3",towerLevel3Base,towerLevel3Top,cavePatterns[11])

    new Chain(towerLevel3Top,8,9)
    new Chain(towerLevel3Top,9,9)
    new Chain(towerLevel3Top,10,10)
    new Chain(towerLevel3Top,11,9)
    new Chain(towerLevel3Top,12,8)
    new Chain(towerLevel3Top,13,9)
    new Chain(towerLevel3Top,14,11)
    new Chain(towerLevel3Top,15,10)
    new Chain(towerLevel3Top,16,12)
    new Chain(towerLevel3Top,17,11)
    new Chain(towerLevel3Top,18,9)
    new Chain(towerLevel3Top,19,7)
    new Chain(towerLevel3Top,20,6)
    new Chain(towerLevel3Top,21,11)
    new Chain(towerLevel3Top,22,11)
    new Chain(towerLevel3Top,23,9)
 
    new GrassTuft(floorPlats[0],2,Vegetable);
    new GrassTuft(floorPlats[0],3,Vegetable);
    new GrassTuft(plateau2,4,Vegetable);
    new GrassTuft(plat1Level2,4,Vegetable);
    new GrassTuft(plat1Level2,5,Bomb);
    new GrassTuft(plat1Level2,6,Bomb);
    new GrassTuft(skyLedge1,7,Bomb);
    new GrassTuft(plateau4,5,Bomb);
    new GrassTuft(plateau4,6,Vegetable);
    new GrassTuft(plateau4,7,Bomb);

    new Ladder(floorPlats[1],plateau2,1);
    new Ladder(floorPlats[6],tallPlat,14);
    new Chain(skyLedge1,5,24);
    new Chain(skyLedge1,32,6);
    new Vine(plateau2,plat1Level2,6);

    new MushroomBlock(plateau2,0,0)
    new MushroomBlock(plateau2,1,0)
    
    new MushroomBlock(floorPlats[2],15,0)
    new MushroomBlock(floorPlats[3],0,0)
    new MushroomBlock(floorPlats[3],0,1)
    new MushroomBlock(floorPlats[3],1,0)
    new MushroomBlock(floorPlats[3],1,1)

    background = new Background()
    
    nesPanel = undefined
    heartDisplay = new HeartDisplay();
    player = new Player(Math.round((tilesPerWidth/2)-2)*tileWidth,Math.round(tileWidth*8));
    // dagger = new Sword(daggerText)
    // jetpack = new Jetpack()
    // ed209 = new ed209(player.sprite.x+(tileWidth*4),floorPlats[0].floorSpan.groundY)

    rainField = new RainField(startingRain)


    littleToad1 = new NPC("littleToad1",floorPlats[0],10)
    littleToad2 = new NPC("littleToad2",floorPlats[1],8)
    littleToad3 = new NPC("littleToad3",plat1Level2,12)
    littleToad4 = new NPC("littleToad4",cave1,16,(tilesPerHeight*2)-2)
    littleToad5 = new NPC("littleToad5",cave1,40,(tilesPerHeight*2)-21)
    fishman1 = new NPC("fishman1",tallPlat,31)
    fishman1.sprite.scale.x *= -1
    fishman2 = new NPC("fishman2",shorePlat1,2)
    fishMerchant = new NPC("fishMerchant",storeCave,12,(tilesPerHeight)-2)
    fishMerchant.merchant = true
    // egg3 = new Egg(floorPlats[1],11)
    // egg5 = new Egg(floorPlats[1],13)
    // egg7 = new Egg(floorPlats[2],1)
    // egg9 = new Egg(floorPlats[2],3)
    // egg10 = new Egg(floorPlats[2],5)
    // caveEgg1 = new Egg(tallCave,7,2)
    // caveEgg2 = new Egg(tallCave,9,2)
    // caveEgg3 = new Egg(tallCave,11,2)
    // caveEgg4 = new Egg(tallCave,13,2)
    // caveEgg5 = new Egg(tallCave,15,2)
    // caveEgg6 = new Egg(tallCave,17,2)
    // caveEgg7 = new Egg(tallCave,19,2)
    // caveEgg8 = new Egg(tallCave,21,2)
    // caveEgg9 = new Egg(tallCave,23,2)

    // new Facehugger(tallCave,caveEgg1,12,2)
    // new Facehugger(tallCave,caveEgg2,11,2)
    // new Facehugger(tallCave,caveEgg3,12,2)
    // new Facehugger(tallCave,caveEgg4,10,2)
    // new Facehugger(tallCave,caveEgg1,13,2)
    // new Facehugger(tallCave,false,9,2)



    // console.log(dialogueTree)
    box = new DialogueBox(true)
    progress.push(player.screenOccupying());
    progress.push({x:player.screenOccupying().x+1,y:player.screenOccupying().y});
    for (var p=0;p<plateaus.length;p++) {
        var plateau = plateaus[p];
        if (plateau.hide) {
            plateau.hide()
        }
    }

    if (starField) {
        stage.setChildIndex(starField.container,2)
    }
    if (lightningField) {
        stage.setChildIndex(lightningField.container,3)
    }
    
    // speedBoat = new Speedboat((floorPlats[10].posX+tilesPerWidth+0.5)*tileWidth,floorPlats[worldScreensWide-1].floorSpan.groundY+(tileWidth*0.5))
    
    var pixelateFilter = new PIXI.filters.BlurFilter(4)
    stage.filters = [pixelateFilter]
    hideOffscreenElements()
    var logo = new PIXI.Sprite.fromImage("bonuslogo.png")
    var logoBack = new PIXI.Sprite(pixelText)
    logoBack.tint = 0x111111
    
    logo.height = tileWidth*3
    // logo.width = logo.height*(159/635)
    logo.width = tileWidth*9
    logo.x = largePlat.floorSpan.startX+(tileWidth)
    logo.y = tileWidth*5
    logoBack.width = logo.width+(tileWidth/2)
    logoBack.height = logo.height+(tileWidth/2)
    logoBack.x = logo.x-(tileWidth/4)
    logoBack.y = logo.y-(tileWidth/4)
    largePlat.container.addChild(logoBack)
    largePlat.container.addChild(logo)


    whale = new Whale((13*tilesPerWidth)+2,floorPlats[0].posY+1)

    shopDisplay = new ShopDisplay()
    player.updateCoinCount()

    // new Sword('stick')
    // player.sword.displaySymbol()
    // if (rainField) {
    //     stage.setChildIndex(rainField.container,stage.children.length-1)
    // }
    log("location","Village")
    log("time","2:00 PM")
    PIXI.ticker.shared.add(function(time) {
        renderer.render(stage);
        requestAnimationFrame(update);
    });
    
};


