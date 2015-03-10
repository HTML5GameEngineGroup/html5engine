/*
 * File: MyGame_MaterialControl: support UI manipulation of material parameters
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._MaterialControl = function() {
    var delta = 0.01;
    var msg = "";
    
    // player select which object and material channgel to work 
    this._SelectMaterialChannel();
    
    // manipulate the selected component Ambient, Diffuse, Specular
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.E)) {
        this._mMaterialCh[0] += delta; 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.R)) {
        this._mMaterialCh[0] -= delta; 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.T)) {
        this._mMaterialCh[1] += delta; 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Y)) {
        this._mMaterialCh[1] -= delta; 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.U)) {
        this._mMaterialCh[2] += delta; 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.I)) {
        this._mMaterialCh[2] -= delta; 
    }
    
    // shinningess
    var mat = this._mSlectedCh.GetRenderable().GetMaterial();
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.O)) {
        mat.SetShinningness(mat.GetShinningness() + delta); 
    }
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.P)) {
        mat.SetShinningness(mat.GetShinningness() - delta); 
    }
    
    msg += "n(" + mat.GetShinningness().toPrecision(2) + ")" +
           this._PrintVec3("D", mat.GetDiffuse()) +
           this._PrintVec3("S", mat.GetSpecular()) +
           this._PrintVec3("A", mat.GetAmbient());
    
    return msg;
};

MyGame.prototype._SelectMaterialChannel = function()
{
    // select which character to work with
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Seven)) {
        this._mMaterialCh = this._mSlectedCh.GetRenderable().GetMaterial().GetAmbient();
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Eight)) {
        this._mMaterialCh = this._mSlectedCh.GetRenderable().GetMaterial().GetDiffuse();
    }
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Nine)) {
        this._mMaterialCh = this._mSlectedCh.GetRenderable().GetMaterial().GetSpecular();
    }
};
