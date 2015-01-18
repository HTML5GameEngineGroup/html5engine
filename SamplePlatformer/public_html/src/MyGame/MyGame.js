/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // audio clips to be loaded
    this._kBgAudio = "resources/sounds/Mind_Meld.mp3";
    
    // Initialize the webGL Context
    gEngine.Core.InitializeEngineCore(htmlCanvasID);
   
    // start game loop going
    gEngine.GameLoop.Start(this);
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.Update = function()
{
    // starts the background audio playing
    // this can only be called after GameLoop started:
    // when we know all resource loading is done
    if (!gEngine.AudioClips.IsBackgroundAudioPlaying())
        gEngine.AudioClips.PlayBackgroundAudio(this._kBgAudio);
        
    // now start the game loop with BeginLevel
    // var beginLevel = new BeginLevel();
    // this.LoadNextScene(beginLevel);
    
    this.LoadNextScene( new BoundCheck() );
};

MyGame.prototype.Initialize = function() {
    // nothing here
};


MyGame.prototype.LoadContent = function() {
     // load audio clips
    gEngine.AudioClips.LoadAudio(this._kBgAudio);
};

MyGame.prototype.UnloadContent = function() {
    // NOT unloading the bg because it is going
    // to run throughout!
};
