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
    
    this.mWhiteSq = null;		// these are the renderable objects
    this.mRedSq = null;
    
    this.mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    
    // 1. Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    this.mWhiteShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVertexShader.glsl",      // Path to the VertexShader 
            "shaders/WhiteFragmentShader.glsl");    // Path to the White FragmentShader
    
    this.mRedShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVertexShader.glsl",      // Path to the VertexShader 
            "shaders/RedFragmentShader.glsl");      // Path to the Red FragmentShader
    
    // 3. Now initialize the buffer with the vertex positions for the unit square
    this.mVertexBuffer = new VertexBuffer(gEngineCore.GetGL());
    
    // 4. Create the renderable objects:
    this.mWhiteSq = new RenderableObject(this.mWhiteShader, this.mVertexBuffer);
    this.mRedSq = new RenderableObject(this.mRedShader, this.mVertexBuffer);
    
    // 4. Now we can Draw!
    gEngineCore.ClearCanvas();
    
    // 5. Starts the drawing by activating the camera
    this.mCamera.BeginDraw();
    
    // sets the shader VPMatrix
    this.mWhiteShader.LoadViewProjMatrix(this.mCamera.GetVPMatrix());
    this.mRedShader.LoadViewProjMatrix(this.mCamera.GetVPMatrix());
    
    
    // Centre white, slightly rotated square
    this.mWhiteSq.GetXform().SetPosition(20, 60);
    this.mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this.mWhiteSq.GetXform().SetSize(5, 5);
    this.mWhiteSq.Draw();
    
    // centre red square
    this.mRedSq.GetXform().SetPosition(20, 60);
    this.mRedSq.GetXform().SetSize(2, 2);
    this.mRedSq.Draw();
    
    // top left
    this.mRedSq.GetXform().SetPosition(10, 65);
    this.mRedSq.Draw();
    
    // top right
    this.mRedSq.GetXform().SetPosition(30, 65);
    this.mRedSq.Draw();
    
    // bottom right
    this.mRedSq.GetXform().SetPosition(30, 55);
    this.mRedSq.Draw();
    
    // bottom left
    this.mRedSq.GetXform().SetPosition(10, 55);
    this.mRedSq.Draw();
};