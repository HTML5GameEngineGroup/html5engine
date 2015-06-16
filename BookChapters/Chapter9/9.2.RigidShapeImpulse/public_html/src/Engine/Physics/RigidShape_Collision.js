/* 
 * File: RigidShape_Collision.js
 * Detects RigidPoint collisions
 */

/*jslint node: true, vars:true , white: true*/
/*global RigidShape, vec2, LineRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

RigidShape.prototype.circContainsPos = function (circ, pos) {
    var dist = vec2.distance(circ.getPosition(), pos);
    return (dist < circ.getRadius());
};

RigidShape.prototype.rectContainsPos = function (rect, pos) {
    var rPos = rect.getPosition();
    var rMinX = rPos[0] - rect.getWidth() / 2;
    var rMaxX = rPos[0] + rect.getWidth() / 2;
    var rMinY = rPos[1] - rect.getHeight() / 2;
    var rMaxY = rPos[1] + rect.getHeight() / 2;

    return ((rMinX < pos[0]) && (rMaxX > pos[0]) && 
            (rMinY < pos[1] && rMaxY > pos[1]));
};

RigidShape.prototype.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};

RigidShape.prototype.collidedRectCirc = function(rect1Shape, circ2Shape, collisionInfo) {
    var rect1Pos = rect1Shape.getXform().getPosition();
    var circ2Pos = circ2Shape.getXform().getPosition();
    var vFrom1to2 = [0, 0];
    vec2.subtract(vFrom1to2, circ2Pos, rect1Pos);

    var vec = vec2.clone(vFrom1to2);

    var alongX = rect1Shape.getWidth() / 2;
    var alongY = rect1Shape.getHeight() / 2;

    vec[0] = this.clamp(vec[0], -alongX, alongX);
    vec[1] = this.clamp(vec[1], -alongY, alongY);

    var isInside = false;

    if (this.RectContainsPoint(rect1Shape, circ2Pos))  {
        isInside = true;
        // Find closest axis
        if (Math.abs(vFrom1to2[0] - alongX) < Math.abs(vFrom1to2[1] - alongY)) {
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
    }

    var normal = [0, 0];
    vec2.subtract(normal, vFrom1to2, vec);

    var distSqr = vec2.squaredLength(normal);
    var rSqr = circ2Shape.getRadius() * circ2Shape.getRadius();

    if (distSqr > rSqr && !isInside) {
        return false; //no collision exit before costly square root
    }

    var len = vec2.length(normal);
    var depth = circ2Shape.getRadius() - len;
    
    vec2.scale(normal, normal, 1/len); // normalize normal
    if (isInside) { //flip normal if inside the rect
        vec2.scale(normal, normal, -1);
    } else {
        collisionInfo.setNormal(normal);
    }
    
    collisionInfo.setNormal(normal);
    collisionInfo.setDepth(depth);
    return true;
};

RigidShape.prototype.collided = function(otherShape, collisionInfo) { 
    var status = false;
    collisionInfo.setDepth(0);
    switch (otherShape.rigidType()) {
        // case RigidShape.eRigidType.eRigidPoint:
        //    point-point collision is always false;
        
        case RigidShape.eRigidType.eRigidCircle:
            status = this.circContainsPos(otherShape, this.getPosition());
            break;
        case RigidShape.eRigidType.eRigidRectangle:
            status = this.rectContainsPos(otherShape, this.getPosition());
            break;
    }
    return status;
};