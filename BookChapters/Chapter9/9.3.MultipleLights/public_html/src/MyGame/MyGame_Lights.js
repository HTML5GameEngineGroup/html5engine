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
                [35, 50, 2],        // Left minion position
                [1, 0, 1, 1],       // blue color
                8, 12,              // Near and Far
                1.5                 // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(
                [30, 30, 4],        // Left minion position
                [1, 0, 0, 1],       // red color
                8, 15,              // Near and Far
                1.5                 // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(
                [70, 30, 3],        // Right minion position
                [0, 1, 0, 1],       // green color
                6, 10,              // Near and Far
                1.5                 // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(
                [50, 33, 8],        // Center of camera 
                [1, 1, 1, 1],       // white color
                10, 16,             // Near and Far
                1.5                 // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
};
