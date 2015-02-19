/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{           
     // audio clips: supports both mp3 and wav formats
    this._kBgClip = "resources/sounds/BGClip.mp3";
    this._kCue = "resources/sounds/MyGame_cue.wav";
    
    // textures: 
    this._kFontImage = "resources/Consolas-72.png";
    this._kMinionSprite = "resources/minion_sprite.png";
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mPortal = null;
    this._mCollector = null;
    this._mFontImage = null;
    this._mRightMinion = null;
    this._mLeftMinion = null;
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.LoadAndBeginScene = function() 
{
   // Step A: loads the audios
   gEngine.AudioClips.LoadAudio(this._kBgClip);
   gEngine.AudioClips.LoadAudio(this._kCue);
    
   // Step B: loads the textures
   gEngine.Textures.LoadTexture(this._kFontImage);
   gEngine.Textures.LoadTexture(this._kMinionSprite);

    // Step C: Start the game loop running
    gEngine.GameLoop.Start(this);
};

MyGame.prototype.UnloadScene = function() 
{
    // Game loop not running, unload all assets
    // stop the background audio
    gEngine.AudioClips.StopBackgroundAudio();
    
    // unload the scene resources
    // gEngine.AudioClips.UnloadAudio(this._kBgClip);
    //      You know this clip will be used else where in the game
    //      So you decide to not unload this clip!!
    gEngine.AudioClips.UnloadAudio(this._kCue);
   
    gEngine.Textures.UnloadTexture(this._kFontImage);
    gEngine.Textures.UnloadTexture(this._kMinionSprite);

    // starts the next level
    var nextLevel = new BlueLevel();  // next level to be loaded
    nextLevel.LoadAndBeginScene();
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
    
    // The right minion
    this._mRightMinion= new SpriteAnimateRenderable(this._kMinionSprite);
    this._mRightMinion.SetColor([1, 1, 1, 0]);
    this._mRightMinion.GetXform().SetPosition(26, 56.5);
    this._mRightMinion.GetXform().SetSize(4, 3.2);
    this._mRightMinion.SetSpriteSequence(512, 0,     // first element pixel position: top-right 512 is top of image, 0 is right of image
                                    204,164,    // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this._mRightMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this._mRightMinion.SetAnimationSpeed(50);
                                // show each element for _mAnimSpeed updates
    
    // the left minion
    this._mLeftMinion= new SpriteAnimateRenderable(this._kMinionSprite);
    this._mLeftMinion.SetColor([1, 1, 1, 0]);
    this._mLeftMinion.GetXform().SetPosition(15, 56.5);
    this._mLeftMinion.GetXform().SetSize(4, 3.2);
    this._mLeftMinion.SetSpriteSequence(348, 0,     // first element pixel position: top-right 164 from 512 is top of image, 0 is right of image
                                    204,164,    // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this._mLeftMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this._mLeftMinion.SetAnimationSpeed(50);
                                // show each element for _mAnimSpeed updates

    
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
        this._mRightMinion.Draw(this._mCamera.GetVPMatrix());
        this._mLeftMinion.Draw(this._mCamera.GetVPMatrix());
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
        gEngine.AudioClips.PlaySound(this._kCue);
        xform.IncXPosBy(deltaX);
        if (xform.GetXPos() > 30)  // this is the right-bound of the window
            xform.SetPosition(12, 60);
    }
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        gEngine.AudioClips.PlaySound(this._kCue);
        xform.IncXPosBy(-deltaX);
        if (xform.GetXPos() < 11) {  // this is the left-bound of the window
            gEngine.GameLoop.Stop();
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


    // New code for controlling the sprite animation
    // <editor-fold desc="controlling the sprite animation:">
    // remember to update this._mRightMinion's animation
    this._mRightMinion.UpdateAnimation();
    this._mLeftMinion.UpdateAnimation();
    
    // Animate left on the sprite sheet
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.One)) {
        this._mRightMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
        this._mLeftMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
    }
    
    // swing animation 
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Two)) {
        this._mRightMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
        this._mLeftMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    }
    
    // Animate right on the sprite sheet
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Three)) {
        this._mRightMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
        this._mLeftMinion.SetAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    }
    
    // decrease the duration of showing each sprite element, thereby speeding up the animation
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Four)) {
        this._mRightMinion.IncAnimationSpeed(-2);
        this._mLeftMinion.IncAnimationSpeed(-2);
    }
    
    // increase the duration of showing each sprite element, thereby slowing downthe animation
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Five)) {
        this._mRightMinion.IncAnimationSpeed(2);
        this._mLeftMinion.IncAnimationSpeed(2);
    }
    // </editor-fold>
};