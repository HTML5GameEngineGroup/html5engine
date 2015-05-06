/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update funciton of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, LightRenderable, IllumRenderable */
/* find out more about jslint: http://www.jslint.com/lint.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture, normalMap) {
    this.kDelta = 0.3;

    this.mDye = new IllumRenderable(spriteTexture, normalMap);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(15, 50);
    //this.mDye.getXform().setSize(9, 12);
    this.mDye.getXform().setSize(18, 24);
    this.mDye.setTexPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mDye);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    // control by WSAD
    var xform = this.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        xform.incYPosBy(this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        xform.incYPosBy(-this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        xform.incXPosBy(-this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xform.incXPosBy(this.kDelta);
    }
};