Camera.prototype.Update = function() {
    if (this._mCameraShake !== null) {
        if (this._mCameraShake.ShakeDone())
            this._mCameraShake = null;
        else {
            this._mCameraShake.SetRefCenter(this.GetWCCenter());
            this._mCameraShake.UpdateShakeState();
        }
    }
    this._mCameraState.UpdateCameraState();
};

Camera.prototype.PanBy = function(dx, dy) {
    var newC = vec2.clone(this.GetWCCenter());
    newC[0] += dx;
    newC[1] += dy;
    this._mCameraState.SetCenter(newC);
};

// pan the camera to ensure aXform is within camera bounds
// this is complementary to the ClampAtBound: instead of clamping aXform, now, move the camera
Camera.prototype.PanWith = function(aXform, zone) {
    var status = this.CollideWCBound(aXform, zone);
    if (status !== BoundingBox.eBoundCollideStatus.eInside) {
       var pos = aXform.GetPosition();
       var newC = vec2.clone(this.GetWCCenter());
       if ((status & BoundingBox.eBoundCollideStatus.eCollideTop) !== 0) {
           newC[1] = pos[1] + (aXform.GetHeight()/2) - (zone * this.GetWCHeight()/2);
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideBottom) !== 0) {
            newC[1] = pos[1] - (aXform.GetHeight()/2) + (zone * this.GetWCHeight()/2);
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideRight) !== 0) {
            newC[0] = pos[0] + (aXform.GetWidth()/2) - (zone * this.GetWCWidth()/2);
        }
        if ((status & BoundingBox.eBoundCollideStatus.eCollideLeft) !== 0) {
            newC[0] = pos[0] - (aXform.GetWidth()/2) + (zone * this.GetWCWidth()/2);
        }
        this._mCameraState.SetCenter(newC);
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
        this.SetWCWidth(this.GetWCWidth() * zoom);
};

// zoom towards (pX, pY) by zoom: 
// zoom > 1 ==> zooming out, see more of the world
// zoom < 1 ==> zooming in, see less of the world, more detailed
// zoom < 0 is ignored
Camera.prototype.ZoomTowards = function(pos, zoom) {
    var delta = [];
    var newC = [];
    vec2.sub(delta, pos, this.GetWCCenter());
    vec2.scale(delta, delta, zoom-1);
    vec2.sub(newC, this.GetWCCenter(), delta);
    this.ZoomBy(zoom);
    this._mCameraState.SetCenter(newC);
};

Camera.prototype.Shake = function(xDelta, yDelta, shakeFrequency, duration) {
    this._mCameraShake = new CameraShake(this._mCameraState, xDelta, yDelta, shakeFrequency, duration);
};