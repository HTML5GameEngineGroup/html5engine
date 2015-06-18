/*
 * File: EngineCore_Physics.js 
 * Physics engine supporting impulse responses and verlet integration. 
 */
/*jslint node: true, vars: true, white: true */
/*global vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

gEngine.Physics = (function () {
    var mRelaxationCount = 15;
    var mPosCorrectionRate = 0.8;
    var mSystemGravity = -100;
    
    var mRelaxationLoopCount = 0;
    
    var _positionalCorrection = function (s1, s2, collisionInfo) {
        var s1Mass = s1.getInvMass();
        var s2Mass = s2.getInvMass();
        var num = collisionInfo.getDepth() / (s1Mass + s2Mass) * mPosCorrectionRate;
        var correctionAmount = [0, 0];
        vec2.scale(correctionAmount, collisionInfo.getNormal(), num);

        var ca = [0, 0];
        vec2.scale(ca, correctionAmount, s1Mass);
        var s1Pos = s1.getPosition();
        vec2.subtract(s1Pos, s1Pos, ca);

        vec2.scale(ca, correctionAmount, s2Mass);
        var s2Pos = s2.getPosition();
        vec2.add(s2Pos, s2Pos, ca);
    };
    
    var resolveCollision = function (s1, s2, collisionInfo) {
        _positionalCorrection(s1, s2, collisionInfo);

        var relativeVelocity = [0, 0];
        var s1V = s1.getVelocity();
        var s2V = s2.getVelocity();
        vec2.sub(relativeVelocity, s2V, s1V);

        // Relative velocity in normal direction
        var rVelocityInNormal = vec2.dot(relativeVelocity, collisionInfo.getNormal());
        //if objects moving apart ignore
        if (rVelocityInNormal > 0) {
            return;
        }

        var newRestituion = Math.min(s1.getRestitution(), s2.getRestitution());
        // Calc impulse scalar
        var j = -(1 + newRestituion) * rVelocityInNormal;
        j = j / (s1.getInvMass() + s2.getInvMass());

        var impulse = [0, 0];
        vec2.scale(impulse, collisionInfo.getNormal(), j);

        var newImpulse = [0, 0];
        vec2.scale(newImpulse, impulse, s1.getInvMass());
        vec2.sub(s1V, s1V, newImpulse);

        vec2.scale(newImpulse, impulse, s2.getInvMass());
        vec2.add(s2V, s2V, newImpulse);
    };
    
    var beginRelaxation = function() { mRelaxationLoopCount = mRelaxationCount; };
    var doneRelaxation = function() { 
        mRelaxationLoopCount = mRelaxationLoopCount - 1;
        return (mRelaxationLoopCount <= 0); 
    };
    var getSystemGravity = function() { return mSystemGravity; };
    var setSystemGravity = function(g) { mSystemGravity = g; };
    var getRelaxationCorrectionRate = function() { return mPosCorrectionRate; };
    var setRelaxationCorrectionRate = function(r) {
        if ((r <= 0) || (r>=1)) {
            r = 0.8;
        }
        mPosCorrectionRate = r;
    };
    var getRelaxationLoopCount = function() { return mRelaxationCount; };
    var setRelaxationLoopCount = function(c) { mRelaxationCount = c; };
    
    var mPublic = {
        resolveCollision: resolveCollision,
        beginRelaxation: beginRelaxation,
        doneRelaxation: doneRelaxation,
        getSystemGravity: getSystemGravity,
        setSystemGravity: setSystemGravity,
        getRelaxationCorrectionRate: getRelaxationCorrectionRate,
        setRelaxationCorrectionRate: setRelaxationCorrectionRate,
        getRelaxationLoopCount: getRelaxationLoopCount,
        setRelaxationLoopCount: setRelaxationLoopCount 
    };

    return mPublic;
}());
