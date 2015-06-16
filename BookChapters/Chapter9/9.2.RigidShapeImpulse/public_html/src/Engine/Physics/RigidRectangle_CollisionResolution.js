/* 
 * File: RigidCircle_CollisionResolution.js
 * resolves rigid circle collision (resolve interpenetration)
 */

/*jslint node: true, vars:true , white: true*/
/*global RigidShape, RigidRectangle, vec2, */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

RigidRectangle.prototype.resolveCollision = function(otherShape, collisionInfo) {
    if (otherShape.rigidType() === RigidShape.eRigidType.eRigidPoint) {
        this.resolveCircPos(this, otherShape);
    } else {
        this.resolveCollision(this, otherShape, collisionInfo);
    }
};