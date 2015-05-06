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
    this.mGlobalLightSet = new LightSet(gEngine.DefaultResources.getLightShader().getShader());

    var l = this._createALight(
        [35, 50, 2],        // Left minion position
        [1, 0, 1, 1],       // blue color
        8, 12,              // Near and Far
        1.5                 // intensity
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(
        [30, 30, 4],        // Left minion position
        [1, 0, 0, 1],       // red color
        8, 15,              // Near and Far
        1.5                 // intensity
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(
        [70, 30, 3],        // Right minion position
        [0, 1, 0, 1],       // green color
        6, 10,              // Near and Far
        1.5                 // intensity
    );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(
        [50, 33, 8],        // Center of camera 
        [1, 1, 1, 1],       // white color
        10, 16,             // Near and Far
        1.5                 // intensity
    );
    this.mGlobalLightSet.addToSet(l);
};