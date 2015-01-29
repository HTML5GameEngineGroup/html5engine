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
    var gl = gEngine.Core.GetGL();
    
    // Step B: Setup the camera
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // center of the WC
            20,                        // width of WC
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );

    // Step C: Create the shader
    this._mConstColorShader = new SimpleShader(
            "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
    
    // Step D: Create the renderable objects:
    this._mBlueSq = new Renderable(this._mConstColorShader);
    this._mBlueSq.SetColor([0.25, 0.25, 0.95, 1]);
    this._mRedSq = new Renderable(this._mConstColorShader);
    this._mRedSq.SetColor([1, 0.25, 0.25, 1]);
    this._mTLSq = new Renderable(this._mConstColorShader);
    this._mTLSq.SetColor([0.9, 0.1, 0.1, 1]);
    this._mTRSq = new Renderable(this._mConstColorShader);
    this._mTRSq.SetColor([0.1, 0.9, 0.1, 1]);
    this._mBRSq = new Renderable(this._mConstColorShader);
    this._mBRSq.SetColor([0.1, 0.1, 0.9, 1]);
    this._mBLSq = new Renderable(this._mConstColorShader);
    this._mBLSq.SetColor([0.1, 0.1, 0.1, 1]);
    
    // Step E: Clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1]);        // Clear the canvas
    
    // Step F: Starts the drawing by activating the camera
    this._mCamera.BeginDraw();
    var vpMatrix = this._mCamera.GetVPMatrix();
    
    // Step G: Draw the blue square
         // Centre Blue, slightly rotated square
        this._mBlueSq.GetXform().SetPosition(20, 60);
        this._mBlueSq.GetXform().SetRotationInRad(0.2); // In Radians
        this._mBlueSq.GetXform().SetSize(5, 5);
        this._mBlueSq.Draw(vpMatrix);
    
    // Step H: Draw the center and the corner squares
        // centre red square
        this._mRedSq.GetXform().SetPosition(20, 60);
        this._mRedSq.GetXform().SetSize(2, 2);
        this._mRedSq.Draw(vpMatrix);

        // top left
        this._mTLSq.GetXform().SetPosition(10, 65);
        this._mTLSq.Draw(vpMatrix);

        // top right
        this._mTRSq.GetXform().SetPosition(30, 65);
        this._mTRSq.Draw(vpMatrix);

        // bottom right
        this._mBRSq.GetXform().SetPosition(30, 55);
        this._mBRSq.Draw(vpMatrix);

        // bottom left
        this._mBLSq.GetXform().SetPosition(10, 55);
        this._mBLSq.Draw(vpMatrix);
};