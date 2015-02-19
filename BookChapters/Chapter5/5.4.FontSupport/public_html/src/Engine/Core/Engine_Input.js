/*
 * File: EngineCore_Input.js 
 * Provides input support
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.Input = function()
{
    // Scancode constants
    var _kKeys = { 
        // arrows
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,
        
        // space bar
        Space: 32,
        
        // numbers 
        Zero: 48,
        One: 49,
        Two: 50,
        Three: 51,
        Four: 52,
        Five : 53,
        Six : 54,
        Seven : 55,
        Eight : 56,
        Nine : 57,
    
        // Alphabets
        A : 65,
        D : 68,
        E : 69,
        F : 70,
        G : 71,
        I : 73,
        J : 74,
        K : 75,
        L : 76,
        R : 82,
        S : 83,
        T : 84,
        U : 85, 
        V : 86,
        W : 87,
        X : 88,
        Y : 89,
        Z : 90
        };
    
    var kLastKeyCode = 222;

    // Previous key state
    var _mKeyPreviousState = {};
    // The pressed keys.
    var _mIsKeyPressed = {};
    // Click events: once an event is set, it will remain there until polled
    var _mIsKeyClicked = {};


    // Event service functions
    var _OnKeyDown = function (event) {
        _mIsKeyPressed[event.keyCode] = true;  };
    var _OnKeyUp = function (event)  {
        _mIsKeyPressed[event.keyCode] = false; };
    
    var Initialize = function ()
    {
        for (var i = 0; i<kLastKeyCode; i++) {
            _mIsKeyPressed[i] = false;
            _mKeyPreviousState[i] = false;
            _mIsKeyClicked[i] = false;
        }
        
        // register services 
        window.addEventListener('keyup', _OnKeyUp);
        window.addEventListener('keydown', _OnKeyDown);
    };
    
    var Update = function() {
        for (var i = 0; i<kLastKeyCode; i++) {
             _mIsKeyClicked[i] = (!_mKeyPreviousState[i]) && _mIsKeyPressed[i];
            _mKeyPreviousState[i] = _mIsKeyPressed[i];
        }
    };
    
    // Function for GameEngine Prorammer to test if a key is pressed down
    var IsKeyPressed = function (keyCode) {
        return _mIsKeyPressed[keyCode]; };

    var IsKeyClicked = function(keyCode) {
        return (_mIsKeyClicked[keyCode]); 
    };
    
    var oPublic =
    {
        Initialize: Initialize,
        Update: Update,
        IsKeyPressed: IsKeyPressed,
        IsKeyClicked: IsKeyClicked,
        Keys: _kKeys
    };
    return oPublic;
}();