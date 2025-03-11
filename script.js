window.addEventListener("load", function () {
    let c = document.getElementById("testCanvas");
    let ctx = c.getContext("2d");
    let shapes = [];
    let deletedShapes = [];



    class Square {
        constructor(size, color, position) {
            this.type = "Square";
            this.size = size;
            this.color = color;
            this.position = position;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position[0] - this.size / 2, this.position[1] - this.size / 2, this.size, this.size);
        }
    }

    class Triangle {
        constructor(size, color, position) {
            this.type = "Triangle";
            this.size = size;
            this.color = color;
            this.position = position;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.position[0], this.position[1] - this.size / 2);
            ctx.lineTo(this.position[0] - this.size / 2, this.position[1] + this.size / 2);
            ctx.lineTo(this.position[0] + this.size / 2, this.position[1] + this.size / 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    class Circle {
        constructor(size, color, position) {
            this.type = "Circle";
            this.size = size;
            this.color = color;
            this.position = position;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.position[0], this.position[1], this.size / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }
    }

    

    let currentShape = Square;


    document.getElementById("circle_button").addEventListener("click", function () {
        currentShape = Circle;
    });

    document.getElementById("square_button").addEventListener("click", function () {
        currentShape = Square;
    });

    document.getElementById("triangle_button").addEventListener("click", function () {
        currentShape = Triangle;
    });

    c.addEventListener("mousedown", function (event) {
        let x = event.pageX - this.offsetLeft;
        let y = event.pageY - this.offsetTop;
        let currentSize = parseInt(document.getElementById("size_slider").value);
        let currentColor = document.getElementById("color_slider").value;
        let nextShape = new currentShape(currentSize, currentColor, [x, y]);
        shapes.push(nextShape);
        nextShape.draw();
        console.log(shapes);
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
                case "Square":
                    console.log("square");
                    console.log(shape);
                    return new Square(shape.size, shape.color, shape.position);
                case "Triangle":
                    return new Triangle(shape.size, shape.color, shape.position);    
                case "Circle":
                    return new Circle(shape.size, shape.color, shape.position);
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