/*
 * File: EngineCore.js 
 * The first iteration of what the core of our game engine would look like.
 */

//  Global variable EngineCore
//  the following syntax enforces there can only be one instance of EngineCore object
"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.Core = function() 
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
        
        // initialize the WebGL, the vertex buffer and compile the shaders
        var InitializeWebGL = function(htmlCanvasID) {
            var canvas = document.getElementById(htmlCanvasID);
        
            // Get standard webgl, or experimental
            // binds webgl the the Canvas area on the web-page to the global variable "_mGL"
            _mGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    
            if (_mGL !== null) {
                _mGL.clearColor(0.0, 0.8, 0.0, 1.0);  // set the color to be cleared
            } else {
                document.write("<br><b>WebGL is not supported!</b>");
                return;
            }
            
            // now initialize the VertexBuffer
            gEngine.VertexBuffer.Initialize();
        };
        
        // Clears the draw area and draws one square
        var ClearCanvas = function() {
            _mGL.clear(_mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
        };   
        
    // -- end of public methods

    var oPublic = {
        GetGL: GetGL,
        InitializeWebGL: InitializeWebGL,
        ClearCanvas: ClearCanvas
    };

    return oPublic;
}();
