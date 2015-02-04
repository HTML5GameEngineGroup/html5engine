LevelOne.prototype._DrawWorld = function(camera)
{
    camera.SetupViewProjection();      
    
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