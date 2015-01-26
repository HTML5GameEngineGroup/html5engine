/*
 * File: TextureRenderable.js
 *  
 * Renderable objects with textures
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TextureRenderable(shader, myTexture)
{
    Renderable.call(this, shader);
    this._mTexture = myTexture;          // texture for this object, null is not defined.
};
gEngine.Core.InheritPrototype(TextureRenderable, Renderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
TextureRenderable.prototype.Draw = function(vpMatrix) {
    // activate the texture
    gEngine.Textures.ActivateTexture(this._mTexture);
    Renderable.prototype.Draw.call(this, vpMatrix);
};

TextureRenderable.prototype.GetTexture = function() { return this._mTexture; };
TextureRenderable.prototype.SetTexture = function(t) { this._mTexture = t; };
//--- end of Public Methods
//</editor-fold>