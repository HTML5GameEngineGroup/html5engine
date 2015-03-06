/*
 * File: MyGame_Lights: support the creation of light for MyGame
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._CreateALight = function(pos, color, inner, outer, intensity) {
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
   
    var l = this._CreateALight([35, 50, 5],  // Left minion position
                [0, 0, 1, 1],       // blue color
                4, 8,                   // inner and outer cones
                5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight([30, 30, 4],  // Left minion position
                [0.1, 0, 0, 1],         // red color
                5, 10,                  // inner and outer cones
                0.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight([70, 30, 3],  // Right minion position
                [0, 0.1, 0, 1],         // green color
                5, 10,                  // inner and outer cones
                0.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight([50, 33, 8],  // Center of camera 
                [0.1, 0.1, 0.1, 1],     // white color
                8, 16,                  // inner and outer cones
                0.5                     // intensity
    );
    this._mGlobalLightSet.AddToSet(l);
};
