let score = 0;
let timeUp = false;
let timer;
let countdown;
const scoreBoard = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const finalScore = document.getElementById('final-score');
const gameOverScreen = document.getElementById('game-over');
const gameOverMessage = document.getElementById('game-over-message');
const boxes = document.querySelectorAll('.grid-item');
const startButton = document.getElementById('start-button');
const cancelButton = document.getElementById('cancel-button');

const images = {
    witness: 'https://imagizer.imageshack.com/img922/8195/5yeUJE.png',
    judge: 'https://imagizer.imageshack.com/img924/224/Mw5Opc.png',
    prosecutor: 'https://imagizer.imageshack.com/img922/2996/aQbq54.png',
    defenseAttorney: 'https://imagizer.imageshack.com/img923/5731/yz0IlI.png'
};

let currentBox = null;
let currentImage = null;

const stats = {
    witness: { success: 0, appearances: 0 },
    prosecutor: { success: 0, appearances: 0 },
    defenseAttorney: { success: 0, appearances: 0 },
    judge: { success: 0, appearances: 0 },
};

function randomBox() {
    const index = Math.floor(Math.random() * boxes.length);
    return boxes[index];
}

function randomImage() {
    const keys = Object.keys(images);
    const index = Math.floor(Math.random() * keys.length);
    return keys[index];
}

function resetBoxStyles() {
    boxes.forEach(box => {
        box.style.backgroundColor = '#ddd';
        box.style.borderColor = '#333';
        box.style.borderWidth = '2px';
    });
}

function showImage() {
    if (timeUp) return;

    if (currentBox) {
        currentBox.innerHTML = '';
        currentBox.removeEventListener('click', handleClick);
    }

    resetBoxStyles(); // Reset box styles before showing a new image

    currentBox = randomBox();
    currentImage = randomImage();

    const img = document.createElement('img');
    img.src = images[currentImage];
    img.style.display = 'block';

    currentBox.appendChild(img);
    currentBox.addEventListener('click', handleClick);

    stats[currentImage].appearances++;
    updateStats();

    setTimeout(showImage, 1000);
}

function handleClick(event) {
    const clickedImage = event.target.src.split('/').pop().split('.')[0];

    if (clickedImage === '5yeUJE') {
        currentBox.style.backgroundColor = 'lime'; // Neon green color code
        setTimeout(() => resetBoxStyles(), 2000); // Stay green for 2 seconds
        stats.witness.success++;
        score += 2;
    } else if (clickedImage === 'Mw5Opc') {
        stats.judge.appearances++; // Increase the judge appearance count
        updateStats(); // Update the stats before ending the game
        currentBox.style.borderColor = 'red';
        currentBox.style.borderWidth = '3px';
        setTimeout(() => resetBoxStyles(), 4000); // Stay red for 4 seconds
        gameOver("You whacked the Judge!\nGame Over!");
        return;
    } else {
        currentBox.style.borderColor = 'yellow';
        currentBox.style.borderWidth = '3px';
        setTimeout(() => resetBoxStyles(), 1000); // Stay yellow for 1 second
        if (clickedImage === 'aQbq54') {
            stats.prosecutor.success++;
            score += 1;
        } else if (clickedImage === 'yz0IlI') {
            stats.defenseAttorney.success++;
            score += 1;
        }
    }

    scoreBoard.textContent = score;
    updateStats();
}

function updateStats() {
    document.getElementById('witness-success').textContent = stats.witness.success;
    document.getElementById('witness-appearances').textContent = stats.witness.appearances;
    document.getElementById('prosecutor-success').textContent = stats.prosecutor.success;
    document.getElementById('prosecutor-appearances').textContent = stats.prosecutor.appearances;
    document.getElementById('defense-success').textContent = stats.defenseAttorney.success;
    document.getElementById('defense-appearances').textContent = stats.defenseAttorney.appearances;
    document.getElementById('judge-success').textContent = stats.judge.success;
    document.getElementById('judge-appearances').textContent = stats.judge.appearances;

    const totalSuccess = stats.witness.success + stats.prosecutor.success + stats.defenseAttorney.success;
    const totalAppearances = stats.witness.appearances + stats.prosecutor.appearances + stats.defenseAttorney.appearances + stats.judge.appearances;

    document.getElementById('total-success').textContent = totalSuccess;
    document.getElementById('total-appearances').textContent = totalAppearances;
}

function resetStats() {
    stats.witness.success = 0;
    stats.witness.appearances = 0;
    stats.prosecutor.success = 0;
    stats.prosecutor.appearances = 0;
    stats.defenseAttorney.success = 0;
    stats.defenseAttorney.appearances = 0;
    stats.judge.success = 0;
    stats.judge.appearances = 0;
    updateStats();
}

function gameOver(message = "Game Over!") {
    timeUp = true;
    clearTimeout(timer);
    clearInterval(countdown);
    if (currentBox) {
        currentBox.innerHTML = '';
        currentBox.removeEventListener('click', handleClick);
    }
    finalScore.textContent = score;
    gameOverMessage.textContent = message;
    gameOverScreen.style.display = 'block';
}

function startGame() {
    score = 0; // Reset score at the start of the game
    timeUp = false;
    scoreBoard.textContent = score;
    timeLeftDisplay.textContent = 30;
    gameOverScreen.style.display = 'none';
    resetBoxStyles(); // Reset box styles at the start of the game
    resetStats(); // Reset stats at the start of the game

    showImage();
    countdown = setInterval(() => {
        let timeLeft = parseInt(timeLeftDisplay.textContent);
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            gameOver("Game Over!");
        }
    }, 1000);
    timer = setTimeout(() => {
        clearInterval(countdown);
        gameOver("Game Over!");
    }, 30000); // 30 seconds
}

function cancelGame() {
    clearTimeout(timer);
    clearInterval(countdown);
    gameOver("Game stopped by user");
}

startButton.addEventListener('click', startGame);
cancelButton.addEventListener('click', cancelGame);
