/*
 * File: LightRenderable.js
 *  
 * SpriteRenderable with light illumination
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function LightRenderable(myTexture)
{
    SpriteAnimateRenderable.call(this, myTexture);
    Renderable.prototype._SetShader.call(this, gEngine.DefaultResources.GetLightShader());
    
    // here is the light source
    this._mLights = new Array();
};
gEngine.Core.InheritPrototype(LightRenderable, SpriteAnimateRenderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
LightRenderable.prototype.Draw = function(aCamera) {
    this._mShader.SetLights(this._mLights);
    SpriteAnimateRenderable.prototype.Draw.call(this, aCamera);
};

LightRenderable.prototype.GetLightAt = function(index) {
    return this._mLights[index];
};
LightRenderable.prototype.AddLight = function(l) {
    this._mLights.push(l);
};
//--- end of Public Methods

//</editor-fold>