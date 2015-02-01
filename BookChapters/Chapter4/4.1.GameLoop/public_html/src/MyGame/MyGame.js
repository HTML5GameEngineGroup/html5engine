/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // variables of the constant color shader
    this._mConstColorShader = null;
        
    // variables for the squares
    this._mWhiteSq = null;        // these are the renderable objects
    this._mRedSq = null;    
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // Initialize the webGL Context
    gEngine.Core.InitializeWebGL(htmlCanvasID);
    
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
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to dark gray
    
    // Step  B: create the shader
    this._mConstColorShader = new SimpleShader( 
            "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl");    // Path to the Simple FragmentShader    
    
    // Step  C: Create the renderable objects:
    this._mWhiteSq = new Renderable(this._mConstColorShader);
    this._mWhiteSq.SetColor([1, 1, 1, 1]);
    this._mRedSq = new Renderable(this._mConstColorShader);
    this._mRedSq.SetColor([1, 0, 0, 1]);
    
    // Step  D: Initialize the white renderable object: centred, 5x5, rotated
    this._mWhiteSq.GetXform().SetPosition(20, 60);
    this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mWhiteSq.GetXform().SetSize(5, 5);
    
    // Step  E: Initialize the red renderable object: centered 2x2
    this._mRedSq.GetXform().SetPosition(20, 60);
    this._mRedSq.GetXform().SetSize(2, 2);
    
    // Step F: Start the game loop running
    gEngine.GameLoop.Start(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Step  B: Activate the drawing Camera
    this._mCamera.SetupViewProjection();
    
        // Step  C: Activate the white shader to draw
        this._mWhiteSq.Draw(this._mCamera.GetVPMatrix());
        
        // Step  D: Activate the red shader to draw
        this._mRedSq.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    // For this very simple game, let's move the white square and pulse the red
    
    // Step A: move the white square
    var whiteXform = this._mWhiteSq.GetXform();
    var deltaX = 0.05;
    if (whiteXform.GetXPos() > 30)  // this is the right-bound of the window
        whiteXform.SetPosition(10, 60);
    whiteXform.IncXPosBy(deltaX);
    whiteXform.IncRotationByDegree(1);
    
    // Step B: pulse the red square
    var redXform = this._mRedSq.GetXform();
    if (redXform.GetWidth() > 5)
        redXform.SetSize(2, 2);
    redXform.IncSizeBy(0.05);
    
};