let currentQuestionIndex = 0;
let lives = 3;
let position = 0;
let score = 0;
let questions = [];
const stonePositions = [180, 310, 430, 560];
let selectedAnswerIndex = -1;

async function startGame() {
    const boy = document.getElementById('boy');
    boy.style.left = '40px';
    boy.style.bottom = '80px';
    boy.style.zIndex = '10';
    const audio = document.getElementById('backgroundMusic');
    audio.play()
    .catch(error => {
        console.log("El navegador bloqueó la reproducción automática de audio.");
    });

    document.getElementById('startButton').style.display = 'none';
    document.getElementById('saltos-de-ciencia').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('boy').style.display = 'block';
    document.getElementById('cat').style.display = 'block';
    document.getElementById('stones').style.display = 'flex';
    document.getElementById('lives').style.display = 'block';
    document.getElementById('progress').style.display = 'block';
    document.getElementById('score').style.display = 'block';

    await fetchQuestions();
    displayQuestion();
}

async function fetchQuestions() {
    try {
        const response = await fetch('/preguntas');
        questions = await response.json();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function displayQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        
        let optionsHtml = question.options.map((option, index) => `
            <label class="answer" data-index="${index}">
                <input type="radio" name="answer" value="${option.option}" onclick="checkAnswer('${option.option}')">
                ${option.option}. ${option.text || 'Opción sin texto'}
            </label>
        `).join('');

        questionContainer.innerHTML = `
            <h2>${question.question}</h2>
            <div class="options">
                ${optionsHtml}
            </div>
        `;

        document.getElementById('moveButton').style.display = 'none';
        document.getElementById('progress').innerText = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
        document.getElementById('feedback').innerText = '';
        
        // Reiniciar la selección
        selectedAnswerIndex = -1;
        highlightAnswer();
    } else {
        questionContainer.innerHTML = '<h2>¡Has completado todas las preguntas!</h2>';
    }
}

function checkAnswer(selectedOption) {
    const feedbackElement = document.getElementById('feedback');
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selectedOption === correctAnswer) {
        score += 20;
        feedbackElement.innerHTML = '<i class="fas fa-check-circle"></i> ¡Respuesta correcta!';
        feedbackElement.classList.add('correct');
        document.getElementById('score').innerText = `Puntos: ${score}`;
        document.getElementById('moveButton').style.display = 'block';
        
    } else {
        score -= 20;
        feedbackElement.innerHTML = '<i class="fas fa-times-circle"></i> Respuesta incorrecta. Inténtalo de nuevo.';
        feedbackElement.classList.add('incorrect');
        //feedbackElement.innerText = 'Respuesta incorrecta. Inténtalo de nuevo.';
        document.getElementById('score').innerText = `Puntos: ${score}`;
        lives--;
        updateLives();
        setTimeout(() => {
            feedbackElement.classList.remove('incorrect');
            feedbackElement.innerHTML = ''; // Opcional: limpiar el contenido después de ocultarlo
        }, 1000);
        if (lives === 0) {
            showRetryModal();
        }
    }
}

function saltar() {
    const feedbackElement = document.querySelector('.feedback');
    if (feedbackElement) {
        feedbackElement.classList.remove('correct');
        feedbackElement.classList.remove('incorrect'); // Oculta el feedback
    }
    const stones = document.querySelectorAll('.stone');
    const boy = document.getElementById('boy');

    if (position < stones.length) {
        const targetStone = stones[position];
        const targetLeft = stonePositions[position];
        const stoneWidth = targetStone.offsetWidth;

        // Calcular la posición frontal de la piedra
        const frontPosition = targetLeft + (stoneWidth * 0.0); // Ajusta este valor según necesites

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
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length ) {
                displayQuestion(); //
                
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
    boy.style.left = '685px';
    setTimeout(() => {
        // Mostrar el modal de victoria
        document.getElementById('victoryModal').style.display = 'flex';
    }, 1000);
}

document.addEventListener('keydown', function(event) {
    const answers = document.querySelectorAll('.answer');
    
    switch(event.key) {
        case 'ArrowUp':
            event.preventDefault();
            if (selectedAnswerIndex > 0) {
                selectedAnswerIndex--;
                highlightAnswer();
            }
            break;
        case 'ArrowDown':
            event.preventDefault();
            if (selectedAnswerIndex < answers.length - 1) {
                selectedAnswerIndex++;
                highlightAnswer();
            }
            break;
        case 'Enter':
            event.preventDefault();
            if (selectedAnswerIndex !== -1) {
                const selectedInput = answers[selectedAnswerIndex].querySelector('input');
                if (selectedInput) {
                    selectedInput.click();
                }
            }
            break;
        case ' ':
            event.preventDefault();
            const moveButton = document.getElementById('moveButton');
            if (moveButton.style.display !== 'none') {
                saltar();
            }
            break;
    }
});

function highlightAnswer() {
    const answers = document.querySelectorAll('.answer');
    answers.forEach((answer, index) => {
        if (index === selectedAnswerIndex) {
            answer.classList.add('selected');
        } else {
            answer.classList.remove('selected');
        }
    });
}

function resetGame() {
    const feedbackElement = document.querySelector('.feedback');
    if (feedbackElement) {
        feedbackElement.classList.remove('correct');
        feedbackElement.classList.remove('incorrect'); // Oculta el feedback
    }
    document.getElementById('retryModal').style.display = 'none';
    document.getElementById('victoryModal').style.display = 'none';
    currentQuestionIndex = 0;
    selectedAnswerIndex = -1;
    lives = 3;
    position = 0;
    score = 0; // Restablecer la puntuación a 0 al reiniciar el juego
    document.getElementById('boy').style.left = '40px';
    document.getElementById('boy').style.bottom = '80px';
    document.getElementById('score').innerText = `Puntos: ${score}`; // Restablecer la visualización de la puntuación
    updateLives();
    displayQuestion();
    
}
function exitGame() {
    localStorage.setItem('score', score);
    // Aquí puedes redirigir a otra página o realizar otras acciones para salir del juego
    window.location.href = 'Tabla.html'; // Ejemplo: redirigir a la página principal
}