/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shader for drawing
    this._mShader = null;
       
    // Step 1: Initialize the webGL Context and the VertexBuffer
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // Step 2: Create, load and compile the shaders
    this._mShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the FragmentShader
    
    
    // Step 3: Draw!
        // Step 3a: Clear the canvas
        gEngineCore.ClearCanvas();        
        
        // Step 3b: Activate the proper shader
        this._mShader.ActivateShader(); 
        
        // Step 3c: Draw with the currently activated geometry and the activated shader
        var gl = gEngineCore.GetGL();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
