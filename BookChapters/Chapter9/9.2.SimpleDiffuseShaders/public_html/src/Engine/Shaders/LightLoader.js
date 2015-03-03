/* 
 * LightLoader: capable of loading light source information to a DiffuseShader
 */

// Constructor
function LightLoader(aDiffuseShader, aLight) {    
    // glsl uniform position references
    this._mColorRef = null;
    this._mPosRef = null;
    this._mRadiusRef = null;
    this._mTheLight = aLight;
    this._SetShaderReferences(aDiffuseShader);
};

//<editor-fold desc="public functions">
LightLoader.prototype.LoadToShader = function(aCamera) {
    var gl = gEngine.Core.GetGL();
    var p = aCamera.WCPosToPixel(this._mTheLight.GetPosition());
    var r = aCamera.WCSizeToPixel(this._mTheLight.GetRadius());
    var c = this._mTheLight.GetColor();
    gl.uniform4fv(this._mColorRef, c);
    gl.uniform3fv(this._mPosRef, p);
    gl.uniform1f(this._mRadiusRef, r);
};
//</editor-fold>

//<editor-fold desc="private functions">
LightLoader.prototype._SetShaderReferences = function(aDiffuseShader) {
    var gl = gEngine.Core.GetGL();
    this._mColorRef = gl.getUniformLocation(aDiffuseShader, "uLightColor");
    this._mPosRef = gl.getUniformLocation(aDiffuseShader, "uLightPosition");
    this._mRadiusRef = gl.getUniformLocation(aDiffuseShader, "uLightRadius");
};
//</editor-fold>