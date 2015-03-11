/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{   
    this._kMinionSprite = "resources/minion_sprite.png";
    // The camera to view the rectangles
    this._mCamera = null;
    
    // For echo message
    this._mMsg = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mBrain = null;
    
    // mode of running: 
    //   H: Player drive brain
    //   J: Dye drive brain, immediate orientation change
    //   K: Dye drive brain, gradual orientation change
    this._mMode = 'H';
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.LoadScene = function() 
{
   gEngine.Textures.LoadTexture(this._kMinionSprite);
};

MyGame.prototype.UnloadScene = function() 
{  
    gEngine.Textures.UnloadTexture(this._kMinionSprite);
};

MyGame.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(50, 37.5),   // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
      
    // Create the brain  
    this._mBrain = new Brain(this._kMinionSprite);
        
    
    //  Create the hero object 
    this._mHero = new Hero(this._kMinionSprite);
        
    // For echoing
    this._mMsg = new FontRenderable("Status Message");
    this._mMsg.SetColor([0, 0, 0, 1]);
    this._mMsg.GetXform().SetPosition(1, 2);
    this._mMsg.SetTextHeight(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Step  B: Activate the drawing Camera
    this._mCamera.SetupViewProjection();
    
        // Step  C: Draw everything
        this._mHero.Draw(this._mCamera);
        this._mBrain.Draw(this._mCamera);
        this._mMsg.Draw(this._mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    var msg = "Brain modes [H:keys, J:immidiate, K:gradual]: ";
    var rate = 1;
    
    this._mHero.Update();   
    
    switch (this._mMode) {
        case 'H':
            this._mBrain.Update();  // player drive with arrow keys
            break;
        case 'K':
            rate = 0.02;    // graduate rate
        case 'J':
                this._mBrain.RotateObjPointTo(this._mHero.GetXform().GetPosition(), rate);
                GameObject.prototype.Update.call(this._mBrain);  // the default GameObject: only move forward
            break;
    }
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.H))
        this._mMode = 'H';
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.J))
        this._mMode = 'J';
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.K))
        this._mMode = 'K';
    this._mMsg.SetText(msg + this._mMode);
};