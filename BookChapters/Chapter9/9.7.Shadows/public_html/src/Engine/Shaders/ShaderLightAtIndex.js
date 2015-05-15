/*
 * File: ShaderLightAtIndex.js 
 * support of loading light info to the glsl shader
 *      references are pointing to uLight[index]
 */
/*jslint node: true, vars: true */
/*global gEngine, vec4, Light */
/* find out more about jslint: http://www.jslint.com/lint.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ShaderLightAtIndex(shader, index) {
    this._setShaderReferences(shader, index);
}

//<editor-fold desc="public functions">
ShaderLightAtIndex.prototype.loadToShader = function (aCamera, aLight) {
    var gl = gEngine.Core.getGL();
    gl.uniform1i(this.mIsOnRef, aLight.isLightOn());
    if (aLight.isLightOn()) {
        var p = aCamera.wcPosToPixel(aLight.getPosition());
        var n = aCamera.wcSizeToPixel(aLight.getNear());
        var f = aCamera.wcSizeToPixel(aLight.getFar());
        var c = aLight.getColor();
        gl.uniform4fv(this.mColorRef, c);
        gl.uniform4fv(this.mPosRef, vec4.fromValues(p[0], p[1], p[2], 1));
        gl.uniform1f(this.mNearRef, n);
        gl.uniform1f(this.mFarRef, f);
        gl.uniform1f(this.mInnerRef, 0.0);
        gl.uniform1f(this.mOuterRef, 0.0);
        gl.uniform1f(this.mIntensityRef, aLight.getIntensity());
        gl.uniform1f(this.mDropOffRef, 0);
        gl.uniform1i(this.mLightTypeRef, aLight.getLightType());

        if (aLight.getLightType() === Light.eLightType.ePointLight) {
            gl.uniform4fv(this.mDirRef, vec4.fromValues(0, 0, 0, 1));
        } else {
            // either spot or directional lights: must compute direction
            var d = aCamera.wcDirToPixel(aLight.getDirection());
            gl.uniform4fv(this.mDirRef, vec4.fromValues(d[0], d[1], d[2], 1));
            if (aLight.getLightType() === Light.eLightType.eSpotLight) {
                gl.uniform1f(this.mInnerRef, aLight.getInner());
                gl.uniform1f(this.mOuterRef, aLight.getOuter());
                gl.uniform1f(this.mDropOffRef, aLight.getDropOff());
            }
        }
    }
};

ShaderLightAtIndex.prototype.switchOffLight = function () {
    var gl = gEngine.Core.getGL();
    gl.uniform1i(this.mIsOnRef, false);
};
//</editor-fold>

//<editor-fold desc="private functions">
ShaderLightAtIndex.prototype._setShaderReferences = function (aLightShader, index) {
    var gl = gEngine.Core.getGL();
    this.mColorRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].Color");
    this.mPosRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Position");
    this.mDirRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Direction");
    this.mNearRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].Near");
    this.mFarRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Far");
    this.mInnerRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].Inner");
    this.mOuterRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].Outer");
    this.mIntensityRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Intensity");
    this.mDropOffRef = gl.getUniformLocation(aLightShader,   "uLights[" + index + "].DropOff");
    this.mIsOnRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].IsOn");
    this.mLightTypeRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].LightType");
};
//</editor-fold>