TextureRenderable.prototype.PixelTouches = function(other, wcTouchPos) {
    var pixelTouch = false;
    var xIndex = 0;
    var otherIndex = [0, 0];
    
    var xDir = [1, 0];
    var yDir = [0, 1];
    var otherXDir = [1, 0];
    var otherYDir = [0, 1];
    vec2.rotate(xDir, xDir, this._mXform.GetRotationInRad());
    vec2.rotate(yDir, yDir, this._mXform.GetRotationInRad());
    vec2.rotate(otherXDir, otherXDir, other._mXform.GetRotationInRad());
    vec2.rotate(otherYDir, otherYDir, other._mXform.GetRotationInRad());
        
    while ((!pixelTouch) && (xIndex<this._mTexWidth)) {
        var yIndex = 0;
        while ((!pixelTouch) && (yIndex<this._mTexHeight)) {
            if (this.GetTexelAlpha(xIndex, yIndex) > 0) {
                this.IndexToWCPosition(wcTouchPos, xIndex, yIndex, xDir, yDir);
                other.WCPositionToIndex(otherIndex, wcTouchPos, otherXDir, otherYDir);
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
    y += this._mTexBottomIndex;
    x += this._mTexLeftIndex;
    x = x * 4;
    y = y * 4;
    return this._mColorArray[(y*this._mTextureInfo.mWidth) + x  + 3];
};

TextureRenderable.prototype.WCPositionToIndex = function(returnIndex, wcPos, xDir, yDir) {
    // use wcPos to compute the corresponding returnIndex[0 and 1]
    var delta = [];
    vec2.sub(delta, wcPos, this._mXform.GetPosition());
    var xDisp = vec2.dot(delta, xDir);
    var yDisp = vec2.dot(delta, yDir);
    returnIndex[0] = this._mTexWidth  * (xDisp / this._mXform.GetWidth());
    returnIndex[1] = this._mTexHeight * (yDisp / this._mXform.GetHeight());
    
    // recall that xForm.GetPosition() returns lower-left corner, yet
    // Texture origin is at lower-left corner!
    returnIndex[0] += this._mTexWidth / 2;
    returnIndex[1] += this._mTexHeight / 2;
    
    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
};

TextureRenderable.prototype.IndexToWCPosition = function(returnWCPos, i, j, xDir, yDir) {
    var x = i * this._mXform.GetWidth() / (this._mTexWidth - 1);
    var y = j * this._mXform.GetHeight() / (this._mTexHeight -1);
    var xDisp = x - (this._mXform.GetWidth() * 0.5);
    var yDisp = y - (this._mXform.GetHeight() * 0.5);
    var xDirDisp = [];
    var yDirDisp = [];
    
    vec2.scale(xDirDisp, xDir, xDisp);
    vec2.scale(yDirDisp, yDir, yDisp);
    vec2.add(returnWCPos, this._mXform.GetPosition(), xDirDisp);
    vec2.add(returnWCPos, returnWCPos, yDirDisp);
};

//--- end of Public Methods
//</editor-fold>