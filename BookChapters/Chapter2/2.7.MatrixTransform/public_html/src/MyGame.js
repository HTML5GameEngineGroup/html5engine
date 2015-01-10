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
    this._mWhiteSq = null;		// these are the renderable objects
    this._mRedSq = null;    
    
    // Step 1: Initialize the webGL Context
    gEngineCore.InitializeWebGL(htmlCanvasID);
    
    // Step 2: Create the shaders: white and then the red shader
    this._mWhiteShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader(
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    // Step 3. Create the renderable objects:
    this._mWhiteSq = new RenderableObject(this._mWhiteShader);
    this._mRedSq = new RenderableObject(this._mRedShader);
    
    // Step 4: Draw!
    gEngineCore.ClearCanvas();        // 1. Clear the canvas
    
    // instead of simply drawing the squares, let's apply simple transforms
    var xform = mat4.create();
        
    
    // Step 5: compute the white square transform 
    mat4.translate(xform, xform, vec3.fromValues(-0.25, 0.25, 0.0));
    mat4.rotateZ(xform, xform, 0.2); // rotation is in radian
    mat4.scale(xform, xform, vec3.fromValues(1.2, 1.2, 1.0));
    // Step 6: draw the white square with the computed transform
    this._mWhiteShader.ActivateShader();  // activates the shader
        this._mWhiteSq.Draw(xform);       // draw all objects of this shader
    
    // Step 7: compute the red square transform
    mat4.identity(xform); // restart
    mat4.translate(xform, xform, vec3.fromValues(0.25, -0.25, 0.0));
    mat4.rotateZ(xform, xform, -0.785); // rotation is in radian (about -45-degree)
    mat4.scale(xform, xform, vec3.fromValues(0.4, 0.4, 1.0));
    // Step 8: draw the red square with the computed transform
    this._mRedShader.ActivateShader();  // activates the shader  
        this._mRedSq.Draw(xform);       // draw all objects of this shader
};