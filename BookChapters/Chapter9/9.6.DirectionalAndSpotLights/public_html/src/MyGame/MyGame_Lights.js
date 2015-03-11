/*
 * File: MyGame_Lights: support the creation of light for MyGame
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._CreateALight = function(type, pos, dir, color, n, f, inner, outer, intensity, dropOff) {
    var light = new Light();
    light.SetLightType(type);
    light.SetColor(color);
    light.SetXPos(pos[0]);
    light.SetYPos(pos[1]);
    light.SetZPos(pos[2]);
    light.SetDirection(dir);
    light.SetNear(n);
    light.SetFar(f);
    light.SetInner(inner);
    light.SetOuter(outer);
    light.SetIntensity(intensity);
    light.SetDropOff(dropOff);
    
    return light;
};

MyGame.prototype._InitializeLights = function() 
{
    this._mGlobalLightSet = new LightSet(gEngine.DefaultResources.GetLightShader().GetShader());
   
    var l = this._CreateALight(Light.eLightType.ePoint,
                [15, 50, 5],         // position
                [0, 0, -1],          // Direction 
                [0.6, 0.6, 0.6, 1],  // some color
                8, 20,               // near and far distances
                0.1, 0.2,            // inner and outer cones
                2.5,                 // intensity
                1.0                  // drop off
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(Light.eLightType.eDirectional,
                [17, 15, 4],           // position
                [0, 0, -1],            // Pointing direction upwards
                [0.7, 0.7, 0.7, 1],    // color
                500, 500,              // near anf far distances: essentially switch this off
                0.1, 0.2,              // inner and outer cones
                1.0,                   // intensity
                1.0                    // drop off
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(Light.eLightType.eSpotLight,
                [87, 15, 3],            // Right minion position
                [0, 0, -1],              // direction
                [0.7, 0.7, 0.7, 1],     // color
                5, 8,                   // near and far distances
                0.3, 0.7,               // 0.3 is around 18-degrees, 0.7 is around 60
                1,                      // intensity
                10                     // drop off
    );
    this._mGlobalLightSet.AddToSet(l);
    
    l = this._CreateALight(Light.eLightType.eSpotLight,
                [50, 33, 2],            // Center of camera 
                [0, 0, -1],
                [0.4, 0.4, 0.4, 1],     //  color
                3, 20,                   // near and far distances
                0.6, 0.8,                // inner and outer cones
                4,                       // intensity
                20                        // drop off
    );
    this._mGlobalLightSet.AddToSet(l);
};

