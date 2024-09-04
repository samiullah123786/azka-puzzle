// Puzzle Logic
const puzzleBoard = document.getElementById('puzzleBoard');
const puzzlePieces = document.getElementById('puzzlePieces');
const congratsMessage = document.getElementById('congratsMessage');

let pieceOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Correct order
let shuffledOrder = shuffleArray(pieceOrder.slice());

// Create the puzzle using the provided Imgur image link
function createPuzzle() {
    const imgSrc = 'https://i.imgur.com/Oq5OwtP.jpg'; // Your Imgur image direct link
    const rows = 3;
    const cols = 3;
    const pieceWidth = 333.33;  // Adjusted for 1000px image size
    const pieceHeight = 333.33; // Adjusted for 1000px image size

    shuffledOrder.forEach((num) => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.id = `piece-${num}`;
        
        // Calculate background position to correctly slice the image into pieces
        const row = Math.floor((num - 1) / cols);
        const col = (num - 1) % cols;
        piece.style.backgroundImage = `url(${imgSrc})`;
        piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
        piece.style.width = `${pieceWidth}px`;
        piece.style.height = `${pieceHeight}px`;
        
        piece.draggable = true;
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragend', dragEnd);
        puzzlePieces.appendChild(piece);
    });

    for (let i = 1; i <= 9; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.classList.add('puzzle-piece');
        emptySlot.id = `slot-${i}`;
        emptySlot.addEventListener('dragover', dragOver);
        emptySlot.addEventListener('drop', drop);
        puzzleBoard.appendChild(emptySlot);
    }
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragEnd() {
    checkPuzzleCompletion();
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    const droppedPiece = event.dataTransfer.getData('text');
    const pieceElement = document.getElementById(droppedPiece);
    event.target.appendChild(pieceElement);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkPuzzleCompletion() {
    const slots = document.querySelectorAll('.puzzle-board .puzzle-piece');
    let isComplete = true;

    slots.forEach((slot, index) => {
        const pieceId = slot.firstChild ? slot.firstChild.id.split('-')[1] : null;
        if (pieceId != pieceOrder[index]) {
            isComplete = false;
        }
    });

    if (isComplete) {
        showCongratsMessage();
    }
}

function showCongratsMessage() {
    congratsMessage.style.display = 'block';
    createConfetti();
}

// Confetti effect
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confettiContainer.appendChild(confetti);
    }
}

function getRandomColor() {
    const colors = ['#FF5733', '#33FFBD', '#FFC300', '#DAF7A6', '#FFC0CB', '#8E44AD'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Particles effect
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let numberOfParticles = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = getRandomColor();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Initialize the puzzle
createPuzzle();
