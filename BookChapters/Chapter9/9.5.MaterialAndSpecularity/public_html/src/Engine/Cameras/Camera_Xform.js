Camera.prototype.FakeZInPixelSpace = function(z) {
    return z * this._mRenderCache.mWCToPixelRatio;
};
Camera.prototype.WCPosToPixel = function(p) {  // p is a vec3, fake Z
    // Convert the position to pixel space
    var x = ((p[0] - this._mRenderCache.mCameraOrgX) * this._mRenderCache.mWCToPixelRatio) + 0.5;
    var y = ((p[1] - this._mRenderCache.mCameraOrgY) * this._mRenderCache.mWCToPixelRatio) + 0.5;
    var z = this.FakeZInPixelSpace(p[2]);
    return vec3.fromValues(x, y, z);
};

Camera.prototype.WCSizeToPixel = function(s) {  // 
    return (s * this._mRenderCache.mWCToPixelRatio) + 0.5;
};