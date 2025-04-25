# 🎮 Mini Arcade

A lightweight, browser-based arcade collection featuring classic games reimagined with modern web technologies. Built with Go on the backend and JavaScript on the frontend, this project demonstrates full-stack development skills with a focus on interactive game design.

![Mini Arcade Screenshot](https://github.com/user-attachments/assets/f5f47f54-bb54-412b-9206-edd5a32d0d2e)

## ✨ Features

- **Game Collection Dashboard**: A central hub to access all available games
- **Multiple Games**:
  - 🎈 **Balloon Pop**: Test your reflexes by popping colorful balloons before they disappear
  - 🃏 **Memory Match**: Challenge your memory by finding matching pairs of cards
- **Score Tracking**: Each game tracks high scores and play counts
- **Responsive Design**: Play on desktop or mobile devices
- **Smooth Animations**: Enhanced gameplay experience with fluid animations

## 🛠️ Technology Stack

- **Backend**:
  - Go (Golang) for the HTTP server
  - Standard library only (no external dependencies)
- **Frontend**:
  - Vanilla JavaScript (ES6+)
  - HTML5 & CSS3
  - [Anime.js](https://animejs.com/) for smooth animations
- **Architecture**:
  - RESTful API endpoints for game data
  - Modular JavaScript game engine
  - Component-based UI structure

## 🚀 Getting Started

### Prerequisites

- Go (version 1.16+)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/mini-arcade.git
   cd mini-arcade
   ```

2. Run the server

   ```bash
   go run main.go
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## 🎮 Game Descriptions

### Balloon Pop

A reflex-based game where colorful balloons appear on screen for a limited time. Click or tap them before they disappear to earn points. The game includes particle effects when balloons pop and features a ticking countdown timer.

### Memory Match

A classic memory game where you flip cards to find matching pairs. Select difficulty levels (easy, medium, hard) that change the number of cards and time limit. The game tracks your moves and time remaining to calculate your final score.

## 🧠 Game Engine Architecture

The project features a custom game engine written in JavaScript that provides:

- Game registration and lifecycle management
- Event system for communication between components
- Score and stats persistence using localStorage
- Standardized game interface for easy addition of new games

## 🤝 Contributing

Contributions are welcome! Here are ways you can contribute:

1. Add new games to the arcade
2. Improve existing game mechanics
3. Enhance the UI/UX
4. Fix bugs or optimize performance

## 🙏 Acknowledgements

- [Anime.js](https://animejs.com/) for the animation library
- Emoji graphics used in the Memory Match game
- All open source contributors whose work inspired this project
