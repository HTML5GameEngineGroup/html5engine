/*
 * File: MyGame_Lights: support the creation of light for MyGame
 */
/*jslint node: true, vars: true */
/*global gEngine, MyGame, Light, LightSet */
/* find out more about jslint: http://www.jslint.com/lint.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._createALight = function (type, pos, dir, color, n, f, inner, outer, intensity, dropOff) {
    var light = new Light();
    light.setLightType(type);
    light.setColor(color);
    light.setXPos(pos[0]);
    light.setYPos(pos[1]);
    light.setZPos(pos[2]);
    light.setDirection(dir);
    light.setNear(n);
    light.setFar(f);
    light.setInner(inner);
    light.setOuter(outer);
    light.setIntensity(intensity);
    light.setDropOff(dropOff);

    return light;
};

MyGame.prototype._initializeLights = function () {
    this.mGlobalLightSet = new LightSet(gEngine.DefaultResources.getLightShader().getShader());

    var l = this._createALight(Light.eLightType.ePoint,
            [15, 50, 5],         // position
            [0, 0, -1],          // Direction 
            [0.6, 0.6, 0.6, 1],  // some color
            8, 20,               // near and far distances
            0.1, 0.2,            // inner and outer cones
            2.5,                 // intensity
            1.0                  // drop off
            );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(Light.eLightType.eDirectional,
            [17, 15, 4],           // position
            [0, 0, -1],            // Pointing direction upwards
            [0.7, 0.7, 0.7, 1],    // color
            500, 500,              // near anf far distances: essentially switch this off
            0.1, 0.2,              // inner and outer cones
            1.0,                   // intensity
            1.0                    // drop off
            );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(Light.eLightType.eSpotLight,
            [87, 15, 3],            // Right minion position
            [0, 0, -1],              // direction
            [0.7, 0.7, 0.7, 1],     // color
            5, 8,                   // near and far distances
            0.3, 0.7,               // 0.3 is around 18-degrees, 0.7 is around 60
            1,                      // intensity
            10                     // drop off
            );
    this.mGlobalLightSet.addToSet(l);

    l = this._createALight(Light.eLightType.eSpotLight,
            [50, 33, 2],            // Center of camera 
            [0, 0, -1],
            [0.4, 0.4, 0.4, 1],     //  color
            3, 20,                   // near and far distances
            0.6, 0.8,                // inner and outer cones
            4,                       // intensity
            20                        // drop off
            );
    this.mGlobalLightSet.addToSet(l);
};