class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameMode = 'pvp'; // 'pvp' or 'pvc'
        this.difficulty = 'easy';
        this.gameActive = true;
        this.scores = { X: 0, O: 0, draw: 0 };

        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.gameStatus = document.getElementById('gameStatus');
        this.resetBtn = document.getElementById('resetBtn');
        this.pvpBtn = document.getElementById('pvpBtn');
        this.pvcBtn = document.getElementById('pvcBtn');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.scoreElements = {
            X: document.getElementById('scoreX'),
            O: document.getElementById('scoreO'),
            draw: document.getElementById('scoreDraw')
        };
    }

    bindEvents() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.pvpBtn.addEventListener('click', () => this.setGameMode('pvp'));
        this.pvcBtn.addEventListener('click', () => this.setGameMode('pvc'));

        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setDifficulty(e.target.dataset.level));
        });
    }

    handleCellClick(e) {
        const index = parseInt(e.target.dataset.index);

        if (this.board[index] || !this.gameActive) return;

        this.makeMove(index, this.currentPlayer);

        if (this.gameMode === 'pvc' && this.currentPlayer === 'O' && this.gameActive) {
            setTimeout(() => this.makeComputerMove(), 500);
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].textContent = player;
        this.cells[index].classList.add(player.toLowerCase());

        if (this.checkWinner()) {
            this.endGame(`${player} Wins!`, 'winner');
            this.scores[player]++;
            this.highlightWinningCells();
        } else if (this.board.every(cell => cell !== '')) {
            this.endGame("It's a Draw!", 'draw');
            this.scores.draw++;
            this.highlightDrawCells();
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
        }

        this.updateScoreBoard();
    }

    makeComputerMove() {
        let move;

        switch (this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = Math.random() < 0.5 ? this.getBestMove() : this.getRandomMove();
                break;
            case 'hard':
                move = this.getBestMove();
                break;
        }

        if (move !== -1) {
            this.makeMove(move, 'O');
        }
    }

    getRandomMove() {
        const availableMoves = this.board
            .map((cell, index) => (cell === '' ? index : null))
            .filter((index) => index !== null);

        return availableMoves.length > 0
            ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
            : -1;
    }

    getBestMove() {
        // Check for winning move
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }

        // Check for blocking move
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }

        // Take center if available
        if (this.board[4] === '') return 4;

        // Take corners
        const corners = [0, 2, 6, 8];
        for (let corner of corners) {
            if (this.board[corner] === '') return corner;
        }

        // Take sides
        const sides = [1, 3, 5, 7];
        for (let side of sides) {
            if (this.board[side] === '') return side;
        }

        return this.getRandomMove();
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (
                this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]
            ) {
                this.winningPattern = pattern;
                return true;
            }
        }
        return false;
    }

    highlightWinningCells() {
        if (this.winningPattern) {
            this.winningPattern.forEach((index) => {
                this.cells[index].classList.add('winner');
            });
        }
    }

    highlightDrawCells() {
        this.cells.forEach((cell) => {
            cell.classList.add('draw');
        });
    }

    endGame(message, type) {
        this.gameActive = false;
        this.gameStatus.innerHTML = `<span class="${type}-message">${message}</span>`;
    }

    setGameMode(mode) {
        this.gameMode = mode;
        this.pvpBtn.classList.toggle('active', mode === 'pvp');
        this.pvcBtn.classList.toggle('active', mode === 'pvc');
        this.difficultySelect.style.display = mode === 'pvc' ? 'block' : 'none';
        this.resetGame();
    }

    setDifficulty(level) {
        this.difficulty = level;
        this.difficultyBtns.forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.level === level);
        });
    }

    updateDisplay() {
        const playerName =
            this.gameMode === 'pvc' && this.currentPlayer === 'O'
                ? 'Computer'
                : `Player ${this.currentPlayer}`;
        this.gameStatus.innerHTML = `<span class="current-player">${playerName}'s Turn</span>`;
    }

    updateScoreBoard() {
        this.scoreElements.X.textContent = this.scores.X;
        this.scoreElements.O.textContent = this.scores.O;
        this.scoreElements.draw.textContent = this.scores.draw;
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningPattern = null;

        this.cells.forEach((cell) => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner', 'draw');
        });

        this.updateDisplay();
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});     