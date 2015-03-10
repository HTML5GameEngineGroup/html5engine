
SpriteRenderable.prototype._SetTexInfo = function() {
    var imageW = this._mTextureInfo.mWidth;
    var imageH = this._mTextureInfo.mHeight;
    
    this._mTexLeftIndex = this._mTexLeft * imageW;
    this._mTexBottomIndex = this._mTexBottom * imageH;
    
    this._mTexWidth = ((this._mTexRight - this._mTexLeft) * imageW) + 1; 
    this._mTexHeight = ((this._mTexTop - this._mTexBottom) * imageH) + 1;
};
//--- end of Public Methods
//
//</editor-fold>