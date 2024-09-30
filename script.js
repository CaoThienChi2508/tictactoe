const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restartButton");

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // X là người chơi, O là AI
let isGameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function createBoard() {
    boardElement.innerHTML = ''; // Xóa nội dung hiện có
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell'); // Thêm lớp CSS
        cellElement.textContent = cell; // Hiển thị nội dung của ô
        cellElement.addEventListener('click', () => handleCellClick(index)); // Gán sự kiện click
        boardElement.appendChild(cellElement); // Thêm ô vào bảng
    });
}

function handleCellClick(index) {
    if (board[index] !== '' || !isGameActive) return; // Kiểm tra ô đã được chọn chưa
    board[index] = currentPlayer; // Cập nhật ô với người chơi hiện tại

    if (checkWinner()) {
        statusElement.textContent = `Player ${currentPlayer} wins!`;
        isGameActive = false;
    } else if (board.every(cell => cell !== '')) {
        statusElement.textContent = "It's a tie!";
        statusElement.classList.add("textwin");
        isGameActive = false;
    } else {
        currentPlayer = 'O'; // Đổi lượt cho AI
        aiMove();
    }
    createBoard(); // Tạo lại bảng
}

function aiMove() {
    const bestMove = minimax(board, 'O');
    board[bestMove.index] = 'O';

    if (checkWinner()) {
        statusElement.textContent = `Player O wins!`;
        statusElement.classList.add("textwin");
        isGameActive = false;
    } else if (board.every(cell => cell !== '')) {
        statusElement.textContent = "It's a tie!";
        statusElement.classList.add("textwin");
        isGameActive = false;
    }
    currentPlayer = 'X'; // Đổi lượt về cho người chơi
    createBoard(); // Tạo lại bảng
}

function checkWinner() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true; // Chỉ cần trả về true nếu có người thắng
        }
    }
    return false;
}

function minimax(currentBoard, player) {
    const availableSpots = currentBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);

    if (checkWinner()) {
        return { score: player === 'O' ? 10 : -10 }; // Điểm cho O và X
    } else if (availableSpots.length === 0) {
        return { score: 0 }; // Hòa
    }

    const moves = [];
    availableSpots.forEach(spot => {
        const move = {};
        move.index = spot;
        currentBoard[spot] = player;

        // Kiểm tra người thắng sau khi đặt quân
        if (checkWinner()) {
            move.score = player === 'O' ? 10 : -10;
        } else {
            const result = minimax(currentBoard, player === 'O' ? 'X' : 'O');
            move.score = result.score;
        }

        currentBoard[spot] = ''; // Undo the move
        moves.push(move);
    });

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }
    return bestMove;
}

restartButton.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    statusElement.textContent = '';
    createBoard();
});

createBoard(); // Khởi tạo bảng ngay từ đầu