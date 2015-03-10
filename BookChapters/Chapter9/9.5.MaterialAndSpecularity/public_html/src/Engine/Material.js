/*
 * File: Material.js
 * Simple Phong illumination model material: Ka, Kd, KS, and Shinningness.
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Material() {    
    this._mKa = vec4.fromValues(0.01, 0.01, 0.01, 1);
    this._mKs = vec4.fromValues(0.1, 0.1, 0.1, 1);
    this._mKd = vec4.fromValues(0.1, 0.1, 0.1, 1);
    this._mShinningness = 1;
};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
Material.prototype.SetAmbient= function(a) { this._mKa = vec4.clone(a); };
Material.prototype.GetAmbient = function() { return this._mKa; };

Material.prototype.SetDiffuse = function(d) { this._mKd = vec4.clone(d); };
Material.prototype.GetDiffuse = function() { return this._mKd; };

Material.prototype.SetSpecular = function(s) { this._mKs = vec4.clone(s); };
Material.prototype.GetSpecular = function() { return this._mKs; };

Material.prototype.SetShinningness = function(s) { this._mShinningness= s; };
Material.prototype.GetShinningness = function() { return this._mShinningness; };
//--- end of Public Methods

//</editor-fold>