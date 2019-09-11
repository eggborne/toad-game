cavePatterns = 
[
    {
        structure:
        [
            [1,1,1],
            [1,1,1]
        ],
        addLedges: function() {
            var cave = caves[0]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            var ceilingPos = floorPos-(cave.screensHigh*tilesPerHeight)+2
            new SideLedge(cave,"left",floorPos-2,5,2,true,true)
            new SideLedge(cave,"left",floorPos-4,4,3,true,true)
            new SideLedge(cave,"left",floorPos-6,3,4,true,true)
            new SideLedge(cave,"left",floorPos-8,2,5,true,true)
            new SideLedge(cave,"right",floorPos-8,5,1)
            // new SideLedge(cave,"right",7,21,2)

            new EarthLedge(cave,4,ceilingPos+9,6,1)
            new EarthLedge(cave,18,ceilingPos+9,9,1)
            new EarthLedge(cave,37,ceilingPos+7,4,1)
            new EarthLedge(cave,20,floorPos-2,7,2,true)
            new EarthLedge(cave,29,floorPos-4,4,2,true)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*11),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            var doorway2 = new Doorway(cave,cave.bg.x+(tileWidth*42),(ceilingPos*tileWidth)+(tileWidth*5))
            doorway2.flip()

            cave.plat.door.partner = doorway1
            cave.exitPlat.door.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.exitPlat.door
            
            var caveLedge = new Plateau(false,cave.leftPos+2,cave.topPos+1,0,(cave.screensWide*tilesPerWidth)-4,tanStoneTileImages)
            caveLedge.homeCave = cave
            stage.removeChild(caveLedge.container)
            new Chain(caveLedge,0.5,16)
            new Chain(caveLedge,(cave.screensWide*tilesPerWidth)-5,16)
        }
    },
    {
        structure:
        [
            [1,1]
        ],
        addLedges: function() {
            var cave = caves[1]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            // new SideLedge(cave,"left",floorPos-1,5,2,true,true)
            // new SideLedge(cave,"left",floorPos-2,4,3,true,true)
            // new SideLedge(cave,"left",floorPos-4,3,4,true,true)
            // new SideLedge(cave,"left",floorPos-6,2,5,true,true)
           

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*6),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            var doorway2 = new Doorway(cave,cave.bg.x+(tileWidth*28),(cave.bg.y+cave.bg.height)-(tileWidth*4))
            doorway2.flip()
            cave.plat.door.partner = doorway1
            cave.plat.door2.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.plat.door2
            
            // var caveLedge = new Plateau(false,cave.leftPos+2,cave.topPos+1,0,6,tanStoneTileImages)
            // caveLedge.homeCave = cave
            // stage.removeChild(caveLedge.container)
            // new Chain(caveLedge,0.5,30)
        }
    },
    {
        structure:
        [
            [1],
            [1],
        ],
        addLedges: function() {
            
            var cave = caves[2]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            new SideLedge(cave,"right",floorPos-2,5,2,true,true)
            new SideLedge(cave,"right",floorPos-4,4,3,true,true)
            new SideLedge(cave,"right",floorPos-6,3,4,true,true)
            new SideLedge(cave,"right",floorPos-8,2,5,true,true)
            new SideLedge(cave,"left",floorPos-13,5,2)
            // new SideLedge(cave,"right",floorPos-19,5,1)
            // new SideLedge(cave,"right",floorPos-21,4,2)
            
            new SideLedge(cave,"left",7,6,2)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*5),(cave.bg.y+cave.bg.height)-(tileWidth*4))
            var doorway2 = new Doorway(cave,cave.bg.x+(tileWidth*5),(cave.bg.y)+(tileWidth*5))
            doorway1.flip()

            cave.plat.door.partner = doorway1
            cave.exitPlat.door.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.exitPlat.door
            
            var caveLedge = new Plateau(false,cave.leftPos+2,cave.topPos+1,0,6,tanStoneTileImages)
            caveLedge.homeCave = cave
            stage.removeChild(caveLedge.container)
            new Chain(caveLedge,10.5,16)
        }
    },
    {
        structure:
        [
            [1],
            [1],
            [1]
        ],
        addLedges: function() {
            var cave = caves[3]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            new SideLedge(cave,"left",floorPos-1,5,2,true,true)
            new SideLedge(cave,"left",floorPos-2,4,3,true,true)
            new SideLedge(cave,"left",floorPos-4,3,4,true,true)
            new SideLedge(cave,"left",floorPos-6,2,5,true,true)
            new SideLedge(cave,"right",15,3,2)
            new SideLedge(cave,"right",7,6,2)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*11),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            var doorway2 = new Doorway(cave,cave.bg.x+(tileWidth*12),(cave.bg.y)+(tileWidth*5))
            doorway2.flip()

            cave.plat.door.partner = doorway1
            cave.exitPlat.door.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.exitPlat.door
            
            var caveLedge = new Plateau(false,cave.leftPos+2,cave.topPos+1,0,6,tanStoneTileImages)
            caveLedge.homeCave = cave
            stage.removeChild(caveLedge.container)
            new Chain(caveLedge,0.5,30)
        }
    },
    {
        structure:
        [
            [0,1,1,1,0],
            [1,1,1,1,0],
            [1,1,1,0,0]
        ],
        addLedges: function() {
            var cave = caves[4]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            new SideLedge(cave,"left",floorPos-1,5,2,true,true)
            new SideLedge(cave,"left",floorPos-2,4,3,true,true)
            new SideLedge(cave,"left",floorPos-4,3,4,true,true)
            new SideLedge(cave,"left",floorPos-6,2,5,true,true)
            new SideLedge(cave,"right",15,3,2)
            new SideLedge(cave,"right",7,6,2)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*11),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            var doorway2 = new Doorway(cave,cave.bg.x+(tileWidth*12),(cave.bg.y)+(tileWidth*5))
            doorway2.flip()

            cave.plat.door.partner = doorway1
            cave.exitPlat.door.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.exitPlat.door
            
            var caveLedge = new Plateau(false,cave.leftPos+2,cave.topPos+1,0,6,tanStoneTileImages)
            caveLedge.homeCave = cave
            stage.removeChild(caveLedge.container)
            new Chain(caveLedge,0.5,30)
        }
    },
    {
        structure:
        [
            [1],
            [1],
            [1]
        ],
        addLedges: function() {
            var cave = caves[5]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            new SideLedge(cave,"left",floorPos-1,5,2,true,true)
            new SideLedge(cave,"left",floorPos-2,4,3,true,true)
            new SideLedge(cave,"left",floorPos-4,3,4,true,true)
            new SideLedge(cave,"left",floorPos-6,2,5,true,true)
            new SideLedge(cave,"right",15,3,2)
            new SideLedge(cave,"right",7,6,2)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*11),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            var doorway2 = new Doorway(cave,cave.bg.x+(tileWidth*12),(cave.bg.y)+(tileWidth*5))
            doorway2.flip()

            cave.plat.door.partner = doorway1
            cave.exitPlat.door.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.exitPlat.door
            
            var caveLedge = new Plateau(false,cave.leftPos+2,cave.topPos+1,0,6,tanStoneTileImages)
            caveLedge.homeCave = cave
            stage.removeChild(caveLedge.container)
            new Chain(caveLedge,0.5,30)
        }
    },
    {
        structure:
        [
            [1,1],
            [1,1]
        ],
        addLedges: function() {
            var cave = caves[6]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            new SideLedge(cave,"right",7,14,2)
            new SideLedge(cave,"right",19,14,1)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*4),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            var doorway2 = new Doorway(cave,cave.bg.x+(tileWidth*26),(cave.bg.y)+(tileWidth*5))
            doorway2.flip()

            cave.plat.door.partner = doorway1
            cave.plat.door2.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.plat.door2
            
            var caveLedge = new Plateau(false,cave.leftPos+2,cave.topPos+1,0,6,tanStoneTileImages)
            caveLedge.homeCave = cave
            stage.removeChild(caveLedge.container)
            new Chain(caveLedge,0.5,23)
        }
    },
    {
        structure:
        [
            [1],
        ],
        addLedges: function() {
            var cave = caves[7]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            // new SideLedge(cave,"right",7,6,2)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*4),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
          
            cave.plat.door.partner = doorway1
            doorway1.partner = cave.plat.door

        }
    },
    {
        structure:
        [
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
        ],
        addLedges: function() {
            var cave = caves[8]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            new SideLedge(cave,"right",7,6,2)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*12),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            var doorway2 = new Doorway(cave,cave.bg.x+(viewWidth*cave.screensWide)-(tileWidth*8),(cave.bg.y)+(tileWidth*5))            
          
            cave.plat.door.partner = doorway1
            cave.exitPlat.door.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.exitPlat.door

        }
    },
    {
        structure:
        [
            [1],
            [1],
            [1],
            [1]
        ],
        addLedges: function() {
            var cave = caves[9]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            new SideLedge(cave,"right",7,6,2)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*12),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            var doorway2 = new Doorway(cave,cave.bg.x+(viewWidth*cave.screensWide)-(tileWidth*8),(cave.bg.y)+(tileWidth*5))            
          

            // for leading to same plat
            // cave.plat.door.partner = doorway1
            // cave.plat.door2.partner = doorway2
            // doorway1.partner = cave.plat.door
            // doorway2.partner = cave.plat.door2

            cave.plat.door.partner = doorway1
            cave.exitPlat.door.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.exitPlat.door

        }
    },
    {
        structure:
        [
            [1],
            [1]
        ],
        addLedges: function() {
            var cave = caves[10]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            new SideLedge(cave,"right",7,6,2)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*6),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            // var doorway2 = new Doorway(cave,cave.bg.x+(viewWidth*cave.screensWide)-(tileWidth*8),(cave.bg.y)+(tileWidth*5))            
          

            cave.plat.door.partner = doorway1
            doorway1.partner = cave.plat.door

        }
    },
    {
        structure:
        [
            [1,1,1],
            [1,1,1],
            [1,1,1]
        ],
        addLedges: function() {
            var cave = caves[11]
            var floorPos = (cave.screensHigh*tilesPerHeight)-2
            new SideLedge(cave,"right",7,14,2)
            new SideLedge(cave,"right",19,14,1)

            var doorway1 = new Doorway(cave,cave.bg.x+(tileWidth*4),(cave.bg.y+cave.bg.height)-(tileWidth*4))            
            var doorway2 = new Doorway(cave,cave.bg.x+(tileWidth*26),(cave.bg.y)+(tileWidth*5))
            doorway2.flip()

            cave.plat.door.partner = doorway1
            cave.exitPlat.door.partner = doorway2
            doorway1.partner = cave.plat.door
            doorway2.partner = cave.exitPlat.door
  
        }
    }

]