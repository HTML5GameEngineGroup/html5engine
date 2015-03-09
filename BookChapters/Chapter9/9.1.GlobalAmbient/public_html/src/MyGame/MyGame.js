/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{   
    this._kMinionSprite = "resources/minion_sprite.png";
    this._kBg = "resources/bg.png";
    
    // The camera to view the rectangles
    this._mCamera = null;
    this._mBg = null;
    
    this._mMsg = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mLMinion = null;
    this._mRMinion = null;
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.LoadScene = function() 
{
   gEngine.Textures.LoadTexture(this._kMinionSprite);
   gEngine.Textures.LoadTexture(this._kBg);
};

MyGame.prototype.UnloadScene = function() 
{  
    gEngine.Textures.UnloadTexture(this._kMinionSprite);
    gEngine.Textures.UnloadTexture(this._kBg);
};

MyGame.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    var bgR = new SpriteRenderable(this._kBg);
    bgR.SetTexPixelPositions(0, 1900, 0, 1000);
    bgR.GetXform().SetSize(190, 100);
    bgR.GetXform().SetPosition(50, 35);
    this._mBg = new GameObject(bgR);
      
    // Setp D: Create the hero object with texture from lower-left corner of 
    this._mHero = new Hero(this._kMinionSprite);
        
    this._mLMinion = new Minion(this._kMinionSprite, 30, 30);
    this._mRMinion = new Minion(this._kMinionSprite, 70, 30);
        
    this._mMsg = new FontRenderable("Status Message");
    this._mMsg.SetColor([1, 1, 1, 1]);
    this._mMsg.GetXform().SetPosition(1, 2);
    this._mMsg.SetTextHeight(3);
};


MyGame.prototype.DrawCamera = function(camera) {
    camera.SetupViewProjection();
        this._mBg.Draw(camera);
        this._mHero.Draw(camera);
        this._mLMinion.Draw(camera);
        this._mRMinion.Draw(camera);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Step  B: Draw with all three cameras
    this.DrawCamera(this._mCamera);
        this._mMsg.Draw(this._mCamera);   // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    var deltaAmbient = 0.01;
    var msg = "Current Ambient]: ";
    
    this._mCamera.Update();  // to ensure proper interploated movement effects
    
    this._mLMinion.Update(); // ensure sprite animation
    this._mRMinion.Update();
    
    this._mHero.Update();  // allow keyboard control to move
        
    this._mCamera.PanWith(this._mHero.GetXform(), 0.8);
    
    var v = gEngine.DefaultResources.GetGlobalAmbientColor();
    if (gEngine.Input.IsButtonPressed(gEngine.Input.MouseButton.Left)) {
        v[0] += deltaAmbient;
    }
    
    if (gEngine.Input.IsButtonPressed(gEngine.Input.MouseButton.Middle)) {
        v[0] -= deltaAmbient;
    }
    
    msg += " red=" + v[0].toPrecision(3);
    this._mMsg.SetText(msg);
};