/* 
 * Simple light source
 *      Assumes LightShader has an array of Light, the name of the array is assum to be "uLights[]"
 */

// Constructor
function Light() { 
    this._mColor = vec4.fromValues(1, 1, 1, 1);  // light color
    this._mPosition = vec4.fromValues(0, 0, 5, 1); // light position in WC
    this._mInner = 5;  // effective radius in WC
    this._mOuter = 10;
    this._mIntensity = 1;
    this._mIsOn = true;
};

//<editor-fold desc="public functions">
// simple setters and getters
Light.prototype.SetColor = function(c) { this._mColor = vec4.clone(c); };
Light.prototype.GetColor = function() { return this._mColor; };

Light.prototype.Set2DPosition = function(p) { this._mPosition = vec3.fromValues(p[0], p[1], this._mPosition[2]); };
Light.prototype.SetXPos = function(x) { this._mPosition[0] = x; };
Light.prototype.SetYPos = function(y) { this._mPosition[1] = y; };
Light.prototype.SetZPos = function(z) { this._mPosition[2] = z; };
Light.prototype.GetPosition = function() { return this._mPosition; };

Light.prototype.SetInner = function(r) { this._mInner = r; };
Light.prototype.GetInner = function() { return this._mInner; };

Light.prototype.SetOuter = function(r) { this._mOuter = r; };
Light.prototype.GetOuter = function() { return this._mOuter; };

Light.prototype.SetIntensity = function(i) { this._mIntensity = i; };
Light.prototype.GetIntensity = function() { return this._mIntensity; };

Light.prototype.LightIsOn = function() { return this._mIsOn;};
Light.prototype.SetLightTo = function(on) { this._mIsOn = on; };


//</editor-fold>