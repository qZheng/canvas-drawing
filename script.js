/*
Dylan Nguyen and Lucas Zheng
400592199, 400556902

3/10/2025
JS script for the canvas assignment.
*/


window.addEventListener("load", function () {
    let c = document.getElementById("testCanvas");
    let ctx = c.getContext("2d");
    let shapes = [];
    let deletedShapes = [];
    let isDrawing = false;
    let currentStroke = null; 

    // Classes for their respective brushes

    // Stroke Brush Object Class
    class Stroke {
        constructor(color, size, initialPoint) {
            this.type = "Stroke";
            this.color = color;
            this.size = size;
            // Stores all point history in array
            this.points = [initialPoint];
        }

        // Adds a point to the points array
        addPoint(point) {
            this.points.push(point);
        }

        // Renders Stroke
        draw() {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            // Connects each point in order to create a line
            ctx.beginPath();
            this.points.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();
        }
    }

    // Square Object Class
    class Square {
        constructor(color, size, position) {
            this.type = "Square";
            this.color = color;
            this.size = size;
            this.position = position;
        }

        // Renders Rectangle
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position[0] - this.size/2, this.position[1] - this.size/2, this.size, this.size);
        }
    }

    // Circle Object Class
    class Circle {
        constructor(color, size, position) {
            this.type = "Circle";
            this.color = color;
            this.size = size;
            this.position = position;
        }

        // Renders Circle
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.position[0], this.position[1], this.size/2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Triangle Object Class
    class Triangle {
        constructor(color, size, position) {
            this.type = "Triangle";
            this.color = color;
            this.size = size;
            this.position = position;
        }

        draw() {
            // Creates 3 points and lines up to create triangle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.position[0], this.position[1] - this.size/2);
            ctx.lineTo(this.position[0] - this.size/2, this.position[1] + this.size/2);
            ctx.lineTo(this.position[0] + this.size/2, this.position[1] + this.size/2);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Initializes default drawing style variables
    let currentShape = Stroke;
    let drawingMode = 'line';
    let previewShape = null;
    let startX, startY;

    // Attaches event listeners to all shape buttons and sets the drawing mode to the corresponding button
    document.getElementById("line_button").addEventListener("click", function() {
        drawingMode = 'line';
        currentShape = Stroke;
    });

    document.getElementById("circle_button").addEventListener("click", function() {
        drawingMode = 'shape';
        currentShape = Circle;
    });

    document.getElementById("square_button").addEventListener("click", function() {
        drawingMode = 'shape';
        currentShape = Square;
    });

    document.getElementById("triangle_button").addEventListener("click", function() {
        drawingMode = 'shape';
        currentShape = Triangle;
    });

    // Initializes start (x,y) and creates preview shape render object
    c.addEventListener("mousedown", function (event) {
        isDrawing = true;
        let x = event.pageX - this.offsetLeft;
        let y = event.pageY - this.offsetTop;
        let currentSize = parseInt(document.getElementById("size_slider").value);
        let currentColor = document.getElementById("color_slider").value;

        if (drawingMode === 'line') {
            currentStroke = new currentShape(currentColor, currentSize, {x, y});
        } else if (drawingMode === 'shape') {
            startX = x;
            startY = y;
            previewShape = new currentShape(currentColor, currentSize, [x, y]);
        }
        redrawShapes();
    });

    // Edits preview shape based on mouse move
    c.addEventListener("mousemove", function (event) {
        if (isDrawing) {
            let x = event.pageX - this.offsetLeft;
            let y = event.pageY - this.offsetTop;
            
            // Adds new point to stroke line
            if (drawingMode === 'line') {
                currentStroke.addPoint({x, y});
                redrawShapes();

            // Edits Preview shape by calculating size and position off change in position
            } else if (drawingMode === 'shape' && previewShape) {
                // delta means change in
                let deltaX = x - startX;
                let deltaY = y - startY;
                let size = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                previewShape.size = size;
                previewShape.position = [startX + deltaX / 2, startY + deltaY / 2];
                redrawShapes();
            }
        }
    });

    
    // Stops drawing and saves preview shape to shapes array
    function stopDrawing() {
        isDrawing = false;
        if (drawingMode === 'line' && currentStroke) {
            shapes.push(currentStroke);
            currentStroke = null;
        } else if (drawingMode === 'shape' && previewShape) {
            shapes.push(previewShape);
            previewShape = null;
        }
        redrawShapes();
    }

    // Stops drawing on mouse release. Same as below.
    c.addEventListener("mouseup", stopDrawing());

    // If mouse leaves canvas, stops drawing shape. Same as above
    c.addEventListener("mouseleave", stopDrawing());

    // Removes last shape from shapes array and stores in deleted shapes history array
    document.getElementById("undo").addEventListener("click", function () {
        if (shapes.length != 0) {
            deletedShapes.unshift(shapes.pop());
            redrawShapes();
        }
        
    });

    // Reverts last deleted shape and adds back to shapes array
    document.getElementById("redo").addEventListener("click", function () {
        if (deletedShapes.length != 0) {
            shapes.push(deletedShapes[0]);
            deletedShapes.shift();
            redrawShapes();
        }
    });

    // Clears all shapes and deleted shapes from the array and redraws canvas
    document.getElementById("clear").addEventListener("click", function () {
        shapes = [];
        deletedShapes = [];
        console.log('clear');
        redrawShapes();
    });

    // Redraws shapes after each canvas update
    function redrawShapes() {
        console.log("redraw");
        ctx.clearRect(0, 0, c.width, c.height);
        shapes.forEach(shape => shape.draw());
        if (currentStroke) {
            currentStroke.draw();
        }
        if (previewShape) {
            previewShape.draw();
        }
        console.log(shapes);
        
    }

    // Stores the shapes saved data array into JSON for local storage
    document.getElementById("save_button").addEventListener("click", function () {
        let saveData = JSON.stringify(shapes);
        localStorage.setItem("drawing", saveData);
        console.log("saved");
    });

    // On load, retrieves local storage data
    retreivedData = localStorage.getItem("drawing");
    // If data exists
    if (retreivedData) {
        console.log("retrieved");
        parsedShapes = JSON.parse(retreivedData);
        console.log(parsedShapes);
        // Recreates shape objects based on stored data information
        shapes = parsedShapes.map(function(shape) {
            switch(shape.type) {
                case "Stroke":
                    let stroke = new Stroke(shape.color, shape.size, shape.points[0]); 
                    shape.points.slice(1).forEach((point) => stroke.addPoint(point)); 
                    return stroke;
                case "Square":
                    return new Square(shape.color, shape.size, shape.position);
                case "Triangle":
                    return new Triangle(shape.color, shape.size, shape.position);    
                case "Circle":
                    return new Circle(shape.color, shape.size, shape.position);
                default:
                    console.log("Failure");
                    break;
            }
        });
        // shapes.push(new Square(100, 100, 50, "red"));
        console.log(shapes);
        redrawShapes();
    }
});