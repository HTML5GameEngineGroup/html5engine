/*
 * File: MyGame_Physics.js 
 * Relaxation support for behaviors
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, CollisionInfo, MyGame */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._physicsSimulation = function() {
    gEngine.Physics.beginRelaxation();
    var collisionInfo = new CollisionInfo();
    var i, obj, rShape;
    var heroRigid = this.mHero.getRigidShape();
    do {
        // Hero collide with platforms
        for (i = 0; i<this.mAllPlatforms.size(); i++) {
            obj = this.mAllPlatforms.getObjectAt(i);
            rShape = obj.getRigidShape();
            if (heroRigid.collided(rShape, collisionInfo)) {
                gEngine.Physics.resolveCollision(heroRigid, rShape, collisionInfo);
            }
        }
    } while (!gEngine.Physics.doneRelaxation());
};
