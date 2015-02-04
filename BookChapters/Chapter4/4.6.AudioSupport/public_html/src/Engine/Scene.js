/* 
 * The template for a scene.
 */

// Constructor
function Scene()
{
    // when all memory properly initialized, should call LoadContent()
    this.LoadContent();
}

//<editor-fold desc="functions subclass should override">
// Loads all the level specific resources, 
// when done 
// => Should call Initialize()!
Scene.prototype.LoadContent = function() {
    // override to load scene specific contents
    // when done loading, call initialize to 
    // initilaize the level 
    this.Initialize();
};

// Performs all initialization functions
//   => Should call gEngine.GameLoop.Start(this)!
Scene.prototype.Initialize = function(){
    // initialize the level, when done
    // start gameLoop for this level
    gEngine.GameLoop.Start(this);
};

// Update function to be called form EngineCore.GameLoop
Scene.prototype.Update = function(){};

// Draw function to be called from EngineCore.GameLoop
Scene.prototype.Draw = function(){};

// Unloads all resources
Scene.prototype.UnloadContent = function() {
    gEngine.GameLoop.Stop();    // stops game loop!
    // .. unload all resoruces
};
//</editor-fold>


