TextureRenderable.prototype.PixelTouches = function(other, wcTouchPos) {
    var pixelTouch = false;
    var xIndex = 0;
    var otherIndex = [0, 0];
        
    while ((!pixelTouch) && (xIndex<this._mTexWidth)) {
        var yIndex = 0;
        while ((!pixelTouch) && (yIndex<this._mTexHeight)) {
            if (this.GetTexelAlpha(xIndex, yIndex) > 0) {
                this.IndexToWCPosition(wcTouchPos, xIndex, yIndex);
                other.WCPositionToIndex(otherIndex, wcTouchPos);
                if ((otherIndex[0] > 0) && (otherIndex[0] < other._mTexWidth) &&
                    (otherIndex[1] > 0) && (otherIndex[1] < other._mTexHeight)) {
                    pixelTouch = other.GetTexelAlpha(otherIndex[0], otherIndex[1]) > 0;
                }
            }
            yIndex++;
        }
        xIndex++;
    }
    return pixelTouch;
};

TextureRenderable.prototype.SetColorArray = function () {
    if (this._mColorArray === null)
        this._mColorArray = gEngine.Textures.GetColorArray(this._mTexture);
};

TextureRenderable.prototype.GetTexelAlpha = function (x, y) {
    x = x * 4;
    y = y * 4;
    return this._mColorArray[(y*this._mTextureInfo.mWidth) + x  + 3];
};

TextureRenderable.prototype.WCPositionToIndex = function(returnIndex, wcPos) {
    // use wcPos to compute the corresponding returnIndex[0 and 1]
    var delta = [];
    vec2.sub(delta, wcPos, this._mXform.GetPosition());
    returnIndex[0] = this._mTexWidth  * (delta[0] / this._mXform.GetWidth());
    returnIndex[1] = this._mTexHeight * (delta[1] / this._mXform.GetHeight());
    
    // recall that xForm.GetPosition() returns lower-left corner, yet
    // Texture origin is at lower-left corner!
    returnIndex[0] += this._mTexWidth / 2;
    returnIndex[1] += this._mTexHeight / 2;
    
    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
};

TextureRenderable.prototype.IndexToWCPosition = function(returnWCPos, i, j) {
    var x = i * this._mXform.GetWidth() / (this._mTexWidth - 1);
    var y = j * this._mXform.GetHeight() / (this._mTexHeight -1);
    returnWCPos[0] = this._mXform.GetXPos() + (x - (this._mXform.GetWidth() * 0.5));
    returnWCPos[1] = this._mXform.GetYPos() + (y - (this._mXform.GetHeight() * 0.5));
};

//--- end of Public Methods
//</editor-fold>