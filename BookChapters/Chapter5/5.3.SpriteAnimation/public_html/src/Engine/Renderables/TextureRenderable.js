/*
 * File: TextureRenderable.js
 *  
 * Renderable objects with textures
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TextureRenderable(myTexture)
{
    Renderable.call(this);
    Renderable.prototype.SetColor.call(this, [1, 1, 1, 0]);  
    Renderable.prototype._SetShader.call(this, gEngine.DefaultResources.GetTextureShader());
            // Alpha of 0: switch of tinting of texture
    this._mTexture = myTexture;          // texture for this object, cannot be a "null"
    
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