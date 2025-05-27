// script.js
import getWord from "./words.js";

const contentBtns = document.querySelector('.btns');
const contentGuessWord = document.querySelector('.guess-word');
const img = document.querySelector('img');
const contentClue = document.querySelector('.clue');
const btnNew = document.querySelector('.new');
let indexImg;
let currentWord = '';
let remainingLetters = 0;

init();

btnNew.addEventListener('click', init);

function init() {
    indexImg = 1;
    img.src = `img/forca1.png`;
    contentGuessWord.textContent = '';
    currentWord = '';
    remainingLetters = 0;

    generateButtons();
}

function generateButtons() {
    contentBtns.textContent = '';
    contentGuessWord.textContent = '';

    const { word, clue } = getWord();
    currentWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    remainingLetters = currentWord.length;

    // Criar espaços para as letras da palavra
    Array.from(currentWord).forEach((letter) => {
        const span = document.createElement("span");
        span.textContent = "_";
        span.setAttribute("data-letter", letter);
        contentGuessWord.appendChild(span);
    });

    contentClue.textContent = `Dica: ${clue}`;

    // Criar botões do teclado
    for (let i = 65; i <= 90; i++) {
        const btn = document.createElement("button");
        const letter = String.fromCharCode(i);
        
        btn.textContent = letter;
        btn.className = 'key';
        btn.addEventListener('click', () => {
            btn.disabled = true;
            btn.style.backgroundColor = "gray";
            verifyLetter(letter);
        });
        
        contentBtns.appendChild(btn);
    }
}

function wrongAnswer() {
    indexImg++;
    img.src = `img/${indexImg}.png`;

    if (indexImg === 7) {
        setTimeout(() => {
            alert(`Perdeu! A palavra era: ${currentWord}`);
            init();
        }, 100);
    }
}

function verifyLetter(letter) {
    const letterSpans = document.querySelectorAll(`[data-letter="${letter}"]`);
    
    if (letterSpans.length === 0) {
        wrongAnswer();
    } else {
        letterSpans.forEach(span => {
            span.textContent = letter;
            remainingLetters--;
        });
        
        if (remainingLetters === 0) {
            setTimeout(() => {
                alert("Parabéns! Você ganhou!");
                init();
            }, 100);
        }
    }
}