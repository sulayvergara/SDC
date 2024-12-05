let currentQuestion = 0;
let lives = 3;
let position = 0;
let score = 0; // Inicializar la puntuación en 0
const stonePositions = [160, 260, 360, 460]; // Posiciones left de cada piedra en píxeles

const questions = [
    { question: "¿Cuál es la capital de Francia?", options: ["Madrid", "París", "Berlín"], correct: 1 },
    { question: "¿Cuál es la fórmula del agua?", options: ["CO2", "NaCl", "H2O"], correct: 2 },
    { question: "¿Cuántos planetas hay en el sistema solar?", options: ["8", "9", "10"], correct: 0 },
    { question: "¿Qué gas respiramos principalmente?", options: ["Oxígeno", "Hidrógeno", "Dióxido de carbono"], correct: 0 },
    { question: "¿Cuál es el metal más abundante en la corteza terrestre?", options: ["Hierro", "Aluminio", "Cobre"], correct: 1 }
];

function startGame() {
    const boy = document.getElementById('boy');
    boy.style.left = '40px';
    boy.style.bottom = '60px';
    boy.style.zIndex = '10';
    const audio = document.getElementById('backgroundMusic');
    audio.play().catch(error => {
        console.log("El navegador bloqueó la reproducción automática de audio.");
    });

    document.getElementById('startButton').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('boy').style.display = 'block';
    document.getElementById('cat').style.display = 'block';
    document.getElementById('stones').style.display = 'flex';
    document.getElementById('lives').style.display = 'block';
    document.getElementById('progress').style.display = 'block';

    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion < questions.length) {
        const q = questions[currentQuestion];
        document.getElementById('question').innerText = q.question;
        const options = document.querySelectorAll('.option');
        for (let i = 0; i < options.length; i++) {
            options[i].innerText = q.options[i];
            options[i].onclick = () => checkAnswer(i);
        }
        document.getElementById('moveButton').style.display = 'none'; // Desactivar el botón de mover inicialmente
        document.getElementById('progress').innerText = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
    }
}

function checkAnswer(selected) {
    if (selected === questions[currentQuestion].correct) {
        score += 20; // Sumar 20 puntos por cada respuesta correcta
        document.getElementById('score').innerText = `Puntos: ${score}`; // Mostrar la puntuación actualizada
        document.getElementById('moveButton').style.display = 'block';
    } else {
        score -= 20; // Restar 20 puntos por cada respuesta incorrecta
        document.getElementById('score').innerText = `Puntos: ${score}`; // Mostrar la puntuación actualizada
        lives--;
        updateLives();
        if (lives === 0) {
            showRetryModal();
        } else {
            alert("Respuesta incorrecta. Vuelve a intentarlo.");
        }
    }
}

function saltar() {
    const stones = document.querySelectorAll('.stone');
    const boy = document.getElementById('boy');

    if (position < stones.length) {
        const targetStone = stones[position];
        const targetLeft = stonePositions[position];
        const stoneWidth = targetStone.offsetWidth;

        // Calcular la posición frontal de la piedra
        const frontPosition = targetLeft + (stoneWidth * 0.1); // Ajusta este valor según necesites

        // Realizar el salto
        boy.style.transition = 'left 0.5s ease-in-out, bottom 0.25s ease-in-out';
        boy.style.left = `${frontPosition}px`;
        boy.style.bottom = '150px'; // Sube el niño
        boy.style.zIndex = '10'; // Asegura que el niño esté por encima de la piedra

        setTimeout(() => {
            boy.style.bottom = '70px'; // Baja el niño después de 250ms
        }, 250);

        // Actualizar la posición y cargar la siguiente pregunta
        setTimeout(() => {
            position++;
            document.getElementById('moveButton').style.display = 'none';
            currentQuestion++;
            if (currentQuestion < questions.length) {
                loadQuestion();
            } else {
                moveToCat();
            }
        }, 600);
    } else {
        // Este es el último salto, directamente al gato
        moveToCat();
    }
}

function moveToCat() {
    const boy = document.getElementById('boy');
    const cat = document.getElementById('cat');
    const catLeft = cat.offsetLeft - 50; // Mover al niño a la izquierda del gato

    // Animación del último salto
    boy.style.transition = 'left 0.8s ease-in-out, bottom 0.4s ease-in-out';
    boy.style.left = `${catLeft}px`;
    boy.style.bottom = '150px'; // Sube el niño

    setTimeout(() => {
        boy.style.bottom = '80px'; // Baja el niño después de 400ms
    }, 400);

    setTimeout(() => {
        alert("¡Felicidades, cruzaste el río y te reencontraste con el gato!");
        showVictoryAnimation();
    }, 900);
}

function animateJump(startX, endX, duration) {
    const element = document.getElementById('boy');
    const startY = parseInt(window.getComputedStyle(element).bottom, 10); // Posición inicial en Y (bottom)
    const maxHeight = 150; // Altura máxima del salto

    const frameRate = 60; // Número de fotogramas por segundo
    const totalFrames = Math.round((duration / 1000) * frameRate); // Número total de fotogramas
    let currentFrame = 0;

    const distanceX = endX - startX;
    const distanceY = maxHeight - startY;
    const stepX = distanceX / totalFrames;

    const interval = setInterval(() => {
        currentFrame++;

        // Calcular la posición X
        const newX = startX + stepX * currentFrame;
        element.style.left = `${newX}px`;

        // Calcular la posición Y usando una parábola (efecto de salto)
        const progress = currentFrame / totalFrames;
        const newY = startY + distanceY * Math.sin(Math.PI * progress);
        element.style.bottom = `${newY}px`;

        if (currentFrame >= totalFrames) {
            clearInterval(interval);
            element.style.left = `${endX}px`;
            element.style.bottom = `${startY}px`; // Asegurar que el personaje aterrice en el punto de partida en Y
        }
    }, 1000 / frameRate);
}

function updateLives() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        livesContainer.innerHTML += '❤️';
    }
    if (lives > 0 && lives < 3) {
        livesContainer.classList.add('lives-animation');
        setTimeout(() => livesContainer.classList.remove('lives-animation'), 1000);
    }
}

function showRetryModal() {
    document.getElementById('retryModal').style.display = 'flex';
}

function showVictoryAnimation() {
    const boy = document.getElementById('boy');
    boy.style.left = '660px';
    setTimeout(() => {
        alert("¡Felicidades! ¡Has ganado el juego!");
        resetGame();
    }, 1000);
}

function resetGame() {
    document.getElementById('retryModal').style.display = 'none';
    currentQuestion = 0;
    lives = 3;
    position = 0;
    score = 0; // Restablecer la puntuación a 0 al reiniciar el juego
    document.getElementById('boy').style.left = '40px';
    document.getElementById('boy').style.bottom = '60px';
    document.getElementById('score').innerText = `Puntos: ${score}`; // Restablecer la visualización de la puntuación
    updateLives();
    loadQuestion();
}
