/*
 * File: BlueLevel.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function BlueLevel()
{       
    // audio clips: supports both mp3 and wav formats
    this._kBgClip = "resources/sounds/BGClip.mp3";
    this._kCue = "resources/sounds/BlueLevel_cue.wav";
    
    // scene file name
    this._kSceneFile = "resources/BlueLevel.xml";
    
    // all square
    this._mSqSet = new Array();        // these are the renderable objects
    
    // The camera to view the rectangles
    this._mCamera = null;
};
gEngine.Core.InheritPrototype(BlueLevel, Scene);

BlueLevel.prototype.LoadScene = function() 
{
    // load the scene file
    gEngine.TextFileLoader.LoadTextFile(this._kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile); 
                
    // loads the audios
    gEngine.AudioClips.LoadAudio(this._kBgClip);
    gEngine.AudioClips.LoadAudio(this._kCue);
};

BlueLevel.prototype.UnloadScene = function() 
{
    // stop the background audio
    gEngine.AudioClips.StopBackgroundAudio();
    
    // unload the scene flie and loaded resoruces
    gEngine.TextFileLoader.UnloadTextFile(this._kSceneFile);
    gEngine.AudioClips.UnloadAudio(this._kBgClip);
    gEngine.AudioClips.UnloadAudio(this._kCue);
    
    var nextLevel = new MyGame();  // load the next level
    gEngine.Core.StartScene(nextLevel);
};

BlueLevel.prototype.Initialize = function() 
{
    var sceneParser = new SceneFileParser(this._kSceneFile);
    
    // Step A: Read in the camera
    this._mCamera = sceneParser.ParseCamera();
    
    // Step B: Read all the squares
    sceneParser.ParseSquares(this._mSqSet);
    
    // now start the bg music ...
    gEngine.AudioClips.PlayBackgroundAudio(this._kBgClip);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BlueLevel.prototype.Draw = function() 
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
BlueLevel.prototype.Update = function()
{
    // For this very simple game, let's move the first square
    var xform = this._mSqSet[1].GetXform();
    var deltaX = 0.05;
    
    /// Move right and swap ovre
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        gEngine.AudioClips.PlayACue(this._kCue);
        xform.IncXPosBy(deltaX);
        if (xform.GetXPos() > 30)  // this is the right-bound of the window
            xform.SetPosition(12, 60);
    }
    
    // Step A: test for white square movement
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        gEngine.AudioClips.PlayACue(this._kCue);
        xform.IncXPosBy(-deltaX);
        if (xform.GetXPos() < 11) { // this is the left-boundary
            gEngine.GameLoop.Stop();
        }
    }
};