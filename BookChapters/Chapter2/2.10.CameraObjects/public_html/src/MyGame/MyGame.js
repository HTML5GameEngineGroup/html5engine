/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{   
    // Step A: Initialize the webGL Context
    gEngine.Core.InitializeWebGL(htmlCanvasID);
    
    // Step B: Setup the camera
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // center of the WC
            20,                        // width of WC
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );

    // Step C: Create the shaders: white and then the red shader
    this._mWhiteShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // Step D: Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    this._mTLSq = new RenderableObject(this._mRedShader);
    this._mTRSq = new RenderableObject(this._mRedShader);
    this._mBLSq = new RenderableObject(this._mRedShader);
    this._mBRSq = new RenderableObject(this._mRedShader);
    
    // Step E: Clear the canvas
    gEngine.Core.ClearCanvas();        // Clear the canvas
    
    // Step F: Starts the drawing by activating the camera
    this._mCamera.BeginDraw();
    var vpMatrix = this._mCamera.GetVPMatrix();
    
    // Step G: Draw with the white shader
        // Centre white, slightly rotated square
        this._mWhiteSq.GetXform().SetPosition(20, 60);
        this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
        this._mWhiteSq.GetXform().SetSize(5, 5);
        this._mWhiteSq.Draw(vpMatrix);
    
    // Step H: Draw with the red shader
    this._mRedShader.ActivateShader(this._mCamera.GetVPMatrix());
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