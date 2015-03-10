Camera.prototype._MouseDCX = function() {
    return gEngine.Input.MousePosX() - this._mViewport[Camera.eViewport.eOrgX];
};
Camera.prototype._MouseDCY = function() {
    return gEngine.Input.MousePosY() - this._mViewport[Camera.eViewport.eOrgY];
};

Camera.prototype.IsMouseInViewport = function() {
    var dcX = this._MouseDCX();
    var dcY = this._MouseDCY();
    return ((dcX >= 0) && (dcX < this._mViewport[Camera.eViewport.eWidth]) &&  
            (dcY >=0) && (dcY < this._mViewport[Camera.eViewport.eHeight]));
};

Camera.prototype.MouseWCX = function() {
    var minWCX = this.GetWCCenter()[0] - this.GetWCWidth()/2;
    return minWCX + (this._MouseDCX() * (this.GetWCWidth()/this._mViewport[Camera.eViewport.eWidth]));
};

Camera.prototype.MouseWCY = function() {
    var minWCY = this.GetWCCenter()[1] - this.GetWCHeight()/2;
    return minWCY + (this._MouseDCY() * (this.GetWCHeight()/this._mViewport[Camera.eViewport.eHeight]));
};

