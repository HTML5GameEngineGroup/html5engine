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
        B : 66,
        C : 67,
        D : 68,
        E : 69,
        F : 70,
        G : 71,
        H : 72,
        I : 73,
        J : 74,
        K : 75,
        L : 76,
        M : 77,
        N : 78,
        O : 79,
        P : 80,
        Q : 81,
        R : 82,
        S : 83,
        T : 84,
        U : 85, 
        V : 86,
        W : 87,
        X : 88,
        Y : 89,
        Z : 90,

        LastKeyCode: 222
        };
    
    var _kMouseButton = {
        Left: 0,
        Middle: 1,
        Right: 2
    };

    // Previous key state
    var _mKeyPreviousState = Array();
    // The pressed keys.
    var _mIsKeyPressed = Array();
    // Click events: once an event is set, it will remain there until polled
    var _mIsKeyClicked = Array();

    // Support mouse
    var _mCanvas = null;
    var _mButtonPreviousState = Array();
    var _mIsButtonPressed = Array();
    var _mIsButtonClicked = Array();
    var _mMousePosX = -1;
    var _mMousePosY = -1;

    // <editor-fold desc="Event service functions">
    //<editor-fold desc="Keyboard services">
    var _OnKeyDown = function (event) {
        _mIsKeyPressed[event.keyCode] = true;  };
    var _OnKeyUp = function (event)  {
        _mIsKeyPressed[event.keyCode] = false; };
    //</editor-fold>
    
    //<editor-fold desc="Mouse services">
    var _OnMouseDown = function(event) {
        if (_OnMouseMove(event))
            _mIsButtonPressed[event.button] = true;
    };
    
    var _OnMouseUp = function(event) {
        _OnMouseMove(event);
        _mIsButtonPressed[event.button] = false;
    };
    
    var _OnMouseMove = function(event) {
        var inside = false;
        var bBox = _mCanvas.getBoundingClientRect();
        // In Canvas Space now. Convert via ratio from canvas to client.
        var x = Math.round((event.clientX - bBox.left) * (_mCanvas.width / bBox.width));
        var y = Math.round((event.clientY - bBox.top) * (_mCanvas.width / bBox.width));
        
        if ((x >= 0) && (x < _mCanvas.width) && 
            (y >= 0) && (y < _mCanvas.height)) {
            _mMousePosX = x;
            _mMousePosY = _mCanvas.height-1-y;
            inside = true;
        }   
        return inside;
    };
    //</editor-fold>
    //</editor-fold>
    
    var Initialize = function (canvasID)
    {
        //<editor-fold desc="Keyboard support">
        for (var i = 0; i<_kKeys.LastKeyCode; i++) {
            _mIsKeyPressed[i] = false;
            _mKeyPreviousState[i] = false;
            _mIsKeyClicked[i] = false;
        }
        // register services 
        window.addEventListener('keyup', _OnKeyUp);
        window.addEventListener('keydown', _OnKeyDown);
        //</editor-fold>
        
        //<editor-fold desc="Mouse support">
        for (var i = 0; i<3; i++) {
            _mButtonPreviousState[i] = false;
            _mIsButtonPressed[i] = false;
            _mIsButtonClicked[i] = false;
        }
        window.addEventListener('mousedown', _OnMouseDown);
        window.addEventListener('mouseup', _OnMouseUp);
        window.addEventListener('mousemove', _OnMouseMove);
        _mCanvas = document.getElementById(canvasID);
        //</editor-fold>
    };
    
    var Update = function() {
        for (var i = 0; i<_kKeys.LastKeyCode; i++) {
             _mIsKeyClicked[i] = (!_mKeyPreviousState[i]) && _mIsKeyPressed[i];
            _mKeyPreviousState[i] = _mIsKeyPressed[i];
        }
        for (var i = 0; i<3; i++) {
            _mIsButtonClicked[i] = (!_mButtonPreviousState[i]) && _mIsButtonPressed[i];
            _mButtonPreviousState[i] = _mIsButtonPressed[i];
        }
    };
    
    // Function for GameEngine Prorammer to test if a key is pressed down
    var IsKeyPressed = function (keyCode) {
        return _mIsKeyPressed[keyCode]; };

    var IsKeyClicked = function(keyCode) {
        return (_mIsKeyClicked[keyCode]); 
    };
    
    var IsButtonPressed = function(button) {
        return _mIsButtonPressed[button];
    };
    
    var IsButtonClicked = function(button) {
        return _mIsButtonClicked[button];
    };
    var MousePosX = function() { return _mMousePosX; };
    var MousePosY = function() { return _mMousePosY; };
    
    var oPublic =
    {
        Initialize: Initialize,
        Update: Update,
        
        // keyboard support
        IsKeyPressed: IsKeyPressed,
        IsKeyClicked: IsKeyClicked,
        Keys: _kKeys,
        
        // Mouse support
        IsButtonPressed: IsButtonPressed,
        IsButtonClicked: IsButtonClicked,
        MousePosX: MousePosX,       // invalid if no corresponding buttonPressed or buttonClicked
        MousePosY: MousePosY,
        MouseButton: _kMouseButton
    };
    return oPublic;
}();