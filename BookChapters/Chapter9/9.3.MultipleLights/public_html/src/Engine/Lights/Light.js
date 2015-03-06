/* 
 * Simple light source
 *      Assumes DiffuseShader has an array of Light, the name of the array is assum to be "uLights[]"
 */

// Constructor
function Light(index) {
    this._mColor = vec4.fromValues(1, 1, 1, 1);  // light color
    this._mPosition = vec4.fromValues(0, 0, 5, 1); // light position in WC
    this._mInnerCone = 5;  // effective radius in WC
    this._mOuterCone = 10;
    this._mIntensity = 1;
    this._mIsOn = true;
    
    // glsl uniform position references
    this._mColorRef = null;
    this._mPosRef = null;
    this._mInnerConeRef = null;
    this._mOutterConeRef = null;
    this._mIntensityRef = null;
    this._mIsOnRef = null;
    
    // only knows how to load light to a DiffuseShader!
    var aDiffuseShader = gEngine.DefaultResources.GetDiffuseShader().GetShader();
    this._SetShaderReferences(aDiffuseShader, index);
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

Light.prototype.SetInnerCone = function(r) { this._mInnerCone = r; };
Light.prototype.GetInnerCone = function() { return this._mInnerCone; };

Light.prototype.SetOuterCone = function(r) { this._mOuterCone = r; };
Light.prototype.GetOuterCone = function() { return this._mOuterCone; };

Light.prototype.SetIntensity = function(i) { this._mIntensity = i; };
Light.prototype.GetIntensity = function() { return this._mIntensity; };


// loading to the shader
Light.prototype.LoadToShader = function(shader, aCamera, index) {
    this._mLightLoader.LoadToShader(shader, aCamera, index);
};

Light.prototype.SetLightOn = function(isOn) {
    this._mLightLoader.SetLightOn(isOn);
};
//</editor-fold>