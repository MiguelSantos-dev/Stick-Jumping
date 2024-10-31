const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const jumpSound = document.getElementById('jump-sound');

canvas.width = 800;
canvas.height = 400;

let player = {
    x: 50,
    y: 350,
    width: 20,
    height: 40,
    velocityY: 0,
    jumping: false,
    legForward: true
};
let obstacles = [];
let birds = [];
let score = 0;
let speed = 3;
let gameInterval;
let gameOver = false;

// Evento para pular e reiniciar com "R"
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !player.jumping) {
        player.velocityY = -10;
        player.jumping = true;
        jumpSound.play(); // Toca som de pulo
    }
    if (event.code === 'KeyR' && gameOver) {
        restartGame(); // Reiniciar com a tecla "R"
    }
});

document.getElementById('restart-button').addEventListener('click', restartGame);

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gravidade e movimento do boneco
    player.velocityY += 0.5;
    player.y += player.velocityY;

    if (player.y >= 350) {
        player.y = 350;
        player.jumping = false;
    }

    // Alternar o movimento das pernas
    if (!player.jumping && score % 2 === 0) {
        player.legForward = !player.legForward;
    }

    // Desenhar o "Mini Mario" andando
    drawMiniMario(player.x, player.y);

    // Gerar obstáculos com maior distância
    if (Math.random() < 0.01) {
        obstacles.push({ x: canvas.width, y: 350, width: 20, height: 50 });
    }

    // Gerar passarinhos a partir de 20 pontos
    if (score >= 20 && Math.random() < 0.01) {
        birds.push({ x: canvas.width, y: Math.random() * 200 + 50, width: 30, height: 20 });
    }

    // Atualizar e desenhar os obstáculos
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= speed;

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            document.getElementById('score').innerText = score;

            // Acelerar o jogo a cada 5 obstáculos pulados
            if (score % 5 === 0 && speed < 1000) {
                speed += 0.3;
            }

            // Finalizar o jogo ao chegar a 1000 pontos
            if (score >= 1000) {
                endGame();
            }
        }

        // Desenhar os obstáculos em vermelho
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Verificar colisão com o obstáculo
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            endGame();
        }
    });

    // Atualizar e desenhar os passarinhos
    birds.forEach((bird, index) => {
        bird.x -= speed + 1;

        if (bird.x + bird.width < 0) {
            birds.splice(index, 1);
        }

        // Desenhar os passarinhos
        ctx.fillStyle = 'black';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

        // Verificar colisão com o passarinho
        if (player.x < bird.x + bird.width &&
            player.x + player.width > bird.x &&
            player.y < bird.y + bird.height &&
            player.y + player.height > bird.y) {
            endGame();
        }
    });

    if (!gameOver) {
        requestAnimationFrame(update);
    }
}

function drawMiniMario(x, y) {
    // Cabeça
    ctx.fillStyle = 'red'; // Boné vermelho do Mario
    ctx.fillRect(x + 4, y, 12, 12);

    // Corpo
    ctx.fillStyle = 'blue'; // Roupa azul do Mario
    ctx.fillRect(x, y + 12, 20, 28);

    // Pernas com movimento
    ctx.fillStyle = 'blue';
    if (player.legForward) {
        ctx.fillRect(x + 2, y + 30, 6, 10); // Perna esquerda para frente
        ctx.fillRect(x + 12, y + 30, 6, 10); // Perna direita para trás
    } else {
        ctx.fillRect(x + 2, y + 30, 6, 10); // Perna esquerda para trás
        ctx.fillRect(x + 12, y + 30, 6, 10); // Perna direita para frente
    }

    // Sapatos pretos
    ctx.fillStyle = 'black';
    ctx.fillRect(x + 2, y + 40, 6, 5); // Sapato esquerdo
    ctx.fillRect(x + 12, y + 40, 6, 5); // Sapato direito

    // Braços
    ctx.fillStyle = 'blue';
    ctx.fillRect(x - 4, y + 12, 6, 10); // Braço esquerdo
    ctx.fillRect(x + 18, y + 12, 6, 10); // Braço direito
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    document.getElementById('game-over').classList.remove('hidden');
}

function restartGame() {
    player.y = 350;
    obstacles = [];
    birds = [];
    score = 0;
    speed = 3;
    gameOver = false;
    document.getElementById('score').innerText = score;
    document.getElementById('game-over').classList.add('hidden');
    requestAnimationFrame(update);
}

gameInterval = setInterval(update, 1000 / 60);
