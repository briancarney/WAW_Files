let score = 0;
let timeUp = false;
let timer;
let countdown;
const scoreBoard = document.getElementById('score-board');
const timeLeftDisplay = document.getElementById('time-left');
const finalScore = document.getElementById('final-score');
const gameOverScreen = document.getElementById('game-over');
const gameOverMessage = document.getElementById('game-over-message');
const boxes = document.querySelectorAll('.grid-item');
const startButton = document.getElementById('start-button');
const cancelButton = document.getElementById('cancel-button');
const progressBar = document.getElementById('progress-bar');
const stats = document.getElementById('stats');

const images = {
    witness: 'https://imagizer.imageshack.com/img922/8195/5yeUJE.png',
    judge: 'https://imagizer.imageshack.com/img924/224/Mw5Opc.png',
    prosecutor: 'https://imagizer.imageshack.com/img922/2996/aQbq54.png',
    defenseAttorney: 'https://imagizer.imageshack.com/img923/5731/yz0IlI.png'
};

let currentBox = null;
let currentImage = null;

const statsData = {
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

    statsData[currentImage].appearances++;
    updateStats();

    setTimeout(showImage, 1000);
}

function handleClick(event) {
    const clickedImage = event.target.src.split('/').pop().split('.')[0];

    if (clickedImage === '5yeUJE') {
        currentBox.style.backgroundColor = 'lime'; // Neon green color code
        setTimeout(() => resetBoxStyles(), 2000); // Stay green for 2 seconds
        statsData.witness.success++;
        score += 2;
    } else if (clickedImage === 'Mw5Opc') {
        statsData.judge.appearances++; // Increase the judge appearance count
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
            statsData.prosecutor.success++;
            score += 1;
        } else if (clickedImage === 'yz0IlI') {
            statsData.defenseAttorney.success++;
            score += 1;
        }
    }

    updateStats();
}

function updateStats() {
    document.getElementById('witness-success').textContent = statsData.witness.success;
    document.getElementById('witness-appearances').textContent = statsData.witness.appearances;
    document.getElementById('prosecutor-success').textContent = statsData.prosecutor.success;
    document.getElementById('prosecutor-appearances').textContent = statsData.prosecutor.appearances;
    document.getElementById('defense-success').textContent = statsData.defenseAttorney.success;
    document.getElementById('defense-appearances').textContent = statsData.defenseAttorney.appearances;
    document.getElementById('judge-success').textContent = statsData.judge.success;
    document.getElementById('judge-appearances').textContent = statsData.judge.appearances;

    const totalSuccess = statsData.witness.success + statsData.prosecutor.success + statsData.defenseAttorney.success;
    const totalAppearances = statsData.witness.appearances + statsData.prosecutor.appearances + statsData.defenseAttorney.appearances + statsData.judge.appearances;

    document.getElementById('total-success').textContent = totalSuccess;
    document.getElementById('total-appearances').textContent = totalAppearances;
}

function resetStats() {
    statsData.witness.success = 0;
    statsData.witness.appearances = 0;
    statsData.prosecutor.success = 0;
    statsData.prosecutor.appearances = 0;
    statsData.defenseAttorney.success = 0;
    statsData.defenseAttorney.appearances = 0;
    statsData.judge.success = 0;
    statsData.judge.appearances = 0;
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
    scoreBoard.style.display = 'block'; // Show the scoreboard when the game is over
    stats.style.display = 'block'; // Show the stats table when the game is over
}

function startGame() {
    score = 0; // Reset score at the start of the game
    timeUp = false;
    scoreBoard.style.display = 'none'; // Hide the scoreboard at the start of the game
    stats.style.display = 'none'; // Hide the stats table at the start of the game
    timeLeftDisplay.textContent = 30;
    gameOverScreen.style.display = 'none';
    resetBoxStyles(); // Reset box styles at the start of the game
    resetStats(); // Reset stats at the start of the game
    updateProgressBar(30); // Initialize progress bar

    showImage();
    countdown = setInterval(() => {
        let timeLeft = parseInt(timeLeftDisplay.textContent);
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        updateProgressBar(timeLeft); // Update progress bar
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

function updateProgressBar(timeLeft) {
    progressBar.style.width = `${(timeLeft / 30) * 100}%`;
}

function cancelGame() {
    clearTimeout(timer);
    clearInterval(countdown);
    gameOver("Game stopped by user");
}

startButton.addEventListener('click', startGame);
cancelButton.addEventListener('click', cancelGame);
