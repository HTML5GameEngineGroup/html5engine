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
        var n = aCamera.WCSizeToPixel(aLight.GetNear());
        var f = aCamera.WCSizeToPixel(aLight.GetFar());
        var c = aLight.GetColor();
        var gl = gEngine.Core.GetGL();
        gl.uniform4fv(this._mColorRef, c);
        gl.uniform4fv(this._mPosRef, vec4.fromValues(p[0], p[1], p[2], 1));
        gl.uniform1f(this._mNearRef, n);
        gl.uniform1f(this._mFarRef, f);
        gl.uniform1f(this._mIntensityRef, aLight.GetIntensity());
        
        if (aLight.GetLightType() === Light.eLightType.ePoint) {
            gl.uniform4fv(this._mDirRef, vec4.fromValues(0, 0, 0, 0));
            gl.uniform1f(this._mDropOffRef, -1);
        } else {
            // must compute direction
            var d = new Array();
            vec4.add(d, aLight.GetPosition(), aLight.GetDirection());
            var ptPixel = aCamera.WCPosToPixel(d);
            vec4.sub(d, ptPixel, p);
            gl.uniform4fv(this._mDirRef, vec4.fromValues(d[0], d[1], d[2], 1));
            if (aLight.GetLightType() === Light.eLightType.eDirectional)
                gl.uniform1f(this._mDropOffRef, -1);
            else {
                gl.uniform1f(this._mInnerRef, aLight.GetInner());
                gl.uniform1f(this._mOuterRef, aLight.GetOuter());
                gl.uniform1f(this._mDropOffRef, aLight.GetDropOff());
            }
        }
    }
};

ShaderLightAtIndex.prototype.SwitchOffLight = function() {
    var gl = gEngine.Core.GetGL();
    gl.uniform1i(this._mIsOnRef, false);
};
//</editor-fold>

//<editor-fold desc="private functions">
ShaderLightAtIndex.prototype._SetShaderReferences = function(aLightShader, index) {
    var gl = gEngine.Core.GetGL();
    this._mColorRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].Color");
    this._mPosRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Position");
    this._mDirRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Direction");
    this._mNearRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].Near");
    this._mFarRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Far");
    this._mInnerRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].Inner");
    this._mOuterRef = gl.getUniformLocation(aLightShader,     "uLights[" + index + "].Outer");
    this._mIntensityRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Intensity");
    this._mDropOffRef = gl.getUniformLocation(aLightShader,   "uLights[" + index + "].DropOff");
    this._mIsOnRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].IsOn");
};
//</editor-fold>