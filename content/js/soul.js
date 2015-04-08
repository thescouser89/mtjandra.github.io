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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        return canvas;
    }

    function configureScreen(canvas, dimension) {
        var screen = canvas.getContext(dimension);
        return screen;
    }

    var Soul = function(canvasId) {
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

        // Some context
        function displayText() {
            screen.fillStyle = '#000000';
            screen.font = 'bold 30px monospace';
            screen.textAlign = 'center';
            if((canvas.height/2) >= 300) {
                screen.fillText("def think(mtjandra: Self)", canvas.width/2 , canvas.height/2 - 300);
                screen.fillText("=", canvas.width/2 , canvas.height/2 - 250);
                screen.fillText("{ () => mtjandra }", canvas.width/2 , canvas.height/2 - 200);
            }
            else {
                screen.fillText("def think(mtjandra: Self)", canvas.width/2 , 50);
                screen.fillText("=", canvas.width/2 , 100);
                screen.fillText("{ () => mtjandra }", canvas.width/2 , 150);
            }
        }

        // Setup
        function displaySoul(colour) {
            screen.clearRect(0, 0, canvas.width, canvas.height);
            screen.fillStyle = rgbToHex(colour);
            screen.arc(canvas.width/2, canvas.height/2, 100, 0, 2*Math.PI);
            screen.fill();
        }

        function breathe() {
            canvas.width = window.innerWidth;
            canvas.height= window.innerHeight;
            transition();
            displaySoul(colour);
            displayText();
        }

        displaySoul(colour);
        setInterval(breathe, frequency);
    };

    window.onload = function() {
        new Soul("screen");
    };
})();
