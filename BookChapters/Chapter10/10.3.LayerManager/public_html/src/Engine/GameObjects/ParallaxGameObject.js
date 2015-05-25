/* File: ParallexGameObject.js 
 *
 * Represent an GameObject located at some distance D away, thus 
 * resulting in slower movements
 * 
 * D: is set for the camera Window Size if the camera window size should change
 *    D will vary linearly
 *    
 * Introduces the Parallax space: displacemet is simply t/D where t is WC displacement
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, TiledGameObject, vec2  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ParallaxGameObject(renderableObj, distant, theCamera) {
    this.mTheCamera = theCamera;
    this.mCameraCenter = vec2.clone(theCamera.getWCCenter());
    this.mCameraWCWidth = theCamera.getWCWidth();
    this.mDistant = distant;
    this.mParallaxScale = 1;
    this._distantCheck();
    
    TiledGameObject.call(this, renderableObj);
}
gEngine.Core.inheritPrototype(ParallaxGameObject, TiledGameObject);

//
// renderableObj xfrom is accessible, it is in WC space!!
// GameObject parameters: speed and direction are all in WC space
//

ParallaxGameObject.prototype.update = function () {
    // simple default behavior
    this._cameraUpdate(); // check to see if the camera has moved
    var pos = this.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed() * this.parallaxScale);  // this is movement in Parallax space
};

ParallaxGameObject.prototype._cameraUpdate = function () {
    /* not doing this for now
    // check for width change
    var ratio;
    var deltaW = this.mTheCamera.getWCWidth() - this.mCameraWCWidth;
    if (Math.abs(deltaW) > Number.MIN_VALUE) {
        ratio = this.mTheCamera.getWCWidth() / this.mCameraWCWidth;
        this.mDistant *= ratio;
        if (this.mDistant <= 1) {
            this.mDistant = 1;
        }
    }
    */
    // now check for caerma movement
    var deltaT = vec2.fromValues(0, 0);
    vec2.sub(deltaT, this.mCameraCenter, this.mTheCamera.getWCCenter());
    this.setWCTranslationBy(deltaT);
    vec2.sub(this.mCameraCenter, this.mCameraCenter, deltaT); // update camera position
};

ParallaxGameObject.prototype.setWCTranslationBy = function (delta) {
    this.getXform().incXPosBy(delta[0] * this.parallaxScale);
    this.getXform().incYPosBy(delta[1] * this.parallaxScale);
};

ParallaxGameObject.prototype.getDistance = function () {
    return this.mDistant;
};
ParallaxGameObject.prototype.setDistance = function (d) {
    this.mDistant = d;
    this._distantCheck();
};
ParallaxGameObject.prototype.incDistance = function (delta) {
    this.mDistant += delta;
    this._distantCheck();
};

ParallaxGameObject.prototype._distantCheck = function() {
    if (this.mDistant <= 1) {
        this.mDistant = 1;
    }
    this.parallaxScale = 1/this.mDistant;
};