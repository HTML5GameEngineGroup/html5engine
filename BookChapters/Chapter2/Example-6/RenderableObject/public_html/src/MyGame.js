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
    
    this._mWhiteSq = null;		// these are the renderable objects
    this._mRedSq = null;    
    
    // 1. Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    this._mWhiteShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // 3. Now initialize the buffer with the vertex positions for the unit square
    this._mVertexBuffer = new VertexBuffer(gEngineCore.GetGL());
    
    // 4. Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader, this._mVertexBuffer);
    this._mRedSq = new RenderableObject(this._mRedShader, this._mVertexBuffer);
    
    // 4. Now we can Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    this._mWhiteSq.Draw();
    this._mRedSq.Draw();
    
};
