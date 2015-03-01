/*
 * File: Renderable.js
 *  
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a renderable object on the game screen.
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Renderable()
{
    this._mShader = gEngine.DefaultResources.GetConstColorShader();  // this is the default
    this._mXform = new Transform(); // transform that moves this object around
    this._mColor = [1, 1, 1, 1];
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
Renderable.prototype.Draw = function(vpMatrix) {
    var gl = gEngine.Core.GetGL();    
    this._mShader.ActivateShader(this._mColor, vpMatrix);  // always activate the shader first!
    this._mShader.LoadObjectTransform(this._mXform.GetXform());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

Renderable.prototype.GetXform = function() { return this._mXform; };
Renderable.prototype.SetColor = function(color) { this._mColor = color; };
Renderable.prototype.GetColor = function() { return this._mColor; };
//--- end of Public Methods
//</editor-fold>

Renderable.prototype._SetShader = function(s) { this._mShader = s; };