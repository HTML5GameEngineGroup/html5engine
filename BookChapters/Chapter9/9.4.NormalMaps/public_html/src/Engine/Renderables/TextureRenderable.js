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
    this._mTexture = myTexture;          // texture for this object, null is not defined.
    
    // these two instance variables are to cache texture informaiton
    // for supporting per-pixel accurate collision
    this._mTextureInfo = gEngine.Textures.GetTextureInfo(myTexture);
    this._mColorArray = null;
    // defined for subclass to override
    this._mTexWidth = this._mTextureInfo.mWidth; 
    this._mTexHeight = this._mTextureInfo.mHeight;
    this._mTexLeftIndex = 0;
    this._mTexBottomIndex = 0;
};
gEngine.Core.InheritPrototype(TextureRenderable, Renderable);

//<editor-fold desc="Public Methods">

// Public methods
//**-----------------------------------------
TextureRenderable.prototype.Draw = function(aCamera) {
    // activate the texture
    gEngine.Textures.ActivateTexture(this._mTexture);
    Renderable.prototype.Draw.call(this, aCamera);
};

TextureRenderable.prototype.GetTexture = function() { return this._mTexture; };
TextureRenderable.prototype.SetTexture = function(t) { this._mTexture = t; };
//--- end of Public Methods//**-----------------------------------------
//</editor-fold>