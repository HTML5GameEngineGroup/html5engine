/*
 * File: SpriteRenderable.js
 *  
 * Texture objects where texture cooridnate can change
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SpriteRenderable(myTexture)
{
    TextureRenderable.call(this, myTexture);
    Renderable.prototype._SetShader.call(this, gEngine.DefaultResources.GetSpriteShader());
    this._mTexLeft = 0.0;   // bounds of texture coordinate (0 is left, 1 is right)
    this._mTexRight = 1.0;  // 
    this._mTexTop = 1.0;    //   1 is top and 0 is bottom of image
    this._mTexBottom = 0.0; // 
};
gEngine.Core.InheritPrototype(SpriteRenderable, TextureRenderable);

//<editor-fold desc="Public Methods">
//
//// the expected texture cooridnate array is an array of 8 floats where elements:
    //  [0] [1]: is x/y cooridnate of Top-Right 
    //  [2] [3]: is x/y coordinate of Top-Left
    //  [4] [5]: is x/y coordinate of Bottom-Right
    //  [6] [7]: is x/y coordinate of Bottom-Left
    // Convention: eName is an enumerated data type
SpriteRenderable.eTexCoordArray = Object.freeze({
            eLeft: 2,
            eRight: 0,
            eTop: 1,
            eBottom: 5
});
    
//**-----------------------------------------
// Public methods
//**-----------------------------------------
SpriteRenderable.prototype.Draw = function(pixelColor, aCamera) {
    // set the current texture coordinate
    // 
    // activate the texture
    this._mShader.SetTextureCoordinate(this.GetTexCoordinateArray());
    TextureRenderable.prototype.Draw.call(this, pixelColor, aCamera);
};

// specify subtexture region by texture coordinate (between 0 to 1)
SpriteRenderable.prototype.SetTexCoordinate = function(left, right, bottom, top)
{
    this._mTexLeft = left;
    this._mTexRight = right;
    this._mTexBottom = bottom;
    this._mTexTop = top;
};

// specify subtexture region by pixel positions (between 0 to image resolutions)
SpriteRenderable.prototype.SetTexPixelPositions = function(left, right, bottom, top)
{
    var texInfo = gEngine.ResourceMap.RetrieveAsset(this._mTexture);
    // entire image width, height
    var imageW = texInfo.mWidth;
    var imageH = texInfo.mHeight;
    
    this._mTexLeft = left / imageW;
    this._mTexRight = right / imageW;
    this._mTexBottom = bottom / imageH;
    this._mTexTop = top / imageH;
};

SpriteRenderable.prototype.GetTexCoordinateArray = function() {
    return [
      this._mTexRight,  this._mTexTop,          // x,y of top-right
      this._mTexLeft,   this._mTexTop,
      this._mTexRight,  this._mTexBottom,
      this._mTexLeft,   this._mTexBottom
    ];
};
//--- end of Public Methods
//
//</editor-fold>