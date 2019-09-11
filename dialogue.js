dialogueTree = {

        littleToad1:{
            opening:"Could it be? Are you Toad?",
            responses:{
                "Yes": {
                    opening:"Hurrah! I knew it! The Great Guru said you'd come!"
                },
                "No": {
                    opening:"Oh. Too bad."
                },
                "How do you know my name?": {
                    opening:"The Great Guru has always told us tales of the tall pale warrior Toad.",
                    responses:{
                        "Great Guru...?": {
                            opening:"He guides us in all things from his great Tower to the East. He provides for our every need."
                            
                        }
                    }
                },
            } 
        },
        littleToad2:{
            opening:"The Great Guru has been providing us with infinite chickens for time out of mind... until the spaceship came.",
            responses:{
                "What spaceship?": {
                    opening:"Where you been, mister? Ever since it got here, no one who has crossed the sea has returned.",
                    responses:{
                        "Where is the spaceship now?": {
                            opening:"Straight up, really far. I'd say 30 screens or more. It's just been floating there, looking ominous."
                        },
                        "Where did it come from?": {
                            opening:"Space, I guess."
                        }
                    }
                },
                "Infinite chickens??": {
                    opening:"Indeed. In times of need we would voyage to his temple across the sea, and return with all the chickens we could carry.",
                    responses:{
                        "How is that possible?":{
                            opening:"No one knows. But we have never known hunger, either."
                        },
                        
                    }
                },
                "What does this Guru want with me?": {
                    opening:"He said if trouble he couldn't handle came, you would appear and save the day. Personally I think you look a bit soft.",
                    responses:{
                        "How does he know this?":{
                            opening:"The Great Guru is very powerful and wise. He knows an astounding number of things."
                        },
                        "Where is the Great Guru now?":{
                            opening:"At his place atop the great tower, across the Eastern Sea. But since the spaceship arrived, no one who has ventured there has returned..."
                        }
                    }
                },
            } 
        },
        littleToad3:{
            opening:"The Great Guru tells us many astounding tales of the heroic warrior Toad. If you're him, we're surely saved! Hurrah!",
            responses:{
                "What kind of tales?":{
                    opening:"Tales of a vast bright kingdom always under siege by darkness, and the relentless hero who rises again and again to keep it at bay."
                },
                "Where is the Great Guru now?":{
                    opening:"At his place atop his Temple, across the Eastern Sea. But since the spaceship arrived, no one who has ventured there has returned..."
                }
            }
            
        },
        barToad1:{
            opening:"It's only a matter of time before we all starve. No wonder everybody's drinking and gambling.",
            responses:{
                "Can't you just live on turnips?":{
                    opening:"Turnips are the Great Guru's food. They provide us no nourishment."
                },
                "Where can I gamble?":{
                    opening:"Bonus Chance Casino is a couple doors down. I don't like it. Full of fish-folk, usually."
                }
            }

        },
        littleToad4:{
            opening:"Not long ago, these caves were filled with lush vegetation and frolicking chickens.",

        },
        littleToad5:{
            opening:"Even if that spaceship doesn't attack, we will surely die without our supply of chickens.",
            // responses:{
                // "How can I do that?": {
                //     opening:"I don't know. Ask the Great Guru. He foretold your coming.",
                // },
                // "Why did the ": {
                //     opening:"Indeed. He calls them forth from the Sea Volcano. But now he's gone to the East Mountain, and we're starving.",
                //     responses:{
                //         "Why has he gone there?":{
                //             opening:"No one knows. Some say he's going to awaken an Ancient Weapon, but those are just rumors. \nSurely it's not because he's frightened..."
                //         },
                        
                //     }
                // },
                // "What does this Guru want with me?": {
                //     opening:"He says you're the only one with the power to send the spaceship away. Personally I think you look a bit soft.",
                //     responses:{
                //         "How does he know this?":{
                //             opening:"The Great Guru knows an astounding number of things."
                //         },
                //         "Where is the Great Guru now?":{
                //             opening:"Nobody knows. After the spaceship came he went up to the mountains and hasn't been back since."
                //         }
                //     }
                // },
            // } 
        },
        fishman1:{
            opening:"Greetings.",
            responses:{
                "Why aren't you in the sea?": {
                    opening:"Long ago, the Great Guru called my people forth to help erect his great Tower. Some of us decided we like it better up here! Ha, ha!",
                   
                },
                "What do you know about the spaceship?": {
                    opening:"Nothing. I'm from the sea. To me, YOU are a spaceship! Ha, ha!",
                }
                // "What do you know about the spaceship?": {
                //     opening:"Nothing. I'm from the sea. To me, YOU are a spaceship! Ha, ha!",
                //     responses:{
                //         "What's up there?":{
                //             opening:"I don't know, but it must be very important if the Guru would leave his people."
                //         },
                        
                //     }
                // }
            } 
        },
        fishman2:{
            opening:"You'll need a weapon if you mean to leave the village. Otherwise, you'll never survive.",
            responses:{
                "Why? What's out there?": {
                    opening:"Not sure, but no one who's left lately has come back.",
                    
                }
                
            } 
        },
        fishMerchant:{
            
            opening:"I have useful items for sale... if you have the coins.",
            soldOut:"I guess you cleaned me out."
          
        }

}
dialogueChoices = []



function hasResponses(legend) {
    var hasResponses = false
    for (npc in dialogueTree) {
        var npc = dialogueTree[npc]
        if (npc.opening===legend) {
            if (npc.responses) {
                hasResponses = true
                return Object.keys(npc.responses)
            }
        }
    }
    if (!hasResponses) {
        
        for (npc in dialogueTree) {
            
            var npc = dialogueTree[npc]
            
            if (npc.responses) {
                for (var response in npc.responses) {
                    var resp = npc.responses[response]
                    // console.log(resp) 
                    if (resp.opening===legend && resp.responses) {
                        hasResponses = true
                        return Object.keys(resp.responses)
                    }
                }
            }
            
        }
    }

    // console.log(legend + " responses? " + hasResponses)
    return hasResponses
}

function DialogueBox(init) {
    this.spent = false
    this.choiceBox = false
    this.responses = []
    this.rolling = false
    this.scrollingText = 0
    this.container = new PIXI.Container()
    this.maxHeight = tileWidth*6
    this.border = new PIXI.Sprite(pixelText)
    this.border.tint = 0xdddddd
    this.border.width = viewWidth*0.6
    this.fullText = undefined
    this.bg = new PIXI.Sprite(pixelText)
    this.bg.tint = 0x000000
    this.bg.width = this.border.width-(tileWidth/4)
    this.bg.alpha = this.border.alpha = 0.75
    dialogueStyle.wordWrapWidth = this.bg.width-(tileWidth*1.5)
    dialogueStyle.leading = tileWidth/3
    dialogueStyle2.wordWrapWidth = this.bg.width-(tileWidth*1.5)
    dialogueStyle2.leading = tileWidth/3
    this.legend = new PIXI.Text("",dialogueStyle)
    this.mask = new PIXI.Sprite(pixelText)
    this.scrollSpeed = tileWidth/8
    this.textSpeed = 5
    this.revealing = false
    this.wordsRevealed = 0

    this.topCaret = new PIXI.Sprite(caretText)
    this.bottomCaret = new PIXI.Sprite(caretText)
    this.topCaret.width = this.topCaret.height = this.bottomCaret.width = this.bottomCaret.height = tileWidth
    this.topCaret.anchor.set(0.5)
    this.bottomCaret.anchor.set(0.5)
    this.bottomCaret.scale.y *= -1

    this.topCaret.x = this.bottomCaret.x = this.border.x+(this.border.width/2)
    this.topCaret.y = this.bg.y+(this.topCaret.height/1.5)
    this.bottomCaret.y = this.bg.y+this.bg.height-(this.bottomCaret.height/1.5)
    
    this.container.addChild(this.border)
    this.container.addChild(this.bg)
    this.container.addChild(this.topCaret)
    this.container.addChild(this.bottomCaret)
    this.container.addChild(this.legend)
    this.container.addChild(this.mask)
    this.topCaret.visible = this.bottomCaret.visible = false
    this.container.x = stagePosition().x+viewWidth-this.container.width-tileWidth
    this.container.y = -(stagePosition().y)+tileWidth

    stage.addChild(this.container)
    // this.origHeight = this.container.height

    this.container.height = 0

    if (init) {
        this.place = function() {
            this.container.x = stagePosition().x+viewWidth-this.container.width-tileWidth
            this.container.y = (-stage.y)+tileWidth
            this.origHeight = this.border.height
            stage.setChildIndex(this.container,stage.children.length-1)
        }
    } else {
        this.place = function() {
            this.container.x = stagePosition().x+tileWidth
            this.container.y = (-stage.y)+(viewHeight/2)
            this.origHeight = this.border.height
            stage.setChildIndex(this.container,stage.children.length-1)
        }
        this.selector = new PIXI.Sprite(caretText)
        this.selector.anchor.set(0.5)
        this.selector.rotation = Math.PI/2
        this.selector.width = this.selector.height = tileWidth
        this.selector.x = this.bg.x+(tileWidth*0.5)
        
        this.selectedResponse = 0
        this.lastToggle = -99
        
        this.container.addChild(this.selector)
    }

    this.open = function(npc,soldOut) {
        this.npc = npc
        player.velocity.x = 0
        if (soldOut) {
            this.changeLegend(dialogueTree[npc.name].soldOut)
            dialogueTree[npc.name].opening = dialogueTree[npc.name].soldOut
        } else {
            this.changeLegend(dialogueTree[npc.name].opening)
        }
        if (dialogueTree[npc.name].responses) {
            this.choiceBox.changeChoices(Object.keys(dialogueTree[npc.name].responses))
        }
        activeDBox = true
        this.rolling = "open"
        this.revealing = true
    }

    this.close = function(reset) {
        this.rolling = "closed"
        if (!this.npc.merchant || pressingXButton) {
            console.log("no items for his")
            removeOKExitSymbols()
        } else {
            console.log("got items, not clearing classes")
        }
        if (this.choiceBox.responses.length) {
            this.choiceBox.rolling = "closed"
            this.choiceBox.selectChoice(0)
        }
        dialogueChoices.length = 0
        this.wordsRevealed = 0
        // this.npc = undefined
        if (reset) {
            setTimeout(function(){
                box.changeLegend(dialogueTree[box.speakerName].opening)                
            },300)
            
        }
        // player.approachingNPC = undefined
    }
    this.rollOpen = function() {
        if (this.container.height+(this.origHeight/10) < this.origHeight) {
            this.container.height += (this.origHeight/10) 
            
        } else {
            this.container.height = this.origHeight
            this.rolling = false
            // console.log("opened.--------------------------------------- ")
        }
    }
    this.rollClosed = function() {
        if (this.container.height-(this.origHeight/10)  > 0) {
            this.container.height -= (this.origHeight/10) 

        } else {
            // console.log("closed.---------------------------------------")
            this.container.height = 0
            this.rolling = false
            if (this.choiceBox) {
                activeDBox = undefined
                
            }
        }
    }
    this.changeLegend = function(newLegend) {
        // console.log(dialogueTree[this.npc.name])
        this.fullText = newLegend

        this.container.removeChild(this.legend)
        this.legend = new PIXI.Text(newLegend,dialogueStyle)
        // this.legend.anchor.x = 1 
        this.border.height = this.legend.height+(tileWidth*2)
        if (this.border.height > this.maxHeight) {
            this.border.height = this.maxHeight
            // console.log("too high")
            this.bottomCaret.alpha = 1
            this.bottomCaret.y = this.border.y+this.border.height-(this.bottomCaret.height/1.25)
            this.bottomCaret.visible = true
            
        }
        
        this.border.width = this.legend.width+(tileWidth*1.75)
        this.bg.width = this.border.width-(tileWidth/4)
        this.bg.height = this.border.height-(tileWidth/4)
        this.bg.x = this.border.x+(tileWidth/8)
        this.bg.y = this.border.y+(tileWidth/8)
        this.legend.x = this.bg.x+(tileWidth*0.75)
        this.legend.y = this.topTextY = this.bg.y+(tileWidth*0.75)
        this.container.addChild(this.legend)
        this.mask.x = this.bg.x
        this.mask.y = this.bg.y+(tileWidth*0.5)
        this.mask.width = this.bg.width
        this.mask.height = this.bg.height-(tileWidth*1.5)
        this.legend.mask = this.mask
        var overage = (this.legend.height-this.mask.height)+(tileWidth*0.25)
        this.bottomTextY = this.topTextY-overage   
        var blankedText = ""
        this.place()
        // for (var c=0;c<this.legend.text.length;c++) {
        //     blankedText += " "
        // }
        this.legend.text = blankedText
        if (!hasResponses(this.fullText)) {
            this.spent = true
        } else {
            this.choiceBox.changeChoices(hasResponses(this.fullText))
        }
         
    }
    this.revealText = function() {
        if (mod(this.textSpeed)) {
            var wordArray = this.fullText.split(" ")
            if (this.wordsRevealed < wordArray.length) {
                this.legend.text += wordArray[this.wordsRevealed]+" "
                this.wordsRevealed++
            } else {
                this.revealing = false
                this.wordsRevealed = 0
                if (hasResponses(this.fullText) && !this.bottomCaret.visible) {
                    this.choiceBox.rolling = "open"
                }
                console.log(player.approachingNPC)
                
            }
            if (this.wordsRevealed === 1 && this.legend.text[0] === " ") {
                this.legend.text = this.legend.text.slice(1)
            }
            
        }
    }
    this.flashChoices = function() {
        for (var r=0;r<this.responses.length;r++) {
            var response = this.responses[r]
            if (r === this.selectedResponse) {
                if (counter%10 >= 3) {
                    response.tint = 0x00aa00
                } else {
                    response.tint = 0xffffff
                }
            }
        }
    }
    this.selectChoice = function(choiceIndex) {
        var response = this.responses[choiceIndex]
        this.selector.y = response.y+(tileWidth/4)
        this.lastToggle = counter
        this.responses[this.selectedResponse].tint = 0xffffff
        this.responses[this.selectedResponse].selected = false
        response.selected = true
        // for (var r=0;r<this.responses.length;r++) {
        //     if (r!==choiceIndex) {
        //         response.selected = false
        //     }
        // }
        this.selectedResponse = choiceIndex
    }
    this.changeChoices = function(newArray) {
        
        for (var r=0;r<this.responses.length;r++) {
            this.container.removeChild(this.responses[r])
        }
        this.responses.length = 0
        var widest = 0
        var totalHeight = 0
        for (var a=0;a<newArray.length;a++) {
            var responseText = newArray[a]
            var response = new PIXI.Text(responseText,dialogueStyle)
            response.x = this.bg.x+(tileWidth*1.5)
            response.y = this.bg.y+(tileWidth*0.75)+totalHeight+(a*tileWidth/2)
            response.selected = false
            // if (a===0) {
            //     response.selected = true
            //     this.selectedResponse = 0
            //     this.selector.y = response.y+(response.height/2)
            // }
            // if (a===0) {
            //     response.selected = true
            //     this.selectedResponse = 0
            //     this.selector.y = response.y+(response.height/2)
            // }
            totalHeight += response.height
            if (response.width > widest) {
                widest = response.width
            }
            this.responses.push(response)
            
            this.container.addChild(response)
        }    
        this.selector.y = this.responses[0].y+(tileWidth/4)
        this.selectedResponse = 0
        this.responses[0].selected = true
        this.border.width = widest+(tileWidth*2.5)
        this.border.height = totalHeight+(tileWidth*3)
        this.bg.width = this.border.width-(tileWidth/4)
        this.bg.height = this.border.height-(tileWidth/4)
        this.bg.x = this.border.x+(tileWidth/8)
        this.bg.y = this.border.y+(tileWidth/8)
        this.bg.alpha = this.border.alpha = 0.75
        this.place()
    }
    
    this.scroll = function(amount) {
        if (amount > 0) {
            if (this.legend.y-amount > this.bottomTextY) {
                this.legend.y -= amount
			} else {
                this.legend.y = this.bottomTextY
                this.bottomCaret.visible = false
                // console.log("stuck to bottom")
                this.scrollingText = 0
                if (hasResponses(this.fullText)) {
                    this.choiceBox.rolling = "open"
                }
			}
        } else {
            if (this.legend.y-amount < this.topTextY) {
                if (!this.bottomCaret.visible) {
                    this.bottomCaret.visible = true
                }
				this.legend.y -= amount
			} else {
                this.legend.y = this.topTextY
                // console.log("stuck to top")
                this.scrollingText = 0
			}
        }
    }
    if (init) {
        this.choiceBox = new DialogueBox()
        
    }
}
function ChoiceBox(questionBox,responseArray) {
    this.spent = false
    this.responses = []
    this.selectedResponse = 0
    this.lastToggle = -99
    this.questionBox = questionBox
    questionBox.choiceBox = this
    this.rolling = false
    this.container = new PIXI.Container()
    this.border = new PIXI.Sprite(pixelText)
    this.border.tint = 0xdddddd
    this.border.width = viewWidth*0.8
    this.border.height = viewHeight*0.45
    this.bg = new PIXI.Sprite(pixelText)
    this.bg.tint = 0x000000
    this.bg.width = this.border.width-(tileWidth/4)
    this.bg.height = this.border.height-(tileWidth/4)
    this.bg.x = this.border.x+(tileWidth/8)
    this.bg.y = this.border.y+(tileWidth/8)
    this.bg.alpha = this.border.alpha = 0.75
    
    dialogueStyle2.wordWrapWidth = this.bg.width-(tileWidth*5.5)
    dialogueStyle2.leading = tileWidth/3
    
    this.container.addChild(this.border)
    this.container.addChild(this.bg)
    
    






    stage.addChild(this.container)
    this.origHeight = this.container.height

    this.container.height = 0

    this.flashChoices = function() {
        for (var r=0;r<this.responses.length;r++) {
            var response = this.responses[r]
            if (response.selected) {
                if (counter%10 >= 3) {
                    response.tint = 0x00aa00
                } else {
                    response.tint = 0xffffff
                }
            }
        }
    }

    this.selectChoice = function(choiceIndex) {
        var response = this.responses[choiceIndex]
        this.selector.y = response.y+(tileWidth/4)
        this.lastToggle = counter
        this.responses[this.selectedResponse].tint = 0xffffff
        this.responses[this.selectedResponse].selected = false
        response.selected = true
        this.selectedResponse = choiceIndex
    }

    this.rollOpen = function() {
        if (this.container.height+(this.origHeight/10) < this.origHeight) {
            this.container.height += this.origHeight/10
        } else {
            this.container.height = this.origHeight
            this.rolling = false
        }
    }
    this.rollClosed = function() {
        if (this.container.height-(this.origHeight/10) > 0) {
            this.container.height -= this.origHeight/10
        } else {
            this.container.height = 0
            this.rolling = false
            this.spent = true
        }
    }
    this.changeLegend = function(newArray) {
        for (var r=0;r<this.responses.length;r++) {
            this.container.removeChild(this.responses[r])
        }
        // console.log("CHANGE A NGIGIGIUH")
        var widest = 0
        var totalHeight = 0
        for (var a=0;a<newArray.length;a++) {
            var responseText = newArray[a]
            var response = new PIXI.Text(responseText,dialogueStyle2)
            response.x = this.bg.x+(tileWidth*1.5)
            response.y = this.bg.y+(tileWidth*0.75)+(a*tileWidth*1.1)
            response.selected = false
            if (a===0) {
                response.selected = true
                this.selectedResponse = 0
                this.selector.y = response.y+(response.height/2)
            }
            totalHeight += response.height
            if (response.width > widest) {
                widest = response.width
            }
            this.responses.push(response)
            
            this.container.addChild(response)
        }    
        this.border.width = widest+(tileWidth*2.5)
        this.border.height = totalHeight+(tileWidth*3)

        this.bg.width = this.border.width-(tileWidth/4)
        this.bg.height = this.border.height-(tileWidth/4)

        this.container.x = stagePosition().x+tileWidth
        this.container.y = stagePosition().y+(viewHeight/2)
    }


}


dialogueStyle = {
    fontSize: 0,
    fontFamily : 'Press Start 2P',
    fill : '#ffffff',
    // align:'left',
    wordWrap: true,
    
}
dialogueStyle2 = {
    fontSize: 0,
    fontFamily : 'Press Start 2P',
    fill : '#ffffff',
    // align:'left',
    wordWrap: true,
    
}
shopStyle = {
    fontSize: 0,
    fontFamily : 'Press Start 2P',
    fill : '#ffffff',
    align:'center',
    wordWrap: true,
    
}

function NPC(character,home,posX,posY) {
    this.name = character
    
    this.sprite = new PIXI.Sprite(characters[character].texture)
    this.sprite.width = tileWidth
    this.sprite.height = tileWidth*2
    this.sprite.anchor.x = 0.5
    this.sprite.anchor.y = 1
    if (this.sprite.texture === fishmanText) {
        this.sprite.texture = fishmanSleepingText
    }
    if (home.type === "plateau") {
        this.plateau = home
        this.sprite.x = (home.posX+posX)*tileWidth
        this.sprite.y = home.floorSpan.groundY
        console.log("placing " + character + " on plat at " + this.sprite.x + " , " + this.sprite.y)
        // console.log("placing plat at " + this.sprite.x + " , " + this.sprite.y)
    }
    if (home.type === "cave") {
        this.cave = home
        this.sprite.x = home.posX+(posX*tileWidth)
        this.sprite.y = home.posY+(posY*tileWidth)
        console.log("placing " + character + " in cave at " + this.sprite.x + " , " + this.sprite.y)
        // console.log("placing at " + this.sprite.x + " , " + this.sprite.y)
    }

    this.caret = new PIXI.Sprite(caretText)
    this.caret.anchor.set(0.5)
    this.caret.width = this.caret.height = tileWidth*0.75
    this.caret.x = this.sprite.x
    this.caret.y = this.sprite.y-(tileWidth*1.75)
    this.caret.scale.y *= -1
    this.bobSpeed = 20
    
    // console.log("placing at " + this.sprite.x + " x and " + this.sprite.y + " y")
    stage.addChild(this.sprite)
    stage.addChild(this.caret)
    
    npcs.push(this)

    this.bobCaret = function() {
        
        if (counter%(this.bobSpeed*2) >= this.bobSpeed) {
            this.caret.y += tileWidth/(this.bobSpeed*5)
        } else {
            this.caret.y -= tileWidth/(this.bobSpeed*5)
        }
    }

    this.listenForPlayer = function() {
        
        if(Math.abs(this.sprite.x-player.sprite.x) < tileWidth*1.5 &&
           Math.abs(this.sprite.y-player.sprite.y) < tileWidth) {
            if (this.bobSpeed !== 6) {
                
                this.bobSpeed = 6
                player.approachingNPC = this
                this.caret.y = this.sprite.y-(tileWidth*1.75)
                this.caret.tint = 0x00ff00
                
            }
            if (!shopDisplay.container.visible && $("#y-symbol").html !== "TALK") {
                showTalkSymbol()
            }
            if (this.sprite.x < player.sprite.x && this.sprite.scale.x > 0) {
                this.sprite.scale.x *= -1
            }
            if (this.sprite.x > player.sprite.x && this.sprite.scale.x < 0) {
                this.sprite.scale.x *= -1
            }
          
        } else {
            if (this.bobSpeed !== 20) {
                this.bobSpeed = 20
                player.approachingNPC = undefined
                box.npc = undefined
                this.caret.y = this.sprite.y-(tileWidth*1.75)
                this.caret.tint = 0xffffff
                removeTalkSymbol()
            }
        }
    }
    this.onscreen = function() {
        var on = false
        var xDiff = Math.abs(this.sprite.x-((stagePosition().x+(viewWidth/2))))
        var yDiff = Math.abs((stagePosition().y)-this.sprite.y)
        // console.log(yDiff)
        if ((xDiff < viewWidth/2 && yDiff < viewHeight*2)) {
            on = true
        }
        if (player.cave && this.cave !== player.cave) {
            on = false
        }
        return on
    }
}
function ShopDisplay() {
    this.merchant = undefined
    this.container = new PIXI.Container()
    this.border = new PIXI.Sprite(pixelText)
    this.bg = new PIXI.Sprite(pixelText)
    this.container.addChild(this.border)
    this.container.addChild(this.bg)
    this.border.tint = 0xdddddd
    this.bg.tint = 0x000033
    this.border.width = viewWidth-(tileWidth*2)
    this.border.height = viewHeight-(tileWidth*6)
    this.borderSize = tileWidth/8
    this.bg.width = this.border.width-(this.borderSize*2)
    this.bg.height = this.origHeight = this.border.height-(this.borderSize*2)
    this.bg.x = this.borderSize
    this.bg.y = this.borderSize
    
    this.container.height = 0
    this.rolling = false
    this.itemSprites = []
    this.selectedItem = 0
    this.selector = new PIXI.Sprite(pixelText)
    this.container.addChild(this.selector)
    this.selector.width = tileWidth*2.5
    this.selector.height = tileWidth*3
    this.selector.anchor.set(0.5)
    this.selector.alpha = 0.3
    this.selector.y = (tileWidth*1.5)+(this.selector.height/2.5)
    this.lastToggled = -99
    shopStyle.fontSize = tileWidth/2
    shopStyle.wordWrapWidth = this.bg.width
    shopStyle.leading = tileWidth/3
    this.descriptorBox = new PIXI.Text("",shopStyle)
    this.descriptorBox.anchor.set(0.5)
    this.descriptorBox.x = this.bg.x+(this.bg.width/2)
    
    this.container.addChild(this.descriptorBox)

    this.container.visible = false
    
    this.selectItem = function(newIndex) {
        this.selectedItem = newIndex
        this.selector.x = this.itemSprites[newIndex].x
        this.descriptorBox.text = this.itemSprites[newIndex].obj.description
        this.descriptorBox.y = this.bg.y+this.bg.height-(this.descriptorBox.height)
    }
    this.animate = function() {
        for (var s=0;s<this.itemSprites.length;s++) {
            var itemSprite = this.itemSprites[s]
            if (this.selectedItem===s) {
                if (player.coins >= itemSprite.obj.price) {
                    itemSprite.price.tint = 0x00ff00
                } else {
                    itemSprite.price.tint = 0xff0000
                }
                if (counter%20 < 10) {
                    itemSprite.rotation = degToRad(counter%20)/2
                } else {
                    itemSprite.rotation = -degToRad(counter%20)/2
                }
            } else {
                itemSprite.price.tint = 0xffffff
                itemSprite.rotation = 0
            }
        }
    }

    this.createItemDisplay = function(newItems,merchantName) {
        // this.itemSprites.length = 0
        this.merchant = merchantName
        this.container.x = stagePosition().x+tileWidth
        this.container.y = stagePosition().y+tileWidth
        for (var s=0;s<this.itemSprites.length;s++) {
            var sprite = this.itemSprites[s]
            this.container.removeChild(sprite)
            this.container.removeChild(sprite.price)
        }
        this.itemSprites.length = 0
        for (var i=0;i<newItems.length;i++) {
            var item = newItems[i]
            var xPos = (tileWidth*3)+(i*tileWidth*4)
            var yPos = tileWidth*1.5
            var disp = new PIXI.Sprite(items[item].displayText)
            disp.obj = items[item]
            disp.price = new PIXI.Text(items[item].price,dialogueStyle)
            disp.price.anchor.set(0.5)
            var HWRatio = disp.height/disp.width
            this.container.addChild(disp)
            this.container.addChild(disp.price)
            disp.height = tileWidth*1.5
            disp.width = disp.height/(HWRatio)
            disp.anchor.set(0.5)
            disp.x = xPos
            disp.y = yPos+(disp.height/2)
            disp.price.x = disp.x
            disp.price.y = disp.y+(tileWidth*1.5)
            if (i===this.selectedItem) {
                this.selector.x = disp.x
            }
            this.itemSprites.push(disp)
        }
    }

    this.rollOpen = function() {
        if (this.container.height+(tileWidth) < this.origHeight) {
            this.container.height += (tileWidth)
        } else {
            this.container.height = this.origHeight
            this.rolling = false
            
        }
    }
    this.rollClosed = function() {
        if (this.container.height-(tileWidth) > 0) {
            this.container.height -= (tileWidth)
        } else {
            this.container.height = 0
            this.rolling = false
            this.container.visible = false
        }
    }
    this.close = function() {
        this.rolling = "closed"
        if (player.flamethrower) {
            player.flamethrower.displaySymbol()
        }
        if (player.sword) {
            player.sword.displaySymbol()
        }
        if (player.jetpack) {
            player.jetpack.displaySymbol()
        }
        removeBuyExitSymbols()
        
    }
    

    stage.addChild(this.container)
}
function showTalkSymbol() {
    $("#y-symbol").css({
        'display':'none'
    })
    $("#y-label").html("TALK")
    // console.log("showing talk")
}
function removeTalkSymbol() {
    $("#y-symbol").css({
        'display':'block'
    })
    $("#y-label").html("")
    // console.log("removing talk")
}
function showOKExitSymbols() {
    $("#y-symbol").css({
        'display':'none'
    })
    $("#y-label").html("OK")
    $("#x-symbol").css({
        'display':'none'
    })
    $("#x-label").html("EXIT")
    // console.log("showing okexit")

}
function removeOKExitSymbols() {
    $("#y-symbol").css({
        'display':'block'
    })
    $("#y-label").html("")
    $("#x-symbol").css({
        'display':'block'
    })
    $("#x-label").html("")
    // console.log("removing okexit")

}
function showBuyExitSymbols() {
    $("#y-symbol").css({
        'display':'none'
    })
    $("#y-label").html("BUY")
    $("#x-symbol").css({
        'display':'none'
    })
    $("#x-label").html("EXIT")
    // console.log("showing buyexit")

}
function removeBuyExitSymbols() {
    $("#y-symbol").css({
        'display':'block'
    })
    $("#y-label").html("")
    $("#x-symbol").css({
        'display':'block'
    })
    $("#x-label").html("")
    // console.log("removing buyexit")

}