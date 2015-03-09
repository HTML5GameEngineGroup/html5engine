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

    this._mBlock1 = null;   // to verify swiitching between shaders is fine
    this._mBlock2 = null;
    
    this._mLgtIndex = 0;    // the light to move
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
    // Uncomment the following to see how light affects Dye
    //      this._mHero.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(1)); 
    //      this._mHero.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(2)); 
        
    this._mLMinion = new Minion(this._kMinionSprite, 30, 30);
    this._mLMinion.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(1));   // LMinion light
    this._mLMinion.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(3));   // center light
        
    
    this._mRMinion = new Minion(this._kMinionSprite, 70, 30);
    this._mRMinion.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(2));   // RMinion light
    this._mRMinion.GetRenderable().AddLight(this._mGlobalLightSet.GetLightAt(3));   // center light
            
    this._mMsg = new FontRenderable("Status Message");
    this._mMsg.SetColor([1, 1, 1, 1]);
    this._mMsg.GetXform().SetPosition(1, 2);
    this._mMsg.SetTextHeight(3);
    
    this._mBlock1 = new Renderable();
    this._mBlock1.SetColor([1, 0, 0, 1]);
    this._mBlock1.GetXform().SetSize(5, 5);
    this._mBlock1.GetXform().SetPosition(30, 50);
    
    this._mBlock2 = new Renderable();
    this._mBlock2.SetColor([0, 1, 0, 1]);
    this._mBlock2.GetXform().SetSize(5, 5);
    this._mBlock2.GetXform().SetPosition(70, 50);

};


MyGame.prototype.DrawCamera = function(camera) {
    
    // Step A: set up the View Projection matrix
    camera.SetupViewProjection();
        // Step C: Now draws each primitive
        this._mBg.Draw(camera);
        this._mBlock1.Draw(camera);
        this._mLMinion.Draw(camera);    
        this._mBlock2.Draw(camera);        
        this._mHero.Draw(camera);
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
    var msg = "Selected Light=" + this._mLgtIndex + " ";
    
    this._mCamera.Update();  // to ensure proper interploated movement effects
    
    this._mLMinion.Update(); // ensure sprite animation
    this._mRMinion.Update();
    
    this._mHero.Update();  // allow keyboard control to move
        
    // control the selected light
    msg += this._LightControl();
    
    this._mMsg.SetText(msg);
};