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