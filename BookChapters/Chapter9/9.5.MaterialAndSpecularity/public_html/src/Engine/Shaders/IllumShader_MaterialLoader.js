/* 
 * File: IllumShader_MaterialLoader.js
 * Knows how to load aMaterial into the IllumShader
 * Rederences point to uMaterial.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor 
function ShaderMaterial(aIllumShader)
{    
    // reference to the normal map sampler
    var gl = gEngine.Core.GetGL();
    this._mKaRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ka");
    this._mKdRef = gl.getUniformLocation(aIllumShader, "uMaterial.Kd");
    this._mKsRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ks");
    this._mShineRef = gl.getUniformLocation(aIllumShader, "uMaterial.Shinningness");
};
//</editor-fold>

// <editor-fold desc="Public Methods">
// Loads material onto the shader
ShaderMaterial.prototype.LoadToShader = function(aMaterial) {
    var gl = gEngine.Core.GetGL();
    gl.uniform4fv(this._mKaRef, aMaterial.GetAmbient());
    gl.uniform4fv(this._mKdRef, aMaterial.GetDiffuse());
    gl.uniform4fv(this._mKsRef, aMaterial.GetSpecular());
    gl.uniform1f(this._mShineRef, aMaterial.GetShinningness());
};
//</editor-fold>