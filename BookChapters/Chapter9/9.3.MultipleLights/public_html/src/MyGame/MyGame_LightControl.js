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
        msg = " X=" + (p[0] - delta).toPrecision(3);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        lgt.SetXPos(p[0] + delta); 
        msg = " X=" + (p[0] + delta).toPrecision(3);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Up)) {
        lgt.SetYPos(p[1] + delta); 
        msg = " Y=" + (p[1] + delta).toPrecision(3);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down)) {
        lgt.SetYPos(p[1] - delta); 
        msg = " Y=" + (p[1] - delta).toPrecision(3);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Z)) {
        lgt.SetZPos(p[2] + delta); 
        msg = " Z=" + (p[2] + delta).toPrecision(3);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.X)) {
        lgt.SetZPos(p[2] - delta); 
        msg = " Z=" + (p[2] - delta).toPrecision(3);
    }
    
    // radius
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.C)) {
        lgt.SetInnerCone(lgt.GetInnerCone() + delta); 
        msg = " Inner=" + (lgt.GetInnerCone() + delta).toPrecision(3);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.V)) {
        lgt.SetInnerCone(lgt.GetInnerCone() - delta); 
        msg = " Inner=" + (lgt.GetInnerCone() - delta).toPrecision(3);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.B)) {
        lgt.SetOuterCone(lgt.GetOuterCone() + delta); 
        msg = " Outer=" + (lgt.GetOuterCone() + delta).toPrecision(3);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.N)) {
        lgt.SetOuterCone(lgt.GetOuterCone() - delta); 
        msg = " Outer=" + (lgt.GetOuterCone() - delta).toPrecision(3);
    }
    
    // Intensity
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.K)) {
        lgt.SetIntensity(lgt.GetIntensity() + delta); 
        msg = " Intensity=" + (lgt.GetIntensity() + delta).toPrecision(3);
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.L)) {
        lgt.SetIntensity(lgt.GetIntensity() - delta); 
        msg = " Intensity=" + (lgt.GetIntensity() - delta).toPrecision(3);
    }
    
    
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
}