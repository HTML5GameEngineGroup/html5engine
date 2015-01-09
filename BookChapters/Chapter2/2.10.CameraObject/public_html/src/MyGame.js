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
    this._mTLSq = null;     // top-left square
    this._mTRSq = null;     // top-right
    this._mBLSq = null;     // bottom-left
    this._mBRSq = null;     // bottom-right
    
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    
    // 1. Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    this._mWhiteShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // 3. Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    this._mTLSq = new RenderableObject(this._mRedShader);
    this._mTRSq = new RenderableObject(this._mRedShader);
    this._mBLSq = new RenderableObject(this._mRedShader);
    this._mBRSq = new RenderableObject(this._mRedShader);
    
    // 4. Now we can Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    
    // 5. Starts the drawing by activating the camera
    this._mCamera.BeginDraw();
    
      
    // Draw with the white shader
    this._mWhiteShader.ActivateShader(this._mCamera.GetVPMatrix());
        // Centre white, slightly rotated square
        this._mWhiteSq.GetXform().SetPosition(20, 60);
        this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
        this._mWhiteSq.GetXform().SetSize(5, 5);
        this._mWhiteSq.Draw();
    
    // Draw with the red shader
    this._mRedShader.ActivateShader(this._mCamera.GetVPMatrix());
        // centre red square
        this._mRedSq.GetXform().SetPosition(20, 60);
        this._mRedSq.GetXform().SetSize(2, 2);
        this._mRedSq.Draw();

        // top left
        this._mTLSq.GetXform().SetPosition(10, 65);
        this._mTLSq.Draw();

        // top right
        this._mTRSq.GetXform().SetPosition(30, 65);
        this._mTRSq.Draw();

        // bottom right
        this._mBRSq.GetXform().SetPosition(30, 55);
        this._mBRSq.Draw();

        // bottom left
        this._mBLSq.GetXform().SetPosition(10, 55);
        this._mBLSq.Draw();
};