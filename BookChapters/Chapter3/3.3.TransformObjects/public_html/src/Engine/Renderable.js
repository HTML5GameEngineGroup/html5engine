/*
 * File: Renderable.js
 *  
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a renderable object on the game screen.
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Renderable(shader)
{
    this._mShader = shader;         // the shader for shading this object
    this._mXform = new Transform(); // transform that moves this object around
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
Renderable.prototype.Draw = function() {
    var gl = gEngine.Core.GetGL();    
    this._mShader.ActivateShader();  // always activate the shader first!
    this._mShader.LoadObjectTransform(this._mXform.GetXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

Renderable.prototype.GetXform = function() { return this._mXform; };
//--- end of Public Methods
//</editor-fold>