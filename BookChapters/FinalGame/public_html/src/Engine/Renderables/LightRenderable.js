/*
 * File: LightRenderable.js
 *  
 * SpriteAnimatedRenderable with light illumination
 */

/*jslint node: true, vars: true */
/*global gEngine, Renderable, SpriteAnimateRenderable*/
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Default Contructior<p>
 * SpriteAnimatedRenderable with light illumination
 * @param {type} myTexture
 * @returns {LightRenderable}
 * @memberOf LightRenderable
 */
function LightRenderable(myTexture) {
    SpriteAnimateRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());

    // here is the light source
    this.mLights = [];
}
gEngine.Core.inheritPrototype(LightRenderable, SpriteAnimateRenderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
/**
 * 
 * @param {type} aCamera
 * @returns {undefined}
 * @memberOf LightRenderable
 */
LightRenderable.prototype.draw = function (aCamera) {
    this.mShader.setLights(this.mLights);
    SpriteAnimateRenderable.prototype.draw.call(this, aCamera);
};

/**
 * 
 * @returns {LightRenderable.mLights.length}
 * @memberOf LightRenderable
 */
LightRenderable.prototype.numLights = function () {
    return this.mLights.length;
};

/**
 * 
 * @param {type} index
 * @returns {Array}
 * @memberOf LightRenderable
 */
LightRenderable.prototype.getLightAt = function (index) {
    return this.mLights[index];
};

/**
 * 
 * @param {type} l
 * @returns {undefined}
 * @memberOf LightRenderable
 */
LightRenderable.prototype.addLight = function (l) {
    this.mLights.push(l);
};
//--- end of Public Methods

//</editor-fold>