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
    this._mLight = null;
};
gEngine.Core.InheritPrototype(DiffuseRenderable, SpriteAnimateRenderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
DiffuseRenderable.prototype.Draw = function(aCamera) {
    this._mShader.SetLight(this._mLight);
    SpriteAnimateRenderable.prototype.Draw.call(this, aCamera);
    
};

DiffuseRenderable.prototype.GetLight = function() {
    return this._mLight;
};
DiffuseRenderable.prototype.AddLight = function(l) {
    this._mLight = l;
};
//--- end of Public Methods
//</editor-fold>