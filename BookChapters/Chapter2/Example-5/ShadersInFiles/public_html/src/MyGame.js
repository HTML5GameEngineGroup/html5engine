/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shader for drawing
    this._mShader = null;
    
    // The vertex buffer that contains the square vertices
    this._mVertexBuffer = null;
       
    // 1. Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    this._mShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the FragmentShader
    
    // 3. Now initialize the buffer with the vertex positions for the unit square
    this._mVertexBuffer = new VertexBuffer(gEngineCore.GetGL());
    
    // 4. Now we can Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    this._mShader.ActivateShader();           // 2. Activate the proper shader
    this._mVertexBuffer.ActivateAndDraw();    // 3. Draw with the geometry
};
