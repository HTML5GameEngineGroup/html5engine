/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // variables of the shaders for drawing: one red and one white
    this._mRedShader = null;
    this._mWhiteShader = null;
        
    // variables for the squares
    this._mWhiteSq = null;		// these are the renderable objects
    this._mRedSq = null;    
    
    // Step 1: Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // Step 2: Create the shaders: white and then the red shader
    this._mWhiteShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // Step 3. Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    
    // Step 4: Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    
	// Step 4.1: Activate and draw renderable objects with the white shader
    this._mWhiteShader.ActivateShader();
        this._mWhiteSq.Draw();
    
    // Step 4.2: Activate and draw renderable objects with the red shader
    this._mRedShader.ActivateShader();
        this._mRedSq.Draw();
    
};
