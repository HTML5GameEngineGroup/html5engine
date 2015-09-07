/* 
 * File: VerletParticle.js
 * Defines a verlet particle
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, vec2, LineRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function VerletParticle(pos) {
    this.kPadding = 0.5;
    
    this.mPosition = pos;  // this is probably a reference to xform.mPosition
    this.mPrevPosition = vec2.clone(this.mPosition);
    this.mForce = vec2.fromValues(0, 0);
    this.mAcceleration = gEngine.Verlet.getSystemtAcceleration();
    this.mDrag = 0.99; 
    
    this.mPositionMark = new LineRenderable();
    this.mDrawBounds = false;
}

VerletParticle.prototype.draw = function (aCamera) {
    if (!this.mDrawBounds) {
        return;
    }
    
    //calculation for the X at the particle position
    var x = this.mPosition[0];
    var y = this.mPosition[1];

    this.mPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
    this.mPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT
    this.mPositionMark.draw(aCamera);

    this.mPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);  //TOP RIGHT
    this.mPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding); //BOTTOM LEFT
    this.mPositionMark.draw(aCamera);
};

VerletParticle.prototype.update = function () {
    this.accumulateForces();
    var dt = gEngine.GameLoop.getUpdateIntervalInSeconds();
    
    var p = this.getPosition();
    var preP = this.mPrevPosition;
    
    // newpos += (pos - prevpos) + (force * dt^2)
    var posDrag = [0, 0];
    var prevPosDrag = [0, 0];
    vec2.scale(posDrag, p, this.mDrag);
    vec2.scale(prevPosDrag, preP, this.mDrag);
    //
    preP[0] = p[0];  // setting this.mPrevPosition!!
    preP[1] = p[1];

    var posDiff = [0, 0];
    vec2.subtract(posDiff ,posDrag, prevPosDrag);
    var overTime = [0, 0];
    vec2.scale(overTime, this.mForce, dt*dt);
    vec2.add(overTime, posDiff, overTime);
    vec2.add(p, p, overTime);
};

VerletParticle.prototype.accumulateForces = function () {
    vec2.add(this.mForce, this.mForce, this.mAcceleration);
};

VerletParticle.prototype.setColor = function (color) {
    this.mPositionMark.setColor(color);
};
VerletParticle.prototype.getColor = function () { return this.mPositionMark1.getColor(); };
VerletParticle.prototype.setDrawBounds = function(d) { this.mDrawBounds = d; };
VerletParticle.prototype.getDrawBounds = function() { return this.mDrawBounds; };

VerletParticle.prototype.setPosition = function (xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); };
VerletParticle.prototype.getPosition = function () { return this.mPosition; };
VerletParticle.prototype.getXPos = function () { return this.mPosition[0]; };
VerletParticle.prototype.setXPos = function (xPos) { this.mPosition[0] = xPos; };
VerletParticle.prototype.getYPos = function () { return this.mPosition[1]; };
VerletParticle.prototype.setYPos = function (yPos) { this.mPosition[1] = yPos; };
VerletParticle.prototype.setForce = function (f) { this.mForce = f; };
VerletParticle.prototype.getForce = function () { return this.mForce; };
VerletParticle.prototype.setAcceleration = function (g) { this.mAcceleration = g; };
VerletParticle.prototype.getAcceleration = function () { return this.mAcceleration; };
VerletParticle.prototype.setDrag = function (d) { this.mDrag = d; };
VerletParticle.prototype.getDrag = function () { return this.mDrag; };
