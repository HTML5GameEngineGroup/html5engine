/*
 * File: Engine_DefaultResources.js 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.DefaultResources = function()
{   
    // Simple Shader
    var _kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";  // Path to the VertexShader 
    var _kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";  // Path to the simple FragmentShader
    var _mConstColorShader = null;
    
    // Texture Shader
    var _kTextureVS = "src/GLSLShaders/TextureVS.glsl";  // Path to the VertexShader 
    var _kTextureFS = "src/GLSLShaders/TextureFS.glsl";  // Path to the texture FragmentShader
    var _mTextureShader = null;
    
    
    var _CreateShaders = function(callBackFunction) {
        _mConstColorShader = new SimpleShader(_kSimpleVS, _kSimpleFS);
        _mTextureShader = new TextureShader(_kTextureVS, _kTextureFS);
        callBackFunction();
    };
    
    var _GetConstColorShader = function() { return _mConstColorShader; };
    var _GetTextureShader = function() { return _mTextureShader; };
    
    var _Initialize = function(callBackFunction) {
        // constant color shader: SimpleVS, and SimpleFS
        gEngine.TextFileLoader.LoadTextFile(_kSimpleVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.LoadTextFile(_kSimpleFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        
        // texture shader: 
        gEngine.TextFileLoader.LoadTextFile(_kTextureVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.LoadTextFile(_kTextureFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        
        gEngine.ResourceMap.SetLoadCompleteCallback(function() {_CreateShaders(callBackFunction);});
    };
    
    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        Initialize: _Initialize,
        GetConstColorShader: _GetConstColorShader,
        GetTextureShader: _GetTextureShader
    };
    return oPublic;
}();