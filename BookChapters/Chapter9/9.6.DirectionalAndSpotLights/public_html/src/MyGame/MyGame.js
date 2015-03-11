/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{   
    this._kMinionSprite = "resources/minion_sprite.png";
    this._kMinionSpriteNormal = "resources/minion_sprite_normal.png";
    this._kBg = "resources/bg.png";
    this._kBgNormal = "resources/bg_normal.png";
    
    // The camera to view the rectangles
    this._mCamera = null;
    this._mBg = null;
    
    this._mMsg = null;
    this._mMatMsg = null;
    
    // the hero and the support objects
    this._mLgtHero = null;
    this._mIllumHero = null;
    
    this._mLgtMinion = null;
    this._mIllumMinion = null;
    
    this._mGlobalLightSet = null;

    this._mBlock1 = null;   // to verify swiitching between shaders is fine
    this._mBlock2 = null;
    
    this._mLgtIndex = 0;
    this._mLgtRotateTheta = 0;
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.LoadScene = function() 
{
   gEngine.Textures.LoadTexture(this._kMinionSprite);
   gEngine.Textures.LoadTexture(this._kBg);
   gEngine.Textures.LoadTexture(this._kBgNormal);
   gEngine.Textures.LoadTexture(this._kMinionSpriteNormal);
};

MyGame.prototype.UnloadScene = function() 
{  
    gEngine.Textures.UnloadTexture(this._kMinionSprite);
    gEngine.Textures.UnloadTexture(this._kBg);
    gEngine.Textures.UnloadTexture(this._kBgNormal);
    gEngine.Textures.UnloadTexture(this._kMinionSpriteNormal);
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
    // var bgR = new IllumRenderable(this._kBg, this._kBgNormal);
    var bgR = new LightRenderable(this._kBg, this._kBgNormal);
    bgR.SetTexPixelPositions(0, 1900, 0, 1000);
    // bgR.SetNormalMapPixelPositions(0, 1900, 0, 1000);
    bgR.GetXform().SetSize(380, 200);
    bgR.GetXform().SetPosition(50, 35);
    for (var i =0; i<4; i++)
        bgR.AddLight(this._mGlobalLightSet.GetLightAt(i));   // all the lights
    this._mBg = new GameObject(bgR);
     
    // 
    // the objects
    this._mIllumHero = new Hero(this._kMinionSprite, this._kMinionSpriteNormal, 15, 50, this._mGlobalLightSet);    
    this._mLgtHero = new Hero(this._kMinionSprite, null, 80 , 50, this._mGlobalLightSet);        
    this._mIllumMinion = new Minion(this._kMinionSprite, this._kMinionSpriteNormal,17, 15, this._mGlobalLightSet);    
    this._mLgtMinion = new Minion(this._kMinionSprite, null, 87, 15, this._mGlobalLightSet);
            
    this._mMsg = new FontRenderable("Status Message");
    this._mMsg.SetColor([1, 1, 1, 1]);
    this._mMsg.GetXform().SetPosition(1, 2);
    this._mMsg.SetTextHeight(3);
    
    this._mMatMsg = new FontRenderable("Status Message");
    this._mMatMsg.SetColor([1, 1, 1, 1]);
    this._mMatMsg.GetXform().SetPosition(1, 73);
    this._mMatMsg.SetTextHeight(3);
    
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
        this._mLgtMinion.Draw(camera);
        this._mIllumHero.Draw(camera);
        this._mBlock2.Draw(camera);        
        this._mLgtHero.Draw(camera);
        this._mIllumMinion.Draw(camera);
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
        this._mMatMsg.Draw(this._mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{    
    this._mCamera.Update();  // to ensure proper interploated movement effects
    
    this._mIllumMinion.Update(); // ensure sprite animation
    this._mLgtMinion.Update();
    
    this._mIllumHero.Update();  // allow keyboard control to move
           
    // control the selected light
    var msg = "L=" + this._mLgtIndex + " ";
    msg += this._LightControl();
    this._mMsg.SetText(msg);
    
    /*
    msg = this._SelectCharacter();
    msg += this._MaterialControl();
    this._mMatMsg.SetText(msg);
    */
};

MyGame.prototype._SelectCharacter = function() {
    // select which character to work with
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Four)) {
        this._mSlectedCh = this._mRingHero;
        this._mMaterialCh = this._mSlectedCh.GetRenderable().GetMaterial().GetDiffuse();
        this._mSelectedChMsg = "R:";
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Five)) {
        this._mSlectedCh = this._mLMinion;
        this._mMaterialCh = this._mSlectedCh.GetRenderable().GetMaterial().GetDiffuse();
        this._mSelectedChMsg = "L:";
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Six)) {
        this._mSlectedCh = this._mHero;
        this._mMaterialCh = this._mSlectedCh.GetRenderable().GetMaterial().GetDiffuse();
        this._mSelectedChMsg = "H:";
    }
    return this._mSelectedChMsg;
};
