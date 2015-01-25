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
    
    this._mShowMap = false;  // if the mini map should be shown
    
    this._mBg = new LevelOne_Bg();
    
    this._mPlatforms = new GameObjectSet();
       
    // Initialize the game
    gEngine.XmlLoader.LoadXMLFile(this._LevelFile, this.Initialize.bind(this));
};
gEngine.Core.InheritPrototype(LevelOne, Scene);
 
LevelOne.prototype.Initialize = function() 
{
    var parser = new LevelFileParser(this._LevelFile);
    this._mHero = parser.ParseDye();
        
    // Step A: set up the cameras
    this._mCamera = parser.ParseCamera("MainCamera");
    this._mMapCamera = parser.ParseCamera("MapCamera");
    
    parser.ParsePlatforms("StaticPlatform", this._mPlatforms, 
                    function(x, y, w, h) { return new StaticPlatform(x, y, w, h); });
    parser.ParsePlatforms("FloorPlatform", this._mPlatforms,
                    function(x, y, w, h) { return new FloorPlatform(x, y, w, h); });
    
    this.LoadContent();
};


LevelOne.prototype._DrawWorld = function(camera)
{
    camera.BeginDraw();      
    
    this._mBg.DrawBg(camera); // 
    
    // draw the platforms    
    this._mPlatforms.Draw(camera.GetVPMatrix());
    
    // draw dye
    this._mHero.Draw(camera.GetVPMatrix());
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
LevelOne.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to dark gray
    
    this._DrawWorld(this._mCamera);
    gMyGame.GameState.Draw(this._mCamera.GetVPMatrix()); // <-- status echo
            
    if (this._mShowMap)
        this._DrawWorld(this._mMapCamera); 
};

LevelOne.prototype._MoveXform = function(xform, left, right, up, down)
{
    var delta = 0.1;
    if (gEngine.Input.IsKeyPressed(left)) {
        xform.IncXPosBy(-delta);
    }
    if (gEngine.Input.IsKeyPressed(right)) {
        xform.IncXPosBy(delta);
    }
    if (gEngine.Input.IsKeyPressed(up)) {
        xform.IncYPosBy(delta);
    }
    if (gEngine.Input.IsKeyPressed(down)) {
        xform.IncYPosBy(-delta);
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
LevelOne.prototype.Update = function()
{
    gMyGame.GameState.Update();
    
    this._mHero.Update(this._mMapCamera);
   
    var landed = false; 
    var setIterator = new GameObjectSetIterator(this._mPlatforms);
    setIterator.InitForIteration();
    while ((!landed) && setIterator.HasNextElm()) {
        landed = setIterator.GetNextElm().TouchesHero(this._mHero);
        setIterator.FindNextElm();
    }
    
    // landed should be tested a or-condition for all of the platforms
    this._mHero.SetShouldFall(!landed);
    
    var camPos = this._mCamera.GetWCCenter();
    var s = this._mCamera.CollideWCBound(this._mHero.GetXform(), 0.75);
    switch (s) {
        case this._mCamera.eWCCollideStatus.eCollideLeft:
            gMyGame.GameState.AddMsg("WC-Left");
            camPos[0] -= _gHeroMove;
            break;
            
        case this._mCamera.eWCCollideStatus.eCollideRight:
            gMyGame.GameState.AddMsg("WC-Right");
            camPos[0] += _gHeroMove;
            break;
        
        case this._mCamera.eWCCollideStatus.eCollideTop:
            gMyGame.GameState.AddMsg("WC-Top");
            break;
        
        case this._mCamera.eWCCollideStatus.eCollideBottom:
            gMyGame.GameState.AddMsg("WC-Bottom");
            break;
        
        case this._mCamera.eWCCollideStatus.eInside:
            gMyGame.GameState.AddMsg("WC-Inside");
            break;
        
        case this._mCamera.eWCCollideStatus.eOutside:
            gMyGame.GameState.AddMsg("WC-Outside");
            break;
    }
    
    //<editor-fold desc="map camera control">
    var pos = this._mHero.GetXform().GetPosition();
    this._mMapCamera.SetWCCenter(pos[0], pos[1]);
    if (gEngine.Input.IsKeyClicked(gEngine.Input.One))
        this._mShowMap = !this._mShowMap;
  
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Two))
        this._mMapCamera.ZoomByDelta(_gWorldZoomFactor);
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Three))
        this._mMapCamera.ZoomByDelta(-_gWorldZoomFactor);
    //</editor-fold>
    
    // this._mLevelOne.UpdateBound(this._mCamera, this._mHero);
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Nine))
        this.LoadNextScene( new BeginLevel() );
};

LevelOne.prototype.LoadContent = function() {
    
};

LevelOne.prototype.UnloadContent = function() {
    gEngine.XmlLoader.UnloadXMLFile(this._LevelFile);
};