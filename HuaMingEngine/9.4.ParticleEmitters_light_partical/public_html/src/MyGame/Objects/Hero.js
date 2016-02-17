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
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(18, 24);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mDye);
    var r = new RigidRectangle(this.getXform(), 16, 22);
    r.setMass(0.7);  // less dense than Minions
    r.setRestitution(0.3);
    r.setColor([0, 1, 0, 1]);
    r.setDrawBounds(true);
    this.setPhysicsComponent(r);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    // must call super class update
    GameObject.prototype.update.call(this);

    // control by WASD
    var v = this.getPhysicsComponent().getVelocity();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        v[1] += this.kYDelta;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        v[1] -= this.kYDelta;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        v[0] -= this.kXDelta;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        v[0] += this.kXDelta;
    }
    
    var func = function(x, y) { Hero.prototype.createParticle.call(this, x, y); };
    
    // now interact with the dyePack ...
    var i, obj, collisionPt = [0, 0];
    
    var p = this.getXform().getPosition();
    for (i=0; i<gCurrentScene.mAllDyePacks.size(); i++) {
        obj = gCurrentScene.mAllDyePacks.getObjectAt(i);
        // chase after hero
        obj.rotateObjPointTo(p, 0.8);
        if (obj.pixelTouches(this, collisionPt)) {
            gCurrentScene.mAllDyePacks.removeFromSet(obj);
            obj.destory();
            gCurrentScene.mAllParticle.addEmitterAt(collisionPt, 200, func);
        }
    }
    
    // create dye pack and remove the expired ones ...
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        if (gCurrentScene.mCamera.isMouseInViewport()) {
            var d = new DyePack(gCurrentScene.kDyePackTexture, gCurrentScene.mCamera.mouseWCX(), gCurrentScene.mCamera.mouseWCY());
            gCurrentScene.mAllDyePacks.addToSet(d);
        }
    }
    
    // create particles
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        if (gCurrentScene.mCamera.isMouseInViewport()) {
            var p = this.createParticle(gCurrentScene.mCamera.mouseWCX(), gCurrentScene.mCamera.mouseWCY());
          //  gCurrentScene.mAllParticle.addToSet(p);
        }
    }
    
    // Cleanup DyePacks
    var i, obj;
    for (i=0; i<gCurrentScene.mAllDyePacks.size(); i++) {
        obj = gCurrentScene.mAllDyePacks.getObjectAt(i);
        if (obj.hasExpired()) {
            gCurrentScene.mAllDyePacks.removeFromSet(obj);
        }
    }
};

Hero.prototype.createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particle.png", atX, atY, life);
    p.getRenderable().setColor([1, 0, 0, 1]);
    
    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);
    
    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);
    
    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getPhysicsComponent().setVelocity([fx, fy]);
    
    // size delta
    p.setSizeDelta(0.98);
    
    return p;
};