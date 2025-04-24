/**
 * Dashboard - Main interface for game selection
 */
(function() {
  // DOM references
  const gamesGrid = document.getElementById('games-grid');
  const gameContainer = document.getElementById('game-container');
  const activeGameArea = document.getElementById('active-game-area');
  const backButton = document.getElementById('back-to-dashboard');
  
  // Game card template
  function createGameCard(game) {
    return `
      <div class="game-card" data-game-id="${game.id}">
        <div class="game-thumbnail" style="background-image: url('${game.thumbnail}')">
        </div>
        <div class="game-info">
          <h3 class="game-title">${game.name}</h3>
          <p class="game-description">${game.description}</p>
          <div class="game-stats">
            <span>High Score: ${game.highScore}</span>
            <span>Times Played: ${game.playCount}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // Render games grid
  function renderGames() {
    const games = GameEngine.getGames();
    gamesGrid.innerHTML = '';
    
    games.forEach(game => {
      const gameCardHTML = createGameCard(game);
      gamesGrid.insertAdjacentHTML('beforeend', gameCardHTML);
    });
    
    // Add click event to game cards
    document.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.getAttribute('data-game-id');
        launchGame(gameId);
      });
    });
  }
  
  // Launch selected game
  function launchGame(gameId) {
    GameEngine.launchGame(gameId);
    gameContainer.classList.remove('hidden');
  }
  
  // Return to dashboard
  function returnToDashboard() {
    GameEngine.endGame();
    activeGameArea.innerHTML = '';
    gameContainer.classList.add('hidden');
    
    // Update game stats on the dashboard
    renderGames();
  }
  
  // Initialize dashboard
  function init() {
    // Load game stats from localStorage
    GameEngine.loadGameStats();
    
    // Render games grid
    renderGames();
    
    // Add back button event listener
    backButton.addEventListener('click', returnToDashboard);
    
    // Listen for game registration to update the dashboard
    GameEngine.on('gameRegistered', () => {
      renderGames();
    });
    
    // Listen for high score updates
    GameEngine.on('highScoreUpdated', () => {
      GameEngine.saveGameStats();
    });
  }
  
  // Start the dashboard when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);
})(); 