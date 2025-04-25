/**
 * Memory Match Game Module
 */
(function() {
  // Game metadata
  const GAME_ID = 'memoryMatch';
  const GAME_NAME = 'Memory Match';
  const GAME_DESCRIPTION = 'Test your memory by matching pairs of cards. Find all matches before time runs out!';
  const GAME_THUMBNAIL = '/arcade/games/memoryMatch/thumbnail.jpg';
  
  // Game variables
  let score = 0;
  let moves = 0;
  let gameTime = 60;
  let gameTimer;
  let isGameRunning = false;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedPairs = 0;
  let cardDeck = [];
  let difficulty = 'medium'; // easy, medium, hard
  
  // Difficulty settings
  const DIFFICULTY_SETTINGS = {
    'easy': { pairs: 6, timeLimit: 60 },
    'medium': { pairs: 8, timeLimit: 60 },
    'hard': { pairs: 12, timeLimit: 90 }
  };
  
  // Card themes (emojis for simplicity, can be replaced with images)
  const CARD_THEMES = [
    '🍎', '🍌', '🍒', '🍓', '🍕', '🍩', '🍪', '🌮',
    '🦊', '🐶', '🐱', '🐼', '🐨', '🐯', '🦁', '🐮',
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑'
  ];
  
  // HTML templates
  const gameTemplate = `
    <div class="memory-match-game">
      <div class="game-header">
        <div class="score-display">Moves: <span id="game-moves">0</span></div>
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
      
      <div class="difficulty-controls">
        <button class="difficulty-btn" data-difficulty="easy">Easy</button>
        <button class="difficulty-btn" data-difficulty="medium">Medium</button>
        <button class="difficulty-btn" data-difficulty="hard">Hard</button>
      </div>
      
      <div id="game-board" class="game-board"></div>
      
      <div class="game-controls">
        <button id="start-game-btn" class="game-btn">Start Game</button>
        <button id="reset-game-btn" class="game-btn" disabled>Reset Game</button>
      </div>
      
      <div id="game-message" class="game-message"></div>
    </div>
  `;
  
  // DOM references
  let gameBoard;
  let movesDisplay;
  let timerNeedle;
  let timerProgress;
  let tickMarksGroup;
  let gameMessage;
  let startBtn;
  let resetBtn;
  let difficultyBtns;
  
  // Initialize game
  function init() {
    // Get DOM elements
    gameBoard = document.getElementById('game-board');
    movesDisplay = document.getElementById('game-moves');
    timerNeedle = document.getElementById('timer-needle');
    timerProgress = document.getElementById('timer-progress');
    tickMarksGroup = document.getElementById('tick-marks');
    gameMessage = document.getElementById('game-message');
    startBtn = document.getElementById('start-game-btn');
    resetBtn = document.getElementById('reset-game-btn');
    difficultyBtns = document.querySelectorAll('.difficulty-btn');
    
    // Add event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Add difficulty button listeners
    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!isGameRunning) {
          difficulty = btn.getAttribute('data-difficulty');
          difficultyBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
    
    // Set default difficulty
    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
    
    // Create tick marks
    createTickMarks();
  }
  
  // Create tick marks around the timer
  function createTickMarks() {
    // Clear existing tick marks
    tickMarksGroup.innerHTML = '';
    
    // Get time limit from difficulty settings
    const timeLimit = DIFFICULTY_SETTINGS[difficulty].timeLimit;
    
    // Create tick marks (one for each 5 seconds)
    const tickCount = timeLimit / 5;
    for (let i = 0; i < tickCount; i++) {
      const angle = (i * (360 / tickCount)) - 90; // Starting at top
      const isMainTick = i % 3 === 0; // Larger tick every 15 seconds
      
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
  
  // Create the game board based on difficulty
  function createGameBoard() {
    // Clear the board
    gameBoard.innerHTML = '';
    
    // Get number of pairs based on difficulty
    const numPairs = DIFFICULTY_SETTINGS[difficulty].pairs;
    
    // Create shuffled array of card values
    const cardValues = CARD_THEMES.slice(0, numPairs);
    cardDeck = [...cardValues, ...cardValues];
    shuffleArray(cardDeck);
    
    // Set grid columns based on number of cards
    const columns = difficulty === 'hard' ? 6 : 4;
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    // Create cards
    cardDeck.forEach((value, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.setAttribute('data-value', value);
      card.setAttribute('data-index', index);
      
      // Create card inner for flip effect
      const cardInner = document.createElement('div');
      cardInner.className = 'card-inner';
      
      // Create card front (hidden side)
      const cardFront = document.createElement('div');
      cardFront.className = 'card-front';
      cardFront.innerHTML = '?';
      
      // Create card back (value side)
      const cardBack = document.createElement('div');
      cardBack.className = 'card-back';
      cardBack.innerHTML = value;
      
      // Assemble card
      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);
      
      // Add click event
      card.addEventListener('click', flipCard);
      
      // Add to board
      gameBoard.appendChild(card);
    });
  }
  
  // Start the game
  function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    moves = 0;
    matchedPairs = 0;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    
    // Get time limit from difficulty
    gameTime = DIFFICULTY_SETTINGS[difficulty].timeLimit;
    
    // Create the game board
    createGameBoard();
    createTickMarks();
    
    movesDisplay.textContent = moves;
    gameMessage.textContent = '';
    
    startBtn.disabled = true;
    resetBtn.disabled = false;
    
    // Disable difficulty buttons during gameplay
    difficultyBtns.forEach(btn => {
      btn.disabled = true;
    });
    
    // Reset timer animation
    resetTimerAnimation();
    
    // Start game timer
    gameTimer = setInterval(() => {
      gameTime--;
      
      // Update timer animation
      updateTimerAnimation(gameTime);
      
      if (gameTime <= 0) {
        endGame(false); // Game over - time's up
      }
    }, 1000);
    
    // Initial timer animation
    updateTimerAnimation(gameTime);
  }
  
  // Update the timer animation
  function updateTimerAnimation(seconds) {
    // Get time limit from difficulty
    const max = DIFFICULTY_SETTINGS[difficulty].timeLimit;
    
    // Calculate the progress (0 to 283, which is the circumference of the circle)
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
  
  // Flip card when clicked
  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    
    // Flip the card
    this.classList.add('flipped');
    
    // Play flip sound
    playSound('flip');
    
    // If this is the first card
    if (!firstCard) {
      firstCard = this;
      return;
    }
    
    // This is the second card
    secondCard = this;
    checkForMatch();
  }
  
  // Check if the two flipped cards match
  function checkForMatch() {
    // Increment moves counter
    moves++;
    movesDisplay.textContent = moves;
    
    // Get card values
    const firstCardValue = firstCard.getAttribute('data-value');
    const secondCardValue = secondCard.getAttribute('data-value');
    
    // Check if cards match
    const isMatch = firstCardValue === secondCardValue;
    
    // Lock the board to prevent more clicks during animation
    lockBoard = true;
    
    if (isMatch) {
      // Cards match - disable them
      disableCards();
    } else {
      // Cards don't match - flip them back
      unflipCards();
    }
  }
  
  // Disable matched cards
  function disableCards() {
    // Play match sound
    playSound('match');
    
    // Add matched class for styling
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    // Animate matched cards
    anime({
      targets: [firstCard, secondCard],
      scale: [
        {value: 1.1, duration: 200, easing: 'easeOutQuad'},
        {value: 1, duration: 200, easing: 'easeInQuad'}
      ],
      opacity: [
        {value: 0.8, duration: 200},
        {value: 1, duration: 200}
      ],
      backgroundColor: '#4CAF50',
      complete: () => {
        // Remove event listeners
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        // Increment matched pairs counter
        matchedPairs++;
        
        // Check if all pairs found
        if (matchedPairs === DIFFICULTY_SETTINGS[difficulty].pairs) {
          // Game completed!
          setTimeout(() => {
            endGame(true); // Win condition
          }, 500);
        } else {
          // Reset first and second card for next turn
          resetBoard();
        }
      }
    });
  }
  
  // Unflip non-matching cards
  function unflipCards() {
    // Play error sound
    playSound('error');
    
    // Brief pause before unflipping
    setTimeout(() => {
      // Animate unflipping
      anime({
        targets: [firstCard, secondCard],
        scale: [
          {value: 0.9, duration: 150, easing: 'easeOutQuad'},
          {value: 1, duration: 150, easing: 'easeInQuad'}
        ],
        backgroundColor: '#FF5252',
        complete: () => {
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
          resetBoard();
        }
      });
    }, 800);
  }
  
  // Reset the board for the next turn
  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }
  
  // End the game
  function endGame(isWin) {
    isGameRunning = false;
    clearInterval(gameTimer);
    lockBoard = true;
    
    // Calculate score based on moves and remaining time
    if (isWin) {
      // Base score: 1000 points
      // Bonus for remaining time: 10 points per second
      // Penalty for moves: -5 points per move
      score = 1000 + (gameTime * 10) - (moves * 5);
      gameMessage.textContent = `Congratulations! You found all matches in ${moves} moves. Score: ${score}`;
      playSound('win');
      
      // Celebrate with animation
      const cards = document.querySelectorAll('.memory-card');
      anime({
        targets: cards,
        scale: [
          {value: 1.1, duration: 300, easing: 'easeOutQuad'},
          {value: 1, duration: 300, easing: 'easeInQuad'}
        ],
        delay: anime.stagger(100, {grid: [4, 4], from: 'center'}),
        complete: () => {
          // Update high score
          GameEngine.updateHighScore(GAME_ID, score);
        }
      });
    } else {
      gameMessage.textContent = `Time's up! You found ${matchedPairs} out of ${DIFFICULTY_SETTINGS[difficulty].pairs} pairs.`;
      playSound('lose');
    }
    
    startBtn.disabled = false;
    resetBtn.disabled = false;
    
    // Re-enable difficulty buttons
    difficultyBtns.forEach(btn => {
      btn.disabled = false;
    });
  }
  
  // Reset the game
  function resetGame() {
    clearInterval(gameTimer);
    lockBoard = true;
    isGameRunning = false;
    gameBoard.innerHTML = '';
    movesDisplay.textContent = '0';
    gameMessage.textContent = '';
    
    startBtn.disabled = false;
    resetBtn.disabled = true;
    
    // Re-enable difficulty buttons
    difficultyBtns.forEach(btn => {
      btn.disabled = false;
    });
    
    resetTimerAnimation();
  }
  
  // Play sound effects
  function playSound(soundType) {
    // Simple sound effect implementation
    const sounds = {
      flip: {frequency: 300, duration: 0.1},
      match: {frequency: 600, duration: 0.15},
      error: {frequency: 200, duration: 0.2},
      win: {frequency: [500, 700, 900], duration: 0.3},
      lose: {frequency: [300, 200], duration: 0.3}
    };
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      
      if (Array.isArray(sounds[soundType].frequency)) {
        // Play sequence for complex sounds
        sounds[soundType].frequency.forEach((freq, i) => {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          oscillator.type = 'sine';
          oscillator.frequency.value = freq;
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + sounds[soundType].duration);
          
          oscillator.start(audioCtx.currentTime + i * 0.1);
          oscillator.stop(audioCtx.currentTime + sounds[soundType].duration + i * 0.1);
        });
      } else {
        // Simple sound
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = sounds[soundType].frequency;
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + sounds[soundType].duration);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + sounds[soundType].duration);
      }
    } catch (e) {
      console.log('Audio context not supported or user gesture required');
    }
  }
  
  // Utility function to shuffle an array (Fisher-Yates algorithm)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Clean up game resources
  function destroy() {
    if (isGameRunning) {
      clearInterval(gameTimer);
    }
    
    // Remove event listeners
    if (startBtn) startBtn.removeEventListener('click', startGame);
    if (resetBtn) resetBtn.removeEventListener('click', resetGame);
    
    if (difficultyBtns) {
      difficultyBtns.forEach(btn => {
        btn.removeEventListener('click', () => {});
      });
    }
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