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
    
    // glsl uniform position references
    this._mColorRef = null;
    this._mPosRef = null;
    this._mRadiusRef = null;
    this._mIsOnRef = null;
    
    this._mLight = null; // <-- this is the light soruce in the Game Engine
    //
    // create the references to these uniforms in the LightShader
    var shader = this._mCompiledShader;
    var gl = gEngine.Core.GetGL();
    this._mColorRef = gl.getUniformLocation(shader, "uLightColor");
    this._mPosRef = gl.getUniformLocation(shader, "uLightPosition");
    this._mRadiusRef = gl.getUniformLocation(shader, "uLightRadius");
    this._mIsOnRef = gl.getUniformLocation(shader, "uLightOn");
};
gEngine.Core.InheritPrototype(LightShader, SpriteShader);
//</editor-fold>

// <editor-fold desc="Public Methods">

// Overriding the Activation of the shader for rendering
LightShader.prototype.ActivateShader = function(pixelColor, aCamera) {
    // fist call the super class's activate
    SpriteShader.prototype.ActivateShader.call(this, pixelColor, aCamera);
    
    // now push the light information to the shader
    if (this._mLight !== null)
        this._LoadToShader(aCamera);
    else
        gEngine.Core.GetGL().uniform1i(this._mIsOnRef, false); // <-- switch off the light!
};

LightShader.prototype.SetLight = function(l) {
    this._mLight = l;
};

LightShader.prototype._LoadToShader = function(aCamera) {
    var gl = gEngine.Core.GetGL();
    gl.uniform1i(this._mIsOnRef, this._mLight.IsLightOn());
    if (this._mLight.IsLightOn()) {
        var p = aCamera.WCPosToPixel(this._mLight.GetPosition());
        var r = aCamera.WCSizeToPixel(this._mLight.GetRadius());
        var c = this._mLight.GetColor();

        gl.uniform4fv(this._mColorRef, c);
        gl.uniform4fv(this._mPosRef, vec4.fromValues(p[0], p[1], p[2], 1));
        gl.uniform1f(this._mRadiusRef, r);
    }
};
//</editor-fold>