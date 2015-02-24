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
        
        // initialize all of the EngineCore components
        var InitializeEngineCore = function(htmlCanvasID, myGame) {
            _InitializeWebGL(htmlCanvasID);
            gEngine.VertexBuffer.Initialize();
            gEngine.Input.Initialize();
            
            // Function to be called within an anomynous function to not call immediatly.
            gEngine.DefaultResources.Initialize(function(){StartScene(myGame);});
        };
        
        // initialize the WebGL, the vertex buffer and compile the shaders
        var _InitializeWebGL = function(htmlCanvasID) {
            var canvas = document.getElementById(htmlCanvasID);
        
            // Get standard webgl, or experimental
            // binds webgl the the Canvas area on the web-page to the variable _mGL
            _mGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    
            if (_mGL === null) {
                document.write("<br><b>WebGL is not supported!</b>");
            }
        };
            
        // Clears the draw area and draws one square
        var ClearCanvas = function(color) {
            _mGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
            _mGL.clear(_mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
        };   
        
        var StartScene = function(myGame)
        {
            myGame.Initialize.call(myGame); // Called in this way to keep correct context
            gEngine.GameLoop.Start(myGame); // start the game loop after initialization is done
        };
    // -- end of public methods

    var oPublic = {
        GetGL: GetGL,
        InitializeEngineCore: InitializeEngineCore,
        ClearCanvas: ClearCanvas,
        StartScene: StartScene
    };

    return oPublic;
}();
