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
    this._mTLSq = new RenderableObject(this._mRedShader);
    this._mTRSq = new RenderableObject(this._mRedShader);
    this._mBLSq = new RenderableObject(this._mRedShader);
    this._mBRSq = new RenderableObject(this._mRedShader);
    
    // 4. Now we can Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    
    //<editor-fold desc="Setting up Viewport">
    // Set up the viewport: area on canvas to be drawn
    gEngineCore.GetGL().viewport(
                20,     // x position of bottom-left corner of the area to be drawn
                40,     // y position of bottom-left corner of the area to be drawn
                600,    // width of the area to be drawn
                300     // height of the area to be drawn
            );
    gEngineCore.GetGL().scissor(
                20,     // x position of bottom-left corner of the area to be drawn
                40,     // y position of bottom-left corner of the area to be drawn
                600,    // width of the area to be drawn
                300    // height of the area to be drawn
            );
    gEngineCore.GetGL().clearColor(0.0, 0.0, 0.0, 1.0);  // set the color to be cleared
    gEngineCore.GetGL().enable(gEngineCore.GetGL().SCISSOR_TEST);
        gEngineCore.ClearCanvas();  // set the color to be cleared
    gEngineCore.GetGL().disable(gEngineCore.GetGL().SCISSOR_TEST);    
    //</editor-fold>
    
    //<editor-fold desc="Set up View and Projection matrices">
    var viewMatrix = mat4.create();
    var projMatrix = mat4.create();
    
    mat4.lookAt(viewMatrix, 
        [20, 60, 10],   // camera position
        [20, 60, 0],    // look at position
        [0, 1, 0]);     // orientation vector
        
    mat4.ortho(projMatrix,
        -10,  // distant to left of frustum
         10,  // distant to right of frustum
        -5,   // distant to bottom of frustum
         5,   // distant to top of frustum
         0,   // distant to near plane of frustum
         1000  // distant to far plane of frustum
    );
    var vpMatrix = mat4.create();
    mat4.multiply(vpMatrix, projMatrix, viewMatrix);
    // </editor-fold>
    
    // Draw with the white shader
    this._mWhiteShader.ActivateShader(vpMatrix);
        // Centre white, slightly rotated square
        this._mWhiteSq.GetXform().SetPosition(20, 60);
        this._mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
        this._mWhiteSq.GetXform().SetSize(5, 5);
        this._mWhiteSq.Draw();
    
    // Draw with the red shader
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
