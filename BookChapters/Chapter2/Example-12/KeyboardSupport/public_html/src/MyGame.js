/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shaders for drawing: one red and one white
    this._mRedShader = null;
    this._mWhiteShader = null;
    
    // The vertex buffer that contains the square vertices
    this._mVertexBuffer = null;
    
    // The two renderable objects
    this._mWhiteSq = null;		// these are the renderable objects
    this._mRedSq = null;
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // Initialize the webGL Context
    gEngineCore.InitializeEngineCore(htmlCanvasID);
    
    // now initialize the game
    this.Initialize();
};

MyGame.prototype.Initialize = function() 
{
    // set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.4, 0.4, 0.4, 1]);
            // sets the background to dark gray
    
    // Now create the shaders
    this._mWhiteShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // Now initialize the buffer with the vertex positions for the unit square
    this._mVertexBuffer = new VertexBuffer(gEngineCore.GetGL());
    
    // Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader, this._mVertexBuffer);
    this._mRedSq = new RenderableObject(this._mRedShader, this._mVertexBuffer);
    
    // Centre white, slightly rotated square
    this._mWhiteSq.GetXform().SetPosition(20, 60);
    this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mWhiteSq.GetXform().SetSize(5, 5);
    
    // centre the red square
    this._mRedSq.GetXform().SetPosition(20, 60);
    this._mRedSq.GetXform().SetSize(2, 2);
    
    // now start the game loop running
    gEngineCore.Loop.StartLoop(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    gEngineCore.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Draw with mCamera
    this._mCamera.BeginDraw();
        // sets the shader VPMatrix
        this._mWhiteShader.LoadViewProjMatrix(this._mCamera.GetVPMatrix());
        this._mRedShader.LoadViewProjMatrix(this._mCamera.GetVPMatrix());
        this._mWhiteSq.Draw();   
        this._mRedSq.Draw();
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    // For this very simple game, let's move the white square and pulse the red
    
    var whiteXform = this._mWhiteSq.GetXform();
    var deltaX = 0.05;
    
    // Move the white square
    if (gEngineCore.Input.IsKeyDown(gEngineCore.Input.RIGHT)) {
        if (whiteXform.GetXPos() > 30)  // this is the right-bound of the window
            whiteXform.SetPosition(10, 60);
        whiteXform.IncXPosBy(deltaX);
    }
    
    // Rotate the white square
    if (gEngineCore.Input.IsKeyDown(gEngineCore.Input.UP))
        whiteXform.IncRotationByDegree(1);
    
    
    var redXform = this._mRedSq.GetXform();
    
    // pulse the red square
    if (gEngineCore.Input.IsKeyDown(gEngineCore.Input.DOWN)) {
        if (redXform.GetWidth() > 5)
            redXform.SetSize(2, 2);
        redXform.IncSizeBy(0.05);
    }
};