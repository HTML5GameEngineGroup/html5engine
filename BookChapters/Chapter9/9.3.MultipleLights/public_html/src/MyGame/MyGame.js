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
    
    this._mGlobalLightSet = null;
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
            vec2.fromValues(50, 33),   // position of the camera
            100,                       // width of camera
            [0, 0, 600, 400]           // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
        
    // the light
    this._InitializeLights();   // defined in MyGame_Lights.js
    
    // the Background
    var bgR = new DiffuseRenderable(this._kBg);
    bgR.SetTexPixelPositions(0, 1900, 0, 1000);
    bgR.GetXform().SetSize(380, 200);
    bgR.GetXform().SetPosition(50, 35);
    for (var i =0; i<4; i++)
        bgR.AddLight(this._mGlobalLightSet.GetLightAt(i));   // all the lights
    this._mBg = new GameObject(bgR);
     
    // 
    // the objects
    this._mHero = new Hero(this._kMinionSprite);
    this._mHero.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(0));   // hero light
    this._mHero.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(3));   // center light
        
    this._mLMinion = new Minion(this._kMinionSprite, 30, 30);
    this._mLMinion.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(1));   // LMinion light
    this._mLMinion.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(3));   // center light
        
    
    this._mRMinion = new Minion(this._kMinionSprite, 70, 30);
    this._mRMinion.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(1));   // LMinion light
    this._mRMinion.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(3));   // center light
            
    this._mMsg = new FontRenderable("Status Message");
    this._mMsg.SetColor([0, 0, 0, 1]);
    this._mMsg.GetXform().SetPosition(1, 2);
    this._mMsg.SetTextHeight(3);
};


MyGame.prototype.DrawCamera = function(camera) {
    
    // Step A: set up the View Projection matrix
    camera.SetupViewProjection();
                    
        // Step C: Now draws each primitive
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
    var msg = "";
    var deltaC = 0.01;
    
    this._mCamera.Update();  // to ensure proper interploated movement effects
    
    this._mLMinion.Update(); // ensure sprite animation
    this._mRMinion.Update();
    
    this._mHero.Update();  // allow keyboard control to move
        
    this._mCamera.PanWith(this._mHero.GetXform(), 0.8);

    /*
    if (gEngine.Input.IsButtonPressed(gEngine.Input.MouseButton.Left))
        this._mGlobalLightSet.Set2DPosition(this._mHero.GetXform().GetPosition());
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        var c = this._mGlobalLightSet.GetColor();
        for (var i = 0; i<4; i++)
            c[i] += deltaC;
    }
    */
    
    this._mMsg.SetText(msg);
};