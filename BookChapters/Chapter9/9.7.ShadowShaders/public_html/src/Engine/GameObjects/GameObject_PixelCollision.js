/* File: GameObject_PixelCollision.js 
 *
 * Implements the pixelTouch() funciton of GameObject
 */

/*jslint node: true, vars: true */
/*global GameObject, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// 
GameObject.prototype.pixelTouches = function (otherObj, wcTouchPos) {
    // only continue if both objects have getColorArray defined 
    // if defined, should have other texture intersection support!
    var pixelTouch = false;
    var myRen = this.getRenderable();
    var otherRen = otherObj.getRenderable();

    if ((typeof myRen.pixelTouches === "function") && (typeof otherRen.pixelTouches === "function")) {
        if ((myRen.getXform().getRotationInRad() === 0) && (otherRen.getXform().getRotationInRad() === 0)) {
            // no rotation, we can use bbox ...
            var otherBbox = otherObj.getBBox();
            if (otherBbox.intersectsBound(this.getBBox())) {
                myRen.setColorArray();
                otherRen.setColorArray();
                pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
            }
        } else {
            // One of both are rotated ... use radius ... be conservative
            // Use the larger of the Width/Height and approx radius
            //   Sqrt(1/2)*x Approx = 0.71f * x;
            var mySize = myRen.getXform().getSize();
            var otherSize = otherRen.getXform().getSize();
            // otherwise, use simple distance
            // Sqrt(0.5) approx = 0.71
            var myR = 0.71 * Math.max(mySize[0], mySize[1]);
            var otherR = 0.71 * Math.max(otherSize[0], otherSize[1]);
            var d = [];
            vec2.sub(d, myRen.getXform().getPosition(), otherRen.getXform().getPosition());
            if (vec2.length(d) < (myR + otherR)) {
                myRen.setColorArray();
                otherRen.setColorArray();
                pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
            }
        }
    }
    return pixelTouch;
};