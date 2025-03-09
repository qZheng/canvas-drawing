window.addEventListener("load", function() {
    let c = document.getElementById("testCanvas");
    let ctx = c.getContext("2d");
    let shapes = [];

    class Square {
        constructor (size, color, position, drawFunc) {
            this.size = size;
            this.color = color;
            this.position = position;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position[0] - this.size/2, this.position[1] - this.size/2, this.size, this.size);
        }
    }

    class Triangle {
        constructor (size, color, position) {
            this.size = size;
            this.color = color;
            this.position = position;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.position[0], this.position[1] - this.size/2);
            ctx.lineTo(this.position[0] - this.size/2, this.position[1] + this.size/2);
            ctx.lineTo(this.position[0] - this.size/2, this.position[1] + this.size/2);
            ctx.closePath();
            ctx.fill();
        }
    }

    class Circle {
        constructor (size, color, position) {
            this.size = size;
            this.color = color;
            this.position = position;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.position[0] - this.size, this.position[1] - this.size, this.size, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
        }
    }

    document.getElementById("circle_button").addEventListener("click", function() {
        currentShape = Circle;
    });
    document.getElementById("square_button").addEventListener("click", function() {
        currentShape = Square;
    });
    document.getElementById("triangle_button").addEventListener("click", function() {
        currentShape = Triangle;
    });

    c.addEventListener("click", function(event) {
        let x = event.pageX - this.offsetLeft;
        let y = event.pageY - this.offsetTop;
        let currentSize = document.getElementById("size_slider").value;
        let currentColor = document.getElementById("color_slider").value;
        shapes.push(new currentShape(currentSize, currentColor, [x, y]));
        for (i=0; i<shapes.length; i++) {
            ctx.clearRect(0, 0, c.width, c.height);
            shapes[i].draw();
        }
    });

    document.getElementById("undo").addEventListener("click", function() {
        shapes.pop();
    })

    document.getElementById("clear").addEventListener("click", function() {
        ctx.clearRect(0, 0, c.width, c.height);
    });
    let currentShape = Square;

  
});

