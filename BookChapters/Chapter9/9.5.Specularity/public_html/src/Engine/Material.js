/*
 * File: Material.js
 * 
 * Simple material
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function IllumRenderable(myTexture, myNormalMap)
{
    DiffuseRenderable.call(this, myTexture);
    Renderable.prototype._SetShader.call(this, gEngine.DefaultResources.GetIllumShader());
    
    // here is the normal map resoruce id
    this._mNormalMap = myNormalMap;
    
    // Normal map texture coordinate
    this._mNormalMapLeft = 0.0;
    this._mNormalMapRight = 1.0;
    this._mNormalMapBottom = 0.0;
    this._mMormapMapTop = 1.0;
    
    this._mKs = vec4.fromValues(0.1, 0.1, 0.1, 1);
    this._mKd = vec4.fromValues(0.5, 0.5, 0.5, 1);
    this._mShinningness = 1;
};
gEngine.Core.InheritPrototype(IllumRenderable, DiffuseRenderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
IllumRenderable.prototype.Draw = function(aCamera) {
    gEngine.Textures.ActivateNormalMap(this._mNormalMap);
    this._mShader.SetNormalMapTexCoordinate(this.GetNormalMapCoordinateArray());
    DiffuseRenderable.prototype.Draw.call(this, aCamera);
};


// specify subtexture region by texture coordinate (between 0 to 1)
IllumRenderable.prototype.SetNormalMapTexCoordinate = function(left, right, bottom, top)
{
    this._mNormalMapLeft = left;
    this._mNormalMapRight = right;
    this._mNormalMapBottom = bottom;
    this._mMormapMapTop = top;
};

// specify subtexture region by pixel positions (between 0 to image resolutions)
SpriteRenderable.prototype.SetNormalMapPixelPositions = function(left, right, bottom, top)
{
    var texInfo = gEngine.Textures.GetTextureInfo(this._mNormalMap);
    var imageW = texInfo.mWidth;
    var imageH = texInfo.mHeight;
    
    this._mNormalMapLeft = left / imageW;
    this._mNormalMapRight = right / imageW;
    this._mNormalMapBottom = bottom / imageH;
    this._mMormapMapTop = top / imageH;
};

IllumRenderable.prototype.GetNormalMapCoordinateArray = function() {
    return [
      this._mNormalMapRight,  this._mMormapMapTop,          // x,y of top-right
      this._mNormalMapLeft,   this._mMormapMapTop,
      this._mNormalMapRight,  this._mNormalMapBottom,
      this._mNormalMapLeft,   this._mNormalMapBottom
    ];
};
//
//*** MUST OVERRIDE _SetElement_ from SpriteAnimateRenderable()!!!
IllumRenderable.prototype._SetSpriteElement = function()
{
    var left = this._mFirstElmLeft + (this._mCurrentElm * (this._mElmWidth + this._mWidthPadding));
    var right = left+this._mElmWidth;
    var top = this._mElmTop-this._mElmHeight;
    var bot = this._mElmTop;
    SpriteRenderable.prototype.SetTexCoordinate.call(this, left, right, top, bot);
    this.SetNormalMapTexCoordinate(left, right, top, bot);
};

IllumRenderable.prototype.SetSpecularity = function(s) { this._mKs = vec4.clone(s); };
IllumRenderable.prototype.GetSpecularity = function() { return this._mKs; };

IllumRenderable.prototype.SetDiffuse = function(d) { this._mKd = vec4.clone(d); };
IllumRenderable.prototype.GetDiffuse = function() { return this._mKd; };

IllumRenderable.prototype.SetShinningness = function(s) { this._mShinningness= s; };
IllumRenderable.prototype.GetShinningness = function() { return this._mShinningness; };
//--- end of Public Methods

//</editor-fold>