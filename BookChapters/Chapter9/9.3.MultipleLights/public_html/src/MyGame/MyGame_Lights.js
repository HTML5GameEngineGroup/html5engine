/*
 * File: MyGame_Lights: support the creation of light for MyGame
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._CreateALight = function(index, pos, color, inner, outer, intensity) {
    var light = new Light();
    light.SetColor(color);
    light.SetXPos(pos[0]);
    light.SetYPos(pos[1]);
    light.SetZPos(pos[2]);
    light.SetInnerCone(inner);
    light.SetOuterCone(outer);
    light.SetIntensity(intensity);
    
    return light;
}

MyGame.prototype._InitializeLights = function() 
{
    this._mGlobalLightSet = new LightSet(gEngine.DefaultResources.GetLightShader().GetShader());
   
    var l = this._CreateALight(0,
                [35, 50, 2],  // Left minion position
                [1, 0, 1, 1],       // blue color
                8, 12,                   // inner and outer cones
                1.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(1,
                [30, 30, 4],  // Left minion position
                [1, 0, 0, 1],         // red color
                8, 15,                  // inner and outer cones
                1.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(2,
                [70, 30, 3],  // Right minion position
                [0, 1, 0, 1],         // green color
                6, 10,                  // inner and outer cones
                1.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(3,
                [50, 33, 8],  // Center of camera 
                [1, 1, 1, 1],     // white color
                10, 16,                  // inner and outer cones
                1.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
};
