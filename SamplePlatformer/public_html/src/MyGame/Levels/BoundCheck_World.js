/*
 * File: 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var _gWCBoundZone = 0.75;
var _gWCMoveDelta = _gHeroMove;
var _gBgUnitSize = 81;
var _gBgSizeFudge = 0.5;
var _gBgYPosotion = 20;

function BoundCheck_World(useCamera)
{
    this._mBg = {};
    this._mBg[0] = new SpriteObject(gMyGame.GameState.GetSpriteShader(), gMyGame.GameState.GetBg1Texture());
    this._mBg[0].SetTextureCoordinate(0, 1920/2048, 0, 1080/2048);
    this._mBg[0].GetXform().SetPosition(30, _gBgYPosotion);
    this._mBg[0].GetXform().SetSize(_gBgUnitSize + _gBgSizeFudge, 54);
    
    this._mBg[1] = new SpriteObject(gMyGame.GameState.GetSpriteShader(), gMyGame.GameState.GetBg2Texture());
    this._mBg[1].SetTextureCoordinate(0, 1920/2048, 0, 1080/2048);
    this._mBg[1].GetXform().SetPosition(111, _gBgYPosotion);
    this._mBg[1].GetXform().SetSize(_gBgUnitSize + _gBgSizeFudge, 54);
    
    this._mBgRefX = 30;  // this is where we will derive the bg locations, this is mBg[0] center
    
    this._mDyeCollection = null;
};

BoundCheck_World.prototype.SetObjs = function(allObj)
{
    this._mDyeCollection = allObj;
};

BoundCheck_World.prototype.UpdateBound = function(useCamera, useHero)
{   
    var shouldMove = false;
    var moveDelta = 0;
    var s = useCamera.CollideWCBound(useHero.GetXform(), _gWCBoundZone);
    switch (s) {
        case useCamera.eWCCollideStatus.eCollideLeft:
            gMyGame.GameState.AddMsg("WC-Left");
            shouldMove = true;
            moveDelta = _gWCMoveDelta;
            break;
            
        case useCamera.eWCCollideStatus.eCollideRight:
            gMyGame.GameState.AddMsg("WC-Right");
            shouldMove = true;
            moveDelta = -_gWCMoveDelta;
            break;
        
        case useCamera.eWCCollideStatus.eCollideTop:
            gMyGame.GameState.AddMsg("WC-Top");
            break;
        
        case useCamera.eWCCollideStatus.eCollideBottom:
            gMyGame.GameState.AddMsg("WC-Bottom");
            break;
        
        case useCamera.eWCCollideStatus.eInside:
            gMyGame.GameState.AddMsg("WC-Inside");
            break;
        
        case useCamera.eWCCollideStatus.eOutside:
            gMyGame.GameState.AddMsg("WC-Outside");
            break;
    }
    
    if (shouldMove) {
        this._mDyeCollection.Advance(moveDelta);
        this._ComputeBgMovement(moveDelta);
    }
};

BoundCheck_World.prototype.DrawBound = function(useCamera)
{
    var cameraX = (useCamera.GetWCCenter())[0];
    // how far away is mBgRefX from the camera center?
    var d = cameraX - this._mBgRefX;
    var d = d/_gBgUnitSize;
    var n = Math.floor(Math.abs(d));  // 
    var useIndex = (n % 2);
    
    // activate the shader
    
    // now draw the one closeset to the center 
    var atX = this._mBgRefX + n * _gBgUnitSize;
    this._mBg[useIndex].GetXform().SetPosition(atX, _gBgYPosotion);
    this._mBg[useIndex].Draw(useCamera.GetVPMatrix());
    
    // now draw the ones to the right
    this._DrawBgTiles(atX, useIndex, _gBgUnitSize, useCamera);
    
    // reference to the center one ...
    this._mBg[useIndex].GetXform().SetPosition(atX, _gBgYPosotion);
    // draw the ones to the left
    this._DrawBgTiles(atX, useIndex, -_gBgUnitSize, useCamera);
    
    
    // this._mBg1.Draw();
    // this._mBg2.Draw();
};

BoundCheck_World.prototype._ComputeBgMovement = function(delta)
{
    this._mBgRefX += delta;
};

BoundCheck_World.prototype._DrawBgTiles = function(atX, useI, delta, useCamera)
{
    var nx = atX;
    var ni = useI;
    while (useCamera.CollideWCBound(this._mBg[ni].GetXform()) !== useCamera.eWCCollideStatus.eOutside) {
        ni = (ni+1) %2;
        nx = nx + delta;
        this._mBg[ni].GetXform().SetPosition(nx, _gBgYPosotion);
        this._mBg[ni].Draw(useCamera.GetVPMatrix());
    }
};