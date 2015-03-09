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
    this._mHeroCam = null;
    this._mBrainCam = null;
    this._mBg = null;
    
    this._mMsg = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mBrain = null;
    this._mPortal = null;
    this._mLMinion = null;
    this._mRMinion = null;
    this._mFocusObj = null;
    
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
            vec2.fromValues(50, 26.6), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 340]           // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
            
    this._mHeroCam = new Camera(
            vec2.fromValues(50, 30),    // will be updated at each cycle to point to hero
            20,
            [0, 350, 150, 150]
            );
    this._mBrainCam = new Camera(
            vec2.fromValues(50, 30),    // will be updated at each cycle to point to the brain
            10,
            [500, 350, 150, 150]
            );
    this._mBrainCam.ConfigInterpolation(0.7, 10);
    // Large background image
    var bgR = new SpriteRenderable(this._kBg);
    bgR.SetTexPixelPositions(0, 1900, 0, 1000);
    bgR.GetXform().SetSize(380, 200);
    bgR.GetXform().SetPosition(50, 35);
    this._mBg = new GameObject(bgR);
      
    // Objects in the scene
    this._mBrain = new Brain(this._kMinionSprite);        
    this._mHero = new Hero(this._kMinionSprite);
    this._mPortal = new TextureObject(this._kMinionPortal, 50, 30, 10, 10);
    this._mLMinion = new Minion(this._kMinionSprite, 30, 30);
    this._mRMinion = new Minion(this._kMinionSprite, 70, 30);
    this._mFocusObj = this._mHero;
        
    this._mMsg = new FontRenderable("Status Message");
    this._mMsg.SetColor([1, 1, 1, 1]);
    this._mMsg.GetXform().SetPosition(1, 2);
    this._mMsg.SetTextHeight(3);
};


MyGame.prototype.DrawCamera = function(camera) {
    camera.SetupViewProjection();
        this._mBg.Draw(camera);
        this._mHero.Draw(camera);
        this._mBrain.Draw(camera);
        this._mPortal.Draw(camera);
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
    this.DrawCamera(this._mHeroCam);
    this.DrawCamera(this._mBrainCam);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    var zoomDelta = 0.05;
    var msg = "L/R: Left or Right Minion; H: Dye; P: Portal]: ";
    
    this._mCamera.Update();  // for delay camera movements
    this._mHeroCam.Update();
    this._mBrainCam.Update();
    
    this._mLMinion.Update();  // for sprite animation
    this._mRMinion.Update();
    
    this._mHero.Update();     // for WASD movement
    this._mPortal.Update(     // for arrow movement
            gEngine.Input.Keys.Up, gEngine.Input.Keys.Down,
            gEngine.Input.Keys.Left, gEngine.Input.Keys.Right, gEngine.Input.Keys.P);  
            
    // Brain chasing the hero
    var h = [];
    if (!this._mHero.PixelTouches(this._mBrain, h)) {
        this._mBrain.RotateObjPointTo(this._mHero.GetXform().GetPosition(), 0.01);
        GameObject.prototype.Update.call(this._mBrain);
    } 
    
    // Pan camera to object
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.L)) {
        this._mFocusObj = this._mLMinion;
        this._mChoice = 'L';
        this._mCamera.PanTo(this._mLMinion.GetXform().GetXPos(), this._mLMinion.GetXform().GetYPos());
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.R)) {
        this._mFocusObj = this._mRMinion;
        this._mChoice = 'R';
        this._mCamera.PanTo(this._mRMinion.GetXform().GetXPos(), this._mRMinion.GetXform().GetYPos());
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.P)) {
        this._mFocusObj = this._mPortal;
        this._mChoice = 'P';
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.H)) {
        this._mFocusObj = this._mHero;
        this._mChoice = 'H';
    }
    
    // zoom
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.N))
        this._mCamera.ZoomBy(1-zoomDelta);
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.M))
        this._mCamera.ZoomBy(1+zoomDelta);
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.J))
        this._mCamera.ZoomTowards(this._mFocusObj.GetXform().GetPosition(), 1-zoomDelta);
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.K))
        this._mCamera.ZoomTowards(this._mFocusObj.GetXform().GetPosition(), 1+zoomDelta);

    // interaction with the WC bound
    this._mCamera.ClampAtBoundary(this._mBrain.GetXform(), 0.9);
    this._mCamera.ClampAtBoundary(this._mPortal.GetXform(), 0.8);
    this._mCamera.PanWith(this._mHero.GetXform(), 0.9);

    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Q))
        this._mCamera.Shake(-2, -2, 20, 30);

    // Set the hero and brain cams    
    this._mHeroCam.PanTo(this._mHero.GetXform().GetXPos(), this._mHero.GetXform().GetYPos());
    this._mBrainCam.PanTo(this._mBrain.GetXform().GetXPos(), this._mBrain.GetXform().GetYPos());
    
    
    // Move the hero cam viewport just to show we can
    var v = this._mHeroCam.GetViewport();
    v[0] += 1;
    if (v[0] > 500)
        v[0] = 0;
    
    this._mMsg.SetText(msg + this._mChoice);
};