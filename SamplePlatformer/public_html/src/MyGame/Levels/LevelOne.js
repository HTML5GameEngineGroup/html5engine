/*
 * File: LevelOne.js 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var _gWorldZoomFactor = 0.5;

function LevelOne()
{
    this._LevelFile = "resources/levels/level1.xml";
    this._mAllObjs = new GameObjectSet();
    
    // variable for renderable objects
    this._mHero = null;        // these are the renderable objects
    
    // The camera to view the rectangles
    this._mCamera = null;
    this._mMapCamera = null;
    
    this._mShouldMove = false;
    this._mGameSpeed = null;
    
    this._mShowMap = false;  // if the mini map should be shown
    
    this._mBg = new LevelOne_Bg();
    
    this._mPlatforms = new GameObjectSet();
       
    // Initialize the game
    gEngine.TextFileLoader.LoadTextFile(this._LevelFile, gEngine.TextFileLoader.eTextFileType.eXMLFile, this.Initialize.bind(this));
};
gEngine.Core.InheritPrototype(LevelOne, Scene);
 
LevelOne.prototype.Initialize = function() 
{
    var parser = new LevelFileParser(this._LevelFile);
    this._mHero = parser.ParseDye();
    this._mGameSpeed = parser.ParseGameSpeed();
        
    // Step A: set up the cameras
    this._mCamera = parser.ParseCamera("MainCamera");
    this._mMapCamera = parser.ParseCamera("MapCamera");
    
    parser.ParsePlatforms("StaticHPlatform", false, this._mPlatforms,
                    function(x, y, s) { return new StaticHPlatform(x, y, s); });
    parser.ParsePlatforms("StaticVPlatform", false, this._mPlatforms,
                    function(x, y, s) { return new StaticVPlatform(x, y, s); });
    
    parser.ParsePlatforms("MotionHPlatform", true, this._mPlatforms,
                    function(x, y, s, i, a, v) { return new MotionHPlatform(x, y, s, i, a, v); });
    parser.ParsePlatforms("MotionVPlatform", true, this._mPlatforms,
                    function(x, y, s, i, a, v) { return new MotionVPlatform(x, y, s, i, a, v); });
    
    
    this.LoadContent();
};




LevelOne.prototype.LoadContent = function() {
    
};

LevelOne.prototype.UnloadContent = function() {
    gEngine.XmlLoader.UnloadXMLFile(this._LevelFile);
};