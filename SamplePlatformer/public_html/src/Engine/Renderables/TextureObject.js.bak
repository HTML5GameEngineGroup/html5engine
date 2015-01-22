/*
 * File: TextureObject.js
 *  
 * Renderable objects with textures
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TextureObject(shader, myTexture)
{
    RenderableObject.call(this, shader);
    this._mTexture = myTexture;          // texture for this object, null is not defined.
};
gEngine.Core.InheritPrototype(TextureObject, RenderableObject);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
TextureObject.prototype.Draw = function() {
    // activate the texture
    gEngine.Textures.ActivateTexture(this._mTexture);
    RenderableObject.prototype.Draw.call(this);
};

TextureObject.prototype.GetTexture = function() { return this._mTexture; };
TextureObject.prototype.SetTexture = function(t) { this._mTexture = t; };
//--- end of Public Methods
//</editor-fold>