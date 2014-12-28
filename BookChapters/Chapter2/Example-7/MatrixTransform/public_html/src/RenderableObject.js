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
    this.mShader = shader; // the shader for shading this object
    this.mVertexBuffer = vertexBuffer; // the vertex buffer that defines the vertices of this object
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
RenderableObject.prototype.Draw = function(modelTransform) {
    this.mShader.ActivateShader(modelTransform);
    this.mVertexBuffer.ActivateAndDraw();
};
//--- end of Public Methods
//</editor-fold>