/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{           
    // textures: 
    this._kFontImage = "resources/Consolas-72.png";
    this._kMinionSprite = "resources/minion_sprite.png";
    
    // the fonts
    this._kFontCon16 = "resources/fonts/Consolas-16";  // notice font names do not need extensions!
    this._kFontCon24 = "resources/fonts/Consolas-24";   
    this._kFontCon32 = "resources/fonts/Consolas-32";  // this is also the default system font
    this._kFontCon72 = "resources/fonts/Consolas-72";  
    this._kFontSeg96 = "resources/fonts/Segment7-96";
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mFontImage = null;
    this._mMinion = null;
    
    this._mTextSysFont = null;
    this._mTextCon16 = null;
    this._mTextCon24 = null;
    this._mTextCon32 = null;
    this._mTextCon72 = null;
    this._mTextSeg96 = null;
    
    this._mTextToWork = null;
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.LoadScene = function() 
{
   // Step A: loads the textures
   gEngine.Textures.LoadTexture(this._kFontImage);
   gEngine.Textures.LoadTexture(this._kMinionSprite);
   
    // Step B: loads all the fonts
    gEngine.Fonts.LoadFont(this._kFontCon16);
    gEngine.Fonts.LoadFont(this._kFontCon24);
    gEngine.Fonts.LoadFont(this._kFontCon32);
    gEngine.Fonts.LoadFont(this._kFontCon72);
    gEngine.Fonts.LoadFont(this._kFontSeg96);
};

MyGame.prototype.UnloadScene = function() 
{  
    gEngine.Textures.UnloadTexture(this._kFontImage);
    gEngine.Textures.UnloadTexture(this._kMinionSprite);
    
    // unload the fonts
    gEngine.Fonts.UnloadFont(this._kFontCon16);
    gEngine.Fonts.UnloadFont(this._kFontCon24);
    gEngine.Fonts.UnloadFont(this._kFontCon32);
    gEngine.Fonts.UnloadFont(this._kFontCon72);
    gEngine.Fonts.UnloadFont(this._kFontSeg96);

    // Step B: starts the next level
    var nextLevel = new GameOver();  // next level to be loaded
    gEngine.Core.StartScene(nextLevel);
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
      
    // Step C: Create the font and minion images using sprite
    this._mFontImage = new SpriteRenderable(this._kFontImage);
    this._mFontImage.SetColor([1, 1, 1, 0]);
    this._mFontImage.GetXform().SetPosition(15, 50);
    this._mFontImage.GetXform().SetSize(20, 20);
    
    // The right minion
    this._mMinion= new SpriteAnimateRenderable(this._kMinionSprite);
    this._mMinion.SetColor([1, 1, 1, 0]);
    this._mMinion.GetXform().SetPosition(15, 25);
    this._mMinion.GetXform().SetSize(24, 19.2);
    this._mMinion.SetSpriteSequence(512, 0,     // first element pixel position: top-right 512 is top of image, 0 is right of image
                                    204,164,    // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this._mMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this._mMinion.SetAnimationSpeed(15);
                                // show each element for _mAnimSpeed updates
    
    // Setp D: Create the hero object with texture from lower-left corner of 
    this._mHero = new SpriteRenderable(this._kMinionSprite);
    this._mHero.SetColor([1, 1, 1, 0]);
    this._mHero.GetXform().SetPosition(35, 50);
    this._mHero.GetXform().SetSize(12, 18);
    this._mHero.SetTexPixelPositions(0, 120, 0, 180);

    
    //<editor-fold desc="Create the fonts!">
    // this._mText = new FontRenderable("This is green text");
    this._mTextSysFont = new FontRenderable("System Font: in Red");
    this._InitText(this._mTextSysFont, 50, 60, [1, 0, 0, 1], 3);
    
    this._mTextCon16 = new FontRenderable("Consolas 16: in black");
    this._mTextCon16.SetFont(this._kFontCon16);
    this._InitText(this._mTextCon16, 50, 55, [0, 0, 0, 1], 2);
    
    this._mTextCon24 = new FontRenderable("Consolas 24: in black");
    this._mTextCon24.SetFont(this._kFontCon24);
    this._InitText(this._mTextCon24, 50, 50, [0, 0, 0, 1], 3);
    
    this._mTextCon32 = new FontRenderable("Consolas 32: in white");
    this._mTextCon32.SetFont(this._kFontCon32);
    this._InitText(this._mTextCon32, 40, 40, [1, 1, 1, 1], 4);
    
    this._mTextCon72 = new FontRenderable("Consolas 72: in blue");
    this._mTextCon72.SetFont(this._kFontCon72);
    this._InitText(this._mTextCon72, 30, 30, [0, 0, 1, 1], 6);
    
    this._mTextSeg96  = new FontRenderable("Segment7-92");
    this._mTextSeg96 .SetFont(this._kFontSeg96);
    this._InitText(this._mTextSeg96 , 30, 15, [1, 1, 0, 1], 7);
    //</editor-fold>
    
    this._mTextToWork = this._mTextCon16;
};

MyGame.prototype._InitText = function(font, posX, posY, color, textH)
{
    font.SetColor(color);
    font.GetXform().SetPosition(posX, posY);
    font.SetTextHeight(textH); 
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
        this._mFontImage.Draw(this._mCamera.GetVPMatrix());
        this._mMinion.Draw(this._mCamera.GetVPMatrix());
        
        // drawing the text output
        this._mTextSysFont.Draw(this._mCamera.GetVPMatrix());
        this._mTextCon16.Draw(this._mCamera.GetVPMatrix());
        this._mTextCon24.Draw(this._mCamera.GetVPMatrix());
        this._mTextCon32.Draw(this._mCamera.GetVPMatrix());
        this._mTextCon72.Draw(this._mCamera.GetVPMatrix());
        this._mTextSeg96.Draw(this._mCamera.GetVPMatrix());
        
        
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    // For this very simple, let's only allow the movement of hero, 
    // and if hero moves too far off, this level ends, we will
    // load the next level
    var deltaX = 0.5;
    var xform = this._mHero.GetXform();
    
    // Support hero movements
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        xform.IncXPosBy(deltaX);
        if (xform.GetXPos() > 100)  // this is the right-bound of the window
            xform.SetPosition(0, 50);
    }
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        xform.IncXPosBy(-deltaX);
        if (xform.GetXPos() < 0) {  // this is the left-bound of the window
            gEngine.GameLoop.Stop();
        }
    }
        
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

    // remember to update this._mMinion's animation
    this._mMinion.UpdateAnimation();
     
    
    // interactive control of the display size
    
    // choose which text to work on
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Zero))
        this._mTextToWork = this._mTextCon16;
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.One))
        this._mTextToWork = this._mTextCon24;
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Three))
        this._mTextToWork = this._mTextCon32;
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Four))
        this._mTextToWork = this._mTextCon72;
    
    var deltaF = 0.005;
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Up)) {
         if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.X)) {
             this._mTextToWork.GetXform().IncWidthBy(deltaF);
         } 
         if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Y)) {
            this._mTextToWork.GetXform().IncHeightBy(deltaF);
        }
        this._mTextSysFont.SetText(this._mTextToWork.GetXform().GetWidth().toFixed(2) + "x" + this._mTextToWork.GetXform().GetHeight().toFixed(2));
    }
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down)) {
         if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.X)) {
             this._mTextToWork.GetXform().IncWidthBy(-deltaF);
         }
         if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Y)) {
            this._mTextToWork.GetXform().IncHeightBy(-deltaF);
        }
        this._mTextSysFont.SetText(this._mTextToWork.GetXform().GetWidth().toFixed(2) + "x" + this._mTextToWork.GetXform().GetHeight().toFixed(2));
    }
};