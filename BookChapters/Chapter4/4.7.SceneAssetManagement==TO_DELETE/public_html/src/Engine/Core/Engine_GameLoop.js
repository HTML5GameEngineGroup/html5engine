/*
 * File: EngineCore_Loop.js 
 * Implements the game loop functionality of gEngine
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.GameLoop = function()
{
    var kFPS = 60;          // Frames per second
    var kMPF = 1000 / kFPS; // Milleseconds per frame.
            
    // Variables for timing gameloop.
    var _mPreviousTime;
    var _mLagTime;
    var _mCurrentTime;
    var _mElapsedTime;
    
    // The identifier of the current loop.
    var _mIsLoopRunning = false;
    var _mCurrentScene = null;
    
    // function to run after current loop has stopped
    var _mNextScene = null;
    
    var _TransitionToNextScene = function() {
        // unload current scene
        if (_mCurrentScene !== null)
            _mCurrentScene.UnloadContent();
        
        // set to next scene
        _mCurrentScene = _mNextScene;
        _mNextScene = null;
        
        // Begin loading
        _mCurrentScene.LoadContent();
        
        // wait until loading is done and star loop again
        gEngine.ResourceMap.SetLoadCompleteCallback(
                    function(){
                         // Clean this up for next level
                         gEngine.ResourceMap.SetLoadCompleteCallback(null);
                        _StartLoop();
                    });
    };
    
    // This function assumes it is sub-classed from Scene
    var _RunLoop = function () {
        if(_mIsLoopRunning) {
            // Step A: set up for next call to _RunLoop and update input!
            requestAnimationFrame( function(){_RunLoop.call(_mCurrentScene);});
            gEngine.Input.Update();
            
            // Step B: compute how much time has elapsed since we last RunLoop was execuated
            _mCurrentTime = Date.now();
            _mElapsedTime = _mCurrentTime - _mPreviousTime;
            _mPreviousTime = _mCurrentTime;
            _mLagTime += _mElapsedTime;

            // Step C: Make sure we update the game the appropriate number of times.
            //      Update only every Milleseconds per frame.
            //      If lag larger then update freames, update until catchup.
            while ((_mLagTime >= kMPF) && (_mIsLoopRunning))
            {
                this.Update();      // call Scene.Update()
                _mLagTime -= kMPF;
            }
            
            // Step D: now let's draw
            this.Draw();    // Call Scene.Draw()
        }
        else
        {
            // Now start next scene
            _TransitionToNextScene();
        }
    };

    // update and draw functions must be set before this.
    var _StartLoop = function()
    {
        // Step A: reset frame time 
        _mPreviousTime = Date.now();
        _mLagTime = 0.0;
        
        // Step B: remember that loop is now running
        _mIsLoopRunning = true;
        
        // Step C: request _RunLoop to start when loading is done
        requestAnimationFrame(function(){_RunLoop.call(_mCurrentScene);});
    };
    
    var Start= function(myScene)
    {
        _mNextScene = myScene;
        if (_mIsLoopRunning) {
            // currently loop is running, signal that runLoop should stop 
            _mIsLoopRunning = false; // inform the next RunLoop to quit
        } else {
            _TransitionToNextScene();  // begin!
        }
    };
    
    var oPublic =
    {
        Start: Start
    };
    return oPublic;
   
}();