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
        var InitializeEngineCore = function(htmlCanvasID, callbackFunction) {
            _InitializeWebGL(htmlCanvasID);
            gEngine.VertexBuffer.Initialize();
            gEngine.Input.Initialize();
            gEngine.AudioClips.InitAudioContext();
            gEngine.DefaultResources.Initialize(callbackFunction);
        };
        
        // initialize the WebGL, the vertex buffer and compile the shaders
        var _InitializeWebGL = function(htmlCanvasID) {
            var canvas = document.getElementById(htmlCanvasID);
        
            // Get standard webgl, or experimental
            // binds webgl the the Canvas area on the web-page to the global variable "_mGL"
            _mGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            
            // Allows transperency with textures.
            _mGL.blendFunc(_mGL.SRC_ALPHA, _mGL.ONE_MINUS_SRC_ALPHA);
            _mGL.enable ( _mGL.BLEND ) ;
        
            // Set images to have a fliped y axis to match the texture coordinate space.
            _mGL.pixelStorei(_mGL.UNPACK_FLIP_Y_WEBGL, true);

            if (_mGL === null) {
                document.write("<br><b>WebGL is not supported!</b>");
            }
        };
            
        // Clears the draw area and draws one square
        var ClearCanvas = function(color) {
            _mGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
            _mGL.clear(_mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
        };   
        
        var InheritPrototype = function(subClass, superClass)
        {
            var prototype = Object.create(superClass.prototype);
            prototype.constructor = subClass;
            subClass.prototype = prototype;
        };
    // -- end of public methods

    var oPublic = {
        GetGL: GetGL,
        InitializeEngineCore: InitializeEngineCore,
        ClearCanvas: ClearCanvas,
        InheritPrototype: InheritPrototype
    };

    return oPublic;
}();
