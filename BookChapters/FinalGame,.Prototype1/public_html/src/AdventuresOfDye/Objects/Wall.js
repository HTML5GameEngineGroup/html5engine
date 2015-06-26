/* File: Wall.js 
 *
 * Creates and initializes a Platform
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, IllumRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Wall(cx, cy, texture, normal, lightSet) {
    this.kWallWidth = 1.2;
    this.kWallHeight = 5;

    var renderableObj = new IllumRenderable(texture, normal);
    var i;
    for (i=0; i<lightSet.numLights(); i++) {
        renderableObj.addLight(lightSet.getLightAt(i));
    }
    GameObject.call(this, renderableObj);
    this.getXform().setSize(this.kWallWidth, this.kWallHeight);
    this.getXform().setPosition(cx, cy);
    
    // velocity and movementRange will come later
    var r = new RigidRectangle(this.getXform(), this.kWallWidth, this.kWallHeight);
    r.setDrawBounds(true);
    r.setColor([1, 1, 0, 1]);
    r.setMass(0);
    this.setPhysicsComponent(r);
}
gEngine.Core.inheritPrototype(Wall, GameObject);

/*
Platform.prototype.TouchesHero = function(hero) {
    var hasLanded = this.HasCollidedWithGameObj(hero);
    if (hasLanded ) {
        hasLanded = this._PushHeroOut(hero);
    } 
    return hasLanded;
};

Platform.prototype._PushHeroOut = function(hero) {
    var thisPos = this.GetXform().GetPosition();
    var thisSize = this.GetXform().GetSize();
    var thisHalfW = thisSize[0]/2;
    var thisHalfH = thisSize[1]/2;
    var thisLeft = thisPos[0] - thisHalfW;
    var thisRight = thisPos[0] + thisHalfW;
    var thisTop = thisPos[1] + thisHalfH;
    var thisBot = thisPos[1] - thisHalfH;
    
    var heroPos = hero.GetXform().GetPosition();
    var heroSize = hero.GetXform().GetSize();
    var heroHalfW = heroSize[0]/2;
    var heroHalfH = heroSize[1]/2;
    var heroLeft = heroPos[0] - heroHalfW;
    var heroRight = heroPos[0] + heroHalfW;
    var heroTop = heroPos[1] + heroHalfH;
    var heroBot = heroPos[1] - heroHalfH;
    
    var landed = false;
    
    var dt = thisTop - heroBot; // +ve 
    var db = thisBot - heroTop; // -ve 
    var dr = thisRight - heroLeft; // +ve 
    var dl = thisLeft - heroRight; // -ve 
    var dv, dh;
    
    // vertical
    if (dt > 0) {
        if (db < 0) {
            if (dt < Math.abs(db)) {
                landed = true;
                dv = dt;
            } else 
                dv = db;
        } else {
            dv = dt;
            landed = true;
        }
    } else {
        if (db < 0)
            dv = db;
        else
            dv = 0;
    }
    
    if (dr > 0) {
        if (dl < 0) {
            if (dr < Math.abs(dl))
                dh = dr;
            else
                dh = dl;
        } else {
            dh = dr;
        }
    } else {
        if (dl < 0)
            dh = dl;
        else
            dh = 0;
    }
    
    if (dv !== 0) {
        if (dh !== 0) {
            if (Math.abs(dv) < Math.abs(dh)) {
                hero.GetXform().IncYPosBy(dv);
            } else {
                hero.GetXform().IncXPosBy(dh);
                landed = false;
            }
        } else {
            hero.GetXform().IncYPosBy(dv);
        }
    } else {
        if (dh !== 0) {
            hero.GetXform().IncXPosBy(dh);
            landed = false;
        } else {
            this.Is.InTrouble;
        }
    }

        
    return landed;
};

*/