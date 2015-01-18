/* 
 * The template for a scene.
 */

// Constructor
function Scene()
{
}

//<editor-fold desc="functions subclass should override">
// Performs all initialization functions
//   => Should call LoadConent()!
Scene.prototype.Initialize = function(){
    // You should call LoadContent at the end of Initialize function
};

// Loads all the level specific resources
Scene.prototype.LoadContent = function(){};

// Update function to be called form EngineCore.GameLoop
Scene.prototype.Update = function(){};

// Draw function to be called from EngineCore.GameLoop
Scene.prototype.Draw = function(){};

// Unloads all resources
Scene.prototype.UnloadContent = function() {};
//</editor-fold>

//------ typically there is no need to override thie LoadNextScene() function.
// Unloads all the resources from this level 
// and transits to the next level
Scene.prototype.LoadNextScene = function(nextScene) {
    //  Stop the engine loop before unloading resoruces
    gEngine.GameLoop.Start(nextScene);
};


