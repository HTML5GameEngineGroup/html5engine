/*
 * File: LevelOne_Parse.js 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var _gWorldZoomFactor = 0.5;

function LevelFileParser(levelFile)
{
    this._mLevelXml = gEngine.ResourceMap.RetrieveAsset(levelFile);
};

LevelFileParser.prototype._GetElm = function(tagElm)
{
    var theElm = this._mLevelXml.getElementsByTagName(tagElm);
    if (theElm.length === 0)
        console.error("Warning: Level element:[" + tagElm + "]: is not found!");
    return theElm;
};

LevelFileParser.prototype.ParseDye = function()
{
    var dyeElm = this._GetElm("Dye");
    var dyeX = dyeElm[0].getAttribute("PosX");
    var dyeY = dyeElm[0].getAttribute("PosY");
    return new Dye(dyeX, dyeY);
};

LevelFileParser.prototype.ParseCamera = function(cameraName)
{
    var camElm = this._GetElm(cameraName);
    var cx = camElm[0].getAttribute("CenterX");
    var cy = camElm[0].getAttribute("CenterY");
    var w = camElm[0].getAttribute("Width");
    var viewport = camElm[0].getAttribute("Viewport").split(" ");
    var bgColor = camElm[0].getAttribute("BgColor").split(" ");
    
    var cam = new Camera(
            vec2.fromValues(cx, cy),   // position of the camera
            w,                        // width of camera
            viewport         // viewport (orgX, orgY, width, height)
            );
    cam.SetBackgroundColor(bgColor);
    return cam;
};

 LevelFileParser.prototype.ParsePlatforms = function(platformTag, platformSet, func)
 {
     var elm = this._GetElm(platformTag);
     for (var i=0; i<elm.length; i++) {
         var x = elm.item(i).attributes.getNamedItem("PosX").value;
         var y = elm.item(i).attributes.getNamedItem("PosY").value;
         var w = elm.item(i).attributes.getNamedItem("Width").value;
         var h = elm.item(i).attributes.getNamedItem("Height").value;
         var p = func(x, y, w, h);
         platformSet.AddToSet(p);
     }
 };
 