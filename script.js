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

    class Stroke {
        constructor(color, size, initialPoint) {
            thix.type = "Stroke";
            this.color = color;
            this.size = size;
            this.points = [initialPoint];
        }

        addPoint(point) {
            this.points.push(point);
        }

        draw() {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
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

    class Square {
        constructor(color, size, position) {
            this.type = "Square";
            this.color = color;
            this.size = size;
            this.position = position;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position[0] - this.size/2, this.position[1] - this.size/2, this.size, this.size);
        }
    }

    class Circle {
        constructor(color, size, position) {
            this.type = "Circle";
            this.color = color;
            this.size = size;
            this.position = position;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.position[0], this.position[1], this.size/2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    class Triangle {
        constructor(color, size, position) {
            this.type = "Triangle";
            this.color = color;
            this.size = size;
            this.position = position;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.position[0], this.position[1] - this.size/2);
            ctx.lineTo(this.position[0] - this.size/2, this.position[1] + this.size/2);
            ctx.lineTo(this.position[0] + this.size/2, this.position[1] + this.size/2);
            ctx.closePath();
            ctx.fill();
        }
    }

    let currentShape = Stroke;
    let drawingMode = 'line';
    let previewShape = null;
    let startX, startY;

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

    c.addEventListener("mousedown", function (event) {
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

    c.addEventListener("mousemove", function (event) {
        if (isDrawing) {
            let x = event.pageX - this.offsetLeft;
            let y = event.pageY - this.offsetTop;
            
            if (drawingMode === 'line') {
                currentStroke.addPoint({x, y});
                redrawShapes();
            } else if (drawingMode === 'shape' && previewShape) {
                let deltaX = x - startX;
                let deltaY = y - startY;
                let size = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                previewShape.size = size;
                previewShape.position = [startX + deltaX / 2, startY + deltaY / 2];
                redrawShapes();
            }
        }
    });

    c.addEventListener("mouseup", function () {
        isDrawing = false;
        if (drawingMode === 'line' && currentStroke) {
            shapes.push(currentStroke);
            currentStroke = null;
        } else if (drawingMode === 'shape' && previewShape) {
            shapes.push(previewShape);
            previewShape = null;
        }
        redrawShapes();
    });

    c.addEventListener("mouseleave", function () {
        isDrawing = false;
        if (drawingMode === 'line' && currentStroke) {
            shapes.push(currentStroke);
            currentStroke = null;
            redrawShapes();
        } else if (drawingMode === 'shape' && previewShape) {
            shapes.push(previewShape);
            previewShape = null;
            redrawShapes();
        }
    });


    document.getElementById("undo").addEventListener("click", function () {
        if (shapes.length != 0) {
            deletedShapes.unshift(shapes.pop());
            redrawShapes();
        }
        
    });

    document.getElementById("redo").addEventListener("click", function () {
        if (deletedShapes.length != 0) {
            shapes.push(deletedShapes[0]);
            deletedShapes.shift();
            redrawShapes();
        }
    });

    document.getElementById("clear").addEventListener("click", function () {
        shapes = [];
        deletedShapes = [];
        console.log('clear');
        redrawShapes();
    });

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
        shapes.forEach(function(shape) {
            shape.draw();
        });
        
    }

    document.getElementById("save_button").addEventListener("click", function () {
        let saveData = JSON.stringify(shapes);
        localStorage.setItem("drawing", saveData);
        console.log("saved");
    });

    retreivedData = localStorage.getItem("drawing");
    if (retreivedData) {
        console.log("retrieved");
        parsedShapes = JSON.parse(retreivedData);
        console.log(parsedShapes);
        shapes = parsedShapes.map(function(shape) {
            switch(shape.type) {
                case "Stroke":
                    return new Stroke(shape.color, shape.size, shape.initialPoint);
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