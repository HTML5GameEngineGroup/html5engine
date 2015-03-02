Camera.prototype.PanBy = function(dx, dy) {
    this._mWCCenter[0] += dx;
    this._mWCCenter[1] += dy;
};

// pan the camera to ensure aXform is within camera bounds
// this is complementary to the ClampAtBound: instead of clamping aXform, now, move the camera
Camera.prototype.PanWith = function(aXform) {
    var status = this.CollideWCBound(aXform);
    if (status !== BoundingBox.eBoundCollideStatus.eInside) {
       var pos = aXform.GetPosition();
       if ((status & BoundingBox.eBoundCollideStatus.eCollideTop) !== 0) {
           this._mWCCenter[1] = pos[1] + (aXform.GetHeight()/2) - (this.GetWCHeight()/2);
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideBottom) !== 0) {
            this._mWCCenter[1] = pos[1] - (aXform.GetHeight()/2) + (this.GetWCHeight()/2);
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideRight) !== 0) {
            this._mWCCenter[0] = pos[0] + (aXform.GetWidth()/2) - (this.GetWCWidth()/2);
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideLeft) !== 0) {
            this._mWCCenter[0] = pos[0] - (aXform.GetWidth()/2) + (this.GetWCWidth()/2);
        }
    }
};


Camera.prototype.PanTo = function(cx, cy) {
    this.SetWCCenter(cx, cy);
};

// Zoom with respect to the center
// zoom > 1 ==> zooming out, see more of the world
// zoom < 1 ==> zooming in, see less of the world, more detailed
// zoom < 0 is ignored
Camera.prototype.ZoomBy = function(zoom) {
    if (zoom > 0)
        this._mWCWidth *= zoom;
};

// zoom towards (pX, pY) by zoom: 
// zoom > 1 ==> zooming out, see more of the world
// zoom < 1 ==> zooming in, see less of the world, more detailed
// zoom < 0 is ignored
Camera.prototype.ZoomTowards = function(pos, zoom) {
    var delta = [];
    vec2.sub(delta, pos, this._mWCCenter);
    vec2.scale(delta, delta, zoom-1);
    vec2.sub(this._mWCCenter, this._mWCCenter, delta);
    this.ZoomBy(zoom);
};

