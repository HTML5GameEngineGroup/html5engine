/*
 * File: 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var _gWCBoundZone = 0.75;
var _gWCMoveDelta = _gHeroMove;
var _gBgUnitSize = 81;
var _gBgSizeFudge = 0.5;
var _gBgYPosotion = 20;

// we know each level always begin at x=0
function LevelOne_Bg()
{
    var x = _gBgUnitSize / 2;
    this._mBg = {};
    this._mBg[0] = new SpriteRenderable(gMyGame.GameState.GetSpriteShader(), gMyGame.GameState.GetBg1Texture());
    this._mBg[0].SetTextureCoordinate(0.05, 1910/2048, 0, 1080/2048);
    this._mBg[0].GetXform().SetPosition(x, _gBgYPosotion);
    this._mBg[0].GetXform().SetSize(_gBgUnitSize + _gBgSizeFudge, 54);
    
    this._mBg[1] = new SpriteRenderable(gMyGame.GameState.GetSpriteShader(), gMyGame.GameState.GetBg2Texture());
    this._mBg[1].SetTextureCoordinate(0.05, 1910/2048, 0, 1080/2048);
    this._mBg[1].GetXform().SetPosition(x, _gBgYPosotion);
    this._mBg[1].GetXform().SetSize(_gBgUnitSize + _gBgSizeFudge, 54);
};

// Assume cannot go backwards
LevelOne_Bg.prototype.DrawBg = function(useCamera)
{   
    var p = useCamera.GetWCCenter()[0];
    var halfW = useCamera.GetWCWidth()/2;
    var left = p - halfW;
    var right = p + halfW;
    var d = p/_gBgUnitSize;
    var n = Math.floor(Math.abs(d));  // 
    var useIndex = (n % 2);  // currently using index
    
    var bgXPos = this._mBg[useIndex].GetXform().GetXPos();
    var bgHalfW = this._mBg[useIndex].GetXform().GetWidth() * 0.5;
    var bgLeft = bgXPos - bgHalfW;
    var bgRight = bgXPos + bgHalfW;
    
    // OK draw for current camera
    this._mBg[useIndex].Draw(useCamera.GetVPMatrix());
    
    var otherIndex = (useIndex + 1) %2;
    var x = bgXPos - _gBgUnitSize;
    // now draw all the left ones ... 
    while (bgLeft > left) {
        // draw ones on the left
        this._mBg[otherIndex].GetXform().SetPosition(x, _gBgYPosotion);
        this._mBg[otherIndex].Draw(useCamera.GetVPMatrix());
        
        bgLeft = bgLeft - _gBgUnitSize;
        x = x - _gBgUnitSize;
        otherIndex = (otherIndex + 1) %2;
    }
    
    otherIndex = (useIndex + 1) %2;
    x = bgXPos + _gBgUnitSize;
    while (right > bgRight) {
        this._mBg[otherIndex].GetXform().SetPosition(x, _gBgYPosotion);
        this._mBg[otherIndex].Draw(useCamera.GetVPMatrix());
        bgRight = bgRight + _gBgUnitSize;
        x = x + _gBgUnitSize;
        var otherIndex = (otherIndex + 1) %2;
    }
};