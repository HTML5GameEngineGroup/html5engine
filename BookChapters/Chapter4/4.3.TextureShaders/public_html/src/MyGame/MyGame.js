/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // variables of the shaders for drawing: 
    this._mConstColorShader = null;
    this._mTextureShader = null;
    
    // variable for renderable objects
    this._mAlphaTexSq = null;        // these are the renderable objects
    this._mNoAlphaTexSq = null;
    this._mRedSq = null;
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // textures to be loaded
    this._kTextureWithAlpha = "resources/UWB-Alpha.png";
    this._kTextureNoAlpha = "resources/UWB.png";
    
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
            "src/GLSLShaders/TextureVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/TextureFS.glsl");    // Path to the White FragmentShader
    
    this._mConstColorShader = new SimpleShader( 
            "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl");      // Path to the simple FragmentShader
    
    
    // Step  C: Create the renderable objects:
    this._mAlphaTexSq = new Renderable(this._mTextureShader);
    this._mAlphaTexSq.SetColor([1, 0, 0, 0]);
    this._mNoAlphaTexSq = new Renderable(this._mTextureShader);
    this._mNoAlphaTexSq.SetColor([1, 1, 0, 0]);
    this._mRedSq = new Renderable(this._mConstColorShader);
    this._mRedSq.SetColor([1, 0, 0, 1]);
    
    // Step  D: Initialize the alpha textured object
    this._mAlphaTexSq.GetXform().SetPosition(26, 58);
    this._mAlphaTexSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mAlphaTexSq.GetXform().SetSize(5, 5);
    
    // Step  E: Initialize the top-left object with no transparency
    this._mNoAlphaTexSq.GetXform().SetPosition(14, 62);
    this._mNoAlphaTexSq.GetXform().SetSize(5, 5);
    
    // Step F: Centre the red square
    this._mRedSq.GetXform().SetPosition(20, 60);
    this._mRedSq.GetXform().SetSize(2, 2);
    
    // Step G: load in the images to draw with
    gEngine.Textures.LoadTexture(this._kTextureWithAlpha);
    gEngine.Textures.LoadTexture(this._kTextureNoAlpha);
    
    // Step H: now start the game loop running
    gEngine.GameLoop.Start(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.3, 0.3, 0.3, 1.0]); // clear to dark gray
    
    // Step  B: Activate the drawing Camera
    this._mCamera.BeginDraw();
        
    // Step C draw the texturedSq
        // Step C1: Activate the opaque texture
        gEngine.Textures.ActivateTexture(this._kTextureNoAlpha);
        // Step C2: Draws the associated renderable object
        this._mNoAlphaTexSq.Draw(this._mCamera.GetVPMatrix());
                
    // Step D:     
        // Step D1: Activate the transparent texture
        gEngine.Textures.ActivateTexture(this._kTextureWithAlpha);
        // Step D2: Draws the associated renderable object
        this._mAlphaTexSq.Draw(this._mCamera.GetVPMatrix());
    
    // Step E: draw the redSq
        this._mRedSq.Draw(this._mCamera.GetVPMatrix());
    
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    // For this very simple game, let's move the textured square and pulse the red
    
    var texXform = this._mAlphaTexSq.GetXform();
    var deltaX = 0.05;
    
    // Step A: test for textured square movement
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        if (texXform.GetXPos() > 30)  // this is the right-bound of the window
            texXform.SetPosition(10, texXform.GetYPos());
        texXform.IncXPosBy(deltaX);
    }
    
    // Step  B: test for textured square rotation
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Up))
        texXform.IncRotationByDegree(1);
    
    
    var redXform = this._mRedSq.GetXform();
    // Step  C: test for pulsing the red square
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down)) {
        if (redXform.GetWidth() > 5)
            redXform.SetSize(2, 2);
        redXform.IncSizeBy(0.05);
    }
    
    // Step  D: test for texture tinting
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Left)) {
        this._TintRenderable(this._mAlphaTexSq);
        this._TintRenderable(this._mNoAlphaTexSq);
    }
};

MyGame.prototype._TintRenderable = function(renderable)
{
    var c = renderable.GetColor();
    c[3] += 0.05;
    if (c[3] > 1) 
        c[3] = 0;
    renderable.SetColor(c);
};