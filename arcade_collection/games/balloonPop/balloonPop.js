/**
 * Balloon Pop Game Module
 */
(function() {
  // Game metadata
  const GAME_ID = 'balloon-pop';
  const GAME_NAME = 'Balloon Pop';
  const GAME_DESCRIPTION = 'Click on balloons before they disappear! Test your reflexes in this fast-paced game.';
  const GAME_THUMBNAIL = '/games/balloonPop/thumbnail.jpg';
  
  // Game variables
  let score = 0;
  let gameTime = 30;
  let gameTimer;
  let isGameRunning = false;
  let circleSpawnInterval;
  
  // HTML templates
  const gameTemplate = `
    <div class="balloon-pop-game">
      <div class="game-header">
        <div class="score-display">Score: <span id="game-score">0</span></div>
        <div class="timer-container">
          <div id="timer-wrapper">
            <svg id="timer-svg" viewBox="0 0 100 100">
              <!-- Outer circle (track) -->
              <circle cx="50" cy="50" r="45" fill="none" stroke="#333" stroke-width="2" />
              
              <!-- Colorful progress track -->
              <circle id="timer-progress" cx="50" cy="50" r="45" fill="none" stroke="url(#timer-gradient)" stroke-width="5" 
                stroke-dasharray="283" stroke-dashoffset="0" transform="rotate(-90,50,50)" />
              
              <!-- Center -->
              <circle cx="50" cy="50" r="40" fill="#222" />
              
              <!-- Tick marks for seconds -->
              <g id="tick-marks"></g>
              
              <!-- Needle -->
              <line id="timer-needle" x1="50" y1="50" x2="50" y2="10" stroke="#f5d742" stroke-width="2" />
              
              <!-- Center dot -->
              <circle cx="50" cy="50" r="3" fill="#f5d742" />
              
              <!-- Gradient definition -->
              <defs>
                <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#4CAF50" />
                  <stop offset="25%" stop-color="#8BC34A" />
                  <stop offset="50%" stop-color="#FFEB3B" />
                  <stop offset="75%" stop-color="#FF9800" />
                  <stop offset="100%" stop-color="#F44336" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      
      <div id="game-play-area" class="game-play-area"></div>
      
      <div class="game-controls">
        <button id="start-game-btn" class="game-btn">Start Game</button>
        <button id="reset-game-btn" class="game-btn" disabled>Reset Game</button>
      </div>
      
      <div id="game-message" class="game-message"></div>
    </div>
  `;
  
  // Circle colors
  const circleColors = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
    '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
    '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'
  ];
  
  // DOM references
  let gameArea;
  let scoreDisplay;
  let timerNeedle;
  let timerProgress;
  let tickMarksGroup;
  let gameMessage;
  let startBtn;
  let resetBtn;
  
  // Initialize game
  function init() {
    // Get DOM elements
    gameArea = document.getElementById('game-play-area');
    scoreDisplay = document.getElementById('game-score');
    timerNeedle = document.getElementById('timer-needle');
    timerProgress = document.getElementById('timer-progress');
    tickMarksGroup = document.getElementById('tick-marks');
    gameMessage = document.getElementById('game-message');
    startBtn = document.getElementById('start-game-btn');
    resetBtn = document.getElementById('reset-game-btn');
    
    // Add event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Create tick marks
    createTickMarks();
  }
  
  // Create tick marks around the timer
  function createTickMarks() {
    // Create 30 tick marks (one for each second)
    for (let i = 0; i < 30; i++) {
      const angle = (i * 12) - 90; // 12 degrees per second, starting at top
      const isMainTick = i % 5 === 0; // Larger tick every 5 seconds
      
      // Calculate the tick start and end positions
      const innerRadius = isMainTick ? 40 : 42;
      const outerRadius = 45;
      
      const startX = 50 + innerRadius * Math.cos(angle * Math.PI / 180);
      const startY = 50 + innerRadius * Math.sin(angle * Math.PI / 180);
      const endX = 50 + outerRadius * Math.cos(angle * Math.PI / 180);
      const endY = 50 + outerRadius * Math.sin(angle * Math.PI / 180);
      
      // Create the tick line
      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tick.setAttribute("x1", startX);
      tick.setAttribute("y1", startY);
      tick.setAttribute("x2", endX);
      tick.setAttribute("y2", endY);
      tick.setAttribute("stroke", "#f5d742");
      tick.setAttribute("stroke-width", isMainTick ? "1.5" : "0.75");
      
      // Add to the group
      tickMarksGroup.appendChild(tick);
    }
  }
  
  // Start the game
  function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    gameTime = 30;
    
    scoreDisplay.textContent = score;
    gameMessage.textContent = '';
    
    startBtn.disabled = true;
    resetBtn.disabled = false;
    
    // Reset timer animation
    resetTimerAnimation();
    
    // Start spawning circles
    circleSpawnInterval = setInterval(spawnCircle, 1000);
    
    // Start game timer
    gameTimer = setInterval(() => {
      gameTime--;
      
      // Update timer animation
      updateTimerAnimation(gameTime);
      
      if (gameTime <= 0) {
        endGame();
      }
    }, 1000);
    
    // Initial timer animation
    updateTimerAnimation(gameTime);
  }
  
  // Update the timer animation
  function updateTimerAnimation(seconds) {
    // Calculate the progress (0 to 283, which is the circumference of the circle)
    const max = 30; // 30 seconds
    const progress = 283 * (1 - seconds / max);
    const angle = 360 * (1 - seconds / max);
    
    // Animate the progress track
    anime({
      targets: timerProgress,
      strokeDashoffset: progress,
      duration: 500,
      easing: 'easeOutQuad'
    });
    
    // Animate the needle
    anime({
      targets: timerNeedle,
      rotate: angle,
      duration: 500,
      easing: 'easeOutElastic(1, 0.5)',
      transformOrigin: ['50% 50%'],
    });
  }
  
  // Reset timer animation
  function resetTimerAnimation() {
    anime({
      targets: timerProgress,
      strokeDashoffset: 0,
      duration: 400,
      easing: 'easeOutQuad'
    });
    
    anime({
      targets: timerNeedle,
      rotate: 0,
      duration: 400,
      easing: 'easeOutQuad',
      transformOrigin: ['50% 50%'],
    });
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
        }, 1500); // Circles last 1.5 seconds
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
    
    // Update high score
    GameEngine.updateHighScore(GAME_ID, score);
  }
  
  // Reset the game
  function resetGame() {
    endGame();
    score = 0;
    gameTime = 30;
    scoreDisplay.textContent = score;
    gameMessage.textContent = '';
    resetTimerAnimation();
  }
  
  // Helper function for random numbers
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Clean up game resources
  function destroy() {
    if (isGameRunning) {
      clearInterval(circleSpawnInterval);
      clearInterval(gameTimer);
    }
    
    // Remove event listeners
    if (startBtn) startBtn.removeEventListener('click', startGame);
    if (resetBtn) resetBtn.removeEventListener('click', resetGame);
  }
  
  // Register the game with the GameEngine
  GameEngine.registerGame({
    id: GAME_ID,
    name: GAME_NAME,
    description: GAME_DESCRIPTION,
    thumbnail: GAME_THUMBNAIL,
    create: function() {
      const gameContainer = document.getElementById('active-game-area');
      gameContainer.innerHTML = gameTemplate;
      init();
    },
    destroy: destroy
  });
})(); 