/*
 * File:   main.js
 * Author: Terry Rogers
 * Date:   10/15/2015
 * This is the main entry point for the game.
 */

// Execute when the DOM is ready to be manipulated.
$(document).ready(function() {
  // Create the game.
  var game = new AdventuresOfDye();
  gEngine.Core.initializeEngineCore('GLCanvas', game);
});
    