/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{   
    this._kMinionSprite = "Resources/minion_sprite.png";
    // The camera to view the rectangles
    this._mCamera = null;
    
    this._mMsg = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mBrain = null;
    
    // mode of running: 
    //   H: Player drive brain
    //   J: Dye drive brain, immediate orientation change
    //   K: Dye drive brain, gradual orientation change
    this._mMode = 'h';
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
            vec2.fromValues(50, 33),   // position of the camera
            100,                       // width of camera
            [0, 0, 600, 400]           // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
      
    this._mBrain = new Brain(this._kMinionSprite);
        
    
    // Setp D: Create the hero object with texture from lower-left corner of 
    this._mHero = new Hero(this._kMinionSprite);
        
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
        this._mHero.Draw(this._mCamera.GetVPMatrix());
        this._mBrain.Draw(this._mCamera.GetVPMatrix());
        this._mMsg.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    var msg = "Modes [h: drive, j:dye imm, k:dye gradual]:  ";
    var rate = 1;
    
    this._mHero.Update();   
    
    var heroBBox = this._mHero.GetBBox();
    switch (this._mMode) {
        case 'h':
            this._mBrain.Update();
            break;
        case 'k':
            rate = 0.02;
        case 'j':
            if (!heroBBox.IntersectsBound(this._mBrain.GetBBox())) {
                this._mBrain.RotateObjPointTo(this._mHero.GetXform().GetPosition(), rate);
                GameObject.prototype.Update.call(this._mBrain);
            }
            break;
    }
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.H))
        this._mMode = 'h';
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.J))
        this._mMode = 'j';
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.K))
        this._mMode = 'k';
    this._mMsg.SetText(msg + this._mMode);
};