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
    
    // Step B: Create the shader
    this._mConstColorShader = new SimpleShader(
            "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
    
    // Step C: Create the renderable objects:
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
    this._mBLSq.SetColor([0.1, 0.9, 0.9, 1]);
    
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
    
    //<editor-fold desc="Step F: Set up View and Projection matrices">
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
    
    // Step G: Draw the blue shader
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