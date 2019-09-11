document.onkeydown = function(event) {
    if (event.keyCode == 16) {
        pressingShift = true;
    };
    
    if (event.keyCode == 87 || event.keyCode == 38) {
        pressUp()
    };
    
    if (event.keyCode == 83 || event.keyCode == 40) {
        pressDown()
    };
    if (event.keyCode == 65 || event.keyCode == 37) {
        pressLeft()
    };
    if (event.keyCode == 68 || event.keyCode == 39) {
        event.preventDefault();
        pressRight()

    };
    if (event.keyCode == 32) {
        pressBButton()  
        event.preventDefault();
    };

    if (event.keyCode == 69) {
        pressingE = true;
    };
    if (event.keyCode == 81) {
        pressingQ = true;
    };

};

document.onkeyup = function(event) {
    if (event.keyCode == 16) {
        pressingDownhift = false;
    };
    if (event.keyCode == 87 || event.keyCode == 38) {
        releaseUp()
    };
    if (event.keyCode == 83 || event.keyCode == 40) {
        releaseDown()
    };
    if (event.keyCode == 65 || event.keyCode == 37) { // left
        releaseLeft()
    };
    if (event.keyCode == 68 || event.keyCode == 39) { // right
        releaseRight()
    };
    if (event.keyCode == 32) {
        releaseBButton()  
     };
    if (event.keyCode == 69) {
        pressingE = false;
    };
    if (event.keyCode == 81) {
        pressingQ = false;
    };
    
};
// document.onmousedown = function(event) {
//     if (event.button === 0) {
//         mousedown = true;
//         clicked = counter;
//     } else if (event.button === 2) {
//         RMBDown = true;
//         rightClicked = counter;
//     }
// }
// document.onmouseup = function(event) {
//     if (event.button === 0) {
//         mousedown = false;
//     } else if (event.button === 2) {
//         RMBDown = false;
//     }}

