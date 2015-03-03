/*
 * File: SpriteAnimateRenderable.js
 *  
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SpriteAnimateRenderable(myTexture)
{
    SpriteRenderable.call(this, myTexture);
    Renderable.prototype._SetShader.call(this, gEngine.DefaultResources.GetSpriteShader());
    
    // All coordinates are in texture coordinate (UV between 0 to 1)
    
    // Information on the sprite element
    this._mFirstElmLeft = 0.0; // 0.0 is left corner of image
    this._mElmTop = 1.0;  // 1.0 is top corner of image
    this._mElmWidth = 1.0;     // default sprite element size is the entire image
    this._mElmHeight = 1.0; 
    this._mWidthPadding = 0.0;
    this._mNumElems = 1;   // number of elements in an animation
    
    //
    // per animation settings
    this._mUpdateInterval = 1;   // how often to advance
    this._mAnimationType = SpriteAnimateRenderable.eAnimationType.eAnimateRight;
    
    this._mCurrentAnimAdvance = -1;
    this._mCurrentElm = 0; 
    this._InitAnimation();    
};
gEngine.Core.InheritPrototype(SpriteAnimateRenderable, SpriteRenderable);

SpriteAnimateRenderable.prototype._InitAnimation = function()
{
    // Currently running animation
    this._mCurrentTick = 0;
    switch (this._mAnimationType) {
        case SpriteAnimateRenderable.eAnimationType.eAnimateRight:
            this._mCurrentElm = 0; 
            this._mCurrentAnimAdvance = 1; // either 1 or -1
            break;
        case SpriteAnimateRenderable.eAnimationType.eAnimateSwing:
            this._mCurrentAnimAdvance = -1 * this._mCurrentAnimAdvance; // swings ... 
            this._mCurrentElm += 2*this._mCurrentAnimAdvance;
            break;
        case SpriteAnimateRenderable.eAnimationType.eAnimateLeft:
            this._mCurrentElm = this._mNumElems - 1; 
            this._mCurrentAnimAdvance = -1; // either 1 or -1
            break;
    }
    this._SetSpriteElement();
    
};

SpriteAnimateRenderable.prototype._SetSpriteElement = function()
{
    var left = this._mFirstElmLeft + (this._mCurrentElm * (this._mElmWidth + this._mWidthPadding));
    SpriteRenderable.prototype.SetTexCoordinate.call(this, left, left+this._mElmWidth, 
                                        this._mElmTop-this._mElmHeight, this._mElmTop);
};


//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------

// Assumption is that the first sprite in an animation is always the left-most element.
SpriteAnimateRenderable.eAnimationType = Object.freeze({
            eAnimateRight: 0,     // Animate from first (left) towards right, when hit the end, start from the left again
            eAnimateLeft: 1,      // Compute find the last element (in the right), start from the right animate left-wards, 
            eAnimateSwing: 2      // Animate from first (left) towards the right, when hit the end, animates backwards 
});
 

// Always set the right-most element to be the first
SpriteAnimateRenderable.prototype.SetSpriteSequence = function(
        topPixel,   // offset from top-left
        rightPixel, // offset from top-left
        elmWidthInPixel,
        elmHeightInPixel,
        numElements,      // number of elements in sequence
        wPaddingInPixel  // left/right padding
        ) 
{
    var texInfo = gEngine.ResourceMap.RetrieveAsset(this._mTexture);
    // entire image width, height
    var imageW = texInfo.mWidth;
    var imageH = texInfo.mHeight;
    
    this._mNumElems = numElements;   // number of elements in animation
    this._mFirstElmLeft = rightPixel / imageW;
    this._mElmTop = topPixel / imageH;
    this._mElmWidth = elmWidthInPixel / imageW;
    this._mElmHeight = elmHeightInPixel / imageH;
    this._mWidthPadding = wPaddingInPixel / imageW;
};

SpriteAnimateRenderable.prototype.SetAnimationSpeed = function(
        tickInterval   // number of update calls before advancing the animation
        )
{
    this._mUpdateInterval = tickInterval;   // how often to advance
};

SpriteAnimateRenderable.prototype.IncAnimationSpeed = function(
        deltaInterval   // number of update calls before advancing the animation
        )
{
    this._mUpdateInterval += deltaInterval;   // how often to advance
};


SpriteAnimateRenderable.prototype.SetAnimationType = function(animationType)
{
    this._mAnimationType = animationType;   
    this._mCurrentAnimAdvance = -1;
    this._mCurrentElm = 0; 
    this._InitAnimation();
};

SpriteAnimateRenderable.prototype.UpdateAnimation = function()
{
    this._mCurrentTick++;
    if (this._mCurrentTick >= this._mUpdateInterval) {
        this._mCurrentTick = 0;
        this._mCurrentElm += this._mCurrentAnimAdvance;
        if ((this._mCurrentElm >= 0) && (this._mCurrentElm < this._mNumElems))
            this._SetSpriteElement();
        else
            this._InitAnimation();
    }
};
//--- end of Public Methods
//
//</editor-fold>