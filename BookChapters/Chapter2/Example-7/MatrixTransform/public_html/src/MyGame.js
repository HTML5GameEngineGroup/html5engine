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
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    // instead of simply drawing the squares, let's apply simple transforms
    var xform = mat4.create();
        
    mat4.translate(xform, xform, vec3.fromValues(-0.25, 0.25, 0.0));
    mat4.rotateZ(xform, xform, 0.2); // rotation is in radian
    mat4.scale(xform, xform, vec3.fromValues(1.2, 1.2, 1.0));
    this.mWhiteSq.Draw(xform);
    
    mat4.identity(xform); // restart
    mat4.translate(xform, xform, vec3.fromValues(0.25, -0.25, 0.0));
    mat4.rotateZ(xform, xform, -0.785); // rotation is in radian (about -45-degree)
    mat4.scale(xform, xform, vec3.fromValues(0.4, 0.4, 1.0));
    this.mRedSq.Draw(xform);
};
