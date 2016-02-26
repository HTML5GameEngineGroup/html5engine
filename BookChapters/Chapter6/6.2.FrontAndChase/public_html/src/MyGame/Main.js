/*
 * File:   Main.js
 * Ack: The following entry point into the game is different from those described in the book. 
 *      Thanks to Terry Rogers (from CSS490, Fall 2015) for showing us this.
 */

// Execute when the DOM is ready to be manipulated.
$(document).ready(function() {
  // Create the game.
    var game = new MyGame('GLCanvas');
    gEngine.Core.initializeEngineCore('GLCanvas', game);
});