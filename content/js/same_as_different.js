;(function() {
    // Freeze possible colours
    // Prevents it from being modified
    var Colour = {
        RED: "red",
        GREEN: "green",
        BLUE: "blue"
    };
    if(Object.freeze) {
        Object.freeze(Colour);
    }

    function invertColour(hexTripletColor) {
        var color = hexTripletColor;
        color = color.substring(1);           // remove #
        color = parseInt(color, 16);          // convert to integer
        color = 0xFFFFFF ^ color;             // invert three bytes
        color = color.toString(16);           // convert to hex
        color = ("000000" + color).slice(-6); // pad with leading zeros
        color = "#" + color;                  // prepend #
        return color;
    }

    // Give value to possible colours (RGB)
    function randomColour() {
        var rgb = {}
        for (var key in Colour) {
            rgb[key] =  Math.floor(Math.random()*255);
        }
        return rgb
    }

    // Generate hex value for given RGB scheme
    function rgbToHex(colour) {
        var hex = "#";
        for (var i in colour) {
            var hexValue = colour[i].toString(16);
            (hexValue.length < 2) ?
                hex += "0" + hexValue : hex += hexValue;
        }
        return hex;
    }

    function configureCanvas(canvasId) {
        var canvas = document.getElementById(canvasId);
        return canvas;
    }

    function configureScreen(canvas, dimension) {
        var screen = canvas.getContext(dimension);
        return screen;
    }

    var Circles = function(canvasId) {
        var canvas = configureCanvas(canvasId);
        var screen = configureScreen(canvas, '2d');

        var frequency = 100;
        var colour = randomColour();
        var nextColour = randomColour();
        var delta = deltaRgb();

        // Once the colour has converted to the new colour
        // Generate a new colour
        function generateNewColour() {
            var finished = true;
            for (var key in Colour) {
                if(delta[key] != 0) {
                    finished = false;
                }
            }

            if (finished) {
                colour = nextColour;
                nextColour = randomColour();
                delta = deltaRgb();
            }
        }

        // Calculate change in RGB value to reach next colour in 60 steps
        function deltaRgb() {
            var STEPS = 60;
            var delta = {}
            for (var key in Colour) {
                delta[key] = Math.abs(Math.floor((colour[key] - nextColour[key]) / STEPS));
                if(delta[key] === 0) {
                    delta[key]++;
                }
            }
            return delta;
        }

        // Change value of RGB based on delta retrieved by deltaRgb
        // Stop modifying a RGB element once it has reached its goal
        function transition() {
            generateNewColour();

            for (var key in Colour) {
                if(colour[key] > nextColour[key]) {
                    colour[key] -= delta[key];
                    if(colour[key] <= nextColour[key]) {
                        delta[key] = 0;
                    }
                }
                else {
                    colour[key] += delta[key];
                    if(colour[key] >= nextColour[key]) {
                        delta[key] = 0;
                    }
                }
            }
        }

        // Setup
        function displayCircles(colour) {
            screen.clearRect(0, 0, canvas.width, canvas.height);

            screen.fillStyle = rgbToHex(colour);
            screen.beginPath();
            screen.arc(canvas.width/2 - 100, canvas.height/2 + 50, 50, 0, 2*Math.PI);
            screen.closePath();
            screen.fill();

            var oppositeColour = invertColour(rgbToHex(colour));
            screen.fillStyle = oppositeColour;
            screen.beginPath();
            screen.arc(canvas.width/2, canvas.height/2 - 100, 50, 0, 2*Math.PI);
            screen.closePath();
            screen.fill();

            screen.fillStyle = oppositeColour;
            screen.beginPath();
            screen.arc(canvas.width/2 + 150, canvas.height/2 + 50, 100, 0, 2*Math.PI);
            screen.closePath();
            screen.fill();
        }

        function breathe() {
            transition();
            displayCircles(colour);
        }

        displayCircles(colour);
        setInterval(breathe, frequency);
    };

    window.onload = function() {
        new Circles("screen");
    };
})();
