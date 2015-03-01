/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{   
    this._kMinionSprite = "Resources/minion_sprite.png";
    this._kMinionCollector = "Resources/minion_collector.png";
    this._kMinionPortal = "Resources/minion_portal.png";
    // The camera to view the rectangles
    this._mCamera = null;
    
    this._mMsg = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mBrain = null;
    this._mDyePack = null;
    
    this._mCollector = null;
    this._mPortal = null;
    
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
   gEngine.Textures.LoadTexture(this._kMinionCollector);
   gEngine.Textures.LoadTexture(this._kMinionPortal);
};

MyGame.prototype.UnloadScene = function() 
{  
    gEngine.Textures.UnloadTexture(this._kMinionSprite);
    gEngine.Textures.UnloadTexture(this._kMinionCollector);
    gEngine.Textures.UnloadTexture(this._kMinionPortal);
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
    
    this._mDyePack = new DyePack(this._kMinionSprite);
    this._mDyePack.SetVisibility(false);
    
    
    this._mCollector = new Generic(this._kMinionCollector, 70, 30, 30, 30);
    this._mPortal = new Generic(this._kMinionPortal, 50, 30, 10, 10);
        
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
        //this._mHero.Draw(this._mCamera.GetVPMatrix());
        //this._mBrain.Draw(this._mCamera.GetVPMatrix());
        this._mPortal.Draw(this._mCamera.GetVPMatrix());
        this._mCollector.Draw(this._mCamera.GetVPMatrix());
        this._mDyePack.Draw(this._mCamera.GetVPMatrix());
        this._mMsg.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    var msg = "No Collision";
    
    this._mCollector.Update(
            gEngine.Input.Keys.W, gEngine.Input.Keys.S,
            gEngine.Input.Keys.A, gEngine.Input.Keys.D, gEngine.Input.Keys.E);
    this._mPortal.Update(
            gEngine.Input.Keys.Up, gEngine.Input.Keys.Down,
            gEngine.Input.Keys.Left, gEngine.Input.Keys.Right, gEngine.Input.Keys.P);

    var h = [];
    
    // Portal's resultion is 1/16 that of Collector!
    // if (this._mCollector.PixelTouches(this._mPortal, h)) {  // <-- VERY EXPENSIVE!!
    if (this._mPortal.PixelTouches(this._mCollector, h)) {
        msg = "Collided!: (" + h[0].toPrecision(4) + " " + h[1].toPrecision(4) + ")";
        this._mDyePack.SetVisibility(true);
        this._mDyePack.GetXform().SetXPos(h[0]);
        this._mDyePack.GetXform().SetYPos(h[1]);
    } else 
        this._mDyePack.SetVisibility(false);
    this._mMsg.SetText(msg);
};