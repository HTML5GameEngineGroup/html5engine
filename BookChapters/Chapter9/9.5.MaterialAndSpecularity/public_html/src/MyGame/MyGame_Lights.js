/*
 * File: MyGame_Lights: support the creation of light for MyGame
 */
/*jslint node: true, vars: true */
/*global gEngine, MyGame, Light, LightSet */
/* find out more about jslint: http://www.jslint.com/lint.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._createALight = function (pos, color, n, f, intensity) {
    var light = new Light();
    light.setColor(color);
    light.setXPos(pos[0]);
    light.setYPos(pos[1]);
    light.setZPos(pos[2]);
    light.setNear(n);
    light.setFar(f);
    light.setIntensity(intensity);

    return light;
};

MyGame.prototype._initializeLights = function () {
    this.mGlobalLightSet = new LightSet();

    var l = this._createALight(
        [15, 50, 5],       // Hero
        [0.6, 0.6, 0.6, 1],  // some color
        8, 20,             // Near and Far
        2.5                // intensity
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(
        [17, 15, 4],           // Left minion position
        [0.7, 0.7, 0.7, 1],    // color
        10, 15,                // near and far
        1.8                    // intensity
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(
        [87, 15, 3],            // Right minion position
        [0.7, 0.7, 0.7, 1],     // color
        10, 15,                 // near and far
        1                       // intensity
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(
        [50, 33, 2],            // Center of camera 
        [0.8, 0.2, 0.6, 1],     // color
        15, 20,                 // near and far
        2                       // intensity
    );
    this.mGlobalLightSet.addToSet(l);
};