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
    this._mWhiteSq = null;        // these are the renderable objects
    this._mRedSq = null;
    this._mTLSq = null;     // top-left square
    this._mTRSq = null;     // top-right
    this._mBLSq = null;     // bottom-left
    this._mBRSq = null;     // bottom-right
    
    // Step A: Initialize the webGL Context
    gEngine.Core.InitializeWebGL(htmlCanvasID);
    var gl = gEngine.Core.GetGL();
    
    
    // Step B: Create the shaders: white and then the red shader
    this._mWhiteShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // Step C: Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    this._mTLSq = new RenderableObject(this._mRedShader);
    this._mTRSq = new RenderableObject(this._mRedShader);
    this._mBLSq = new RenderableObject(this._mRedShader);
    this._mBRSq = new RenderableObject(this._mRedShader);
    
    // Step D: Draw!
    gEngine.Core.ClearCanvas();        // 1. Clear the canvas
    
    //<editor-fold desc="Step E: Setting up Viewport">
    // Step E1: Set up the viewport: area on canvas to be drawn
    gl.viewport(
                20,     // x position of bottom-left corner of the area to be drawn
                40,     // y position of bottom-left corner of the area to be drawn
                600,    // width of the area to be drawn
                300     // height of the area to be drawn
            );
    // Step E2: set up the corresponding scissor area to limite clear area
    gl.scissor(
                20,     // x position of bottom-left corner of the area to be drawn
                40,     // y position of bottom-left corner of the area to be drawn
                600,    // width of the area to be drawn
                300    // height of the area to be drawn
            );
    // Step E3: set the color to be clear to black
    gl.clearColor(0.8, 0.8, 0.8, 1.0);  // set the color to be cleared
    // Step 5d: enable the scissor area, clear, and then disable the scissor area
    gl.enable(gl.SCISSOR_TEST);
        gEngine.Core.ClearCanvas();  // set the color to be cleared
    gl.disable(gl.SCISSOR_TEST);    
    //</editor-fold>
    
    //<editor-fold desc="Step 6: Set up View and Projection matrices">
    var viewMatrix = mat4.create();
    var projMatrix = mat4.create();
    // Step 6a: define the view matrix
    mat4.lookAt(viewMatrix, 
        [20, 60, 10],   // camera position
        [20, 60, 0],    // look at position
        [0, 1, 0]);     // orientation vector
    // Step 6b: define the view volume
    mat4.ortho(projMatrix,
        -10,  // distant to left of frustum
         10,  // distant to right of frustum
        -5,   // distant to bottom of frustum
         5,   // distant to top of frustum
         0,   // distant to near plane of frustum
         1000  // distant to far plane of frustum
    );
    // Step 6c: concatenate the view and projection matrix into one
    var vpMatrix = mat4.create();
    mat4.multiply(vpMatrix, projMatrix, viewMatrix);
    // </editor-fold>
    
    // Step 7: Draw with the white shader
    this._mWhiteShader.ActivateShader(vpMatrix);
        // Centre white, slightly rotated square
        this._mWhiteSq.GetXform().SetPosition(20, 60);
        this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
        this._mWhiteSq.GetXform().SetSize(5, 5);
        this._mWhiteSq.Draw();
    
    // Step 8: Draw with the red shader
    this._mRedShader.ActivateShader(vpMatrix);
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
