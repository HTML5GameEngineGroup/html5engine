/* 
 * File: DiffuseShader.js
 * Subclass from SpriteShader
 *          Supports light illumination
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor 
function DiffuseShader(vertexShaderPath, fragmentShaderPath)
{
    // Call sper class constructor
    SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor
    
    this._mLight = null; // defined all the way up in SimpleShader
};
gEngine.Core.InheritPrototype(DiffuseShader, SpriteShader);
//</editor-fold>

// <editor-fold desc="Public Methods">

// Overriding the Activation of the shader for rendering
DiffuseShader.prototype.ActivateShader = function(pixelColor, aCamera) {
    // fist call the super class's activate
    SpriteShader.prototype.ActivateShader.call(this, pixelColor, aCamera);
    
    // now push the light information to the shader
    if (this._mLight !== null)
        this._mLight.LoadToShader(aCamera);
};

DiffuseShader.prototype.SetLight = function(l) {
    this._mLight = l;
};
//</editor-fold>