/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shaders for drawing: one red and one white
    var mRedShader = null, mWhiteShader = null;
    
    // The vertex buffer that contains the square vertices
    var mVertexBuffer = null;
    
    var mWhiteSq = null, mRedSq = null;
    
    //**----------------------------
    // Private methods not meant to be used by other objects
    //**-----------------------------
        var GetVertexBuffer = function() { return mVertexBuffer; };
        var GetRedShader = function() { return mRedShader; };
        var GetWhiteShader = function() { return mWhiteShader; };
        var GetWhiteSq = function() { return mWhiteSq; };
        var GetRedSq = function() { return mRedSq; };
    //------ end of private mehtods
    
    
    // 1. Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    mWhiteShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVertexShader.glsl",      // Path to the VertexShader 
            "shaders/WhiteFragmentShader.glsl");    // Path to the White FragmentShader
    
    mRedShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVertexShader.glsl",      // Path to the VertexShader 
            "shaders/RedFragmentShader.glsl");      // Path to the Red FragmentShader
    
    // 3. Now initialize the buffer with the vertex positions for the unit square
    mVertexBuffer = new VertexBuffer(gEngineCore.GetGL());
    
    // 4. Create the renderable objects:
    mWhiteSq = new RenderableObject(mWhiteShader, mVertexBuffer);
    mRedSq = new RenderableObject(mRedShader, mVertexBuffer);
    
    // 4. Now we can Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    mWhiteSq.Draw();
    mRedSq.Draw();
    
    // returning methods to this object
    var publicMethods = {
        privateMethod1: GetVertexBuffer,
        privateMethod2: GetWhiteShader,
        privateMethod3: GetRedShader,
        privateMethod4: GetWhiteSq,
        privateMethod5: GetRedSq
    };
    return publicMethods;
};
