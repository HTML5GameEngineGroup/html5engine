/*
 * File: EngineCore_Physics.js 
 * Physics engine supporting impulse responses and verlet integration. 
 */
/*jslint node: true, vars: true, evil: true */
/*global */
/* find out more about jslint: http://www.jslint.com/help.html */

//  Global variable EngineCore
//  the following syntax enforces there can only be one instance of EngineCore object
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

gEngine.Physics = (function () {
   var kRelaxationCount = 15;
   var kPosCorrectionPercent = 0.8;

    var mPublic = {
      
    };

    return mPublic;
}());
