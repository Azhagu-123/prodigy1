const board = document.getElementById('board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let confettiTimeout;

function checkWinner() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }
    return gameState.includes(null) ? null : 'Draw';
}

function createBlastConfetti() {
    const confettiCount = 150; // Number of confetti pieces
    const boardRect = document.getElementById('board').getBoundingClientRect();
    const centerX = boardRect.left + boardRect.width / 2;
    const centerY = boardRect.top + boardRect.height / 2;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = centerX + 'px';
        confetti.style.top = centerY + 'px';

        const angle = Math.random() * 2 * Math.PI; // Random direction
        const distance = Math.random() * 300 + 100; // Random distance
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        confetti.style.setProperty('--dx', `${x}px`);
        confetti.style.setProperty('--dy', `${y}px`);
        confetti.style.setProperty('--rotate', `${Math.random() * 360}deg`);
        confetti.style.backgroundColor = getRandomColor();

        document.body.appendChild(confetti);

        // Remove confetti after animation
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}

function stopConfetti() {
    // Cancel any pending confetti blast after the reset
    clearTimeout(confettiTimeout);
}

function getRandomColor() {
    const colors = ['#ff0', '#f00', '#0f0', '#00f', '#f0f', '#0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function handleClick(e) {
    const cell = e.target;
    const cellIndex = cell.dataset.index;

    if (gameState[cellIndex] || !gameActive) return;

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    const winner = checkWinner();
    if (winner) {
        gameActive = false;
        message.textContent = winner === 'Draw' ? 'It\'s a Draw!' : `Player ${winner} Wins!`;

        if (winner !== 'Draw') {
            createBlastConfetti(); // Trigger the blasting confetti on win
        }

        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s Turn`;
}

function resetGame() {
    gameState = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    message.textContent = `Player ${currentPlayer}'s Turn`;

    // Stop any ongoing confetti
    stopConfetti();

    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    createBoard();
}

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    }
}

createBoard();
message.textContent = `Player ${currentPlayer}'s Turn`;

resetButton.addEventListener('click', resetGame);