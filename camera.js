function moveCamera() {
    if (((player.jetpack && player.jetpack.boosting) || player.climbing) && player.sprite.y-player.lastPosition.y < 0 && counter > 100 && player.screenPosition().y <= player.sprite.height) {
        movingToNewScreen = "up";
        if (!player.cave) {
            // var shadeAlpha = (-player.screenOccupying().y+1)/(worldScreensHigh/2)
            // $("#shade").css('transition','opacity 250ms linear')
            // $("#shade").css('opacity',shadeAlpha)
            // starField.alphaToLevel((-player.screenOccupying().y+1))
        }
    } else if (counter > 100 && player.sprite.y-player.lastPosition.y > 0 && player.screenPosition().y > viewHeight) {
        movingToNewScreen = "down";
        if (!player.cave) {
            // var shadeAlpha = (-player.screenOccupying().y-1)/(worldScreensHigh/2)
            // $("#shade").css('transition','opacity 250ms linear')
            // $("#shade").css('opacity',shadeAlpha)
            // starField.alphaToLevel((-player.screenOccupying().y-1))
        }
        
    }

    if (!player.cave || player.cave.bg.width > viewWidth) {
        if (player.cave) {
            var limit = player.cave.scrollLimit
        } else {
            var limit = worldScrollLimit
        }
        var playerPosX = player.sprite.x+(player.sprite.width/2)+((player.sprite.x-player.lastPosition.x)*player.flippedX)
        var playerPosX = player.sprite.x+((player.sprite.width/2)*player.flippedX)+((player.sprite.x-player.lastPosition.x))
        // console.log("X " + stage.x + " vs " + limit.x.min)
        if ((player.velocity.x > 0 && playerPosX > limit.x.min+(viewWidth/2)) ||
             player.velocity.x < 0 && playerPosX < limit.x.max-(viewWidth/2)) {
            var moveAmount = player.sprite.x-player.lastPosition.x
            stage.x -= moveAmount;
            background.moveLayers(moveAmount)
        }
        if (stage.x > limit.x.min) {
            background.moveLayers(stage.x)
            stage.x = limit.x.min
        }
        if (stage.x < -limit.x.max+viewWidth) {
            stage.x = -(limit.x.max-viewWidth)
            background.moveLayers(-moveAmount)
        }
    }
    heartDisplay.container.x = -stage.x;
    heartDisplay.container.y = -stage.y;
    
    if (starField) {
        starField.container.x = -stage.x
        starField.container.y = -stage.y
    }
}
function transitionScreen(direction) {
    if (direction === "up") {
        if (player.screenOccupying().y !== 0) {
            background.hideGround()
        }
        // if (player.screenPosition().y < viewHeight-player.sprite.height) {
        if (stage.shifted < tilesPerHeight*tileWidth) {
            rainField.homeY -= tileWidth
            stage.y += tileWidth;
            stage.shifted += tileWidth;
            // for (var y=0;y<background.clouds.length;y++) {
            //     var layer = background.clouds[y]
            //     var factor = (1.25-(y/10))
            //     for (var c=0;c<layer.children.length;c++) {
            //         var cloud = layer.children[c]
            //         cloud.y -= tileWidth/factor
            //     }
            // }
            
        } else {
            landedOnNewScreen = counter;
            movingToNewScreen = undefined;
            stage.shifted = 0
            
            // console.log(player.screenOccupying())
            // for (var y=0;y<background.clouds.length;y++) {
            //     var layer = background.clouds[y]
            //     for (var c=0;c<layer.children.length;c++) {
            //         var cloud = layer.children[c]
            //         // console.log("layer " + y + " cloud " + c + " y " + cloud.y)
    
            //         if (stagePosition().y+cloud.y > cloud.height) {
            //             // console.log("layer " + y + " cloud " + c + " OFF!")
            //             cloud.y -= viewHeight*1.3
            //         }
            //     }
            // }
        }
    }
    if (direction === "down") {
        if (player.screenOccupying().y === 0) {
            background.showGround()
        }
        // if (stage.y > viewHeight/2 && player.screenPosition().y > 0) {
        if (stage.shifted > -tilesPerHeight*tileWidth) {
            rainField.homeY += tileWidth
            stage.y -= tileWidth;
            stage.shifted -= tileWidth;
            // for (var y=0;y<background.clouds.length;y++) {
            //     var layer = background.clouds[y]
            //     var factor = (1.25-(y/10))
            //     for (var c=0;c<layer.children.length;c++) {
            //         var cloud = layer.children[c]
            //         cloud.y += tileWidth/factor
            //     }
            // }
        } else {
            landedOnNewScreen = counter;
            movingToNewScreen = undefined;
            stage.shifted = 0
            // console.log(player.screenOccupying())
            // for (var y=0;y<background.clouds.length;y++) {
            //     var layer = background.clouds[y]
            //     for (var c=0;c<layer.children.length;c++) {
            //         var cloud = layer.children[c]
            //         // console.log("layer " + y + " cloud " + c + " y " + cloud.y)
    
            //         if (stagePosition().y+cloud.y < (-cloud.height-viewHeight)) {
            //             // console.log("layer " + y + " cloud " + c + " OFF!")
            //             cloud.y += viewHeight*1.3
            //         }
            //     }
            // }
        }
    }
    if (landedOnNewScreen === counter) {
        if (!player.cave) {
            log("location",player.area)  
        }
    }
}
function controlMap() {
    if (pressingLeft) {
        stage.x += tileWidth*stage.scale.x
    }
    if (pressingRight) {
        stage.x -= tileWidth*stage.scale.x
    }
    if (pressingUp) {
        stage.y += tileWidth*stage.scale.x
    }
    if (pressingDown) {
        stage.y -= tileWidth*stage.scale.x
    }
}
var visiblePlateaus = []
function toggleMap() {
    if (stage.scale.x === 1) {
        background.hideGround()
        background.hideClouds()
        for (var p=0;p<plateaus.length;p++) {
            var plateau = plateaus[p];
            if (!player.cave && !plateau.container.visible) {
                plateau.show()
            } else {
                visiblePlateaus.push(p)
            }
        }
        
        oldStagePosition.x = stage.x
        oldStagePosition.y = stage.y
        var HWRatio = stage.height/stage.width
        stage.width *= 1/worldScreensWide
        stage.height = stage.width*HWRatio
        var extraY = (viewHeight)-(stage.height)
        stage.x = 0
        if (!player.cave) {
            stage.y = (viewHeight*(worldScreensHigh-1)*stage.scale.y)
            stage.y += viewHeight-(viewHeight*worldScreensHigh*stage.scale.y)
            spaceship.visible = true
            spaceship.width = (worldScreensWide-4)*viewWidth
            spaceship.height = spaceship.width/4
            spaceship.x = ((worldScreensWide*viewWidth)-spaceship.width)/2
            spaceship.y = -(worldScreensHigh-1)*viewHeight
        } else {
            player.cave.removeBG()
            stage.height = viewHeight
            stage.width = stage.height/HWRatio
            stage.y = -((player.cave.screensHigh+1)*viewHeight)*stage.scale.y
            stage.y += viewHeight
            if (stage.width<viewWidth) {
                stage.x += (viewWidth-stage.width)/2
            }
            player.cave.restoreBG()
        }
    } else {
        background.showGround()
        background.showClouds()
        spaceship.visible = false
        for (var p=0;p<plateaus.length;p++) {
            var plateau = plateaus[p];
            if (visiblePlateaus.indexOf(p) === -1) {
                plateau.hide()
            }
        }
        // for (var c=0;c<caves.length;c++) {
        //     var cave = caves[c]
            
        // }
        stage.scale.x = stage.scale.y = 1
        // stage.x = oldStagePosition.x
        // stage.y = -player.screenOccupying().y*viewHeight
        cameraToPlayerX()
        
        // stage.y = player.screenPosition().y
        oldStagePosition = {}
        visiblePlateaus.length = 1
    }
}
function cameraToPlayerX() {
    if (!player.cave) {
        var limit = worldScrollLimit
        
    } else {
        var limit = player.cave.scrollLimit
    }
    if (player.sprite.x > limit.x.min+(viewWidth/2) && player.sprite.x < limit.x.max-(viewWidth/2)) {
        stage.x = -player.sprite.x-(player.sprite.width/2)+(viewWidth/2)
    } else {
       
        if (player.sprite.x <= limit.x.min+(viewWidth/2)) {
            stage.x = -(limit.x.min)
        }
        if (player.sprite.x >= limit.x.max-(viewWidth/2)) {
            stage.x = -(limit.x.max-viewWidth)
        }
    }
    var camLevel = screenYForPosition(player.sprite.y)
    cameraToYLevel(camLevel)
}
function hideOffscreenElements() {
    if (!player.cave) {
        for (var p=0;p<plateaus.length;p++) {
            var plateau = plateaus[p];
            
            
      
            if (plateau.onscreen()) {
                if (!plateau.container.visible) {
                    plateau.show()
                }
                if (plateau.type === "waterfall") {
                    plateau.flow()
                } else if (plateau.type === "sea") {
                    plateau.wave()
                }
                if (plateau.door) {
                    if (!plateau.door.opened && !plateau.door.opening) {
                        plateau.door.listenForPlayer()
                    }
                    if (plateau.door.opening) {
                        plateau.door.open()
                    }
                    if (plateau.door.closing) {
                        plateau.door.close()
                    }
                }
                if (plateau.door2) {
                    if (!plateau.door2.opened && !plateau.door2.opening) {
                        plateau.door2.listenForPlayer()
                    }
                    if (plateau.door2.opening) {
                        plateau.door2.open()
                    }
                    if (plateau.door2.closing) {
                        plateau.door2.close()
                    }
                }
                if (plateau.moves) {
                    plateau.move()
                }
            } else {
                if (plateau.container.visible) {
                    plateau.hide()
                }
            }
            
        }
    } else if (player.cave) { // in cave 
        
        // console.log("is cave, so doing this")
        for (var p=0;p<plateaus.length;p++) {
            var plateau = plateaus[p];
            if (plateau.onscreen) {
                if (plateau.onscreen()) {
                    if (!plateau.container.visible) {
                        plateau.show()
                    }
                } else {
                    if (plateau.container.visible) {
                        plateau.hide()
                    }
                }
            }
        }
        
        for (var w=0;w<player.cave.doorways.length;w++) {
            var doorway = player.cave.doorways[w]
            if (!doorway.opened && !doorway.opening) {
                doorway.listenForPlayer()
            }
            if (doorway.opening) {
                doorway.open()
            }
            if (doorway.closing) {
                doorway.close()
            }
        }
        for (var c=0;c<caves.length;c++) {
            var cave = caves[c]
            if (cave.container.visible && cave !== player.cave) {
                console.log("hiding cave " + cave.name)
                cave.hide()
                
            }
        }

    }
}
function cameraToYLevel(newLevel) {
    var newY = viewHeight*newLevel
    stage.y = newY
    console.log("now at " + stage.y)
}