/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shaders for drawing: one red and one white
    this.mRedShader = null;
    this.mWhiteShader = null;
    
    // The vertex buffer that contains the square vertices
    this.mVertexBuffer = null;
    
    // The two renderable objects
    this.mWhiteSq = null;		// these are the renderable objects
    this.mRedSq = null;
    
    // The camera to view the rectangles
    this.mCamera = null;
    
    // Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // now initialize the game
    this.Initialize();
};

MyGame.prototype.Initialize = function() 
{
    // set up the cameras
    this.mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    this.mCamera.SetBackgroundColor([0.4, 0.4, 0.4, 1]);
            // sets the background to dark gray
    
    // Now create the shaders
    this.mWhiteShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVertexShader.glsl",      // Path to the VertexShader 
            "shaders/WhiteFragmentShader.glsl");    // Path to the White FragmentShader
    
    this.mRedShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVertexShader.glsl",      // Path to the VertexShader 
            "shaders/RedFragmentShader.glsl");      // Path to the Red FragmentShader
    
    // Now initialize the buffer with the vertex positions for the unit square
    this.mVertexBuffer = new VertexBuffer(gEngineCore.GetGL());
    
    // Create the renderable objects:
    this.mWhiteSq = new RenderableObject(this.mWhiteShader, this.mVertexBuffer);
    this.mRedSq = new RenderableObject(this.mRedShader, this.mVertexBuffer);
    
    // Centre white, slightly rotated square
    this.mWhiteSq.GetXform().SetPosition(20, 60);
    this.mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this.mWhiteSq.GetXform().SetSize(5, 5);
    
    // centre the red square
    this.mRedSq.GetXform().SetPosition(20, 60);
    this.mRedSq.GetXform().SetSize(2, 2);
    
    // now start the game loop running
    gEngineCore.Loop.StartLoop(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    gEngineCore.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Draw with mCamera
    this.mCamera.BeginDraw();
        // sets the shader VPMatrix
        this.mWhiteShader.LoadViewProjMatrix(this.mCamera.GetVPMatrix());
        this.mRedShader.LoadViewProjMatrix(this.mCamera.GetVPMatrix());
        this.mWhiteSq.Draw();   
        this.mRedSq.Draw();
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    // For this very simple game, let's move the white square and pulse the red
    
    // move the white square
    var whiteXform = this.mWhiteSq.GetXform();
    var deltaX = 0.05;
    if (whiteXform.GetXPos() > 30)  // this is the right-bound of the window
        whiteXform.SetPosition(10, 60);
    whiteXform.IncXPosBy(deltaX);
    whiteXform.IncRotationByDegree(1);
    
    // pulse the red square
    var redXform = this.mRedSq.GetXform();
    if (redXform.GetWidth() > 5)
        redXform.SetSize(2, 2);
    redXform.IncSizeBy(0.05);
};