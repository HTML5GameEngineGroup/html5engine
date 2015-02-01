/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{   
    // Step A: Initialize the webGL Context
    gEngine.Core.InitializeWebGL(htmlCanvasID);
    
    // Step B: Create the shader
    this._mConstColorShader = new SimpleShader(
            "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl");     // Path to the Simple FragmentShader
    
    // Step C: Create the renderable objects:
    this._mWhiteSq = new Renderable(this._mConstColorShader);
    this._mWhiteSq.SetColor([1, 1, 1, 1]);
    this._mRedSq = new Renderable(this._mConstColorShader);
    this._mRedSq.SetColor([1, 0, 0, 1]);
    
    // Step D: Draw!
    gEngine.Core.ClearCanvas([0, 0.8, 0, 1]);  // Clear the canvas
    
    // Step D1: Draw renderable objects with the white shader
    this._mWhiteSq.Draw();
    
    // Step D2: Draw renderable objects with the red shader
    this._mRedSq.Draw();
    
};
