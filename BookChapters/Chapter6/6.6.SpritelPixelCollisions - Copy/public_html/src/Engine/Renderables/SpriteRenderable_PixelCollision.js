
SpriteRenderable.prototype._SetTexInfo = function() {
    var imageW = this._mTextureInfo.mWidth;
    var imageH = this._mTextureInfo.mHeight;
    
    this._mTexLeftIndex = this._mTexLeft * imageW;
    this._mTexRightIndex = this._mTexRight * imageW;
    this._mTexBottomIndex = this._mTexBottom * imageH;
    this._mTexTopIndex = this._mTexTop * imageH;
    
    this._mTexWidth = this._mTexRightIndex - this._mTexLeftIndex + 1; 
    this._mTexHeight = this._mTexTopIndex - this.mTexBottomIndex + 1;
};
//--- end of Public Methods
//
//</editor-fold>