/*
 * File: RenderableObject.js
 *  
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a renderable object on the game screen.
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function RenderableObject(shader)
{
    this._mShader = shader;         // the shader for shading this object
    this._mXform = new Transform(); // transform that moves this object around
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
RenderableObject.prototype.Draw = function() {
    var gl = gEngine.Core.GetGL();    
    this._mShader.LoadObjectTransform(this._mXform.GetXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

RenderableObject.prototype.GetXform = function() { return this._mXform; };
//--- end of Public Methods
//</editor-fold>