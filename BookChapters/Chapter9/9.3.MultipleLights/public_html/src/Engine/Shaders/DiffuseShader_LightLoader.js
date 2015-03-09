/* 
 * LightAtIndex: support of loading light info to the glsl shader
 *      references are pointing to uLight[index]
 */
function ShaderLightAtIndex(shader, index)
{
    this._SetShaderReferences(shader, index);
}
//<editor-fold desc="public functions">
ShaderLightAtIndex.prototype.LoadToShader = function(aCamera, aLight) {
    var gl = gEngine.Core.GetGL();
    gl.uniform1i(this._mIsOnRef, aLight.LightIsOn());
    if (aLight.LightIsOn()) {
        var p = aCamera.WCPosToPixel(aLight.GetPosition());
        var ic = aCamera.WCSizeToPixel(aLight.GetInnerCone());
        var oc = aCamera.WCSizeToPixel(aLight.GetOuterCone());
        var c = aLight.GetColor();
        var gl = gEngine.Core.GetGL();
        gl.uniform4fv(this._mColorRef, c);
        gl.uniform4fv(this._mPosRef, vec4.fromValues(p[0], p[1], p[2], 1));
        gl.uniform1f(this._mInnerConeRef, ic);
        gl.uniform1f(this._mOutterConeRef, oc);
        gl.uniform1f(this._mIntensityRef, aLight.GetIntensity());
    }
};

ShaderLightAtIndex.prototype.SwitchOffLight = function() {
    var gl = gEngine.Core.GetGL();
    gl.uniform1i(this._mIsOnRef, false);
};
//</editor-fold>

//<editor-fold desc="private functions">
ShaderLightAtIndex.prototype._SetShaderReferences = function(aDiffuseShader, index) {
    var gl = gEngine.Core.GetGL();
    gl.useProgram(aDiffuseShader);
    this._mColorRef = gl.getUniformLocation(aDiffuseShader,      "uLights[" + index + "].Color");
    this._mPosRef = gl.getUniformLocation(aDiffuseShader,        "uLights[" + index + "].Position");
    this._mInnerConeRef = gl.getUniformLocation(aDiffuseShader,  "uLights[" + index + "].Inner");
    this._mOutterConeRef = gl.getUniformLocation(aDiffuseShader, "uLights[" + index + "].Outer");
    this._mIntensityRef = gl.getUniformLocation(aDiffuseShader,  "uLights[" + index + "].Intensity");
    this._mIsOnRef = gl.getUniformLocation(aDiffuseShader,       "uLights[" + index + "].IsOn");
};


//</editor-fold>