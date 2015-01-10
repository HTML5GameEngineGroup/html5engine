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
    
    // Step 3: Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    
    // Step 4: Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    
    // instead of simply drawing the squares, let's apply simple transforms
	// Step 5: sets the white renderable object's transform
    this._mWhiteSq.GetXform().SetPosition(-0.25, 0.25);
    this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mWhiteSq.GetXform().SetSize(1.2, 1.2);
    // Step 6: draws the white square (transform behavior in the object)
    this._mWhiteShader.ActivateShader();  // activates the shader
        this._mWhiteSq.Draw();

    // Step 7: sets the red square transform    
    this._mRedSq.GetXform().SetXPos(0.25);
    this._mRedSq.GetXform().SetYPos(-0.25);
    this._mRedSq.GetXform().SetRotationInDegree(45);  // this is in Radian
    this._mRedSq.GetXform().SetWidth(0.4);
    this._mRedSq.GetXform().SetHeight(0.4);
    // Step 8: draw the red square (transform in the object)
    this._mRedShader.ActivateShader();  // activates the shader    
        this._mRedSq.Draw();
};