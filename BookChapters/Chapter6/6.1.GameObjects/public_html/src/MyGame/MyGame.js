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
    
    // For echo message
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
            vec2.fromValues(50, 37.5),   // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
      
    // Step B: The dye pack: simple another GameObject
    this._mDyePack= new DyePack(this._kMinionSprite);
    
    // Step C: A set of Minions
    this._mMinionSet = new GameObjectSet();
    // create 5 minions at random Y values
    for (var i = 0; i< 5; i++) {
        var randomY = Math.random() * 65;
        var aMinion = new Minion(this._kMinionSprite, randomY);
        this._mMinionSet.AddToSet(aMinion);
    }
        
    // Setp D: Create the hero object
    this._mHero = new Hero(this._kMinionSprite);
    
    // Step E: Create and initialize message output
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
        this._mMinionSet.Draw(this._mCamera);
        this._mDyePack.Draw(this._mCamera);
        this._mMsg.Draw(this._mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    this._mHero.Update();
    this._mMinionSet.Update();
    this._mDyePack.Update();
};