/*
 * File: EngineCore_Loop.js 
 * Implements the game loop functionality of gEngineCore
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

gEngineCore.Loop = function()
{
    var kFPS = 60;          // Frames per second
    var kMPF = 1000 / kFPS; // Milleseconds per frame.
            
    // Variables for timing gameloop.
    var _mPreviousTime;
    var _mLagTime;
    var _mCurrentTime;
    var _mElapsedTime;
    
    // The identifier of the current loop.
    var _mIntervalID = null;
    var _mIsLoopRunning = false;

    // This function assumes it is sub-classed from MyGame
    var _RunLoop = function () {
        if(_mIsLoopRunning) {
            // Step 1: compute how much time has elapsed since we last RunLoop was execuated
            _mCurrentTime = Date.now();
            _mElapsedTime = _mCurrentTime - _mPreviousTime;
            _mPreviousTime = _mCurrentTime;
            _mLagTime += _mElapsedTime;

            // Step 2: Make sure we update the game the appropriate number of times.
            //        Update only every Milleseconds per frame.
            //        If lag larger then update freames, update until catchup.
            while(_mLagTime >= kMPF)
            {
                this.Update();      // call MyGame.Update()
                _mLagTime -= kMPF;
            }
            
            // Step 3. Draw
            this.Draw();    // Call MyGame.Draw()
        }
        else
        {
            clearInterval(_mIntervalID);
            _mIntervalID = null;
        }
    };

    // update and draw functions must be set before this.
    var StartLoop = function(myGame)
    {
        _mPreviousTime = Date.now();
        _mLagTime = 0.0;
        
        _mIsLoopRunning = true;
        _mIntervalID = setInterval(function(){_RunLoop.call(myGame);}, kMPF);
    };
    
    // Stops only after a loop is started and when the loop ends.
    var StopLoop = function()
    {
        if(_mIntervalID !== null) {
            _mIsLoopRunning = false; // inform the next RunLoop to quit
        }
    };
    
    var oPublic =
    {
        StartLoop: StartLoop,
        StopLoop: StopLoop
    };
    return oPublic;
   
}();