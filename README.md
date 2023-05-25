## TCG Central

### Summary
TCG Central is a web application that allows users to create and play their own custom trading card games. Users can create games with personalized rules, customize cards and decks, and share their creations with others. The app utilizes the Phaser game engine for online gameplay. It provides a user-friendly interface, game building tools, and a portal to access and play publicly available trading card games. The project incorporates React.js for the front-end website, Express.js for the back-end REST API, Firebase's Firestore for the database, and Phaser 3 for the game engine.

### Table of Contents
1. [Introduction](#introduction)
2. [Project Functionality - A User’s Perspective](#project-functionality---a-users-perspective)
3. [Technologies Used](#technologies-used)
4. [Conclusion](#conclusion)
5. [Installation](#installation)

### Introduction
TCG Central is an online trading card game maker app that allows users to create, customize, and play their own trading card games. The goal of the application is to provide an easy-to-use platform for users to build a variety of gaming experiences within a broad card game framework. Inspired by popular games like Slay the Spire, Monster Train, and Hearthstone, TCG Central focuses on solitaire battlefield gameplay, where users can create and share challenges with custom decks and enemies. The project is divided into three main parts: a front-end website for game creation, a back-end service for game management, and a play portal for users to enjoy the games they have created.

### Project Functionality - A User’s Perspective
Users can visit the TCG Central website to log in or create a new account. The TCG Portal allows users to view publicly available trading card games. To play a game, users can select a game from the portal, choose a character, deck size, and game difficulty, and then start playing in the Phaser game instance.

To create a TCG, users need to log in and access their user profile. From there, they can create a game using the Game Builder interface. The game customization options include setting the title, description, cover image, game characters, and rules such as deck size, starting hand, player health, and resources. Once satisfied, users can save the game data to the backend.

After saving a game, users can create custom cards for their game. The Card Editing interface allows users to specify the card's title, type, stats, cost, image, effects, and availability options. The created cards are stored in the backend, and users can view them in the card list.

Similarly, users can create enemies for their game using the Game Builder interface. They can customize enemy attributes such as level, information, effects, background color, and image.

When users choose to play a TCG, they will be redirected to a game setup page to choose their character, deck size, and game difficulty. Then, they will enter the Phaser game engine, where a random enemy encounter will be generated based on the chosen difficulty. The game begins with card dealing and gameplay.

### Technologies Used
#### Front-end website:
- React.js

#### Back-end REST API:
- Express.js

#### Back-end database:
- Firebase's Firestore (for REST API)
- Firebase's Storage (for image storage)

#### Game engine:
- Phaser 3 (HTML5 web framework)
- Express.js (server for client-server communication)
- JavaScript

### Conclusion
TCG Central provides a user-friendly platform for creating and customizing trading card games. The TCG Portal allows access to publicly available games, while the Game Builder interface enables users to create games with customized rules, characters, and cards. The Phaser game engine provides an immersive environment for playing the created games. The project was a result of strong teamwork, and future plans include refining the game, deploying a public version, and converting it into an open-source project with additional features like card collecting mechanics, multiplayer functionality, and advanced game customization.

### Installation
To deploy the frontend, backend, and Phaser engine locally, clone the respective repositories and run the following commands in the command line:

- Frontend:
```
npm init
npm install
npm start
```

- Backend:
```
npm init
npm install
npm start
```

- Phaser game:
```
npm install
npm start
```

Note that the backend is designed to work with Firebase and may not run locally as intended. It is recommended to follow the provided instructions within a Google Cloud console with an initialized Firebase. Detailed instructions on exploring and testing various functionalities will be available.