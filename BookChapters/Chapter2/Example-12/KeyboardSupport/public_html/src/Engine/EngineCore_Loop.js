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
    var mPreviousTime;
    var mLagTime;
    var mCurrentTime;
    var mElapsedTime;
    
    // The identifier of the current loop.
    var mIntervalID = null;
    var mIsLoopRunning = false;

    // This function assumes it is sub-classed from MyGame
    var RunLoop = function () {
        if(mIsLoopRunning) {
            // 1. compute how much time has elapsed since we last RunLoop was execuated
            mCurrentTime = Date.now();
            mElapsedTime = mCurrentTime - mPreviousTime;
            mPreviousTime = mCurrentTime;
            mLagTime += mElapsedTime;

            // 2. Make sure we update the game the appropriate number of times.
            //      Update only every Milleseconds per frame.
            //      If lag larger then update freames, update until catchup.
            while(mLagTime >= kMPF)
            {
                this.Update();      // call MyGame.Update()
                mLagTime -= kMPF;
            }
            
            // 3. now let's draw
            this.Draw();    // Call MyGame.Draw()
        }
        else
        {
            clearInterval(mIntervalID);
            mIntervalID = null;
        }
    };

    // update and draw functions must be set before this.
    var StartLoop = function(myGame)
    {
        mPreviousTime = Date.now();
        mLagTime = 0.0;
        
        mIsLoopRunning = true;
        mIntervalID = setInterval(function(){RunLoop.call(myGame);}, kMPF);
    };
    
    // Stops only after a loop is started and when the loop ends.
    var StopLoop = function()
    {
        if(mIntervalID !== null) {
            mIsLoopRunning = false; // inform the next RunLoop to quit
        }
    };
    
    var oPublic =
    {
        StartLoop: StartLoop,
        StopLoop: StopLoop
    };
    return oPublic;
   
}();