/*
 * File: DiffuseRenderable.js
 *  
 * SpriteRenderable with light illumination
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function DiffuseRenderable(myTexture)
{
    SpriteAnimateRenderable.call(this, myTexture);
    Renderable.prototype._SetShader.call(this, gEngine.DefaultResources.GetDiffuseShader());
    
    // here is the light source
    this._mLights = new Array();
};
gEngine.Core.InheritPrototype(DiffuseRenderable, SpriteAnimateRenderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
DiffuseRenderable.prototype.Draw = function(aCamera) {
    this._mShader.SetLights(this._mLights);
    SpriteAnimateRenderable.prototype.Draw.call(this, aCamera);
    for (var i = 0; i<this._mLights.length; i++)
        this._mLights[i].SwitchOffLight();
        // remember lights are shared, set to known state
};

DiffuseRenderable.prototype.GetLightAt = function(index) {
    return this._mLights[index];
};
DiffuseRenderable.prototype.AddLight = function(l) {
    this._mLights.push(l);
};
//--- end of Public Methods

//</editor-fold>