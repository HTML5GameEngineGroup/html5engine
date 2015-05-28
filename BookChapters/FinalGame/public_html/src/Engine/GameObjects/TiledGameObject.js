/* File: TiledGameObject.js 
 *
 * Infinitely tiled, assume X/Y alignments
 */

/*jslint node: true, vars: true, white: true, bitwise: true */
/*global gEngine, GameObject, vec2, BoundingBox, alert  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function TiledGameObject(renderableObj) {
    this.mShouldTile = true;  // can switch this off if desired
    GameObject.call(this, renderableObj);
}
gEngine.Core.inheritPrototype(TiledGameObject, GameObject);

TiledGameObject.prototype.setTilingTo = function (t) {
    this.mShouldTile = t;
};
TiledGameObject.prototype.shouldTile = function () {
    return this.mShouldTile;
};

TiledGameObject.prototype._drawTile = function(aCamera) {
    var xf = this.getXform();
    var w = xf.getWidth();
    var h = xf.getHeight();
    var pos = xf.getPosition();
    var left = pos[0] - (w/2);
    var right = left + w;
    var top = pos[1] + (h/2);
    var bottom = top - h;
    
    var wcPos = aCamera.getWCCenter();
    var wcLeft = wcPos[0] - (aCamera.getWCWidth() / 2);
    var wcRight = wcLeft + aCamera.getWCWidth();
    var wcBottom = wcPos[1] - (aCamera.getWCHeight() / 2);
    var wcTop = wcBottom + aCamera.getWCHeight();
    
    var dx = 0, dy = 0; // offset to the lower left corner
    // left/right boundary?
    if (right < wcLeft) { // left of WC left
        dx = Math.ceil((wcLeft - right)/w) * w;
    } else {
        if (left > wcLeft) { // not touching the left side
            dx = -Math.ceil((left-wcLeft)/w) * w;
        }
    }
    
    // top/bottom boundary
    if (top < wcBottom) {
        dy = Math.ceil((wcBottom - top)/h) * h;
    } else {
        if (bottom > wcBottom) {  // not touching the bottom
            dy = -Math.ceil((bottom - wcBottom)/h) * h;
        }
    }
    var sX = pos[0];
    var sY = pos[1];
    xf.incXPosBy(dx);
    xf.incYPosBy(dy);
    right = pos[0] + (w/2);
    top = pos[1] + (h/2);
    var nx = 1, ny = 1; // number to draw in the x and y directions
    nx = Math.ceil((wcRight - right) / w);
    ny = Math.ceil((wcTop - top) / h);
    var cx = nx;
    var xPos = pos[0];
    while (ny >= 0) {
        cx = nx;
        pos[0] = xPos;
        while (cx >= 0) {
            this.mRenderComponent.draw(aCamera);
            xf.incXPosBy(w);
            --cx;
        }
        xf.incYPosBy(h);
        --ny;
    }
    pos[0] = sX;
    pos[1] = sY;
};

TiledGameObject.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        if (this.shouldTile()) {
            // find out where we should be drawing   
            this._drawTile(aCamera);
        } else {
            this.mRenderComponent.draw(aCamera);  
        }
    }
};
