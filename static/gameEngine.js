/**
 * Game Engine - Core framework for all games
 * Provides common functionality and interfaces for game modules
 */
const GameEngine = (function() {
  // Private variables and methods
  const _registeredGames = {};
  let _activeGame = null;
  
  // Event handling system
  const _events = {};
  
  // Register event listener
  function _on(event, callback) {
    if (!_events[event]) {
      _events[event] = [];
    }
    _events[event].push(callback);
  }
  
  // Trigger event
  function _trigger(event, data) {
    if (!_events[event]) return;
    _events[event].forEach(callback => callback(data));
  }
  
  // Game factory - Creates standardized game objects
  function _createGame(config) {
    // Validate required properties
    const requiredProps = ['id', 'name', 'description', 'thumbnail', 'create'];
    requiredProps.forEach(prop => {
      if (!config[prop]) {
        throw new Error(`Game configuration missing required property: ${prop}`);
      }
    });
    
    // Return standardized game object
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      thumbnail: config.thumbnail,
      playCount: config.playCount || 0,
      highScore: config.highScore || 0,
      create: config.create,
      destroy: config.destroy || function() {}
    };
  }
  
  // Public API
  return {
    // Register a new game with the engine
    registerGame: function(gameConfig) {
      try {
        const game = _createGame(gameConfig);
        _registeredGames[game.id] = game;
        _trigger('gameRegistered', game);
        console.log(`Game registered: ${game.name}`);
        return game;
      } catch (error) {
        console.error('Error registering game:', error);
        return null;
      }
    },
    
    // Get all registered games
    getGames: function() {
      return Object.values(_registeredGames);
    },
    
    // Get a specific game by ID
    getGame: function(id) {
      return _registeredGames[id] || null;
    },
    
    // Launch a game by ID
    launchGame: function(id) {
      const game = this.getGame(id);
      if (!game) {
        console.error(`Game not found with ID: ${id}`);
        return false;
      }
      
      // Clean up any previous active game
      if (_activeGame) {
        _activeGame.destroy();
      }
      
      // Create new game instance
      _activeGame = game;
      game.playCount++;
      _trigger('gameLaunched', game);
      
      // Initialize the game
      game.create();
      
      return true;
    },
    
    // End the current active game
    endGame: function() {
      if (_activeGame) {
        _activeGame.destroy();
        _trigger('gameEnded', _activeGame);
        _activeGame = null;
        return true;
      }
      return false;
    },
    
    // Update high score for a game
    updateHighScore: function(gameId, score) {
      const game = this.getGame(gameId);
      if (game && score > game.highScore) {
        game.highScore = score;
        _trigger('highScoreUpdated', { gameId, score });
        
        // Store in localStorage for persistence
        this.saveGameStats();
        return true;
      }
      return false;
    },
    
    // Save game stats to localStorage
    saveGameStats: function() {
      const stats = {};
      Object.values(_registeredGames).forEach(game => {
        stats[game.id] = {
          playCount: game.playCount,
          highScore: game.highScore
        };
      });
      localStorage.setItem('gameStats', JSON.stringify(stats));
    },
    
    // Load game stats from localStorage
    loadGameStats: function() {
      try {
        const stats = JSON.parse(localStorage.getItem('gameStats'));
        if (stats) {
          Object.keys(stats).forEach(gameId => {
            if (_registeredGames[gameId]) {
              _registeredGames[gameId].playCount = stats[gameId].playCount || 0;
              _registeredGames[gameId].highScore = stats[gameId].highScore || 0;
            }
          });
        }
      } catch (error) {
        console.error('Error loading game stats:', error);
      }
    },
    
    // Event handling - public interface
    on: _on,
    trigger: _trigger
  };
})(); 