/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shader for drawing
    var mShader = null;
    
    // The vertex buffer that contains the square vertices
    var mVertexBuffer = null;
    
    //**----------------------------
    // Private methods not meant to be used by other objects
    //**-----------------------------
        var GetVertexBuffer = function() { return mVertexBuffer; };
        var GetShader = function() { return mShader; };
    //------ end of private mehtods
    
    
    // 1. Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    mShader = new ShaderProgram(gEngineCore.GetGL(), "VertexShader", "FragmentShader");
    
    // 3. Now initialize the buffer with the vertex positions for the unit square
    mVertexBuffer = new VertexBuffer(gEngineCore.GetGL());
    
    // 4. Now we can Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    mShader.ActivateShader();           // 2. Activate the proper shader
    mVertexBuffer.ActivateAndDraw();    // 3. Draw with the geometry
    
    // returning methods to this object
    var publicMethods = {
        privateMethod1: GetVertexBuffer,
        privateMethod2: GetShader
    };
    return publicMethods;
};
