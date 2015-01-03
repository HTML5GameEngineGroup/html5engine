/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shaders for drawing: one red and one white
    this._mRedShader = null;
    this._mWhiteShader = null;
        
    this._mWhiteSq = null;		// these are the renderable objects
    this._mRedSq = null;    
    
    // 1. Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    this._mWhiteShader = new ShaderProgram(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new ShaderProgram(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // 3. Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    
    // 4. Now we can Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    // instead of simply drawing the squares, let's apply simple transforms
    var xform = mat4.create();
        
    this._mWhiteSq.GetXform().SetPosition(-0.25, 0.25);
    this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this._mWhiteSq.GetXform().SetSize(1.2, 1.2);
    this._mWhiteSq.Draw();
    
    this._mRedSq.GetXform().SetXPos(0.25);
    this._mRedSq.GetXform().SetYPos(-0.25);
    this._mRedSq.GetXform().SetRotationInDegree(45);  // this is in Radian
    this._mRedSq.GetXform().SetWidth(0.4);
    this._mRedSq.GetXform().SetHeight(0.4);
    this._mRedSq.Draw();
};
