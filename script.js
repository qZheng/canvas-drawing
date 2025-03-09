window.addEventListener("load", function () {
    let c = document.getElementById("testCanvas");
    let ctx = c.getContext("2d");
    let shapes = [];
    let deletedShapes = [];



    class Square {
        constructor(size, color, position) {
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

    c.addEventListener("click", function (event) {
        let x = event.pageX - this.offsetLeft;
        let y = event.pageY - this.offsetTop;
        let currentSize = parseInt(document.getElementById("size_slider").value);
        let currentColor = document.getElementById("color_slider").value;
        shapes.push(new currentShape(currentSize, currentColor, [x, y]));
        deletedShapes = [];
        redrawShapes();
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
        redrawShapes();
    });

    function redrawShapes() {
        ctx.clearRect(0, 0, c.width, c.height);
        console.log(shapes);
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].draw();
        }
    }
});