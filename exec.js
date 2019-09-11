function update() {
    if (stage.scale.x === 1) {
        hideOffscreenElements()
    }
    if (counter >0 && mod(8)) {
        advanceTime()
    }
    if (stage.filters.length && stage.filters[0].blur > 0) {
        stage.filters[0].blur -= 1
        if (stage.filters[0].blur <= 0) {
            stage.filters = []
        }
    }
    if (shopDisplay.container.visible) {
        shopDisplay.animate()
        if (shopDisplay.rolling === "open") {
            shopDisplay.rollOpen()
        }
        if (shopDisplay.rolling === "closed") {
            shopDisplay.rollClosed()
        }

    }
    if (pressingQ) {
        player.speed = player.runSpeed
    } else {
        if (player.speed !== player.origSpeed) {
            player.speed = player.origSpeed;
        }
    }
    // if (pressingQ) {
    //     controlMap()
    // }
    if (isTouchDevice) {
        monitorTouches()
    }
    handleInputs()
    if (!enteringDoor) {
        if (!activeDBox && !shopDisplay.container.visible) {
            checkForInputs();
        } else if (activeDBox) {
            controlChoiceMenu()
            if (box.choiceBox.container.height) {
                box.choiceBox.flashChoices()
            }
        } else if (shopDisplay.container.visible) {
            controlShopDisplay()
        }
    } else {
        if (player.doorEntered.opened) {
            if (player.sprite.alpha-0.1 > 0) {
                player.sprite.alpha -= 0.1
            }
        }
    }
    
    if (lastEndTouch === counter) {
        if (lastTouchPos.x < window.innerWidth/2) {
            for (var d=1;d<dPadPieces.length;d++) {
                if ($("#"+dPadPositions[d].name).css('opacity') < 1) {
                    dPadPositions[d].touchOff()
                }
            }
        }
    }
    if (!player.cave) {
        if (rainField.drops > 0) {
            rainField.animate()
        }
        if (!rainField.stopped) {
            if (mod(lightningFrequency)) {
                lightningStruckAt = counter
                lightningDuration = randomInt(30,100)
                lightningFrequency = randomInt(500,1000)
            }
            if (rainField.stopping) {
                rainField.removeDrop()
            }
        }
        
    }
    if (starField && !player.cave) {
        starField.animate(5)
    }
    // if (counter === 300) {
    //     console.log("STOP")
    //     rainField.stopping = true
    // }
    
   
    if (pressingE) {
        // darkenSky()
        stage.scale.x += 0.01
        stage.scale.y += 0.01
    }
    for (var f=0;f<flames.length;f++) {
        var flame = flames[f]
        if (flame.sprite.visible) {
            flame.animate()
            if (flame.isProjectile) {
                flame.checkForFlammables()
            }
        }
    }
    for (var f=0;f<flames.length;f++) {
        var flame = flames[f]
        if (!flame.sprite.visible) {
            stage.removeChild(flame.sprite)
            flames.splice(f,1)
            f--
        }
    }
    player.checkForBlockages();
    player.checkForCherries();
    if (!player.immune) {
        player.checkForEnemies();
    }

    player.legCycleRate = 7-(Math.abs(Math.round((player.velocity.x)/15)));
    if (player.speed === player.runSpeed) {
        player.legCycleRate = 2
    }
    // if (player.jetpack && !activeDBox && !player.plucking && !pressingUp && counter === pressedAAt) {
    //     player.jetpack.boosting = true
    // }
    if (player.standingOnGround() || player.climbing) {
        if (!activeDBox && !player.plucking && !pressingUp && counter === pressedBAt) {
            // if (!player.jetpack || player.jetpack.fuel===0) {
                player.leap();
            // }
        }
        if (!player.climbing && player.velocity.x !== 0) {
            if (mod(player.legCycleRate)) {
                if (player.currentFrame === 7 || player.currentFrame === 5) {
                    player.land();
                } else if (!player.crouching && counter-player.threw >= player.legCycleRate) {
                    player.cycleLegs();
                }
            };
        } else if (!player.crouching && !player.climbing && counter-player.threw >= 15 && !player.plucking && mod(Math.round(player.speed*1.5)) && player.currentFrame !== 0 && player.currentFrame !== 3) {
            if (!player.carrying) {   
                player.currentFrame = 0;
            } else {
                player.currentFrame = 3;
            }
            player.changeFrame(player.currentFrame);
        }
    } else {
        if (counter-player.lastPlucked > player.pluckTime ) {
            // if (!player.jetpack.boosting) {
                player.applyGravity();
            // }
            // console.log(player.sprite.y)
        };
        if (counter-player.threw >= 15 && !player.carrying && player.currentFrame !== 7) {
            if (!player.immune && player.velocity.y > 0) {
                player.currentFrame = 5;
            } else {
                player.currentFrame = 7;
            }
        };
        if (counter-player.threw >= 15 && player.carrying && player.currentFrame !== 5) {
            if (!player.immune && player.velocity.y > 0) {
                player.currentFrame = 5;
            } else {
                player.currentFrame = 5;
            }
        };
        if (!player.crouching) {
            player.changeFrame(player.currentFrame);
        };
    }
    // log(player.velocity.y)
    if (player.climbing) {
        if (Math.abs(player.sprite.x-(player.climbing.base.x+player.climbing.base.width/2)) >= tileWidth/2) {
            player.climbing = undefined;
        }
    }
    if (mod(1) && counter-player.hit <= 45) {
        if (player.sprite.visible) {
            player.sprite.visible = false;
        } else {
            player.sprite.visible = true;
        }
        if (counter-player.hit === 45) {
            player.sprite.visible = true;
            player.immune = false;
        }

    }

    if (player.velocity.y > 0) {
        if (player.velocity.y-1 > 0) {
            player.velocity.y -= 1;
        } else {
            player.velocity.y = 0;
        }
        if (!player.climbing) {
            player.sprite.y -= tileWidth*(player.velocity.y/24)
        };
        if (player.carrying) {
            player.carrying.sprite.y -= tileWidth*(player.velocity.y/24);
        }
        if (player.turrets.length > 0) {
            player.turrets[0].container.y -= tileWidth*(player.velocity.y/24);
        }
    }
    if (player.plucking) {
        if (player.plucking.type === "tuft") {
            player.pluckGrass(player.plucking);
        } else {
            player.liftBlock(player.plucking);
        }
    }
    if (player.carrying && counter-player.lastPlucked <= player.uprootTime) {
        if (player.currentFrame !== 10) {
            if (player.carrying.type === "bomb") {
                if (!player.carrying.litFuseAt) {
                    player.carrying.litFuseAt = counter;
                }
            }
            player.currentFrame = 10;
            player.changeFrame(player.currentFrame);
            // automatically changed back when uprootTime elapsed
        }
        if (player.carrying.type === "enemy") {
            player.carrying.sprite.y -= 10/player.uprootTime;
        } else if (player.carrying.type === "mushroomBlock") {
            player.carrying.sprite.y -= (player.carrying.sprite.y-(player.sprite.y-player.carryingSpot))/player.uprootTime;
        } else {
            player.carrying.sprite.y -= 4
//            player.carrying.sprite.y -= (player.carrying.sprite.y-(player.sprite.y-player.carryingSpot))/player.uprootTime;
        }



    }

    if (player.sprite.x+(player.speed*(player.velocity.x/10)) >= player.sprite.width/2 && !player.blocked && !player.plucking && player.velocity.x !== 0) {
//    if (player.sprite.x+(player.speed*(player.velocity.x/10)) >= player.sprite.width/2 && player.sprite.x+(player.speed*(player.velocity.x/10)) <= scrollMax.right+(window.innerWidth/2)-(player.actualWidth/2) && !player.blocked && !player.plucking && player.velocity.x !== 0) {

        player.sprite.x += player.speed*(player.velocity.x/10);

        if (player.turrets.length > 0) {
            player.turrets[0].container.x += player.speed*(player.velocity.x/10);
        }
        if (player.carrying) {
            player.carrying.sprite.x += player.speed*(player.velocity.x/10);
        }

    };
    if (player.sprite.y > stage.y+window.innerHeight/2) {
//        player.sprite.y = stage.y-window.innerHeight/2;
    }
    if (!player.cave) {
        if (player.area !== "Village" && player.sprite.x < areaLimits["Overworld - Village"].x.max) {
            player.area = "Village"
            log("location",player.area)
        } else if (player.area !== "Eastern Sea" && player.sprite.x >= areaLimits["Overworld - Eastern Sea"].x.min && player.sprite.x < areaLimits["Overworld - Eastern Sea"].x.max) {
            player.area = "Eastern Sea"
            log("location",player.area)
        } else if (player.area !== "Guru's Tower" && player.sprite.x >= areaLimits["Overworld - Guru's Tower"].x.min) {
            player.area = "Guru's Tower"
            log("location",player.area)
        }
    }
    for (var e=0;e<eggs.length;e++) {
        var egg = eggs[e]
        if (!egg.dead && egg.home.container.visible) {
            egg.listenForPlayer()
            // console.log("listening egg " + e)

            if (egg.opening) {
                egg.open()  
            }
            if (egg.onFire) {
                egg.burn(egg.onFire)
                if (mod(30)) {
                    egg.onFire--
                }
            }
            if (counter-egg.damagedAt < 10) {
                if (mod(2)) {
                    egg.sprite.tint = 0xff0000
                } else {
                    egg.sprite.tint = 0xffffff
                }
            }
            if (counter-egg.damagedAt === 10) {
                egg.sprite.tint = 0xffffff
            }
        } else {
            // console.log("egg " + e + " contaainer invisble")
        }
    }
    // for (var a=0;a<aliens.length;a++) {
    //     var alien = aliens[a]
    //     if (alien.home.container.visible) {
            
    //         if (!alien.touchingGround()) {
    //             alien.applyGravity()
    //         } else {
    //             // if (counter%200 < 100) {
    //             //     alien.run(1)
    //             // } else {
    //             //     alien.run(-1)
    //             // }
    //         }
    //         alien.applyVelocity()
    //         if (pressedAAt===counter) {
    //             // alien.hop()
    //         }
    //         console.log(alien.velocity.y)
    //         alien.previousPosition.x = alien.sprite.x
    //         alien.previousPosition.y = alien.sprite.y
    //     }
    // }


    if (box.rolling === "open") {
        console.log("rolling open")
        box.rollOpen()
    }
    if (box.rolling === "closed") {
        box.rollClosed()
    }
    if (box.revealing) {
        box.revealText()
    }
    if (box.choiceBox.rolling === "open") {
        box.choiceBox.rollOpen()
    }
    if (box.choiceBox.rolling === "closed") {
        box.choiceBox.rollClosed()
    }


    for (var n=0;n<npcs.length;n++) {
        var npc = npcs[n]
        if (npc.onscreen()) {
            if (!npc.sprite.visible) {
                npc.sprite.visible = true
                npc.caret.visible = true
            }
            // npc.sprite.tint = 0x00ff00
            // if (mod(3)) {
                npc.listenForPlayer()
                npc.bobCaret()
            // }
        } else {
            // npc.sprite.tint = 0xff0000
            // npc.listenForPlayer()
            // npc.bobCaret()
            if (npc.sprite.visible) {
                npc.sprite.visible = false
                npc.caret.visible = false
            }
        }
    }

    for (var b=0;b<bullets.length;b++) {
        var bullet = bullets[b];
        bullet.fly();
    }

    if (mushroomBlocks.length) {
        for (var m=0;m<mushroomBlocks.length;m++) {
            var mBlock = mushroomBlocks[m];
            if (mBlock.thrown) {
                mBlock.fly();
            };
            if (player.carrying !== mBlock && !mBlock.touchingGround()) {
//                mBlock.applyGravity();
            }
        }
    }
    if (bombs.length) {
        for (var b=0;b<bombs.length;b++) {
            var bomb = bombs[b];
            if (counter-bomb.litFuseAt > 60 && mod(2)) {
                bomb.flash();
            }
            if (counter-bomb.litFuseAt === 120) {
                bomb.explode();
            }
            if (bomb.thrown) {
                bomb.fly();
            };
        }
    }
    if (explosionSprites.length) {
        for (var e=0;e<explosionSprites.length;e++) {
            var explosion = explosionSprites[e];
            if (explosion.width < tileWidth*2 && counter-explosion.wentOffAt <= 24) {
                explosion.scale.x += 0.2;
                explosion.scale.y += 0.2;
            }
            if (counter-explosion.wentOffAt === 24) {
                explosionSprites.splice(e,1);
                stage.removeChild(explosion);
            }
        }
    }
    if (vegetables.length) {
        for (var v=0;v<vegetables.length;v++) {
            var veg = vegetables[v];
            if (veg.thrown) {
                veg.fly();
            }
        }
//        if (veg.velocity.y > 0) {
//            if (veg.velocity.y-1 > 0) {
//                veg.velocity.y -= 1;
//            } else {
//                veg.velocity.y = 0;
//            }
//        }

//        if (veg.velocity.x !== 0) {
//            if (veg.velocity.x > 0) {
//                veg.velocity.x *= 0.9
//            } else if (veg.velocity.x < 0) {
//                veg.velocity.x *= 0.9
//            }
//        }
    }
    for (var n=0;n<enemies.length;n++) {
        var enemy = enemies[n];
        enemy.checkForBlockages();
        if (!enemy.died) {
            if (player.carrying !== enemy) {
                if (enemy.touchingGround()) {
                    if (!enemy.blocked) {
                        enemy.walk();
                    } else {
                        enemy.sprite.scale.x *= -1;
                        enemy.flippedX *= -1;
                        enemy.walk();

                    }
                } else {
                    enemy.fly();
                    enemy.applyGravity();
                }

                enemy.checkForProjectiles();
            } else {
                enemy.cycleLegs(Math.round(enemy.legCycleRate/3));
            }
        } else {
            enemy.applyGravity();
            enemy.sprite.y -= (enemy.velocity.y/72)*tileWidth;
            enemy.velocity.y--;
//            enemy.sprite.x -= enemy.velocity.x/24;
//            enemy.velocity.x--;
            if (enemy.sprite.y-player.sprite.y >= window.innerHeight) {
                enemies.splice(n,1);
                stage.removeChild(enemy.sprite);
            }
        }

    }

    if (stage.scale.x === 1 && movingToNewScreen) {
        transitionScreen(movingToNewScreen)
    }
    if (stage.scale.x === 1 && (player.sprite.y-player.lastPosition.y !== 0 || Math.abs(player.velocity.x) || player.climbing)) {
        moveCamera();
    }
    if (player.sword) {
        var sword = player.sword
        sword.followPlayer()

        if (sword.chargeTime>=sword.chargeMax) {
            if (mod(2)) {
                player.sprite.tint = 0xff0000
            } else {
                player.sprite.tint = 0xffffff
            }
        }
        if (sword.windingUp) {
            sword.windUp(sword.strikeSpeed/4,sword.upLimit)
        }
        if (sword.striking) {
            sword.strike(sword.strikeSpeed,sword.downLimit)
            sword.checkForSlicables()
        }
        if (sword.angle < sword.idleAngle && !sword.striking) {
            sword.windUp(sword.strikeSpeed,sword.idleAngle)
        }
    }
    if (player.flamethrower) {
        player.flamethrower.followPlayer()
    }
    if (player.jetpack) {
        player.jetpack.followPlayer()
        // player.jetpack.updateGasMeter()
        if (player.jetpack.boosting) {
            player.jetpack.boost()
        }
        if (player.standingOnGround() && !pressingXButton && mod(30)) {
            if (player.jetpack.fuel+player.jetpack.rechargeRate < player.jetpack.maxFuel) {
                player.jetpack.fuel += player.jetpack.rechargeRate
            } else {
                player.jetpack.fuel = player.jetpack.maxFuel
            }
           
            player.jetpack.updateGasMeter()
        }
    }

    player.lastPosition.x = player.sprite.x;
    player.lastPosition.y = player.sprite.y;

    if (tufts.length) {tufts[0].wave()};
    if (cherries.length) {cherries[0].wave()};
    for (var c=0; c<climbables.length;c++) {
        if (climbables[c].type === "vine") {
            climbables[c].wave();
            continue;
        }
    };
    if (!player.standingOnGround() || player.velocity.y > 0) {
        player.standingOn = undefined;
    }
    if (player.standingOn && (counter-player.beganPluck > player.pluckTime*2) && !player.crouching && player.carrying) {
        player.placeCargo();
    }
    
    if (lightningStruckAt) {
        
        lightningField.flash(lightningDuration)
    }
    counter++;
    // lastUpdated = Date.now();
    // lastDrawn = Date.now();
}
