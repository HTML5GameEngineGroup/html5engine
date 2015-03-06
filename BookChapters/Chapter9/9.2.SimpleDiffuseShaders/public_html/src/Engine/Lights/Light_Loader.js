/* 
 * Light_Loader: support of loading light info to the glsl shader
 */

//<editor-fold desc="public functions">
Light.prototype.LoadToShader = function(aCamera) {
    var gl = gEngine.Core.GetGL();
    gl.uniform1i(this._mIsOnRef, this._mIsOn);
    if (this._mIsOn) {
        var p = aCamera.WCPosToPixel(this.GetPosition());
        var r = aCamera.WCSizeToPixel(this.GetRadius());
        var c = this.GetColor();

        gl.uniform4fv(this._mColorRef, c);
        gl.uniform3fv(this._mPosRef, p);
        gl.uniform1f(this._mRadiusRef, r);
    }
};

Light.prototype.SwitchOffLight = function() {
    var gl = gEngine.Core.GetGL();
    gl.uniform1i(this._mIsOnRef, false);
};


//</editor-fold>

//<editor-fold desc="private functions">
Light.prototype._SetShaderReferences = function(aDiffuseShader) {
    var gl = gEngine.Core.GetGL();
    gl.useProgram(aDiffuseShader);
    this._mColorRef = gl.getUniformLocation(aDiffuseShader, "uLightColor");
    this._mPosRef = gl.getUniformLocation(aDiffuseShader, "uLightPosition");
    this._mRadiusRef = gl.getUniformLocation(aDiffuseShader, "uLightRadius");
    this._mIsOnRef = gl.getUniformLocation(aDiffuseShader, "uLightOn");
};
//</editor-fold>