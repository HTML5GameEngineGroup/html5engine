/*
 * File: EngineCore.js 
 * The first iteration of what the core of our game engine would look like.
 */

//  Global variable EngineCore
//  the following syntax enforces there can only be one instance of EngineCore object
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngineCore = gEngineCore || function() 
{
    // instance variables
    // The graphical context to draw to
    var _mGL = null;
        
    //**----------------------------
    // Public methods:
    //**-----------------------------
    //
        // Accessor of the webgl context
        var GetGL = function() { return _mGL; };
        
        // initialize all of the EngineCore components
        var InitializeEngineCore = function(htmlCanvasID) {
            _InitializeWebGL(htmlCanvasID);
            gEngineCore.Input.Initialize();
        };
        
        // initialize the WebGL, the vertex buffer and compile the shaders
        var _InitializeWebGL = function(htmlCanvasID) {
            var canvas = document.getElementById(htmlCanvasID);
        
            // Get standard webgl, or experimental
            // binds webgl the the Canvas area on the web-page to the global variable "_mGL"
            _mGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    
            if (_mGL === null) {
                document.write("<br><b>WebGL is not supported!</b>");
                return;
            }
        };
            
        // Clears the draw area and draws one square
        var ClearCanvas = function(color) {
            _mGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
            _mGL.clear(_mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
        };   
        
    // -- end of public methods

    var publicMethods = {
        GetGL: GetGL,
        InitializeEngineCore: InitializeEngineCore,
        ClearCanvas: ClearCanvas
    };

    return publicMethods;
}();
