/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{    
    // Step A: Initialize the webGL Context
    gEngine.Core.InitializeWebGL(htmlCanvasID);
    var gl = gEngine.Core.GetGL();
    
    // Step B: Create the shaders: white and then the red shader
    this._mWhiteShader = new SimpleShader(
            "src/GLSLShaders/SimpleVS.glsl",    // Path to the VertexShader 
            "src/GLSLShaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader(
            "src/GLSLShaders/SimpleVS.glsl",    // Path to the VertexShader 
            "src/GLSLShaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // Step C: Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    this._mTLSq = new RenderableObject(this._mRedShader);
    this._mTRSq = new RenderableObject(this._mRedShader);
    this._mBLSq = new RenderableObject(this._mRedShader);
    this._mBRSq = new RenderableObject(this._mRedShader);
    
    // Step D: Clear the entire canvas first
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1]);   // Clear the canvas
    
    //<editor-fold desc="Step E: Setting up Viewport">
    // Step E1: Set up the viewport: area on canvas to be drawn
    gl.viewport(
                20,     // x position of bottom-left corner of the area to be drawn
                40,     // y position of bottom-left corner of the area to be drawn
                600,    // width of the area to be drawn
                300     // height of the area to be drawn
            );
    // Step E2: set up the corresponding scissor area to limit clear area
    gl.scissor(
                20,     // x position of bottom-left corner of the area to be drawn
                40,     // y position of bottom-left corner of the area to be drawn
                600,    // width of the area to be drawn
                300    // height of the area to be drawn
            );    
    // Step E3: enable the scissor area, clear, and then disable the scissor area
    gl.enable(gl.SCISSOR_TEST);
        gEngine.Core.ClearCanvas([0.8, 0.8, 0.8, 1.0]);  // clear the scissor area
    gl.disable(gl.SCISSOR_TEST);    
    //</editor-fold>
    
    //<editor-fold desc="Step 6: Set up View and Projection matrices">
    var viewMatrix = mat4.create();
    var projMatrix = mat4.create();
    // Step F1: define the view matrix
    mat4.lookAt(viewMatrix, 
        [20, 60, 10],   // camera position
        [20, 60, 0],    // look at position
        [0, 1, 0]);     // orientation 
    // Step F2: define the view volume
    mat4.ortho(projMatrix,
        -10,  // distant to left of WC
         10,  // distant to right of WC
        -5,   // distant to bottom of WC
         5,   // distant to top of WC
         0,   // distant to near plane 
         1000  // distant to far plane 
    );
    // Step F3: concatenate to form the View-Projection operator
    var vpMatrix = mat4.create();
    mat4.multiply(vpMatrix, projMatrix, viewMatrix);
    // </editor-fold>
    
    // Step G: Draw with the white shader
         // Centre white, slightly rotated square
        this._mWhiteSq.GetXform().SetPosition(20, 60);
        this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Radians
        this._mWhiteSq.GetXform().SetSize(5, 5);
        this._mWhiteSq.Draw(vpMatrix);
    
    // Step H: Draw with the red shader
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