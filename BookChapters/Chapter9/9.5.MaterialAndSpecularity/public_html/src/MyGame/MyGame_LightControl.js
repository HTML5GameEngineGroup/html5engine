/*
 * File: MyGame_LightControl: support UI manipulation of light parameters
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!
MyGame.prototype._LightControl = function() {
    var delta = 0.2;
    var msg = "";
    // player select which light to work 
    this._SelectLight();
    
    // manipulate the light
    var lgt = this._mGlobalLightSet.GetLightAt(this._mLgtIndex);
    var p = lgt.GetPosition();
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        lgt.SetXPos(p[0] - delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        lgt.SetXPos(p[0] + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Up)) {
        lgt.SetYPos(p[1] + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down)) {
        lgt.SetYPos(p[1] - delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Z)) {
        lgt.SetZPos(p[2] + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.X)) {
        lgt.SetZPos(p[2] - delta); 
    }
    
    // radius
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.C)) {
        lgt.SetNear(lgt.GetNear() + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.V)) {
        lgt.SetNear(lgt.GetNear() - delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.B)) {
        lgt.SetFar(lgt.GetFar() + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.N)) {
        lgt.SetFar(lgt.GetFar() - delta); 
    }
    
    // Intensity
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.K)) {
        lgt.SetIntensity(lgt.GetIntensity() + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.L)) {
        lgt.SetIntensity(lgt.GetIntensity() - delta); 
    }
    
    // on/off
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.H)) {
        lgt.SetLightTo(!lgt.LightIsOn());
    }
    msg = "On(" + lgt.LightIsOn() + ") " +
          this._PrintVec3("P", p) +
          "R(" + lgt.GetNear().toPrecision(3) + "/" + lgt.GetFar().toPrecision(3) + ") " + 
          "I(" + lgt.GetIntensity().toPrecision(3) + ")";
    
    return msg;
};

MyGame.prototype._SelectLight = function() {
    // select which light to work with
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Zero)) 
        this._mLgtIndex = 0; 
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.One))
        this._mLgtIndex = 1;
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Two))
        this._mLgtIndex = 2;
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Three))
        this._mLgtIndex = 3;
};

MyGame.prototype._PrintVec3 = function(msg, p)
{
    return msg + "(" + p[0].toPrecision(2) + " " + p[1].toPrecision(2) + " " + p[2].toPrecision(2) + ") ";
};