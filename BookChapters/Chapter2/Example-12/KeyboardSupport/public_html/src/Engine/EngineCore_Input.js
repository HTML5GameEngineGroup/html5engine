/*
 * File: EngineCore_Input.js 
 * Provides input support
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

gEngineCore.Input = function()
{
    // Scancode constants
    var LEFT = 37;
    var UP = 38;
    var RIGHT = 39;
    var DOWN = 40;
    var SPACE = 32;
    var W = 87;
    var A = 65;
    var S = 83;
    var D = 68;
    var E = 69;
    var R = 82;
    var F = 70;
    var J = 74;
    var I = 73;
    var L = 76;
    var K = 75;
    
    var kLastKeyCode = 222;

    // The pressed keys.
    var mIsKeyPressed = {};

    var Initialize = function ()
    {
        for (var i = 0; i<kLastKeyCode; i++)
            mIsKeyPressed[i] = false;
        
        // register services 
        window.addEventListener('keyup', OnKeyUp);
        window.addEventListener('keydown', OnKeyDown);
    };
    
    // Event service functions
    var OnKeyDown = function (event) {
        mIsKeyPressed[event.keyCode] = true;  };
    var OnKeyUp = function (event)  {
        mIsKeyPressed[event.keyCode] = false; };

    // Function for GameEngine Prorammer to test if a key is pressed down
    var IsKeyDown = function (keyCode) {
        return mIsKeyPressed[keyCode]; };

    var oPublic =
    {
        Initialize: Initialize,
        IsKeyDown: IsKeyDown,
        UP: UP,
        DOWN: DOWN,
        LEFT: LEFT,
        RIGHT: RIGHT,
        SPACE: SPACE,
        W: W,
        A: A,
        S: S,
        D: D,
        E: E,
        R: R,
        F: F,
        J: J,
        I: I,
        L: L,
        K: K
    };
    return oPublic;
}();