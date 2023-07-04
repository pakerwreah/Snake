(function() {
    const Dir = {
        Up: {x: 0, y: -1},
        Down: {x: 0, y: 1},
        Right: {x: 1, y: 0},
        Left: {x: -1, y: 0}
    }

    const gridSize = 40
    const scale = 15

    let gameOver = false
    let food = {x: 0, y: 0}
    let snake = {
        body: [{x: 0, y: 0}],
        direction: 0
    }

    function createSnake() {
        const length = 5
        const center = gridSize / 2
        snake = {
            body: [],
            direction: Dir.Right
        }
        for (let i = 0; i < length; i++) {
            snake.body.push({x: center - length + i, y: center})
        }
    }

    function createFood() {
        food = {
            x: Math.trunc(Math.random() * gridSize),
            y: Math.trunc(Math.random() * gridSize)
        }
    }

    function restart() {
        createSnake()
        createFood()
        gameOver = false
        newDirs = []
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    function draw(canvas, ctx) {
        if (gameOver) {
            return
        }

        ctx.save()
        // change to grid coordinates
        ctx.scale(scale, scale)

        // draw background
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // draw snake
        for (let i = 0; i < snake.body.length; i++) {
            const node = snake.body[i]
            ctx.fillStyle = i < snake.body.length - 1 ? 'green' : 'red'
            ctx.fillRect(node.x, node.y, 1, 1)
        }

        // draw food
        ctx.fillStyle = 'orange'
        ctx.fillRect(food.x, food.y, 1, 1)

        ctx.restore()

        moveSnake()
    }

    let newDirs = []

    function processKey(key) {
        const lastDir = newDirs.length ? newDirs[newDirs.length - 1] : snake.direction
        switch (key) {
            case 'ArrowUp':
                if (lastDir !== Dir.Down) {
                    newDirs.push(Dir.Up)
                }
                break
            case 'ArrowDown':
                if (lastDir !== Dir.Up) {
                    newDirs.push(Dir.Down)
                }
                break
            case 'ArrowRight':
                if (lastDir !== Dir.Left) {
                    newDirs.push(Dir.Right)
                }
                break
            case 'ArrowLeft':
                if (lastDir !== Dir.Right) {
                    newDirs.push(Dir.Left)
                }
                break
        }
    }

    function moveSnake() {
        // process direction change
        const dir = newDirs.shift()
        if (dir) {
            snake.direction = dir
        }

        // calculate new position
        const head = snake.body[snake.body.length - 1]
        const x = (head.x + snake.direction.x) % gridSize
        const y = (head.y + snake.direction.y) % gridSize
        const newPos = {
            x: x < 0 ? gridSize : x,
            y: y < 0 ? gridSize : y
        }

        // detect collision
        for (const node of snake.body) {
            if (newPos.x === node.x && newPos.y === node.y) {
                gameOver = true
                setTimeout(() => alert('Game Over'))
                return
            }
        }

        // grow snake
        snake.body.push(newPos)

        // detect food eaten
        if (newPos.x === food.x && newPos.y === food.y) {
            createFood()
        } else {
            // remove tail
            snake.body.shift()
        }
    }

    const restartButton = (() => {
        const button = document.createElement('button')
        button.innerText = 'Restart'
        button.style.display = 'block'
        button.style.fontSize = '1em'
        button.style.marginTop = '16px'
        button.style.marginLeft = 'auto'
        button.style.marginRight = 'auto'
        button.onclick = restart
        return button
    })()

    function init() {
        const canvas = document.createElement('canvas')
        canvas.width = gridSize * scale
        canvas.height = gridSize * scale
        canvas.style.display = 'block'
        canvas.style.marginLeft = 'auto'
        canvas.style.marginRight = 'auto'

        document.body.appendChild(canvas)
        document.body.appendChild(restartButton)

        const context = canvas.getContext('2d')

        restart()

        setInterval(() => draw(canvas, context), 150)

        document.addEventListener("keydown", (e) => processKey(e.key))
    }

    document.addEventListener("DOMContentLoaded", init)
})();
