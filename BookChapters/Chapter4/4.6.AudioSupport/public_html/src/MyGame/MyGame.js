/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // variables of the shaders for drawing: one red and one white
    this._mRedShader = null;
    this._mTextureShader = null;
    this._mSpriteShader = null;
    
    // variable for renderable objects
    this._mTexSq = null;        // these are the renderable objects
    this._mSpriteFontSq = null;
    this._mSpriteBoySq = null;
    this._mRedSq = null;
    this._mMyText = null;
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // textures to be loaded
    this._kTextureWithAlpha = "resources/UWB-Alpha.png";
    this._kFontSprite = "resources/fonts/dos-font.png";
    this._kBoySprite = "resources/BoySprite.png";
    
    // audio clips to be loaded
    this._kBgAudio = "resources/sounds/Mind_Meld.mp3";
    this._kKeyClicked = "resources/sounds/game-sound.wav";
    
    // Initialize the webGL Context
    gEngine.Core.InitializeEngineCore(htmlCanvasID);
    
    // Initialize the game
    this.Initialize();
};

MyGame.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.9, 0.9, 0.9, 1]);
            // sets the background to light gray
        
    // Step  B: create the shaders
    this._mTextureShader = new TextureShader(
            "shaders/TextureVS.glsl",      // Path to the VertexShader 
            "shaders/TextureFS.glsl");    // Path to the White FragmentShader
    
    this._mSpriteShader = new SpriteShader(
            "shaders/TextureVS.glsl",
            "shaders/TextureFS.glsl");
            
    this._mRedShader = new SimpleShader( 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    
    // Step  C: Create the renderable objects:
    this._mTexSq = new TextureObject(this._mTextureShader, this._kTextureWithAlpha);
    this._mSpriteFontSq = new SpriteObject(this._mSpriteShader, this._kFontSprite);
    this._mSpriteBoySq = new SpriteObject(this._mSpriteShader, this._kBoySprite);
    this._mRedSq = new RenderableObject(this._mRedShader);
    this._mMyText = new TextObject(this._mSpriteShader, "This Is A Test");
    
    // The transparent W 
    this._mTexSq.GetXform().SetPosition(26, 58);
    this._mTexSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mTexSq.GetXform().SetSize(5, 5);
    
    // Top left square with font sprite
    this._mSpriteFontSq.GetXform().SetPosition(14, 62);
    this._mSpriteFontSq.GetXform().SetSize(5, 5);
    
    // Top right square with boty sprite
    this._mSpriteBoySq.GetXform().SetPosition(26, 63);
    this._mSpriteBoySq.GetXform().SetSize(8, 4);
    
    // centre the red square
    this._mRedSq.GetXform().SetPosition(20, 60);
    this._mRedSq.GetXform().SetSize(2, 2);
    
    // Text object, at the very bottom
    this._mMyText.GetXform().SetSize(6, 0.5);
    this._mMyText.GetXform().SetPosition(14, 57);
    
    
    // load in images to draw with
    gEngine.Textures.LoadTexture(this._kTextureWithAlpha);
    gEngine.Textures.LoadTexture(this._kFontSprite);
    gEngine.Textures.LoadTexture(this._kBoySprite);
    
    // load audio clips
    gEngine.AudioClips.LoadAudio(this._kBgAudio);
    gEngine.AudioClips.LoadAudio(this._kKeyClicked);
    
    // now start the game loop running
    gEngine.GameLoop.Start(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    gEngine.Core.ClearCanvas([0.3, 0.3, 0.3, 1.0]); // clear to dark gray
    
    // Draw with mCamera
    this._mCamera.BeginDraw();
        
    // Draw the two sprite objects
    this._mSpriteFontSq.Draw(this._mCamera.GetVPMatrix());
    this._mSpriteBoySq.Draw(this._mCamera.GetVPMatrix());
        
    // Draw the texturedSq and the redSq
    this._mTexSq.Draw(this._mCamera.GetVPMatrix());
    this._mRedSq.Draw(this._mCamera.GetVPMatrix());

    // The test string
    this._mMyText.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function! 
MyGame.prototype.Update = function()
{
    // For this very simple game, let's move the textured square and pulse the red
    
    var texXform = this._mTexSq.GetXform();
    var deltaX = 0.05;
    
    // Move the textured square and the text
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        if (texXform.GetXPos() < 30) {  // this is the right-bound of the window
            texXform.IncXPosBy(deltaX);
            this._mMyText.GetXform().IncXPosBy(deltaX);
        }
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        if (texXform.GetXPos() > 14) {  // this is the right-bound of the window
            texXform.IncXPosBy(-deltaX);
            this._mMyText.GetXform().IncXPosBy(-deltaX);
        }
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    // Rotate the textured square
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Up)) {
        texXform.IncRotationByDegree(1);
        this._mMyText.GetXform().IncRotationByDegree(1);
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    
    var redXform = this._mRedSq.GetXform();
    
    // pulse the red square
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down)) {
        if (redXform.GetWidth() > 5) {
            redXform.SetSize(2, 2);
            this._mMyText.GetXform().SetSize(6, 0.5);
        }
        redXform.IncSizeBy(0.05);
        this._mMyText.GetXform().IncSizeBy(0.05);
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    
    // animate the texture coordinate of both of the sprite objects
    
    // <editor-fold desc="Font: continuously shrink it ...">
    var delta = 0.001;
    var texArray = this._mSpriteFontSq.GetTexArray();
    if (texArray[this._mSpriteShader.eTextureCoordArray.eLeft] < 0.4) { // this is the x-value of right boundary
        this._mSpriteFontSq.SetTextureCoordinate(
                texArray[this._mSpriteShader.eTextureCoordArray.eLeft]+delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eRight]-delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eBottom]+delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eTop]-delta);
    } else { // showing only a very small area!
        this._mSpriteFontSq.SetTextureCoordinate(0, 1, 0, 1);  // reset to cover the entire image
    }
    // </editor-fold>
    
    // <editor-fold desc="Boy: zoom into upper-left">
    texArray = this._mSpriteBoySq.GetTexArray();
    if (texArray[this._mSpriteShader.eTextureCoordArray.eRight] > 0.5) { // this is the x-value of right boundary
        this._mSpriteBoySq.SetTextureCoordinate(
                texArray[this._mSpriteShader.eTextureCoordArray.eLeft],
                texArray[this._mSpriteShader.eTextureCoordArray.eRight]-delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eBottom]+delta,
                texArray[this._mSpriteShader.eTextureCoordArray.eTop]);
    } else { // showing only a very small area!
        this._mSpriteBoySq.SetTextureCoordinate(0, 1, 0, 1);  // reset to cover the entire image
    }
    // </editor-fold>
    
    
    // <editor-fold desc="background music control">
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.S))
        gEngine.AudioClips.StopBackgroundAudio(this._kBgAudio);
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.A)) 
        gEngine.AudioClips.PlayBackgroundAudio(this._kBgAudio);
    // </editor-fold>
};