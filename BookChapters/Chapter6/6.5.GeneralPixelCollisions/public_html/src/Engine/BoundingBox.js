/* 
 * File: BoundingBox.js
 */
function BoundingBox(centerPos, w, h) {
    this._mLL = vec2.fromValues(0, 0);
    this.SetBounds(centerPos, w, h);
};

BoundingBox.eBoundCollideStatus = Object.freeze({
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside : 16,
    eOutside: 0
});
// rotation is ignored.
// centerPos is a vec2
BoundingBox.prototype.SetBounds = function(centerPos, w, h) {
    this._mWidth = w;
    this._mHeight = h;
    this._mLL[0] = centerPos[0] - (w/2);
    this._mLL[1] = centerPos[1] - (h/2);
};

BoundingBox.prototype.ContainsPoint = function(x, y) {
    return ( (x>this.MinX()) && (x<this.MaxX()) &&
             (y>this.MinY()) && (y<this.MaxY()) );
};

BoundingBox.prototype.IntersectsBound = function(otherBound) {
    return ((this.MinX() < otherBound.MaxX()) &&
            (this.MaxX() > otherBound.MinX()) &&
            (this.MinY() < otherBound.MaxY()) &&
            (this.MaxY() > otherBound.MinY()));
};

// returns the status of otherBound wrt to this.
BoundingBox.prototype.BoundCollideStatus = function(otherBound) {
    var status = BoundingBox.eBoundCollideStatus.eOutside;
    
    if (this.IntersectsBound(otherBound)) {
        if (otherBound.MinX() < this.MinX())
            status |= BoundingBox.eBoundCollideStatus.eCollideLeft;
        if (otherBound.MaxX() > this.MaxX())
            status |= BoundingBox.eBoundCollideStatus.eCollideRight;
        if (otherBound.MinY() < this.MinY())
            status |= BoundingBox.eBoundCollideStatus.eCollideBottom;
        if (otherBound.MaxY() > this.MaxY())
            status |= BoundingBox.eBoundCollideStatus.eCollideTop;
        
        // if the bounds intersects and yet onoe of the sides overlaps
        // otherBound is completely inside thisBound
        if (status === BoundingBox.eBoundCollideStatus.eOutside)
            status = BoundingBox.eBoundCollideStatus.eInside;
    }
    return status;
};

BoundingBox.prototype.MinX = function() { return this._mLL[0]; };
BoundingBox.prototype.MaxX = function() { return this._mLL[0] + this._mWidth; };
BoundingBox.prototype.MinY = function() { return this._mLL[1]; };
BoundingBox.prototype.MaxY = function() { return this._mLL[1] + this._mHeight; };


//</editor-fold>