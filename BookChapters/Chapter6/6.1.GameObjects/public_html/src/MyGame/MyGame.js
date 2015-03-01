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
    this._mMinionSet = null;
    this._mDyePack = null;
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
      
    // The right minion
    this._mDyePack= new DyePack(this._kMinionSprite);
    
    this._mMinionSet = new GameObjectSet();
    // create 5 minions at random Y values
    for (var i = 0; i< 5; i++) {
        var randomY = Math.random() * 65;
        var aMinion = new Minion(this._kMinionSprite, randomY);
        this._mMinionSet.AddToSet(aMinion);
    }
        
    
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
        this._mMinionSet.Draw(this._mCamera.GetVPMatrix());
        this._mDyePack.Draw(this._mCamera.GetVPMatrix());
        this._mMsg.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    this._mHero.Update();
    this._mMinionSet.Update();
    this._mDyePack.Update();
};