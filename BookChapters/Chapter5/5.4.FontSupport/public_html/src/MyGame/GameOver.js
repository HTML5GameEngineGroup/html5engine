/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GameOver()
{           
    this._mCamera = null;
    this._mMsg = null;
};
gEngine.Core.InheritPrototype(GameOver, Scene);

GameOver.prototype.LoadScene = function() 
{
};

GameOver.prototype.UnloadScene = function() 
{  
    // will be called from GameLoop.Stop
    gEngine.Core.CleanUp(); // release gl resources
};

GameOver.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(50, 33),   // position of the camera
            100,                       // width of camera
            [0, 0, 600, 400]           // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.9, 0.9, 0.9, 1]);
            // sets the background to gray
    
    //<editor-fold desc="Create the fonts!">
    // this._mText = new FontRenderable("This is green text");
    this._mMsg = new FontRenderable("Game Over!");
    this._mMsg.SetColor([0, 0, 0, 1]);
    this._mMsg.GetXform().SetPosition(22, 32);
    this._mMsg.SetTextHeight(10); 
    //</editor-fold>
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
GameOver.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Step  B: Activate the drawing Camera
    this._mCamera.SetupViewProjection();
        this._mMsg.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
GameOver.prototype.Update = function()
{
    gEngine.GameLoop.Stop();
};