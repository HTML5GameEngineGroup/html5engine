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
    this._mShader = shader; // the shader for shading this object
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
Renderable.prototype.Draw = function() {
    var gl = gEngine.Core.GetGL();
    this._mShader.ActivateShader();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
//--- end of Public Methods
//</editor-fold>
