// script.js
import getWord from './words.js';

// Game state
const gameState = {
    word: '',
    clue: '',
    guessedLetters: [],
    wrongAttempts: 0,
    maxAttempts: 6,
    score: 0,
    vbucks: 0,
    gameActive: false
};

// DOM elements
const elements = {
    hangmanImage: document.getElementById('hangman-image'),
    wordDisplay: document.getElementById('word-display'),
    clueText: document.getElementById('clue'),
    attemptsDisplay: document.getElementById('attempts'),
    scoreDisplay: document.getElementById('score'),
    vbucksDisplay: document.getElementById('total-vbucks'),
    keyboardKeys: document.querySelectorAll('.keyboard-key'),
    restartBtn: document.querySelector('.restart-btn'),
    hintBtn: document.querySelector('.hint-btn'),
    notification: document.querySelector('.fortnite-notification'),
    notificationText: document.getElementById('notification-text')
};

// Sounds
const sounds = {
    click: document.getElementById('clickSound'),
    correct: document.getElementById('correctSound'),
    wrong: document.getElementById('wrongSound'),
    victory: document.getElementById('victorySound'),
    gameover: document.getElementById('gameoverSound'),
    vbucks: document.getElementById('vbucksSound')
};

// Initialize the game
function initGame() {
    const { word, clue } = getWord();
    gameState.word = word.toUpperCase();
    gameState.clue = clue;
    gameState.guessedLetters = [];
    gameState.wrongAttempts = 0;
    gameState.gameActive = true;
    
    // Reset keyboard
    elements.keyboardKeys.forEach(key => {
        key.disabled = false;
        key.classList.remove('correct', 'wrong');
    });
    
    // Update UI
    updateHangmanImage();
    updateWordDisplay();
    elements.clueText.textContent = gameState.clue;
    elements.attemptsDisplay.textContent = `${gameState.maxAttempts - gameState.wrongAttempts}/${gameState.maxAttempts}`;
    elements.hintBtn.disabled = false;
    
    showNotification('NOVO JOGO INICIADO! BOA SORTE!');
}

// Update hangman image based on wrong attempts
function updateHangmanImage() {
    elements.hangmanImage.src = `img/hangman-${gameState.wrongAttempts}.png`;
}

// Update the word display with guessed letters
function updateWordDisplay() {
    elements.wordDisplay.innerHTML = '';
    const wordArray = gameState.word.split('');
    
    wordArray.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.className = 'word-letter';
        
        if (letter === ' ') {
            letterElement.classList.add('space');
            letterElement.innerHTML = '&nbsp;';
        } else if (gameState.guessedLetters.includes(letter)) {
            letterElement.textContent = letter;
            letterElement.classList.add('visible');
        } else {
            letterElement.textContent = '_';
        }
        
        elements.wordDisplay.appendChild(letterElement);
    });
    
    // Check if player won
    if (checkWin()) {
        gameState.gameActive = false;
        gameState.score += 100;
        gameState.vbucks += 50;
        updateScore();
        sounds.victory.play();
        showNotification('VICTORY ROYALE! +50 V-BUCKS', true);
    }
}

// Check if player has won
function checkWin() {
    const wordLetters = [...new Set(gameState.word.replace(/ /g, '').split(''))];
    return wordLetters.every(letter => gameState.guessedLetters.includes(letter));
}

// Handle letter guess
function guessLetter(letter) {
    if (!gameState.gameActive) return;
    
    playSound(sounds.click);
    
    // Check if letter was already guessed
    if (gameState.guessedLetters.includes(letter)) return;
    
    gameState.guessedLetters.push(letter);
    
    // Check if letter is in the word
    if (gameState.word.includes(letter)) {
        // Correct guess
        const keyElement = document.querySelector(`.keyboard-key[data-key="${letter}"]`);
        keyElement.classList.add('correct');
        keyElement.disabled = true;
        playSound(sounds.correct);
        updateWordDisplay();
    } else {
        // Wrong guess
        const keyElement = document.querySelector(`.keyboard-key[data-key="${letter}"]`);
        keyElement.classList.add('wrong');
        keyElement.disabled = true;
        gameState.wrongAttempts++;
        playSound(sounds.wrong);
        updateHangmanImage();
        elements.attemptsDisplay.textContent = `${gameState.maxAttempts - gameState.wrongAttempts}/${gameState.maxAttempts}`;
        
        // Check if player lost
        if (gameState.wrongAttempts >= gameState.maxAttempts) {
            gameState.gameActive = false;
            gameState.score = Math.max(0, gameState.score - 50);
            updateScore();
            sounds.gameover.play();
            showNotification(`GAME OVER! A PALAVRA ERA: ${gameState.word}`, true);
            revealWord();
        }
    }
}

// Reveal the entire word (when game is lost)
function revealWord() {
    const wordLetters = [...new Set(gameState.word.replace(/ /g, '').split(''))];
    wordLetters.forEach(letter => {
        if (!gameState.guessedLetters.includes(letter)) {
            gameState.guessedLetters.push(letter);
            const keyElement = document.querySelector(`.keyboard-key[data-key="${letter}"]`);
            if (keyElement) {
                keyElement.classList.add('wrong');
                keyElement.disabled = true;
            }
        }
    });
    updateWordDisplay();
}

// Update score display
function updateScore() {
    elements.scoreDisplay.textContent = gameState.score;
    elements.vbucksDisplay.textContent = gameState.vbucks;
}

// Show notification
function showNotification(message, showVbucks = false) {
    elements.notificationText.textContent = message;
    elements.notification.classList.add('show');
    
    if (showVbucks) {
        playSound(sounds.vbucks);
    }
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// Play sound
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Give hint (reveal a random letter)
function giveHint() {
    if (!gameState.gameActive || gameState.vbucks < 10) return;
    
    const unguessedLetters = [...gameState.word].filter(
        letter => letter !== ' ' && !gameState.guessedLetters.includes(letter)
    );
    
    if (unguessedLetters.length > 0) {
        const randomLetter = unguessedLetters[
            Math.floor(Math.random() * unguessedLetters.length)
        ];
        
        gameState.vbucks -= 10;
        updateScore();
        elements.hintBtn.disabled = gameState.vbucks < 10;
        guessLetter(randomLetter);
        showNotification(`DICA REVELADA: ${randomLetter}`);
    }
}

// Event listeners
elements.keyboardKeys.forEach(key => {
    key.addEventListener('click', () => {
        guessLetter(key.dataset.key);
    });
});

elements.restartBtn.addEventListener('click', () => {
    initGame();
});

elements.hintBtn.addEventListener('click', () => {
    giveHint();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (!gameState.gameActive) return;
    
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
        const keyElement = document.querySelector(`.keyboard-key[data-key="${key}"]`);
        if (keyElement && !keyElement.disabled) {
            keyElement.classList.add('active');
            guessLetter(key);
        }
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
        const keyElement = document.querySelector(`.keyboard-key[data-key="${key}"]`);
        if (keyElement) keyElement.classList.remove('active');
    }
});

// Initialize the game on load
window.addEventListener('DOMContentLoaded', () => {
    initGame();
    showNotification('BEM-VINDO AO FORCA ROYALE!');
});