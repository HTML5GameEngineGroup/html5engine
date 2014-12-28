/*
 * File: MyGame.js 
 * This is the the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID)
{
    // The shaders for drawing: one red and one white
    this.mRedShader = null;
    this.mWhiteShader = null;
    
    // The vertex buffer that contains the square vertices
    this.mVertexBuffer = null;
    
    this.mWhiteSq = null;		// these are the renderable objects
    this.mRedSq = null;
    
    
    // 1. Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // 2. Now create the shaders
    this.mWhiteShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVertexShader.glsl",      // Path to the VertexShader 
            "shaders/WhiteFragmentShader.glsl");    // Path to the White FragmentShader
    
    this.mRedShader = new ShaderProgram(gEngineCore.GetGL(), 
            "shaders/SimpleVertexShader.glsl",      // Path to the VertexShader 
            "shaders/RedFragmentShader.glsl");      // Path to the Red FragmentShader
    
    // 3. Now initialize the buffer with the vertex positions for the unit square
    this.mVertexBuffer = new VertexBuffer(gEngineCore.GetGL());
    
    // 4. Create the renderable objects:
    this.mWhiteSq = new RenderableObject(this.mWhiteShader, this.mVertexBuffer);
    this.mRedSq = new RenderableObject(this.mRedShader, this.mVertexBuffer);
    
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
    this.mWhiteShader.LoadViewProjMatrix(vpMatrix);
    this.mRedShader.LoadViewProjMatrix(vpMatrix);
    // </editor-fold>
    
    // Centre white, slightly rotated square
    this.mWhiteSq.GetXform().SetPosition(20, 60);
    this.mWhiteSq.GetXform().SetRotationInRad(0.2); // In Degree
    this.mWhiteSq.GetXform().SetSize(5, 5);
    this.mWhiteSq.Draw();
    
    // centre red square
    this.mRedSq.GetXform().SetPosition(20, 60);
    this.mRedSq.GetXform().SetSize(2, 2);
    this.mRedSq.Draw();
    
    // top left
    this.mRedSq.GetXform().SetPosition(10, 65);
    this.mRedSq.Draw();
    
    // top right
    this.mRedSq.GetXform().SetPosition(30, 65);
    this.mRedSq.Draw();
    
    // bottom right
    this.mRedSq.GetXform().SetPosition(30, 55);
    this.mRedSq.Draw();
    
    // bottom left
    this.mRedSq.GetXform().SetPosition(10, 55);
    this.mRedSq.Draw();
};
