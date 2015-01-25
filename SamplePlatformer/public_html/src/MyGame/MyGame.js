/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    
    // Initialize the webGL Context
    gEngine.Core.InitializeEngineCore(htmlCanvasID);
   
    gMyGame.GameState.Initialize();
   
    // start game loop going
    gEngine.GameLoop.Start(this);
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.Update = function()
{   
    // now start the game loop with BeginLevel
    // var beginLevel = new BeginLevel();
    // this.LoadNextScene(beginLevel);
    
    this.LoadNextScene( new LevelOne() );
};

MyGame.prototype.Initialize = function() {
    
};


MyGame.prototype.LoadContent = function() {
};

MyGame.prototype.UnloadContent = function() {
    // NOT unloading the bg because it is going
    // to run throughout!
};
