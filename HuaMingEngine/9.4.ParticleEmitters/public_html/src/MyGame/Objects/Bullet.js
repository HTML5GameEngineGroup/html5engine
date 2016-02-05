/* File: Bullet.js 
 *
 * Creates a Bullet object
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, TextureRenderable, RigidCircle*/
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Bullet(texture, atX, atY) {
    this.mCycleLeft = 3000;

    this.mBullet = new TextureRenderable(texture);

    this.mBullet.setColor([1, 1, 1, 0]);
    this.mBullet.getXform().setPosition(atX, atY);
    this.mBullet.getXform().setSize(4, 3);
    //   this.mBullet.getXform().incRotationByDegree(90);

    // show each element for mAnimSpeed updates
    GameObject.call(this, this.mBullet);
    this.setSpeed(0.5);
    this.setCurrentFrontDir([Math.random(), Math.random()]);
    var rigidShape = new RigidCircle(this.getXform(), 1.5);
    rigidShape.setMass(0.1);
    rigidShape.setAcceleration([0, 0]);
    // rigidShape.setDrawBounds(true);
    this.setPhysicsComponent(rigidShape);
}
gEngine.Core.inheritPrototype(Bullet, GameObject);


Bullet.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.mCycleLeft--;
    if (this.hasExpired())
        this.destory();
    if (this.getXform().getPosition()[0] < 0)
        this.setCurrentFrontDir([-this.getCurrentFrontDir()[0], this.getCurrentFrontDir()[1]]);
    if (this.getXform().getPosition()[0] > 200)
        this.setCurrentFrontDir([-this.getCurrentFrontDir()[0], this.getCurrentFrontDir()[1]]);
    if (this.getXform().getPosition()[1] < 0)
        this.setCurrentFrontDir([this.getCurrentFrontDir()[0], -this.getCurrentFrontDir()[1]]);
    if (this.getXform().getPosition()[1] > 110)
        this.setCurrentFrontDir([this.getCurrentFrontDir()[0], -this.getCurrentFrontDir()[1]]);
};


Bullet.prototype.hasExpired = function () {
    return this.mCycleLeft <= 0;
};


////this is added by Huaming
Bullet.prototype.onCollisionExit = function (otherObj) {
    if (otherObj.mName == "Enemy") {
        this.mBullet.setColor([1, 1, 1, 0]);
        otherObj.reduceNum();
    }
};
Bullet.prototype.onCollisionEnter = function (otherObj) {
    if (otherObj.mName == "Enemy"){
    this.mBullet.setColor([1, 0, 0, 1]);
            otherObj.addNum();
    }
};