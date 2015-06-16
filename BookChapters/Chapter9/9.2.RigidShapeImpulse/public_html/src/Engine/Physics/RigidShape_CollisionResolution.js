/* 
 * File: RigidShape_CollisionResolution.js
 * resolves rigid shape collision (resolve interpenetration)
 */

/*jslint node: true, vars:true , white: true*/
/*global RigidShape, vec2, */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

RigidShape.prototype.resolveCircPos = function (circShape, ptShape) {
    var point = ptShape.getPosition();
    var cPos = circShape.getXform().getPosition();
    var vFrom1to2 = [0, 0];
    vec2.subtract(vFrom1to2, point, cPos);
    var dist = vec2.length(vFrom1to2);
    if (dist < circShape.getRadius()) {
        vec2.scale(vFrom1to2, vFrom1to2, 1/dist);
        vec2.scaleAndAdd(point, cPos, vFrom1to2, circShape.getRadius());
    }
};

RigidShape.prototype.resolveRectPos = function (rectShape, ptShape) {
    var vFrom1to2 = [0, 0];
    var pt = ptShape.getPosition();
    vec2.subtract(vFrom1to2, pt, rectShape.getPosition());

    var vec = [0, 0];
    vec2.clone(vFrom1to2);

    var alongX = rectShape.getWidth() / 2;
    var alongY = rectShape.getHeight() / 2;

    // Find closest axis
    if (Math.abs(vFrom1to2[0] - alongX) < Math.abs(vFrom1to2[1] - alongY))  {
        // Clamp to closest side
        if (vec[0] > 0) {
            vec[0] = alongX;
        } else {
            vec[0] = -alongX;
        }
    } else { // y axis is shorter
        // Clamp to closest side
        if (vec[1] > 0) {
            vec[1] = alongY;
        } else {
            vec[1] = -alongY;
        }
    }

    var diff = [0, 0];
    vec2.subtract(diff, vec, vFrom1to2);
    vec2.add(pt, pt, diff);  // remember pt is ptShape.Position!!
};

RigidShape.prototype.ResolveCollision = function (s1, s2, collisionInfo, correctPercent) {
    this.PositionalCorrection(s1, s2, collisionInfo, correctPercent);

    var relativeVelocity = [0, 0];
    vec2.sub(relativeVelocity, s2.getVelocity(), s1.getVelocity());

    // Relative velocity in normal direction
    var rVelocityInNormal = vec2.dot(relativeVelocity, collisionInfo.getNormal());
    //if objects moving apart ignore
    if (rVelocityInNormal > 0)
        return;

    var newRestituion = Math.min(s1.getRestitution(), s2.getRestitution());
    // Calc impulse scalar
    var j = -(1 + newRestituion) * rVelocityInNormal;
    j = j / (s1.getInvMass() + s2.getInvMass());

    var impulse = [0, 0];
    vec2.scale(impulse, collisionInfo.getNormal(), j);

    var newVel1 = [0, 0];
    var newImpulse1 = [0, 0];
    vec2.scale(newImpulse1, impulse, s1.getInvMass());
    vec2.sub(newVel1, s1.getVelocity(), newImpulse1);
    s1.setVelocity(newVel1);

    var newVel2 = [0, 0];
    var newImpulse2 = [0, 0];
    vec2.scale(newImpulse2, impulse, s2.getInvMass());
    vec2.add(newVel2, s2.getVelocity(), newImpulse2);
    s2.setVelocity(newVel2);
};

RigidShape.prototype.PositionalCorrection = function (s1, s2, collisionInfo, percent) {
    var num = collisionInfo.getDepth() / (s1.getInvMass() + s2.getInvMass()) * percent;
    var correctionAmount = [0, 0];
    vec2.scale(correctionAmount, collisionInfo.getNormal(), num);

    var ca = [0, 0];
    var invMass = s1.getInvMass();
    vec2.scale(ca, correctionAmount, invMass);
    var newPos = [0, 0];
    vec2.subtract(newPos, s1.getPosition(), ca);
    s1.setPosition(newPos[0], newPos[1]);

    ca = [0, 0];
    invMass = s2.getInvMass();
    vec2.scale(ca, correctionAmount, invMass);
    newPos = [0, 0];
    vec2.add(newPos, s2.getPosition(), ca);
    s2.setPosition(newPos[0], newPos[1]);
};

RigidShape.prototype.resolveCollision = function(otherShape, collisionInfo) {
    switch (otherShape.rigidType()) {
        // case RigidShape.eRigidType.eRigidPoint:
        //    point-point collision is always false and no need for any specific resolution
        
        case RigidShape.eRigidType.eRigidCircle:
            this.resolveCircPos(otherShape, this.getPosition());
            break;
        case RigidShape.eRigidType.eRigidRectangle:
            this.resolveRectPos(otherShape, this.getPosition());
            break;
    }
};