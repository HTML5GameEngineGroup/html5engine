/* 
 * File: LightShader.js
 * Subclass from SpriteShader
 *          Supports light illumination
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor 
function LightShader(vertexShaderPath, fragmentShaderPath)
{
    // Call sper class constructor
    SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor
    
    this._mLights = null;  // lights from the renderable
    
    //*****************************
    // this number MUST correspond to the GLSL uLight[] array size (for LightFS.glsl and IllumFS.glsl)
    //**********************************
    this._kGLSLuLightArraySize = 4;  // <-- make sure this is the same as LightFS.glsl and IllumFS.glsl
    this._mShaderLights = [];
    for (var i = 0; i<this._kGLSLuLightArraySize; i++) {
        var ls = new ShaderLightAtIndex(this._mCompiledShader, i);
        this._mShaderLights.push(ls);
    }
    
};
gEngine.Core.InheritPrototype(LightShader, SpriteShader);
//</editor-fold>

// <editor-fold desc="Public Methods">

// Overriding the Activation of the shader for rendering
LightShader.prototype.ActivateShader = function(pixelColor, aCamera) {
    // fist call the super class's activate
    SpriteShader.prototype.ActivateShader.call(this, pixelColor, aCamera);
    
    // now push the light information to the shader
    var numLight = 0;
    if (this._mLights !== null) {
        for (; numLight<this._mLights.length; numLight++)
            this._mShaderLights[numLight].LoadToShader(aCamera, this._mLights[numLight]);
    }
    for (; numLight < 4; numLight++)
        this._mShaderLights[numLight].SwitchOffLight(); // switch off unused lights
};

LightShader.prototype.SetLights = function(l) {
    this._mLights = l;
};
//</editor-fold>