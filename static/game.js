// Game variables
let score = 0;
let gameTime = 30;
let gameTimer;
let isGameRunning = false;
let circleSpawnInterval;
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const gameMessage = document.getElementById('game-message');
const startBtn = document.getElementById('startGameBtn');
const resetBtn = document.getElementById('resetGameBtn');

// Circle colors
const circleColors = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'
];

// Initialize game
function initGame() {
  startBtn.addEventListener('click', startGame);
  resetBtn.addEventListener('click', resetGame);
  resetBtn.disabled = true;
}

// Start the game
function startGame() {
  if (isGameRunning) return;
  
  isGameRunning = true;
  score = 0;
  gameTime = 30;
  
  scoreDisplay.textContent = score;
  timeDisplay.textContent = gameTime;
  gameMessage.textContent = '';
  
  startBtn.disabled = true;
  resetBtn.disabled = false;
  
  // Start spawning circles
  circleSpawnInterval = setInterval(spawnCircle, 1000);
  
  // Start game timer
  gameTimer = setInterval(() => {
    gameTime--;
    timeDisplay.textContent = gameTime;
    
    if (gameTime <= 0) {
      endGame();
    }
  }, 1000);
}

// Create balloon pop effect
function createBalloonPopEffect(x, y, color, size) {
  // Create balloon fragments
  const fragmentCount = 12;
  const fragments = [];
  
  // Create container for fragments
  const fragmentsContainer = document.createElement('div');
  fragmentsContainer.style.position = 'absolute';
  fragmentsContainer.style.left = `${x}px`;
  fragmentsContainer.style.top = `${y}px`;
  fragmentsContainer.style.pointerEvents = 'none';
  fragmentsContainer.className = 'fragments-container';
  gameArea.appendChild(fragmentsContainer);
  
  // Create initial burst effect (white flash)
  const burst = document.createElement('div');
  burst.className = 'burst';
  burst.style.position = 'absolute';
  burst.style.width = `${size}px`;
  burst.style.height = `${size}px`;
  burst.style.borderRadius = '50%';
  burst.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  burst.style.transform = 'translate(-50%, -50%)';
  fragmentsContainer.appendChild(burst);
  
  // Animate burst
  anime({
    targets: burst,
    scale: [0.5, 2],
    opacity: [0.8, 0],
    duration: 300,
    easing: 'easeOutQuad'
  });
  
  // Create fragments with curved shapes
  for (let i = 0; i < fragmentCount; i++) {
    const fragment = document.createElement('div');
    
    // Calculate size and shape of fragment
    const fragmentSize = size / 4 + (Math.random() * size / 8);
    const curve = Math.random() * 50 + 30; // Random curve for each piece
    
    // Style the fragment
    fragment.style.position = 'absolute';
    fragment.style.width = `${fragmentSize}px`;
    fragment.style.height = `${fragmentSize}px`;
    fragment.style.backgroundColor = color;
    fragment.style.borderRadius = `${curve}% ${100-curve}% ${curve}% ${100-curve}%`;
    fragment.style.transform = `rotate(${Math.random() * 360}deg)`;
    fragment.style.boxShadow = 'inset 0 0 8px rgba(0,0,0,0.2)';
    fragment.style.opacity = '0.9';
    fragment.style.left = '0';
    fragment.style.top = '0';
    fragment.style.marginLeft = `-${fragmentSize/2}px`;
    fragment.style.marginTop = `-${fragmentSize/2}px`;
    
    fragmentsContainer.appendChild(fragment);
    fragments.push(fragment);
  }
  
  // Animate fragments
  anime({
    targets: fragments,
    translateX: () => anime.random(-size, size),
    translateY: () => anime.random(-size, size),
    scale: [
      {value: 1, duration: 100, easing: 'easeOutSine'},
      {value: 0, duration: 700, easing: 'easeOutExpo'}
    ],
    opacity: [
      {value: 0.9, duration: 100},
      {value: 0, duration: 700}
    ],
    rotate: () => anime.random(-360, 360) + 'deg',
    delay: anime.stagger(15, {from: 'center', easing: 'easeOutQuad'}),
    complete: () => {
      if (fragmentsContainer.parentNode) {
        gameArea.removeChild(fragmentsContainer);
      }
    }
  });
}

// Spawn a circle at random location
function spawnCircle() {
  if (!isGameRunning) return;
  
  const circleSize = getRandomNumber(30, 80);
  const circleX = getRandomNumber(0, gameArea.clientWidth - circleSize);
  const circleY = getRandomNumber(0, gameArea.clientHeight - circleSize);
  const colorIndex = Math.floor(Math.random() * circleColors.length);
  const circleColor = circleColors[colorIndex];
  
  // Create the circle element
  const circle = document.createElement('div');
  circle.className = 'target-circle';
  circle.style.width = `${circleSize}px`;
  circle.style.height = `${circleSize}px`;
  circle.style.left = `${circleX}px`;
  circle.style.top = `${circleY}px`;
  circle.style.backgroundColor = circleColor;
  
  // Add balloon-like appearance
  circle.style.boxShadow = 'inset -5px -5px 10px rgba(0,0,0,0.1), 3px 3px 3px rgba(0,0,0,0.05)';
  
  // Add highlight to make it look like a balloon
  const highlight = document.createElement('div');
  highlight.style.position = 'absolute';
  highlight.style.width = '30%';
  highlight.style.height = '30%';
  highlight.style.borderRadius = '50%';
  highlight.style.background = 'rgba(255,255,255,0.3)';
  highlight.style.top = '15%';
  highlight.style.left = '15%';
  highlight.style.pointerEvents = 'none';
  circle.appendChild(highlight);
  
  // Add click event
  circle.addEventListener('click', () => {
    if (!isGameRunning) return;
    
    // Increment score
    score++;
    scoreDisplay.textContent = score;
    
    // Get the center position of the circle for the balloon pop effect
    const centerX = circleX + circleSize/2;
    const centerY = circleY + circleSize/2;
    
    // Create balloon pop effect
    createBalloonPopEffect(centerX, centerY, circleColor, circleSize);
    
    // Remove circle immediately on click
    if (circle.parentNode) {
      gameArea.removeChild(circle);
    }
  });
  
  // Add to game area
  gameArea.appendChild(circle);
  
  // Animate the circle appearance with a slight bounce
  anime({
    targets: circle,
    opacity: [0, 1],
    scale: [0.2, 1],
    duration: 400,
    easing: 'easeOutElastic(1, 0.5)',
    complete: () => {
      // Make the circle clickable
      circle.style.pointerEvents = 'auto';
      
      // Schedule circle disappearance
      setTimeout(() => {
        if (!circle.parentNode) return;
        
        // Animate disappearance
        anime({
          targets: circle,
          opacity: [1, 0],
          scale: [1, 0.8],
          duration: 200,
          easing: 'easeInQuad',
          complete: () => {
            if (circle.parentNode) {
              gameArea.removeChild(circle);
            }
          }
        });
      }, 500); // Circles last half a second
    }
  });
}

// End the game
function endGame() {
  isGameRunning = false;
  clearInterval(circleSpawnInterval);
  clearInterval(gameTimer);
  
  // Remove all remaining circles
  const circles = document.querySelectorAll('.target-circle');
  circles.forEach(circle => {
    anime({
      targets: circle,
      opacity: 0,
      scale: 0,
      duration: 300,
      easing: 'easeOutQuad',
      complete: () => {
        if (circle.parentNode) {
          gameArea.removeChild(circle);
        }
      }
    });
  });
  
  startBtn.disabled = false;
  gameMessage.textContent = `Game Over! Final Score: ${score}`;
}

// Reset the game
function resetGame() {
  endGame();
  score = 0;
  gameTime = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = gameTime;
  gameMessage.textContent = '';
}

// Helper function for random numbers
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame); 