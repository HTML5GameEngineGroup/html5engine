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
    this._mShader = shader; // the shader for shading this object
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
RenderableObject.prototype.Draw = function(modelTransform) {
    var gl = gEngineCore.GetGL();
    this._mShader.ActivateShader(modelTransform);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
//--- end of Public Methods
//</editor-fold>