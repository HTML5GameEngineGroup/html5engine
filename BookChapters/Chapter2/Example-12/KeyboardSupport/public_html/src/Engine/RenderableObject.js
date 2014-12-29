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
    this._mShader = shader; // the shader for shading this object
    this._mVertexBuffer = vertexBuffer; // the vertex buffer that defines the vertices of this object
    this._mXform = new Transform();     // transform that moves this object around
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
RenderableObject.prototype.Draw = function() {
    this._mShader.ActivateShader(this._mXform.GetXform());
    this._mVertexBuffer.ActivateAndDraw();
};

RenderableObject.prototype.GetXform = function() { return this._mXform; }
//--- end of Public Methods
//</editor-fold>