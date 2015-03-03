/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{   
    this._kMinionSprite = "resources/minion_sprite.png";
    this._kMinionPortal = "resources/minion_portal.png";
    this._kBg = "resources/bg.png";
    
    // The camera to view the rectangles
    this._mCamera = null;
    this._mBg = null;
    
    this._mMsg = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mBrain = null;
    this._mDyePack = null;
    this._mDyeHit = null;
    
    this._mPortal = null;
    this._mLMinion = null;
    this._mRMinion = null;
    
    this._mCollide = null;
    this._mChoice = 'D';
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.LoadScene = function() 
{
   gEngine.Textures.LoadTexture(this._kMinionSprite);
   gEngine.Textures.LoadTexture(this._kMinionPortal);
   gEngine.Textures.LoadTexture(this._kBg);
};

MyGame.prototype.UnloadScene = function() 
{  
    gEngine.Textures.UnloadTexture(this._kMinionSprite);
    gEngine.Textures.UnloadTexture(this._kMinionPortal);
    gEngine.Textures.UnloadTexture(this._kBg);
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
    var bgR = new SpriteRenderable(this._kBg);
    bgR.SetTexPixelPositions(0, 1900, 0, 1000);
    bgR.GetXform().SetSize(380, 200);
    bgR.GetXform().SetPosition(50, 35);
    this._mBg = new GameObject(bgR);
      
    this._mBrain = new Brain(this._kMinionSprite);        
    
    // Setp D: Create the hero object with texture from lower-left corner of 
    this._mHero = new Hero(this._kMinionSprite);
    
    this._mDyePack = new DyePack(this._kMinionSprite);
    this._mDyePack.SetVisibility(false);
    this._mDyeHit = new DyePack(this._kMinionSprite);
    this._mDyeHit.SetVisibility(false);
    
    this._mPortal = new Generic(this._kMinionPortal, 50, 30, 10, 10);
    
    this._mLMinion = new Minion(this._kMinionSprite, 30, 30);
    this._mRMinion = new Minion(this._kMinionSprite, 70, 30);
        
    this._mMsg = new FontRenderable("Status Message");
    this._mMsg.SetColor([1, 1, 1, 1]);
    this._mMsg.GetXform().SetPosition(1, 2);
    this._mMsg.SetTextHeight(3);
    
    this._mCollide = this._mHero;
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
        this._mBg.Draw(this._mCamera);
        this._mHero.Draw(this._mCamera);
        this._mBrain.Draw(this._mCamera);
        this._mPortal.Draw(this._mCamera);
        this._mLMinion.Draw(this._mCamera);
        this._mRMinion.Draw(this._mCamera);
        this._mDyePack.Draw(this._mCamera);
        this._mDyeHit.Draw(this._mCamera);
        this._mMsg.Draw(this._mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    var zoomDelta = 0.05;
    var msg = "L/R: Left or Right Minion; H: Dye; P: Portal]: ";
    
    this._mCamera.Update();
    
    this._mLMinion.Update();
    this._mRMinion.Update();
    
    this._mHero.Update();
    
    this._mPortal.Update(
            gEngine.Input.Keys.Up, gEngine.Input.Keys.Down,
            gEngine.Input.Keys.Left, gEngine.Input.Keys.Right, gEngine.Input.Keys.P);
    
    var h = [];   
    
    if (!this._mHero.PixelTouches(this._mBrain, h)) {
        this._mBrain.RotateObjPointTo(this._mHero.GetXform().GetPosition(), 0.01);
        GameObject.prototype.Update.call(this._mBrain);
        this._mDyeHit.SetVisibility(false);
    } else {
        this._mDyeHit.SetVisibility(true);
        this._mDyeHit.GetXform().SetPosition(h[0], h[1]);
    }
    
    
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.L)) {
        this._mCollide = this._mLMinion;
        this._mChoice = 'L';
        this._mCamera.PanTo(this._mLMinion.GetXform().GetXPos(), this._mLMinion.GetXform().GetYPos());
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.R)) {
        this._mCollide = this._mRMinion;
        this._mChoice = 'R';
        this._mCamera.PanTo(this._mRMinion.GetXform().GetXPos(), this._mRMinion.GetXform().GetYPos());
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.P)) {
        this._mCollide = this._mPortal;
        this._mChoice = 'P';
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.H)) {
        this._mCollide = this._mHero;
        this._mChoice = 'H';
    }
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.N))
        this._mCamera.ZoomBy(1-zoomDelta);
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.M))
        this._mCamera.ZoomBy(1+zoomDelta);
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.J))
        this._mCamera.ZoomTowards(this._mCollide.GetXform().GetPosition(), 1-zoomDelta);
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.K))
        this._mCamera.ZoomTowards(this._mCollide.GetXform().GetPosition(), 1+zoomDelta);
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Q))
        this._mCamera.Shake(-2, -2, 20, 30);
    
    this._mCamera.ClampAtBoundary(this._mBrain.GetXform(), 0.9);
    this._mCamera.ClampAtBoundary(this._mPortal.GetXform(), 0.8);
    
    this._mCamera.PanWith(this._mHero.GetXform(), 0.8);
    
    this._mMsg.SetText(msg + this._mChoice);
};