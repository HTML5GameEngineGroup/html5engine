/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shader for drawing
    this._mShader = null;
       
    // Step A: Initialize the webGL Context and the VertexBuffer
    gEngine.Core.InitializeWebGL(htmlCanvasID);
    
    // Step B: Create, load and compile the shaders
    this._mShader = new SimpleShader("VertexShader", "FragmentShader");
    
    // Step C: Draw!
        // Step C1: Clear the canvas
        gEngine.Core.ClearCanvas();        
        
        // Step C2: Activate the proper shader
        this._mShader.ActivateShader(); 
        
        // Step C3: Draw with the currently activated geometry and the activated shader
        var gl = gEngine.Core.GetGL();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
