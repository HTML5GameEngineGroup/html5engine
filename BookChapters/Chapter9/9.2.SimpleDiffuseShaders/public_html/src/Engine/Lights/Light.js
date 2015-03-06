/* 
 * Simple light source
 */

// Constructor
function Light() {
    this._mColor = vec4.fromValues(0.1, 0.1, 0.1, 1);  // light color
    this._mPosition = vec3.fromValues(0, 0, 5); // light position in WC
    this._mRadius = 10;  // effective radius in WC
    this._mIsOn = true;
    
    // glsl uniform position references
    this._mColorRef = null;
    this._mPosRef = null;
    this._mRadiusRef = null;
    this._mIsOnRef = null;
    
    // only knows how to load light to a DiffuseShader!
    var aDiffuseShader = gEngine.DefaultResources.GetDiffuseShader().GetShader();
    this._SetShaderReferences(aDiffuseShader);
};

//<editor-fold desc="public functions">
// simple setters and getters
Light.prototype.SetColor = function(c) { this._mColor = vec4.clone(c); };
Light.prototype.GetColor = function(c) { return this._mColor; };

Light.prototype.Set2DPosition = function(p) { this._mPosition = vec3.fromValues(p[0], p[1], this._mPosition[2]); };
Light.prototype.SetXPos = function(x) { this._mPosition[0] = x; };
Light.prototype.SetYPos = function(y) { this._mPosition[1] = y; };
Light.prototype.SetZPos = function(z) { this._mPosition[2] = z; };
Light.prototype.GetPosition = function() { return this._mPosition; };

Light.prototype.SetRadius = function(r) { this._mRadius = r; };
Light.prototype.GetRadius = function() { return this._mRadius; };

Light.prototype.SetLightOn = function(isOn) {
    this._mIsOn = isOn;
};
//</editor-fold>