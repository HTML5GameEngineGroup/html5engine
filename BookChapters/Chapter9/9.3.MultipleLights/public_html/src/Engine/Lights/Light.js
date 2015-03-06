/* 
 * Simple light source
 *      Assumes DiffuseShader has an array of Light, the name of the array is assum to be "uLights[]"
 */

// Constructor
function LightAtShaderIndex(index) {
    this._mShaderLightIndex = index; // this is the index of the shader uLights array
    
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
LightAtShaderIndex.prototype.GetShaderLightIndex = function() { return this._mShaderLightIndex; }; 

LightAtShaderIndex.prototype.SetColor = function(c) { this._mColor = vec4.clone(c); };
LightAtShaderIndex.prototype.GetColor = function(c) { return this._mColor; };

LightAtShaderIndex.prototype.Set2DPosition = function(p) { this._mPosition = vec3.fromValues(p[0], p[1], this._mPosition[2]); };
LightAtShaderIndex.prototype.SetXPos = function(x) { this._mPosition[0] = x; };
LightAtShaderIndex.prototype.SetYPos = function(y) { this._mPosition[1] = y; };
LightAtShaderIndex.prototype.SetZPos = function(z) { this._mPosition[2] = z; };
LightAtShaderIndex.prototype.GetPosition = function() { return this._mPosition; };

LightAtShaderIndex.prototype.SetInnerCone = function(r) { this._mInnerCone = r; };
LightAtShaderIndex.prototype.GetInnerCone = function() { return this._mInnerCone; };

LightAtShaderIndex.prototype.SetOuterCone = function(r) { this._mOuterCone = r; };
LightAtShaderIndex.prototype.GetOuterCone = function() { return this._mOuterCone; };

LightAtShaderIndex.prototype.SetIntensity = function(i) { this._mIntensity = i; };
LightAtShaderIndex.prototype.GetIntensity = function() { return this._mIntensity; };


LightAtShaderIndex.prototype.LightIsOn = function() { return this._mIsOn;};
LightAtShaderIndex.prototype.SetLightTo = function(on) { this._mIsOn = on; };


//</editor-fold>