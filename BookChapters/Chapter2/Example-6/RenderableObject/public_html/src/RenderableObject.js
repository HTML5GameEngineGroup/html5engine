/*
 * File: RenderableObject.js
 *  
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a renderable object on the game screen.
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function RenderableObject(shader, vertexBuffer)
{
    
    var mShader = shader; // the shader for shading this object
    var mVertexBuffer = vertexBuffer; // the vertex buffer that defines the vertices of this object
    
    //**-----------------------------------------
    // Private methods
    //**-----------------------------------------
        var GetShader = function() { return mShader; };
        var GetVB = function() { return mVertexBuffer; };
    //--- end of Private methods
    
    //
    //**-----------------------------------------
    // Public methods
    //**-----------------------------------------
    var Draw = function() {
        mShader.ActivateShader();
        mVertexBuffer.ActivateAndDraw();
    };
    //--- end of Public Methods
    
    var publicMethods = {
        privateMethod1 : GetShader,
        privateMethod2 : GetVB,
        
        Draw : Draw
    };
    
    return publicMethods;
}