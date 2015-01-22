/*
 * File: BoundCheck.js 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var _gWorldZoomFactor = 0.5;

function BoundCheck()
{
    this._mAllObjs = new GameObjectSet();
    
    // variable for renderable objects
    this._mHero = null;        // these are the renderable objects
    
    this._mRedSqs = {};
    this._mWhiteSq = null;
    
    // The camera to view the rectangles
    this._mCamera = null;
    this._mMapCamera = null;
    
    this._mShowMap = false;
    
    this._mBoundCheck = new BoundCheck_World();
       
    // Initialize the game
    this.Initialize();
};
gEngine.Core.InheritPrototype(BoundCheck, Scene);

BoundCheck.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(30, 20),   // position of the camera
            64,                        // width of camera
            [0, 0, 640, 480]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.9, 0.9, 0.9, 1]);
            // sets the background to light gray
   
    this._mMapCamera = new Camera(
            vec2.fromValues(30, 20),
            128 ,
            [470, 410, 160, 60]
            );
    this._mMapCamera.SetBackgroundColor([0.7, 0.7, 0.7, 1.0]);
        
    
    // Step C: Create the renderable objects:
    this._mHero = new HeroObject();
    this._mAllObjs.AddToSet(this._mHero);
    
    this._mWhiteSq = new TexturedPlatform();
    this._mAllObjs.AddToSet(this._mWhiteSq);
     
    var w = new RenderableObject(gMyGame.GameState.GetRedShader());
    var r = new PlatformObject(w);
    this._mAllObjs.AddToSet(r);
    r.GetXform().SetPosition(30, -2);
    r.GetXform().SetSize(65, 1);
    this._mRedSqs[0] = r;
    
    // Step D: Initialize the alpha textured object
    this._mHero.GetXform().SetPosition(50, 30);
    this._mHero.GetXform().SetSize(5, 7.5);
    
    // Step E: Initialize the top-left object with no transparency
    this._mWhiteSq.GetXform().SetPosition(20, 10);
    this._mWhiteSq.GetXform().SetSize(25, 5);
    
    this._mBoundCheck.SetObjs(this._mAllObjs);
};


BoundCheck.prototype._DrawWorld = function(camera)
{
    camera.BeginDraw();      
    
    this._mBoundCheck.DrawBound(camera);
    
        this._mRedSqs[0].Draw(camera.GetVPMatrix());

        this._mHero.Draw(camera.GetVPMatrix());
        this._mWhiteSq.Draw(camera.GetVPMatrix());
        
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BoundCheck.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.3, 0.3, 0.3, 1.0]); // clear to dark gray
    
    
    this._DrawWorld(this._mCamera);
            gMyGame.GameState.Draw(this._mCamera.GetVPMatrix());
            
    if (this._mShowMap)
        this._DrawWorld(this._mMapCamera); 
};

BoundCheck.prototype._MoveXform = function(xform, left, right, up, down)
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
BoundCheck.prototype.Update = function()
{
    gMyGame.GameState.Update();
    
    this._mHero.Update(this._mMapCamera);
    
    this._MoveXform(this._mWhiteSq.GetXform(),   
                gEngine.Input.LEFT,
                gEngine.Input.RIGHT,
                gEngine.Input.UP,
                gEngine.Input.DOWN);
                                            
    var landed = this._mWhiteSq.TouchesHero(this._mHero);
    landed = landed || this._mRedSqs[0].TouchesHero(this._mHero);
    
    
    // landed should be tested a or-condition for all of the platforms
    this._mHero.SetShouldFall(!landed);
    
    var s = this._mCamera.CollideWCBound(this._mHero.GetXform(), 0.75);
    switch (s) {
        case this._mCamera.eWCCollideStatus.eCollideLeft:
            gMyGame.GameState.AddMsg("WC-Left");
            break;
            
        case this._mCamera.eWCCollideStatus.eCollideRight:
            gMyGame.GameState.AddMsg("WC-Right");
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
    
    this._mBoundCheck.UpdateBound(this._mCamera, this._mHero);
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Nine))
        this.LoadNextScene( new BeginLevel() );
};

BoundCheck.prototype.LoadContent = function() {

};

BoundCheck.prototype.UnloadContent = function() {

};