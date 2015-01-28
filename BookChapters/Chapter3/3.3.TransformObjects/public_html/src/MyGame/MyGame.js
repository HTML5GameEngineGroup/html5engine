/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // variables of the shader for drawing: one shader to be shared by two renderables
    this._mConstColorShader = null;
        
    // variables for the squares
    this._mBlueSq = null;        // these are the renderable objects
    this._mRedSq = null;    
    
    // Step A: Initialize the webGL Context
    gEngine.Core.InitializeWebGL(htmlCanvasID);
    
    // Step B: Create the shader
    this._mConstColorShader = new SimpleShader(
            "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
    
    // Step C: Create the renderable objects:
    this._mBlueSq = new Renderable(this._mConstColorShader);
    this._mBlueSq.SetColor([0.25, 0.25, 0.95, 1]);
    this._mRedSq = new Renderable(this._mConstColorShader);
    this._mRedSq.SetColor([1, 0.25, 0.25, 1]);
    
    // Step D: Draw!
    gEngine.Core.ClearCanvas([0, 0.8, 0, 1]);   // 1. Clear the canvas
    
    // instead of simply drawing the squares, let's apply simple transforms
    // Step E: sets the blue renderable object's transform
    this._mBlueSq.GetXform().SetPosition(-0.25, 0.25);
    this._mBlueSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mBlueSq.GetXform().SetSize(1.2, 1.2);
    // Step F: draws the blue square (transform behavior in the object)
    this._mBlueSq.Draw();

    // Step G: sets the red square transform    
    this._mRedSq.GetXform().SetXPos(0.25);
    this._mRedSq.GetXform().SetYPos(-0.25);
    this._mRedSq.GetXform().SetRotationInDegree(45);  // this is in Radian
    this._mRedSq.GetXform().SetWidth(0.4);
    this._mRedSq.GetXform().SetHeight(0.4);
    // Step H: draw the red square (transform in the object)
    this._mRedSq.Draw();
};