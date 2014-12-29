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
    
    
    // 1. Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    this.mWhiteShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this.mRedShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // 3. Now initialize the buffer with the vertex positions for the unit square
    this.mVertexBuffer = new VertexBuffer(gEngineCore.GetGL());
    
    // 4. Create the renderable objects:
    this.mWhiteSq = new RenderableObject(this.mWhiteShader, this.mVertexBuffer);
    this.mRedSq = new RenderableObject(this.mRedShader, this.mVertexBuffer);
    
    // 4. Now we can Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
        
    this.mWhiteSq.GetXform().SetPosition(-0.25, 0.25);
    this.mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this.mWhiteSq.GetXform().SetSize(1.2, 1.2);
    this.mWhiteSq.Draw();
    
    this.mRedSq.GetXform().SetXPos(0.25);
    this.mRedSq.GetXform().SetYPos(-0.25);
    this.mRedSq.GetXform().SetRotationInDegree(45);  // this is in Radian
    this.mRedSq.GetXform().SetWidth(0.4);
    this.mRedSq.GetXform().SetHeight(0.4);
    this.mRedSq.Draw();
};
