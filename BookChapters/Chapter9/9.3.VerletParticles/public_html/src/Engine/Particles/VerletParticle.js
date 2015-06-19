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
    
    this.mPosition = pos;
    this.mPrevPosition = this.mPosition;
    this.mForce = vec2.fromValues(0, 0);
    this.mGravity = gEngine.Physics.getSystemGravity();
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
    var drag = 0.99;
    var oldPos = this.mPosition;
    
    // newpos += (pos - prevpos) + (force * dt^2)
    var posDrag = [0, 0];
    var prevPosDrag = [0, 0];
    vec2.scale(posDrag, this.mPosition, drag);
    vec2.scale(prevPosDrag, this.mPrevPosition, drag);
    var posDiff = [0, 0];
    vec2.subtract(posDiff ,posDrag, prevPosDrag);
    var forceOverTime = [0, 0];
    vec2.scale(forceOverTime, this.mForce, dt*dt);
    var posAndForce = [0, 0];
    vec2.add(posAndForce, posDiff, forceOverTime);
    var newPos = [0, 0];
    vec2.add(newPos, this.mPosition, posAndForce);
    this.mPosition = newPos;
    this.mPrevPosition = oldPos;
};

VerletParticle.prototype.accumulateForces = function () {
    this.mForce = this.mGravity;
};

VerletParticle.prototype.setColor = function (color) {
    this.mColor = color;
    this.mPositionMark.setColor(color);
};

VerletParticle.prototype.setPosition = function (xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); };
VerletParticle.prototype.getPosition = function () { return this.mPosition; };
VerletParticle.prototype.getXPos = function () { return this.mPosition[0]; };
VerletParticle.prototype.setXPos = function (xPos) { this.mPosition[0] = xPos; };
VerletParticle.prototype.getYPos = function () { return this.mPosition[1]; };
VerletParticle.prototype.setYPos = function (yPos) { this.mPosition[1] = yPos; };
VerletParticle.prototype.getPsuedoVelocity = function () {
    var vel = [0,0];
    vec2.subtract(vel, this.mPrevPosition, this.mPosition);
    return vel; };