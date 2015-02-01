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
    this._mShader = shader;       // the shader for shading this object
    this._mColor = [1, 1, 1, 1];  // Color for fragment shader
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
Renderable.prototype.Draw = function(modelTransform) {
    var gl = gEngine.Core.GetGL();
    this._mShader.ActivateShader(this._mColor);  // always activate the shader first!
    this._mShader.LoadObjectTransform(modelTransform);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
Renderable.prototype.SetColor = function(color) { this._mColor = color; };
Renderable.prototype.GetColor = function() { return this._mColor; };
//--- end of Public Methods
//</editor-fold>