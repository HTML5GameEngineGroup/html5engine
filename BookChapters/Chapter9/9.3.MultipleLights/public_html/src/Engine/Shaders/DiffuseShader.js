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
    
    this._mLights = null; 
};
gEngine.Core.InheritPrototype(DiffuseShader, SpriteShader);
//</editor-fold>

// <editor-fold desc="Public Methods">

// Overriding the Activation of the shader for rendering
DiffuseShader.prototype.ActivateShader = function(pixelColor, aCamera) {
    // fist call the super class's activate
    SpriteShader.prototype.ActivateShader.call(this, pixelColor, aCamera);
    
    // now push the light information to the shader
    if (this._mLights !== null) {
        for (var i = 0; i<this._mLights.length; i++)
            this._mLights[i].LoadToShader(aCamera);
    }
};

DiffuseShader.prototype.SetLights = function(l) {
    this._mLights = l;
};
//</editor-fold>