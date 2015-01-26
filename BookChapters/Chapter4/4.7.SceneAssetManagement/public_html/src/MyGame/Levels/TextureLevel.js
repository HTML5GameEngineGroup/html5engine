/*
 * File: TextureLevel.js 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TextureLevel(htmlCanvasID)
{
    Scene.call(this); // call super class constructor
    //
    // variables of the shaders for drawing: 
    this._mRedShader = null;
    this._mTextureShader = null;
    
    // variable for renderable objects
    this._mAlpahTexSq = null;        // these are the renderable objects
    this._mNoAlphaTexSq = null;
    this._mRedSq = null;
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // textures to be loaded
    this._kTextureWithAlpha = "resources/UWB-Alpha.png";
    this._kTextureNoAlpha = "resources/UWB.png";

    // audio clip
    this._kKeyClicked = "resources/sounds/game-sound.wav";
    
    
    // Initialize the game
    this.Initialize();
};
gEngine.Core.InheritPrototype(TextureLevel, Scene);

TextureLevel.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.9, 0.9, 0.9, 1]);
            // sets the background to light gray
        
    // Step B: create the shaders
    this._mTextureShader = new TextureShader(
            "shaders/TextureVS.glsl",      // Path to the VertexShader 
            "shaders/TextureFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader( 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    
    // Step C: Create the renderable objects:
    this._mAlpahTexSq = new TextureObject(this._mTextureShader, this._kTextureWithAlpha);
    this._mNoAlphaTexSq = new TextureObject(this._mTextureShader, this._kTextureNoAlpha);
    this._mRedSq = new RenderableObject(this._mRedShader);
    
    // Step D: Initialize the alpha textured object
    this._mAlpahTexSq.GetXform().SetPosition(26, 58);
    this._mAlpahTexSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mAlpahTexSq.GetXform().SetSize(5, 5);
    
    // Step E: Initialize the top-left object with no transparency
    this._mNoAlphaTexSq.GetXform().SetPosition(14, 62);
    this._mNoAlphaTexSq.GetXform().SetSize(5, 5);
    
    // Step F: Centre the red square
    this._mRedSq.GetXform().SetPosition(20, 60);
    this._mRedSq.GetXform().SetSize(2, 2);
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
TextureLevel.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.3, 0.3, 0.3, 1.0]); // clear to dark gray
    
    // Step B: Activate the drawing Camera
    this._mCamera.BeginDraw();
        
    this._mNoAlphaTexSq.Draw(this._mCamera.GetVPMatrix());
    this._mAlpahTexSq.Draw(this._mCamera.GetVPMatrix());
    this._mRedSq.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
TextureLevel.prototype.Update = function()
{
    // For this very simple game, let's move the textured square and pulse the red
    
    var texXform = this._mAlpahTexSq.GetXform();
    var deltaX = 0.05;
    
    // Step A: test for textured square movement
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        if (texXform.GetXPos() > 30)  // this is the right-bound of the window
            texXform.SetPosition(10, texXform.GetYPos());
        texXform.IncXPosBy(deltaX);
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    // Step B: test for textured square rotation
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Up)) {
        texXform.IncRotationByDegree(1);
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    
    var redXform = this._mRedSq.GetXform();
    
    // Step C: test for pulsing the red square
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down)) {
        if (redXform.GetWidth() > 5)
            redXform.SetSize(2, 2);
        redXform.IncSizeBy(0.05);
        gEngine.AudioClips.PlaySound(this._kKeyClicked);
    }
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Four)) {
        this.LoadNextScene( new BeginLevel() );
    }
    
};

TextureLevel.prototype.LoadContent = function() {
    gEngine.Textures.LoadTexture(this._kTextureWithAlpha);
    gEngine.Textures.LoadTexture(this._kTextureNoAlpha);
    
    gEngine.AudioClips.LoadAudio(this._kKeyClicked);
};

TextureLevel.prototype.UnloadContent = function() {
    gEngine.Textures.UnloadTexture(this._kTextureWithAlpha);
    gEngine.Textures.UnloadTexture(this._kTextureNoAlpha);
    
    gEngine.AudioClips.UnloadAudio(this._kKeyClicked);
};