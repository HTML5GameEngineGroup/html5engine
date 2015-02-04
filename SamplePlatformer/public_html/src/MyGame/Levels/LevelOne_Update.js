

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
LevelOne.prototype.Update = function()
{
    gMyGame.GameState.Update();
    
    this._mHero.Update(this._mMapCamera);
   
   //<editor-fold desc="detect if dye landed on a platform (vertical platforms BREAKS THIS!!!)">
           // warning this does not work for verticle platforms!!
    var landed = false; 
    var setIterator = new GameObjectSetIterator(this._mPlatforms);
    setIterator.InitForIteration();
    while ((!landed) && setIterator.HasNextElm()) {
        landed = setIterator.GetNextElm().Update(this._mHero);
        setIterator.FindNextElm();
    }
    // landed should be tested a or-condition for all of the platforms
    this._mHero.SetShouldFall(!landed);
    var p = this._mHero.GetXform().GetPosition();
    gMyGame.GameState.AddMsg("At:("+p[0].toFixed(1) + " " + p[1].toFixed(1) + ") ");
    //</editor-fold>
    
    //<editor-fold desc="Updates the camera and dye">
    var camPos = this._mCamera.GetWCCenter();
    if (this._mShouldMove)
        camPos[0] += this._mGameSpeed;
    var s = this._mCamera.ClampAtWCBound(this._mHero.GetXform(), 1.0);
    switch (s) {
        case this._mCamera.eWCCollideStatus.eCollideLeft:
            gMyGame.GameState.AddMsg("WC-Left");
            // ok, dye should die here ... but for now
            this._mHero.GetXform().IncXPosBy(this._mGameSpeed);
            break;
            
        case this._mCamera.eWCCollideStatus.eCollideRight:
            gMyGame.GameState.AddMsg("WC-Right");
            break;
        
        case this._mCamera.eWCCollideStatus.eCollideTop:
            gMyGame.GameState.AddMsg("WC-Top");
            this._mHero.CancelYVelocity();
            break;
        
        case this._mCamera.eWCCollideStatus.eCollideBottom:
            gMyGame.GameState.AddMsg("WC-Bottom");
            this._mHero.CancelYVelocity();
            break;
        
        case this._mCamera.eWCCollideStatus.eInside:
            gMyGame.GameState.AddMsg("WC-Inside");
            break;
        
        case this._mCamera.eWCCollideStatus.eOutside:
            gMyGame.GameState.AddMsg("WC-Outside");
            break;
    }
    //</editor-fold>
    
    //<editor-fold desc="map camera control">
    var pos = this._mHero.GetXform().GetPosition();
    this._mMapCamera.SetWCCenter(pos[0], pos[1]);
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.One))
        this._mShowMap = !this._mShowMap;
  
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Two))
        this._mMapCamera.ZoomByDelta(_gWorldZoomFactor);
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Three))
        this._mMapCamera.ZoomByDelta(-_gWorldZoomFactor);
    //</editor-fold>
    
    // this._mLevelOne.UpdateBound(this._mCamera, this._mHero);
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Nine))
        this.LoadNextScene( new BeginLevel() );
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.M))
        this._mShouldMove = !this._mShouldMove;
};
