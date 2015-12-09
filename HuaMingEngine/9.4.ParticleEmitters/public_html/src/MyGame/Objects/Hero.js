/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, SpriteRenderable, RigidCircle, RigidRectangle, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture, atX, atY) {
    this.kXDelta = 1;
    this.kYDelta = 2.0;
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([0, 0, 0, 0.2]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(30, 3.75);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mDye);
    var r = new RigidRectangle(this.getXform(), 30, 3);
    r.setMass(1);  // less dense than Minions
    r.setRestitution(0.3);
    r.setColor([1, 0.2, 0.2, 1]);

    r.setAcceleration([0, 0]);
    r.setFriction(0);
    r.setDrawBounds(true);
    this.setPhysicsComponent(r);



}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    // must call super class update
    GameObject.prototype.update.call(this);

    // control by WASD
    var v = this.getPhysicsComponent().getVelocity();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        v[0] -= this.kXDelta;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        v[0] += this.kXDelta;
    }
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        if (currentScene.mCamera.isMouseInViewport()) {
            var d = new Platform(currentScene.kPlatformTexture, currentScene.mCamera.mouseWCX(), currentScene.mCamera.mouseWCY());
            d.mName="Brick";
            d.mCollidableFlag=true;
            currentScene.mAllBrick.addToSet(d);
        }
    }
    // now interact with the dyePack ...
    var i, obj, collisionPt = [0, 0];

    /* var p = this.getXform().getPosition();
     for (i=0; i<this.mAllDyePacks.mSet.size(); i++) {
     obj = this.mAllDyePacks.mSet.getObjectAt(i);
     // chase after hero
     obj.rotateObjPointTo(p, 0.8);
     if (obj.pixelTouches(this, collisionPt)) {
     dyePacks.removeFromSet(obj);
     allParticles.addEmitterAt(collisionPt, 200, func);
     }
     }*/
};

Hero.prototype.onCollisionStay = function (otherObj) {
    this.mDye.mColor[0]+=0.01;
};
Hero.prototype.onCollisionEnter = function (otherObj) {
    this.mDye.mColor[0]+=0.01;
    console.log("Collision Enter by %s ", otherObj);
};
Hero.prototype.onCollisionExit = function (otherObj) {
    this.mDye.mColor[0]+=0.01;
    console.log("Collision Exit by %s ", otherObj);
};