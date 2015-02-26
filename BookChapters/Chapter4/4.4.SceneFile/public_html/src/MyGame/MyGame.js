/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{       
    // scene file name
    this._kSceneFile = "resources/scene.xml";
    // all square
    this._mSqSet = new Array();        // these are the renderable objects
    
    // The camera to view the rectangles
    this._mCamera = null;
};

MyGame.prototype.LoadScene = function() 
{
    gEngine.TextFileLoader.LoadTextFile(this._kSceneFile, 
                gEngine.TextFileLoader.eTextFileType.eXMLFile);
};

MyGame.prototype.UnloadScene = function()
{
    gEngine.TextFileLoader.UnloadTextFile(this._kSceneFile);
};

MyGame.prototype.Initialize = function() 
{
    var sceneParser = new SceneFileParser(this._kSceneFile);
    
    // Step A: Parse the camera
    this._mCamera = sceneParser.ParseCamera();
    
    // Step B: Parse for all the squares
    sceneParser.ParseSquares(this._mSqSet);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Step  B: Activate the drawing Camera
    this._mCamera.SetupViewProjection();
    
        // Step  C: Draw all the squares
        for (var i = 0; i<this._mSqSet.length; i++) {
            this._mSqSet[i].Draw(this._mCamera.GetVPMatrix());
        }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    // For this very simple game, let's move the white square and pulse the red
    
    var xform = this._mSqSet[0].GetXform();
    var deltaX = 0.05;
    
    // Step A: test for white square movement
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        if (xform.GetXPos() > 30)  // this is the right-bound of the window
            xform.SetPosition(10, 60);
        xform.IncXPosBy(deltaX);
    }
    
    // Step  B: test for white square rotation
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Up))
        xform.IncRotationByDegree(1);
    
    xform = this._mSqSet[1].GetXform();
    // Step  C: test for pulsing the red square
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Down)) {
        if (xform.GetWidth() > 5)
            xform.SetSize(2, 2);
        xform.IncSizeBy(0.05);
    }
};