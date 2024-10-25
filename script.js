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
    boardElement.innerHTML = ''; 
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell; 
        cellElement.addEventListener('click', () => handleCellClick(index)); // Gán sự kiện click
        boardElement.appendChild(cellElement); 
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
    createBoard(); 
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

    // Kiểm tra người thắng và trả về điểm số tương ứng
    if (checkWinner()) {
        return { score: player === 'O' ? -1 : 1 }; // O thắng: -1, X thắng: 1
    } else if (availableSpots.length === 0) {
        return { score: 0 }; // Hòa
    }

    const moves = [];
    availableSpots.forEach(spot => {
        const move = {};
        move.index = spot;
        currentBoard[spot] = player; // Đặt nước đi

        // Kiểm tra người thắng sau khi đặt quân
        if (checkWinner()) {
            move.score = player === 'X' ? 1 : -1; // Gán điểm khi thắng
        } else {
            const result = minimax(currentBoard, player === 'X' ? 'O' : 'X'); // Gọi đệ quy cho người chơi khác
            move.score = result.score;
        }

        currentBoard[spot] = ''; // Hoàn tác nước đi
        moves.push(move);
    });

    let bestMove;
    if (player === 'X') {
        let bestScore = -Infinity; // X sẽ tìm điểm tối đa
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity; // O sẽ tìm điểm tối thiểu
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
    currentPlayer = 'X'; // Bắt đầu với người chơi X
    isGameActive = true;
    statusElement.textContent = '';
    createBoard(); // Khởi tạo bảng
});

// Khởi tạo bảng ngay từ đầu
createBoard();