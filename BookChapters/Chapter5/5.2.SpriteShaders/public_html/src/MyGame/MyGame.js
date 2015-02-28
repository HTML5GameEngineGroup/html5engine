/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{               
    // textures: 
    this._kFontImage = "resources/Consolas-72.png";
    this._kMinionSprite = "resources/minion_sprite.png";  // Portal and Collector are embbeded here
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mPortal = null;
    this._mCollector = null;
    this._mFontImage = null;
    this._mMinion = null;
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.LoadScene = function() 
{
   // loads the textures
   gEngine.Textures.LoadTexture(this._kFontImage);
   gEngine.Textures.LoadTexture(this._kMinionSprite);

};

MyGame.prototype.UnloadScene = function() 
{  
    gEngine.Textures.UnloadTexture(this._kFontImage);
    gEngine.Textures.UnloadTexture(this._kMinionSprite);
};

MyGame.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    // Step B: Create the support objects
    this._mPortal = new SpriteRenderable(this._kMinionSprite);
    this._mPortal.SetColor([1, 0, 0, 0.2]);  // tints red
    this._mPortal.GetXform().SetPosition(25, 60);
    this._mPortal.GetXform().SetSize(3, 3);
    this._mPortal.SetTexPixelPositions(130, 310, 0, 180);
    
    this._mCollector = new SpriteRenderable(this._kMinionSprite);
    this._mCollector.SetColor([0, 0, 0, 0]);  // No tinting
    this._mCollector.GetXform().SetPosition(15, 60);
    this._mCollector.GetXform().SetSize(3, 3);
    this._mCollector.SetTexPixelPositions(315, 495, 0, 180);
    
    // Step C: Create the font and minion images using sprite
    this._mFontImage = new SpriteRenderable(this._kFontImage);
    this._mFontImage.SetColor([1, 1, 1, 0]);
    this._mFontImage.GetXform().SetPosition(13, 62);
    this._mFontImage.GetXform().SetSize(4, 4);
    
    this._mMinion= new SpriteRenderable(this._kMinionSprite);
    this._mMinion.SetColor([1, 1, 1, 0]);
    this._mMinion.GetXform().SetPosition(26, 56);
    this._mMinion.GetXform().SetSize(5, 2.5);
    
    // Setp D: Create the hero object with texture from lower-left corner of 
    this._mHero = new SpriteRenderable(this._kMinionSprite);
    this._mHero.SetColor([1, 1, 1, 0]);
    this._mHero.GetXform().SetPosition(20, 60);
    this._mHero.GetXform().SetSize(2, 3);
    this._mHero.SetTexPixelPositions(0, 120, 0, 180);
    
    // now start the bg music ...
    gEngine.AudioClips.PlayBackgroundAudio(this._kBgClip);
    
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
        this._mPortal.Draw(this._mCamera.GetVPMatrix());
        this._mCollector.Draw(this._mCamera.GetVPMatrix());
        this._mHero.Draw(this._mCamera.GetVPMatrix());
        this._mFontImage.Draw(this._mCamera.GetVPMatrix());
        this._mMinion.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    // For this very simple, let's only allow the movement of hero, 
    // and if hero moves too far off, this level ends, we will
    // load the next level
    var deltaX = 0.05;
    var xform = this._mHero.GetXform();
    
    // Support hero movements
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        xform.IncXPosBy(deltaX);
        if (xform.GetXPos() > 30)  // this is the right-bound of the window
            xform.SetPosition(12, 60);
    }
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        xform.IncXPosBy(-deltaX);
        if (xform.GetXPos() < 11) {  // this is the left-bound of the window
            xform.SetXPos(20);
        }
    }
    
    // continously change texture tinting
    var c = this._mPortal.GetColor();
    var ca = c[3] + deltaX;
    if (ca > 1) ca = 0;
    c[3] = ca;
    
    
    // New update code for changing the sub-texture regions being shown"
    var deltaT = 0.001;
    
    // <editor-fold desc="The font image:">
    // zoom into the texture by updating texture coordinate
    // For font: zoom to the upper left corner by changing bottom right
    var texCoord = this._mFontImage.GetTexCoordinateArray();
            // The 8 elements:
            //      _mTexRight,  _mTexTop,          // x,y of top-right
            //      _mTexLeft,   _mTexTop,
            //      _mTexRight,  _mTexBottom,
            //      _mTexLeft,   _mTexBottom
   var b = texCoord[SpriteRenderable.eTexCoordArray.eBottom] + deltaT;
   var r = texCoord[SpriteRenderable.eTexCoordArray.eRight] - deltaT;
   if (b > 1.0)  b = 0;
   if (r < 0)   r = 1.0;
   this._mFontImage.SetTexCoordinate(
           texCoord[SpriteRenderable.eTexCoordArray.eLeft], r,
           b, texCoord[SpriteRenderable.eTexCoordArray.eTop]);
    // </editor-fold>
           
    // <editor-fold desc="The minion image:">
    // For minion: zoom to the bottom right corner by changing top left
    var texCoord = this._mMinion.GetTexCoordinateArray();
            // The 8 elements:
            //      _mTexRight,  _mTexTop,          // x,y of top-right
            //      _mTexLeft,   _mTexTop,
            //      _mTexRight,  _mTexBottom,
            //      _mTexLeft,   _mTexBottom
    var t = texCoord[SpriteRenderable.eTexCoordArray.eTop] - deltaT;
    var l = texCoord[SpriteRenderable.eTexCoordArray.eLeft] + deltaT;
   
    if (l > 0.5) l = 0;
    if (t < 0.5) t = 1.0;
   
    this._mMinion.SetTexCoordinate(
           l, texCoord[SpriteRenderable.eTexCoordArray.eRight],
           texCoord[SpriteRenderable.eTexCoordArray.eBottom], t);
    // </editor-fold>
};