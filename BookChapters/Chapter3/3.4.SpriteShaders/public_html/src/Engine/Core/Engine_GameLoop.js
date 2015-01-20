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
    
    // The current loop state (running or should stop)
    var _mIsLoopRunning = false;
    
    var _mMyGame = null;

    // This function assumes it is sub-classed from MyGame
    var _RunLoop = function () {
        if(_mIsLoopRunning) {
            // Step A: set up for next call to _RunLoop and update input!
            requestAnimationFrame( function(){_RunLoop.call(_mMyGame);});
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
        requestAnimationFrame(function(){_RunLoop.call(_mMyGame);});
    };
    
    var Start = function(myGame)
    {
        _mMyGame = myGame;
        // _StartLoop(); // start the loop
        gEngine.ResourceMap.SetLoadCompleteCallback(
                function(){
                    // Clean up to ensure clean start the next round of loading
                    gEngine.ResourceMap.SetLoadCompleteCallback(null);
                    _StartLoop();
                });
    };
    
    var oPublic =
    {
        Start: Start
    };
    return oPublic;
   
}();