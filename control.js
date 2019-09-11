nesBGColor = 0x555555

function pressUp() {
	pressingUp = true;
	pressedUpAt = counter;
	$("#nes-up").css('transform','none')
}
function releaseUp() {
	pressingUp = false;
	releasedUpAt = counter
	$("#nes-up").css('transform','perspective( 50vmin ) rotateX( -25deg )')
}
function pressDown() {
	pressingDown = true;
	pressedDownAt = counter;
	$("#nes-down").css('transform','none');
}
function releaseDown() {
	pressingDown = false
	releasedDownAt = counter
	$("#nes-down").css('transform','perspective( 50vmin ) rotateX( 25deg )')
}
function pressLeft() {
	pressingLeft= true;
	pressedLeftAt = counter
	$("#nes-left").css('transform','none');
}
function releaseLeft() {
	pressingLeft= false;
	releasedLeftAt = counter
	$("#nes-left").css('transform','perspective( 50vmin ) rotateY( 25deg )');
}
function pressRight() {
	pressingRight = true;
	pressedRightAt = counter;
	$("#nes-right").css('transform','none');
}
function releaseRight() {
	pressingRight = false;
	releasedRightAt = counter
	$("#nes-right").css('transform','perspective( 50vmin ) rotateY( -25deg )');
}

function pressUpLeft() {
	pressingUpLeft = true;
	$("#nes-up").css('transform','none')
	$("#nes-left").css('transform','none')
}
function releaseUpLeft() {
	pressingUpLeft = false;
	$("#nes-up").css('transform','perspective( 50vmin ) rotateX( -25deg )')
	$("#nes-left").css('transform','perspective( 50vmin ) rotateY( 25deg )');
}
function pressUpRight() {
	pressingUpRight= true;
	$("#nes-up").css('transform','none');
	$("#nes-right").css('transform','none');
}
function releaseUpRight() {
	pressingUpRight= false;
	$("#nes-up").css('transform','perspective( 50vmin ) rotateX( -25deg )')
	$("#nes-right").css('transform','perspective( 50vmin ) rotateY( -25deg )');

}
function pressDownLeft() {
	pressingDownLeft = true;
	$("#nes-down").css('transform','none');
	$("#nes-left").css('transform','none');
}
function releaseDownLeft() {
	pressingDownLeft = false
	$("#nes-down").css('transform','perspective( 50vmin ) rotateX( 25deg )')
	$("#nes-left").css('transform','perspective( 50vmin ) rotateY( 25deg )');
}
function pressDownRight() {
	pressingDownRight = true;
	$("#nes-down").css('transform','none');
	$("#nes-right").css('transform','none');
}
function releaseDownRight() {
	pressingDownRight = false;
	$("#nes-down").css('transform','perspective( 50vmin ) rotateX( 25deg )')
	$("#nes-right").css('transform','perspective( 50vmin ) rotateY( -25deg )');

}





function pressAButton() {
	playSound(jumpSound)
	pressedAAt = counter
	pressingAButton = true
	$("#a-button").css('background-size','98%')
}
function releaseAButton() {
	pressingAButton = false
	releasedAAt = counter
	$("#a-button").css('background-size','100%')
}
function pressBButton() {
	pressedBAt = counter
	pressingBButton = true
	$("#b-button").css('background-size','98%')
}
function releaseBButton() {
	releasedShootAt = counter
	pressingBButton = false
	releasedBAt = counter
	$("#b-button").css('background-size','100%')
}
function pressYButton() {
	pressedYAt = counter
	pressingYButton = true
	$("#y-button").css('background-size','98%')
}
function releaseYButton() {
	pressingYButton = false
	releasedYAt = counter
	$("#y-button").css('background-size','100%')
}
function pressXButton() {
	pressedXAt = counter
	pressingXButton = true
	$("#x-button").css('background-size','98%')
}
function releaseXButton() {
	pressingXButton = false
	releasedXAt = counter
	$("#x-button").css('background-size','100%')
}
function touchOverElement(touch,element) {
	var posX = touch.clientX
	var posY = touch.clientY
	var over = false
	if ( posX > $(element).position().left &&
    posX < $(element).position().left+$(element).width() &&
    posY > $(element).position().top &&
    posY < $(element).position().top+$(element).height() ) {
		over = true
	}
	// if (over) {
	// 	console.log("setting touch over!")
	// 	touch.over = element
	// }
	return over
}
function controlShopDisplay() {
	if (pressingRight && counter-shopDisplay.lastToggled > 10) {
		if (shopDisplay.selectedItem+1 < shopDisplay.itemSprites.length) {
			shopDisplay.selectItem(shopDisplay.selectedItem+1)
		} else {
			console.log("no move right. total items " + shopDisplay.itemSprites.length + " and tried to select index " + (shopDisplay.selectedItem+1))
		}
		shopDisplay.lastToggled = counter
	}
	if (pressingLeft && counter-shopDisplay.lastToggled > 10) {
		if (shopDisplay.selectedItem > 0) {
			shopDisplay.selectItem(shopDisplay.selectedItem-1)
		}
		shopDisplay.lastToggled = counter
	}
	if (pressedXAt===counter) {
		shopDisplay.close()
	}
	if (pressedYAt===counter && counter-shopDisplay.lastToggled > 10) {
		var itemObj = shopDisplay.itemSprites[shopDisplay.selectedItem].obj
		if (player.coins >= itemObj.price) {
			shopDisplay.lastToggled = counter
			itemObj.purchaseAction()
			
			shopDisplay.itemSprites[shopDisplay.selectedItem].alpha = false
			shopDisplay.itemSprites[shopDisplay.selectedItem].price.visible = false
			shopDisplay.itemSprites.splice(shopDisplay.selectedItem,1)
			characters[player.approachingNPC.name].items.splice(shopDisplay.selectedItem,1)
			var newItemArray = []
			if (shopDisplay.itemSprites.length) {
				for (var i=0;i<shopDisplay.itemSprites.length;i++) {
					newItemArray.push(shopDisplay.itemSprites[i].obj.name)
				}
				shopDisplay.createItemDisplay(newItemArray,shopDisplay.merchant)
				shopDisplay.selectItem(0)
			} else {
				box.open(player.approachingNPC,true)
				shopDisplay.close()
				
				
				// "I'm all out" message
			}
			

		}
	}
	
}

function controlChoiceMenu() {
	// var box = activeDBox.choiceBox
	
	if (pressedXAt===counter) {
		// var newLegend = dialogueTree[box.speakerName].responses[box.responses[box.selectedResponse].text].opening
		// var newChoices = dialogueTree[activeDBox.speakerName].responses[box.responses[box.selectedResponse].text].opening
		
		// box.changeLegend(newLegend)

		if (box.container.height) {
			box.close()
		} else {
			box.close()
		}
	}
	if (box.bottomCaret.visible) {
		if (counter%6 < 3) {
			box.bottomCaret.alpha = 0.2
		} else {
			box.bottomCaret.alpha = 1
		}	
	}
	// if (pressingUp) {
	// 	box.scroll(-box.scrollSpeed)
	// }
	if (box.choiceBox.container.height) {
		
		if (pressingDown && counter-box.choiceBox.lastToggle > 10) {
			if (box.choiceBox.responses[box.choiceBox.selectedResponse+1]) {
				box.choiceBox.selectChoice(box.choiceBox.selectedResponse+1)
			}
		}
		if (pressingUp && counter-box.choiceBox.lastToggle > 10) {
			if (box.choiceBox.responses[box.choiceBox.selectedResponse-1]) {
				box.choiceBox.selectChoice(box.choiceBox.selectedResponse-1)
			}
		}
		if (pressedBAt===counter || pressedYAt===counter) {
			if (dialogueChoices.length===0) {
				var newLegend = dialogueTree[box.npc.name].responses[box.choiceBox.responses[box.choiceBox.selectedResponse].text]
			} else if (dialogueChoices.length===1) {
				var newLegend = dialogueTree[box.npc.name].responses[dialogueChoices[0]].responses[box.choiceBox.responses[box.choiceBox.selectedResponse].text]
			}
			// console.log(newLegend)
			dialogueChoices.push(box.choiceBox.responses[box.choiceBox.selectedResponse].text)
			box.changeLegend(newLegend.opening)
			box.choiceBox.rolling = "closed"
			box.revealing = true
			box.choiceBox.responseSelected = 0
			// console.log(dialogueChoices)
		}
	} else {
		if (pressingDown) {
			box.scrollingText = 1
		}
		if (pressedBAt===counter || pressedYAt===counter) {
			if (box.bottomCaret.visible && !box.scrollingText) {
				box.scrollingText = 1
			} else if (characters[player.approachingNPC.name].items && characters[player.approachingNPC.name].items.length) {
				if (shopDisplay.merchant!==player.approachingNPC.name) {
					showBuyExitSymbols()
					shopDisplay.createItemDisplay(characters[player.approachingNPC.name].items,characters[player.approachingNPC.name].name)
					shopDisplay.selectItem(0)
				}
				shopDisplay.container.visible = true
				shopDisplay.rolling = "open"
				box.close()
			} else {
				box.close()
			}
		}
	}
	
	if (box.scrollingText) {
		box.scroll(box.scrollSpeed)
	}
	
	
}

function NESPanel() {
	this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(PIXI.Texture.fromImage("assets/pixel.bmp"))
	this.bg.tint = nesBGColor
	// this.bg.visible = false
	// this.bg.alpha = 0
	this.bg.width = window.innerWidth
    this.bg.height = window.innerHeight-(tilesPerHeight*tileWidth)
	this.bg.x = 0
    this.bg.y = tileWidth*(tilesPerHeight)
	this.upButton = new PIXI.Sprite.fromImage("assets/nesup.png")
	this.downButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nesdown.png"))
	this.leftButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nesleft.png"))
	this.rightButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nesright.png"))
	this.centerPiece = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nescenter.png"))
	this.upLeftButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nescenter.png"))
	this.upRightButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nescenter.png"))
	this.downLeftButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nescenter.png"))
	this.downRightButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nescenter.png"))
	this.aButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nesbutton.png"))
	this.bButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nesbutton.png"))
	this.aLabel = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nesa.png"))
	this.bLabel = new PIXI.Sprite(PIXI.Texture.fromImage("assets/nesb.png"))
	this.dPadPieces = [this.upButton,this.downButton,this.leftButton,this.rightButton,this.upLeftButton,this.upRightButton,this.downLeftButton,this.downRightButton,this.centerPiece]
	var pieceSize = Math.round(tileWidth*2)
	for (var p=0;p<this.dPadPieces.length;p++) {
		var piece = this.dPadPieces[p]
		piece.width = piece.height = pieceSize
		piece.interactive = true
	}
	this.upLeftButton.alpha = 0
	this.upRightButton.alpha = 0
	this.downLeftButton.alpha = 0
	this.downRightButton.alpha = 0
	
	this.centerPiece.x = tileWidth*3
	// this.centerPiece.y = (this.bgHeight/2)
	this.centerPiece.y = (tilesPerHeight*tileWidth)+this.bg.height-(tileWidth*8)
	
	this.upButton.x = this.centerPiece.x
	this.upButton.y = this.centerPiece.y-pieceSize
	this.downButton.x = this.centerPiece.x
	this.downButton.y = this.centerPiece.y+pieceSize
	this.leftButton.x = this.centerPiece.x-pieceSize
	this.leftButton.y = this.centerPiece.y
	this.rightButton.x = this.centerPiece.x+pieceSize
	this.rightButton.y = this.centerPiece.y
	this.upRightButton.x = this.rightButton.x
	this.upRightButton.y = this.upButton.y
	this.upLeftButton.x = this.leftButton.x
	this.upLeftButton.y = this.upButton.y
	this.downRightButton.x = this.rightButton.x
	this.downRightButton.y = this.downButton.y
	this.downLeftButton.x = this.leftButton.x
	this.downLeftButton.y = this.downButton.y
	this.aButton.interactive = this.bButton.interactive = true
	this.aButton.width = this.aButton.height = this.bButton.width = this.bButton.height = Math.round(tileWidth*3)
	this.aLabel.width = this.aLabel.height = this.bLabel.width = this.bLabel.height = Math.round(tileWidth*0.75)
	this.aButton.x = viewWidth-(tileWidth)-this.aButton.width
	this.bButton.x = this.aButton.x-(this.aButton.width*1.25)
	this.aButton.y = this.bButton.y = this.centerPiece.y
	this.bLabel.x = this.bButton.x+this.bButton.width-this.bLabel.width
	this.bLabel.y = this.aLabel.y = this.bButton.y+(this.bButton.height*1.1)
	this.aLabel.x = this.aButton.x+this.aButton.width-this.aLabel.width


	
	this.container.addChild(this.bg)
	this.container.addChild(this.centerPiece)
	this.container.addChild(this.upButton)
	this.container.addChild(this.downButton)
	this.container.addChild(this.leftButton)
	this.container.addChild(this.rightButton)
	this.container.addChild(this.upLeftButton)
	this.container.addChild(this.upRightButton)
	this.container.addChild(this.downLeftButton)
	this.container.addChild(this.downRightButton)
	this.container.addChild(this.bButton)
	this.container.addChild(this.aButton)
	this.container.addChild(this.bLabel)
	this.container.addChild(this.aLabel)
	

    // this.container.visible = false
    // this.container.y = 400
	
	this.listenForTouchInput = function(touchIndex) {
		if (fingerOnScreen) {
			var cursor = {x:touches[touchIndex].pos.x,y:touches[touchIndex].pos.y}
			var center = {x:nesPanel.container.x+this.centerPiece.x+(pieceSize/2),y:nesPanel.container.y+this.centerPiece.y+(pieceSize/2)}
			var xDistance = cursor.x-center.x
			var yDistance = cursor.y-center.y
			var angle = radToDeg(angleOfPointABFromXY(cursor.x,cursor.y,center.x,center.y))-90
			if (Math.abs(xDistance) < pieceSize*1.5 && Math.abs(yDistance) < pieceSize*1.5) {
				if (angle > 110 || angle < -110) {
					if (!pressingLeft ) {
						pressingLeft = true
						this.leftButton.tint = 0x00ff00
					}
				} else if (pressingLeft) {
					stopPressing("left")
					this.leftButton.tint = 0xffffff
				}
				if (angle > -70 && angle < 70) {
					if (!pressingRight) {
						pressingRight = true
						this.rightButton.tint = 0x00ff00
					}
				} else if (pressingRight) {
					stopPressing("right")
					this.rightButton.tint = 0xffffff
				}
				if (angle > 20 && angle < 160) {
					if (!pressingDown) {
						pressingDown = true
						pressedDownAt = counter
						this.downButton.tint = 0x00ff00
					}
				} else if (pressingDown) {
					stopPressing("down")
					this.downButton.tint = 0xffffff
				}
				if (angle > -160 && angle < -20) {
					if (!pressingUp) {
						pressingUp = true
						pressedupAt = counter				
						this.upButton.tint = 0x00ff00
					}
				} else if (pressingUp) {
					stopPressing("up")
					releasedUpAt = counter
					this.upButton.tint = 0xffffff
				}
			} else {
				if (Math.abs(xDistance) < pieceSize*2) {
					stopPressing("up")
					stopPressing("down")
					stopPressing("left")
					stopPressing("right")
				}
			}
			// if (!pressingBButton && cursor.x >= this.bButton.x && cursor.x <= this.bButton.x+this.bButton.width && cursor.y >= this.bButton.y && cursor.y <= this.bButton.y+this.bButton.height) {
			// 	pressingBButton = true
			// 	pressedBAt = counter
			// 	this.bButton.tint = 0x00ff00
			// } else if ((cursor.x > this.bButton.x+this.bButton.width || cursor.x < this.bButton.x || cursor.y < this.bButton.y || cursor.y > this.bButton.y+this.bButton.height)
			//  && pressingBButton) {
			// 	// pressingBButton = false
			// 	// this.bButton.tint = 0xffffff
			// }
			// if (!pressingAButton && cursor.x >= this.aButton.x && cursor.x <= this.aButton.x+this.aButton.width && cursor.y >= this.aButton.y && cursor.y <= this.aButton.y+this.aButton.height) {
			// 	pressingAButton = true
			// 	pressedAAt = counter
			// 	this.aButton.tint = 0x00ff00
			// } else if ((cursor.x > this.aButton.x+this.aButton.width || cursor.x < this.aButton.x || cursor.y < this.aButton.y || cursor.y > this.aButton.y+this.aButton.height)
			// && pressingAButton
			// ) {
			// 	// pressingAButton = false
			// 	// releasedAAt = counter
			// 	// this.aButton.tint = 0xffffff
			// 	// console.log("releasing now " + cursor.y + " cur y and " + this.aButton.y + " buttonY")
			// }
		}
	}
	
	stage.addChild(this.container)
	// this.upLeftButton.on('touchstart',function() {
	// 	pressingUp = true
	// 	pressingLeft = true
	// 	nesPanel.upButton.tint = 0xff0000
	// 	nesPanel.leftButton.tint = 0xff0000
	// })
	this.upLeftButton.on('touchend',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		pressingLeft = false
		nesPanel.upButton.tint = 0xffffff
		nesPanel.leftButton.tint = 0xffffff
	})
	this.upLeftButton.on('touchendoutside',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		pressingLeft = false
		nesPanel.upButton.tint = 0xffffff
		nesPanel.leftButton.tint = 0xffffff
	})
	// this.upRightButton.on('touchstart',function() {
	// 	pressingUp = true
	// 	pressingRight = true
	// 	nesPanel.upButton.tint = 0xff0000
	// 	nesPanel.rightButton.tint = 0xff0000
	// })
	this.upRightButton.on('touchend',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		pressingRight = false
		nesPanel.upButton.tint = 0xffffff
		nesPanel.rightButton.tint = 0xffffff
	})
	this.upRightButton.on('touchendoutside',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		pressingRight = false
		nesPanel.upButton.tint = 0xffffff
		nesPanel.rightButton.tint = 0xffffff
	})
	this.downLeftButton.on('touchend',function() {
		pressingLeft = false
		pressingDown = false
		pressedDownAt = 0
		releasedDownAt = counter
		nesPanel.downButton.tint = 0xffffff
		nesPanel.leftButton.tint = 0xffffff
	})
	this.downLeftButton.on('touchendoutside',function() {
		pressingLeft = false
		pressingDown = false
		pressedDownAt = 0
		releasedDownAt = counter
		nesPanel.downButton.tint = 0xffffff
		nesPanel.leftButton.tint = 0xffffff
	})
	this.downRightButton.on('touchend',function() {
		pressingRight = false
		pressingDown = false
		pressedDownAt = 0
		releasedDownAt = counter
		nesPanel.downButton.tint = 0xffffff
		nesPanel.rightButton.tint = 0xffffff
	})
	this.downRightButton.on('touchendoutside',function() {
		pressingRight = false
		pressingDown = false
		pressedDownAt = 0
		releasedDownAt = counter
		nesPanel.downButton.tint = 0xffffff
		nesPanel.rightButton.tint = 0xffffff
	})
	// this.upButton.on('touchstart',function() {
	// 	pressingUp = true
	// 	this.tint = 0xff0000
	// })
	this.upButton.on('touchend',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		this.tint = 0xffffff
		stopPressing("up")
	})
	this.upButton.on('touchendoutside',function() {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		this.tint = 0xffffff
		stopPressing("up")
	})
	// this.downButton.on('touchstart',function() {
	// 	pressingDown = true
	// 	this.tint = 0xff0000
	// })
	this.downButton.on('touchend',function() {
		pressingDown = false
		this.tint = 0xffffff
		stopPressing("down")
	})
	this.downButton.on('touchendoutside',function() {
		pressingDown = false
		this.tint = 0xffffff
		stopPressing("down")
	})
	// this.leftButton.on('touchstart',function() {
	// 	pressingLeft = true
	// 	this.tint = 0xff0000
	// })
	this.leftButton.on('touchend',function() {
		pressingLeft = false
		this.tint = 0xffffff
	})
	this.leftButton.on('touchendoutside',function() {
		pressingLeft = false
		this.tint = 0xffffff
	})
	// this.rightButton.on('touchstart',function() {
	// 	pressingRight = true
	// 	this.tint = 0xff0000
	// })
	this.rightButton.on('touchend',function() {
		pressingRight = false
		this.tint = 0xffffff
	})
	// this.rightButton.on('touchendoutside',function() {
	// 	pressingRight = false
	// 	this.tint = 0xffffff
	// })
	this.aButton.on('touchstart',function() {
		
		pressedAAt = counter
		pressingAButton = true
		this.tint = 0x00ff00
	})
	this.aButton.on('touchend',function() {
		releasedAAt = counter
		pressingAButton = false
		this.tint = 0xffffff
	})
	this.aButton.on('touchendoutside',function() {
		releasedAAt = counter
		pressingAButton = false
		this.tint = 0xffffff
	})
	this.bButton.on('touchstart',function() {
		pressedBAt = counter
		pressingBButton = true
		this.tint = 0x00ff00
	})
	this.bButton.on('touchend',function() {
		releasedShootAt = counter
		pressingBButton = false
		this.tint = 0xffffff
	})
	this.bButton.on('touchendoutside',function() {
		releasedShootAt = counter
		pressingBButton = false
		this.tint = 0xffffff
	})
}

function handleInputs() {
	if (pressingUp) {
		newDirection = "up"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
			if (!pressedUpAt) {
				pressedUpAt = counter
			}
		}
	}
	if (pressingDown) {
		newDirection = "down"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
			if (!pressedDownAt) {
				pressedDownAt = counter
			}
		}
	}
	if (pressingLeft) {
		newDirection = "left"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
			pressedLeftAt = counter
		}
	}
	if (pressingRight) {
		newDirection = "right"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
			pressedRightAt = counter
		}
	}	
	if (isTouchDevice && removedTouchAt === counter) {
		var currentTouch = lastLiftedTouch
		for (var d=1;d<dPadPieces.length;d++) {
		
			var pieceName = dPadPieces[d]
			var xBounds = {left:dPadPositions[d].left,right:(dPadPositions[d].left+pieceSize)}
			var yBounds = {top:dPadPositions[d].top,bottom:(dPadPositions[d].top+pieceSize)}
			if (currentTouch.pageX > xBounds.left && currentTouch.pageX < xBounds.right &&
				currentTouch.pageY > yBounds.top && currentTouch.pageY < yBounds.bottom) {
				dPadPositions[d].touchOff()
				
			}
		}
	}
	// console.log(pressingDirections[0])
	// console.log(pressingDirections[1])
}

function stopPressing(direction) {
	if (direction === "up") {
		pressingUp = false
		pressedUpAt = 0
		releasedUpAt = counter
		
		if (nesPanel) {
			nesPanel.upButton.tint = 0xffffff
		}
	}
	if (direction === "down") {
		pressingDown = false
		pressedDownAt = 0
		releasedDownAt = counter
		if (nesPanel) {
			nesPanel.downButton.tint = 0xffffff
		}
	}
	if (direction === "left") {
		pressingLeft = false
		if (nesPanel) {
			nesPanel.leftButton.tint = 0xffffff
		}
	}
	if (direction === "right") {
		pressingRight = false
		if (nesPanel) {
			nesPanel.rightButton.tint = 0xffffff
		}
	}
	lastLiftedDirection = direction
	stoppedPressing = counter
	pressingDirections.splice(pressingDirections.indexOf(direction),1)
}

function monitorDPad(touch) {
	var currentTouch = ongoingTouches[touch]
	// console.log("monitoring at " + counter + " with touchX " + currentTouch.pageX + " and window/2 " + (window.innerWidth/2))
	if (currentTouch.pageX < window.innerWidth/2) {
		for (var d=1;d<dPadPieces.length;d++) {
			
			var pieceName = dPadPieces[d]
			var xBounds = {left:dPadPositions[d].left,right:(dPadPositions[d].left+pieceSize)}
			var yBounds = {top:dPadPositions[d].top,bottom:(dPadPositions[d].top+pieceSize)}
			if (currentTouch.pageX > xBounds.left && currentTouch.pageX < xBounds.right &&
				currentTouch.pageY > yBounds.top && currentTouch.pageY < yBounds.bottom) {
				dPadPositions[d].touchOn()
				
			} else if (d<5 && $("#"+pieceName).css('transform') === "none"){
				dPadPositions[d].touchOff()
			}
		}
	}
	
}
function monitorTouches() {
	for (var t=0;t<ongoingTouches.length;t++) {
		monitorDPad(t)
	}
	
}