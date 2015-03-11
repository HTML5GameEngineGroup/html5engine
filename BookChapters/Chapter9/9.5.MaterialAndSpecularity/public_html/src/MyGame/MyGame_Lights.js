/*
 * File: MyGame_Lights: support the creation of light for MyGame
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._CreateALight = function(pos, color, n, f, intensity) {
    var light = new Light();
    light.SetColor(color);
    light.SetXPos(pos[0]);
    light.SetYPos(pos[1]);
    light.SetZPos(pos[2]);
    light.SetNear(n);
    light.SetFar(f);
    light.SetIntensity(intensity);
    
    return light;
};

MyGame.prototype._InitializeLights = function() 
{
    this._mGlobalLightSet = new LightSet(gEngine.DefaultResources.GetLightShader().GetShader());
   
    var l = this._CreateALight(
                [15, 50, 5],        // Hero
                [0.6, 0.6, 0.6, 1], // some color
                8, 20,              // Near and Far
                2.5                 // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(
                [17, 15, 4],           // Left minion position
                [0.7, 0.7, 0.7, 1],    // color
                10, 15,                // Near and Far
                1.8                    // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(
                [87, 15, 3],            // Right minion position
                [0.7, 0.7, 0.7, 1],     // color
                10, 15,                 // near and far
                1                       // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(
                [50, 33, 2],            // Center of camera 
                [0.8, 0.2, 0.6, 1],     //  color
                15, 20,                 // near and far
                2                       // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
};