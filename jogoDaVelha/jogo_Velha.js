document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cells = document.querySelectorAll('.board-cell');
    const xPlayerCard = document.querySelector('.x-player');
    const oPlayerCard = document.querySelector('.o-player');
    const xPlayerScore = document.querySelector('.x-player .player-score');
    const oPlayerScore = document.querySelector('.o-player .player-score');
    const xPlayerVbucks = document.querySelector('.x-player .player-vbucks');
    const oPlayerVbucks = document.querySelector('.o-player .player-vbucks');
    const restartBtn = document.querySelector('.restart-btn');
    const newGameBtn = document.querySelector('.newgame-btn');
    const notification = document.querySelector('.fortnite-notification');
    const totalVbucksDisplay = document.getElementById('total-vbucks');
    const clickSound = document.getElementById('clickSound');
    const victorySound = document.getElementById('victorySound');
    const vbucksSound = document.getElementById('vbucksSound');
    const playerSelection = document.querySelector('.player-selection');
    const gameContainer = document.querySelector('.game-container');
    const skinOptions = document.querySelectorAll('.skin-option');
    const confirmButtons = document.querySelectorAll('.confirm-btn');
    const playerNameInputs = document.querySelectorAll('.fortnite-input');
    const player1DisplayName = document.getElementById('player1-display-name');
    const player2DisplayName = document.getElementById('player2-display-name');
    const player1Avatar = document.querySelector('.x-player .player-avatar');
    const player2Avatar = document.querySelector('.o-player .player-avatar');
    
    // Game Variables
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { X: 0, O: 0 };
    let vbucks = { X: 0, O: 0 };
    let totalVbucks = 500;
    let player1 = {
        name: "JONESY",
        skin: "Jonesy",
        confirmed: false
    };
    let player2 = {
        name: "PEELY",
        skin: "Peely",
        confirmed: false
    };
    
    // Winning Conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Initialize Game
    init();
    
    function init() {
        // Hide game elements initially
        gameContainer.style.display = 'none';
        playerSelection.style.display = 'block';
        
        // Initialize VBucks display
        totalVbucksDisplay.textContent = totalVbucks;
        
        // Event listeners
        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        restartBtn.addEventListener('click', restartGame);
        newGameBtn.addEventListener('click', newGame);
        
        // Player selection event listeners
        skinOptions.forEach(option => {
            option.addEventListener('click', function() {
                const playerCard = this.closest('.player-selection-card');
                const playerNum = playerCard.querySelector('.confirm-btn').getAttribute('data-player');
                const skin = this.getAttribute('data-skin');
                
                // Remove selected class from all options in this card
                playerCard.querySelectorAll('.skin-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Update player skin
                if (playerNum === '1') {
                    player1.skin = skin;
                } else {
                    player2.skin = skin;
                }
                
                playSound(clickSound);
            });
        });

        confirmButtons.forEach(button => {
            button.addEventListener('click', function() {
                const playerNum = this.getAttribute('data-player');
                const playerCard = this.closest('.player-selection-card');
                const nameInput = playerCard.querySelector('.fortnite-input');
                const selectedSkin = playerCard.querySelector('.skin-option.selected').getAttribute('data-skin');
                
                if (playerNum === '1') {
                    player1.name = nameInput.value.trim() || "PLAYER 1";
                    player1.skin = selectedSkin;
                    player1.confirmed = true;
                } else {
                    player2.name = nameInput.value.trim() || "PLAYER 2";
                    player2.skin = selectedSkin;
                    player2.confirmed = true;
                }
                
                // Update button appearance
                this.classList.add('confirmed');
                this.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">CONFIRMED!</span>';
                playSound(clickSound);
                
                // Start game if both confirmed
                if (player1.confirmed && player2.confirmed) {
                    startGame();
                }
            });
        });
    }
    
    function startGame() {
        // Hide selection and show game elements
        playerSelection.style.display = 'none';
        gameContainer.style.display = 'block';
        
        // Update player info
        player1DisplayName.textContent = player1.name;
        player2DisplayName.textContent = player2.name;
        player1Avatar.src = `img/${player1.skin}.png`;
        player2Avatar.src = `img/${player2.skin}.png`;
        
        // Initialize game
        resetGame();
        gameActive = true;
        
        showNotification("BATTLE STARTED! GOOD LUCK!");
        playSound(victorySound);
    }
    
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;
        
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        playSound(clickSound);
        
        if (checkWin()) {
            handleWin();
        } else if (checkDraw()) {
            handleDraw();
        } else {
            switchPlayer();
        }
    }
    
    function checkWin() {
        return winningConditions.some(condition => {
            return condition.every(index => gameState[index] === currentPlayer);
        });
    }
    
    function checkDraw() {
        return !gameState.includes('');
    }
    
    function handleWin() {
        const winningCombo = winningConditions.find(condition => {
            return condition.every(index => gameState[index] === currentPlayer);
        });
        
        winningCombo.forEach(index => {
            cells[index].classList.add('winner');
        });
        
        // Update scores and VBucks
        scores[currentPlayer]++;
        vbucks[currentPlayer] += 100;
        totalVbucks += 100;
        
        if (currentPlayer === 'X') {
            xPlayerScore.textContent = scores.X;
            xPlayerVbucks.textContent = `+${vbucks.X} V-BUCKS`;
        } else {
            oPlayerScore.textContent = scores.O;
            oPlayerVbucks.textContent = `+${vbucks.O} V-BUCKS`;
        }
        
        totalVbucksDisplay.textContent = totalVbucks;
        
        playSound(victorySound);
        playSound(vbucksSound);
        showNotification(`${currentPlayer === 'X' ? player1.name : player2.name} VICTORY ROYALE! +100 V-BUCKS`);
        endGame();
    }
    
    function handleDraw() {
        showNotification('DRAW! NO WINNER!');
        endGame();
    }
    
    function endGame() {
        gameActive = false;
    }
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        xPlayerCard.classList.toggle('active', currentPlayer === 'X');
        oPlayerCard.classList.toggle('active', currentPlayer === 'O');
    }
    
    function restartGame() {
        resetGame();
        playSound(clickSound);
    }
    
    function newGame() {
        // Reset game state
        resetGame();
        scores = { X: 0, O: 0 };
        vbucks = { X: 0, O: 0 };
        
        // Reset player displays
        xPlayerScore.textContent = '0';
        oPlayerScore.textContent = '0';
        xPlayerVbucks.textContent = '+0 V-BUCKS';
        oPlayerVbucks.textContent = '+0 V-BUCKS';
        
        // Show player selection again
        playerSelection.style.display = 'block';
        gameContainer.style.display = 'none';
        
        // Reset confirmation buttons
        confirmButtons.forEach(button => {
            button.classList.remove('confirmed');
            button.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">CONFIRM</span>';
        });
        
        // Reset player confirmation status
        player1.confirmed = false;
        player2.confirmed = false;
        
        playSound(clickSound);
    }
    
    function resetGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        
        // Reset cells
        cells.forEach(cell => {
            cell.className = 'board-cell';
            cell.removeAttribute('data-value');
        });
        
        // Reset player indicators
        xPlayerCard.classList.add('active');
        oPlayerCard.classList.remove('active');
    }
    
    function showNotification(message) {
        const notificationContent = notification.querySelector('.notification-content p');
        notificationContent.textContent = message;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    function playSound(sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play failed:", e));
    }
});