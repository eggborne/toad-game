hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]
function distanceFromABtoXY(a,b,x,y) {
    var distanceX = x-a;
    var distanceY = y-b;
    return Math.round( Math.sqrt( (distanceX*distanceX)+(distanceY*distanceY) ));
}
function pointAtAngle(x,y,angle,distance) {
    return {x:x+distance*Math.cos(angle),y:y+distance*Math.sin(angle)};
};
function angleOfPointABFromXY(a,b,x,y) {
    return Math.atan2(b-y,a-x)+(Math.PI/2);
};
function toPercent(dec) {
    return Math.round(dec*100);
}
degToRad = function(radians) {
    return radians*(Math.PI/180);
};
radToDeg = function(radians) {
    deg = radians*(180/Math.PI);
    if (deg < 0) {
        deg += 360;
    } else if (deg > 359) {
        deg -= 360;
    };
    return Math.round(radians*(180/Math.PI))
};
function advanceTwoDigitHex(orig) {
    if (orig !== "ff") {
        var newArray = [orig.charAt(0),orig.charAt(1)];
        newArray[1] = hexDigits[hexDigits.indexOf(newArray[1])+1];
        if (!newArray[1]) {

            newArray[0] = hexDigits[hexDigits.indexOf(newArray[0])+1];
            if (!newArray[0]) {
                newArray[0] = "f";
                newArray[1] = "f";
            } else {
                newArray[1] = "0";
            }
        }
        return newArray.join("");
    } else { // if white
        return orig;
    }
}
function mod(num) {
    return (counter%num===0)
}
function randomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function randomColor() {
    var characters = [0,"x"];
    while (characters.length < 8) {
        characters.push(hexDigits[randomInt(0,15)]);
        while (characters[0] > hexDigits[5]) {
            characters.splice(0,1);
            characters.push(hexDigits[randomInt(0,15)]);
        };
    };
    return characters.join("");
};
playSound = function(sound) {
    if (sound.playing) {
        sound.stop();
    }
    sound.play();
}
function visibleChildren() {
    var vis = 0
    for (var c=0;c<stage.children.length;c++) {
        if (stage.children[c].visible) {
            vis++
        }
    }
    return vis
}

// Object.prototype.getKeyByValue = function( value ) {
//     for( var prop in this ) {
//         if( this.hasOwnProperty( prop ) ) {
//              if( this[ prop ] === value )
//                  return prop;
//         }
//     }
// }