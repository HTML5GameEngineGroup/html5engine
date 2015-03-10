/*
 * File: IllumRenderable.js
 *  
 * SpriteRenderable with light illumination
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function IllumRenderable(myTexture, myNormalMap)
{
    LightRenderable.call(this, myTexture);
    Renderable.prototype._SetShader.call(this, gEngine.DefaultResources.GetIllumShader());
    
    // here is the normal map resoruce id
    this._mNormalMap = myNormalMap;
    
    // Normal map texture coordinate
    this._mNormalMapLeft = 0.0;
    this._mNormalMapRight = 1.0;
    this._mNormalMapBottom = 0.0;
    this._mMormapMapTop = 1.0;
    
    // Material for this renderable
    this._mMaterial = new Material();
};
gEngine.Core.InheritPrototype(IllumRenderable, LightRenderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
IllumRenderable.prototype.Draw = function(aCamera) {
    gEngine.Textures.ActivateNormalMap(this._mNormalMap);
    this._mShader.SetNormalMapTexCoordinate(this.GetNormalMapCoordinateArray());
    this._mShader.SetMaterialAndCameraPos(this._mMaterial, aCamera.GetPosInPixelSpace());
    LightRenderable.prototype.Draw.call(this, aCamera);
};


// specify subtexture region by texture coordinate (between 0 to 1)
IllumRenderable.prototype.SetNormalMapTexCoordinate = function(left, right, bottom, top) {
    this._mNormalMapLeft = left;
    this._mNormalMapRight = right;
    this._mNormalMapBottom = bottom;
    this._mMormapMapTop = top;
};

// specify subtexture region by pixel positions (between 0 to image resolutions)
SpriteRenderable.prototype.SetNormalMapPixelPositions = function(left, right, bottom, top) {
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

IllumRenderable.prototype.GetMaterial = function() { return this._mMaterial; };
//--- end of Public Methods


//*** MUST OVERRIDE _SetElement_ from SpriteAnimateRenderable()!!!
IllumRenderable.prototype._SetSpriteElement = function() {
    var left = this._mFirstElmLeft + (this._mCurrentElm * (this._mElmWidth + this._mWidthPadding));
    var right = left+this._mElmWidth;
    var top = this._mElmTop-this._mElmHeight;
    var bot = this._mElmTop;
    SpriteRenderable.prototype.SetTexCoordinate.call(this, left, right, top, bot);
    this.SetNormalMapTexCoordinate(left, right, top, bot);
};
//</editor-fold>