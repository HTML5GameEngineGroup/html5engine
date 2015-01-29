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
    this._mWhiteSq = null;        // these are the renderable objects
    this._mRedSq = null;    
    
    // Step A: Initialize the webGL Context
    gEngine.Core.InitializeWebGL(htmlCanvasID);
    
    // Step B: Create the shader
    this._mConstColorShader = new SimpleShader(
            "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
    
    // Step C: Create the renderable objects:
    this._mWhiteSq = new Renderable(this._mConstColorShader);
    this._mWhiteSq.SetColor([1, 1, 1, 1]);
    this._mRedSq = new Renderable(this._mConstColorShader);
    this._mRedSq.SetColor([1, 0, 0, 1]);
    
    // Step D: Draw!
    gEngine.Core.ClearCanvas([0, 0.8, 0, 1]);   // 1. Clear the canvas
    
    // instead of simply drawing the squares, let's apply simple transforms
    // Step E: sets the blue renderable object's transform
    this._mWhiteSq.GetXform().SetPosition(-0.25, 0.25);
    this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mWhiteSq.GetXform().SetSize(1.2, 1.2);
    // Step F: draws the blue square (transform behavior in the object)
    this._mWhiteSq.Draw();

    // Step G: sets the red square transform    
    this._mRedSq.GetXform().SetXPos(0.25);  // to show alternative to SetPosition
    this._mRedSq.GetXform().SetYPos(-0.25); // it is possible to setX/Y separately
    this._mRedSq.GetXform().SetRotationInDegree(45);  // this is in Degree
    this._mRedSq.GetXform().SetWidth(0.4);  // to show alternative to SetSize
    this._mRedSq.GetXform().SetHeight(0.4);  // that it is possible to width/height separately
    // Step H: draw the red square (transform in the object)
    this._mRedSq.Draw();
};