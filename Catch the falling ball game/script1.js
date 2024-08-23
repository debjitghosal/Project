document.addEventListener('DOMContentLoaded', () => {
    const basket = document.getElementById('basket');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const startButton = document.getElementById('start-game');
    const instructions = document.getElementById('instructions');
    const startInstructionsButton = document.getElementById('start-instructions');
    let score = 0;
    let lives = 2;
    let gameInterval;
    let objectInterval;
    let gameStartTime;

    // Function to handle dragging of the basket
    let isDragging = false;
    let startX;

    basket.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX - basket.getBoundingClientRect().left;
        basket.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const newX = event.clientX - startX;
            const containerRect = document.querySelector('.game-container').getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();
            const maxX = containerRect.width - basketRect.width;
            if (newX >= 0 && newX <= maxX) {
                basket.style.left = newX + 'px';
            }
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        basket.style.cursor = 'grab';
    });

    // Function to get the current falling speed based on game time
    function getFallingSpeed(elapsedTime) {
        if (elapsedTime <= 10) {
            return 5000; // 5 seconds
        } else if (elapsedTime <= 20) {
            return 3000; // 3 seconds
        } else if (elapsedTime <= 30) {
            return 3000; // 3 seconds
        } else if (elapsedTime <= 90) {
            return 2000; // 2 seconds
        } else {
            return 2000; // Default speed after 90 seconds
        }
    }

    // Function to create a falling object
    function createFallingObject() {
        const object = document.createElement('div');
        object.classList.add('object');
        object.style.left = Math.random() * (window.innerWidth - 30) + 'px';
        document.body.appendChild(object);

        const fallingSpeed = getFallingSpeed((Date.now() - gameStartTime) / 1000);
        object.style.animationDuration = fallingSpeed + 'ms';

        function moveObject() {
            const objectRect = object.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();

            if (objectRect.bottom >= basketRect.top &&
                objectRect.left >= basketRect.left &&
                objectRect.right <= basketRect.right) {
                score++;
                scoreElement.textContent = score;
                object.remove();
            } else if (objectRect.top >= window.innerHeight) {
                lives--;
                livesElement.textContent = lives;
                object.remove();
                if (lives === 0) {
                    clearInterval(objectInterval);
                    clearInterval(gameInterval);
                    alert('Game Over! Your score: ' + score);
                    window.location.reload();
                }
            }
        }

        // Use requestAnimationFrame for smoother movement
        function animate() {
            moveObject();
            objectInterval = requestAnimationFrame(animate);
        }

        animate();
    }

    // Start the game when the start button is clicked
    startInstructionsButton.addEventListener('click', () => {
        instructions.style.display = 'none'; // Hide instructions
        document.querySelector('.game-container').style.display = 'flex'; // Show game container

        // Record the game start time
        gameStartTime = Date.now();

        // Start the game loop
        gameInterval = setInterval(() => {
            createFallingObject();
        }, 2000); // Create objects every 2 seconds initially

        // Remove the start button after 1 seconds
        setTimeout(() => {
            startButton.style.display = 'none';
        }, 1000);
    });
});
