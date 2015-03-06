/* 
 * Light_Loader: support of loading light info to the glsl shader
 */

//<editor-fold desc="public functions">
LightAtShaderIndex.prototype.LoadToShader = function(aCamera) {
    var gl = gEngine.Core.GetGL();
    gl.uniform1i(this._mIsOnRef, this._mIsOn);
    if (this._mIsOn) {
        var p = aCamera.WCPosToPixel(this.GetPosition());
        var ic = aCamera.WCSizeToPixel(this.GetInnerCone());
        var oc = aCamera.WCSizeToPixel(this.GetOuterCone());
        var c = this.GetColor();
        var gl = gEngine.Core.GetGL();
        gl.uniform4fv(this._mColorRef, c);
        gl.uniform4fv(this._mPosRef, vec4.fromValues(p[0], p[1], p[2], 1));
        gl.uniform1f(this._mInnerConeRef, ic);
        gl.uniform1f(this._mOutterConeRef, oc);
        gl.uniform1f(this._mIntensityRef, this.GetIntensity());
    }
};

LightAtShaderIndex.prototype.SwitchOffLightInShader = function() {
    var gl = gEngine.Core.GetGL();
    gl.uniform1i(this._mIsOnRef, false);
};


//</editor-fold>

//<editor-fold desc="private functions">
LightAtShaderIndex.prototype._SetShaderReferences = function(aDiffuseShader, index) {
    var gl = gEngine.Core.GetGL();
    gl.useProgram(aDiffuseShader);
    this._mColorRef = gl.getUniformLocation(aDiffuseShader,      "uLights[" + index + "].Color");
    this._mPosRef = gl.getUniformLocation(aDiffuseShader,        "uLights[" + index + "].Position");
    this._mInnerConeRef = gl.getUniformLocation(aDiffuseShader,  "uLights[" + index + "].Inner");
    this._mOutterConeRef = gl.getUniformLocation(aDiffuseShader, "uLights[" + index + "].Outer");
    this._mIntensityRef = gl.getUniformLocation(aDiffuseShader,  "uLights[" + index + "].Intensity");
    this._mIsOnRef = gl.getUniformLocation(aDiffuseShader,       "uLights[" + index + "].IsOn");
    
    gl.uniform4fv(this._mColorRef, vec4.fromValues(index/4, 0, 0, 1));
};
//</editor-fold>