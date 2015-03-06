/* 
 * The template for a scene.
 */

// Constructor
function Scene() {};

//<editor-fold desc="functions subclass should override">

// Begin Scene: must load all the scene contents
// when done 
//  => start the GameLoop
// The game loop will call initialize and then Update/Draw
Scene.prototype.LoadScene = function() {
    // override to load scene specific contents
};

// Performs all initialization functions
//   => Should call gEngine.GameLoop.Start(this)!
Scene.prototype.Initialize = function(){
    // initialize the level (called from GameLoop)
};

// Update function to be called form EngineCore.GameLoop
Scene.prototype.Update = function(){
    // when done with this level should call:
    // GameLoop.Stop() ==> which will call this.UnloadScene();
};

// Draw function to be called from EngineCore.GameLoop
Scene.prototype.Draw = function(){};

// Must unload all resources
Scene.prototype.UnloadScene = function() {
    // .. unload all resoruces
};
//</editor-fold>


