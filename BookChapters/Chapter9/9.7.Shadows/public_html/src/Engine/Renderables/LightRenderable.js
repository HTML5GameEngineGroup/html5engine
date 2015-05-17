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

function LightRenderable(myTexture) {
    SpriteAnimateRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());

    // here is the light source
    this.mLights = [];

    this.mShadowColor = [0.2, 0.2, 0.2, 1];
}
gEngine.Core.inheritPrototype(LightRenderable, SpriteAnimateRenderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
LightRenderable.prototype.draw = function (aCamera) {
    this.mShader.setLights(this.mLights);
    SpriteAnimateRenderable.prototype.draw.call(this, aCamera);
};

LightRenderable.prototype.numLights = function () {
    return this.mLights.length;
};

LightRenderable.prototype.getLightAt = function (index) {
    return this.mLights[index];
};
LightRenderable.prototype.addLight = function (l) {
    this.mLights.push(l);
};


//<editor-fold desc="support for shadow operations">
LightRenderable.prototype.setShadowColor = function (c) {
    this.mShadowColor = c;
};

LightRenderable.prototype.drawAsShadowCaster = function (aCamera) {
    this._setShader(gEngine.DefaultResources.getShadowCasterShader());
    this.draw(this.mShadowColor, aCamera);
    this._setShader(gEngine.DefaultResources.getLightShader());
};
//</editor-fold>
//--- end of Public Methods

//</editor-fold>