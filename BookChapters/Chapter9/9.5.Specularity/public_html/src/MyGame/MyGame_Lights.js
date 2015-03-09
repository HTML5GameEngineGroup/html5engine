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
    this._mGlobalLightSet = new LightSet(gEngine.DefaultResources.GetDiffuseShader().GetShader());
   
    var l = this._CreateALight(0,
                [15, 50, 5],  // Hero
                [1, 0, 1, 1],       // blue color
                8, 20,                   // inner and outer cones
                1.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(1,
                [17, 15, 4],  // Left minion position
                [1, 1, 1, 1],         // red color
                10, 15,                  // inner and outer cones
                0.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(2,
                [87, 15, 3],  // Right minion position
                [1, 1, 1, 1],         // red color
                10, 15,                  // inner and outer cones
                0.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(3,
                [50, 33, 3],  // Center of camera 
                [1, 1, 1, 1],     // white color
                8, 15,                  // inner and outer cones
                0.2                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
};
