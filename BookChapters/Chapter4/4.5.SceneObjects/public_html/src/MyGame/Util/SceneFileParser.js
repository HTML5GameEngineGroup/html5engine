/*
 * File: SceneFile_Parse.js 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SceneFileParser(sceneFile)
{
    this._mSceneXml = gEngine.ResourceMap.RetrieveAsset(sceneFile);
};

SceneFileParser.prototype._GetElm = function(tagElm)
{
    var theElm = this._mSceneXml.getElementsByTagName(tagElm);
    if (theElm.length === 0)
        console.error("Warning: Level element:[" + tagElm + "]: is not found!");
    return theElm;
};

SceneFileParser.prototype.ParseCamera = function()
{
    var camElm = this._GetElm("Camera");
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

SceneFileParser.prototype.ParseSquares = function(sqSet)
{    
    var elm = this._GetElm("Square");
    for (var i=0; i<elm.length; i++) {
        var x = elm.item(i).attributes.getNamedItem("PosX").value;
        var y = elm.item(i).attributes.getNamedItem("PosY").value;
        var w = elm.item(i).attributes.getNamedItem("Width").value;
        var h = elm.item(i).attributes.getNamedItem("Height").value;
        var r = elm.item(i).attributes.getNamedItem("Rotation").value;
        var c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
        var sq = new Renderable(gEngine.SystemResources.GetConstColorShader());
        sq.SetColor(c);
        sq.GetXform().SetPosition(x, y);
        sq.GetXform().SetRotationInDegree(r); // In Degree
        sq.GetXform().SetSize(w, h);
        sqSet[sqSet.length] = sq;
     }
};
