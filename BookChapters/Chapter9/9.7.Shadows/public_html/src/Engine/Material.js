/*
 * File: Material.js
 * Simple Phong illumination model material: Ka, Kd, KS, and Shinningness.
 */

/*jslint node: true, vars: true */
/*global gEngine, vec4 */
/* find out more about jslint: http://www.jslint.com/lint.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Material() {
    this.mKa = vec4.fromValues(0.0, 0.0, 0.0, 0);
    this.mKs = vec4.fromValues(0.2, 0.2, 0.2, 1);
    this.mKd = vec4.fromValues(1.0, 1.0, 1.0, 1);
    this.mShinningness = 20;
}

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
Material.prototype.setAmbient = function (a) { this.mKa = vec4.clone(a); };
Material.prototype.getAmbient = function () { return this.mKa; };

Material.prototype.setDiffuse = function (d) { this.mKd = vec4.clone(d); };
Material.prototype.getDiffuse = function () { return this.mKd; };

Material.prototype.setSpecular = function (s) { this.mKs = vec4.clone(s); };
Material.prototype.getSpecular = function () { return this.mKs; };

Material.prototype.setShinningness = function (s) { this.mShinningness = s; };
Material.prototype.getShinningness = function () { return this.mShinningness; };
//--- end of Public Methods

//</editor-fold>