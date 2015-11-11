/* File: ParallexGameObject.js 
 *
 * Represent an GameObject located at some distance D away, thus 
 * resulting in slower movements
 * 
 * Passed in scale: 
 *     ==1: means same as actors
 *     > 1: farther away, slows down inversely (scale==2 slows down twice)
 *     < 1: closer, speeds up inversely (scale==0.5 speeds up twice)
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, TiledGameObject, vec2  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Default Contructor<p>
 * Represent an GameObject located at some distance D away, thus resulting in slower movements<p>
 * Passed in scale:<p>
 *      ==1: means same as actors<p>
 *      > 1: farther away, slows down inversely (scale==2 slows down twice)<p>
 *      < 1: closer, speeds up inversely (scale==0.5 speeds up twice)
 * 
 * @memberOf ParallaxGameObject
 * @param {type} renderableObj
 * @param {type} scale
 * @param {type} aCamera
 * @returns {ParallaxGameObject}
 */
function ParallaxGameObject(renderableObj, scale, aCamera) {
    this.mRefCamera = aCamera;
    this.mCameraWCCenterRef = vec2.clone(this.mRefCamera.getWCCenter());
    this.mParallaxScale = 1;
    this.setParallaxScale(scale);
    TiledGameObject.call(this, renderableObj);
}
gEngine.Core.inheritPrototype(ParallaxGameObject, TiledGameObject);

/**
 * renderableObj xfrom is accessible, it is in WC space!!<p>
 * GameObject parameters: speed and direction are all in WC space
 * @memberOf ParallaxGameObject
 * @returns {undefined}
 */
ParallaxGameObject.prototype.update = function () {
    // simple default behavior
    this._refPosUpdate(); // check to see if the camera has moved
    var pos = this.getXform().getPosition();  // our own xform
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed() * this.mParallaxScale);
};

/**
 * 
 * @memberOf ParallaxGameObject
 * @returns {undefined}
 */
ParallaxGameObject.prototype._refPosUpdate = function () {
    // now check for reference movement
    var deltaT = vec2.fromValues(0, 0);
    vec2.sub(deltaT, this.mCameraWCCenterRef, this.mRefCamera.getWCCenter());
    this.setWCTranslationBy(deltaT);
    vec2.sub(this.mCameraWCCenterRef, this.mCameraWCCenterRef, deltaT); // update WC center ref position
};

/**
 * 
 * @memberOf ParallaxGameObject
 * @param {type} delta
 * @returns {undefined}
 */
ParallaxGameObject.prototype.setWCTranslationBy = function (delta) {
    var f = (1-this.mParallaxScale);
    this.getXform().incXPosBy(-delta[0] * f);
    this.getXform().incYPosBy(-delta[1] * f);
};

/**
 * 
 * @memberOf ParallaxGameObject
 * @returns {Number}
 */
ParallaxGameObject.prototype.getParallaxScale = function () {
    return this.mParallaxScale;
};

/**
 * 
 * @memberOf ParallaxGameObject
 * @param {type} s
 * @returns {undefined}
 */
ParallaxGameObject.prototype.setParallaxScale = function(s) {
    if (s <= 0) {
        this.mParallaxScale = 1;
    } else {
        this.mParallaxScale = 1/s;
    }
};