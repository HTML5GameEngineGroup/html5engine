/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shader for drawing
    this._mShader = null;
       
    // 1. Initialize the webGL Context and the VertexBuffer
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    this._mShader = new ShaderProgram("VertexShader", "FragmentShader");
    
    // 3. Now we can Draw!
        // step 1. Clear the canvas
        gEngineCore.ClearCanvas();        
        
        // 2. Activate the proper shader
        this._mShader.ActivateShader(); 
        
        // 3. Draw with the currently activated geometry (by the shader)
        var gl = gEngineCore.GetGL();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
