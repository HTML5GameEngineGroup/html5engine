/*
 * File: Engine_DefaultResources.js 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.DefaultResources = function()
{   
    // Global Ambient color
    var _mGlobalAmbientColor = [0.01, 0.01, 0.01, 0];
    var _GetGlobalAmbientColor = function() { return _mGlobalAmbientColor; };
    var _SetGlobalAmbientColor = function(v) { _mGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]); };
    
    // Simple Shader
    var _kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";  // Path to the VertexShader 
    var _kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";  // Path to the simple FragmentShader
    var _mConstColorShader = null;
    
    // Texture Shader
    var _kTextureVS = "src/GLSLShaders/TextureVS.glsl";  // Path to the VertexShader 
    var _kTextureFS = "src/GLSLShaders/TextureFS.glsl";  // Path to the texture FragmentShader
    var _mTextureShader = null;
    var _mSpriteShader = null;
    
    // Diffuse Shader
    var _kDiffuseFS = "src/GLSLShaders/DiffuseFS.glsl";  // Path to the Diffuse FragmentShader
    var _mDiffuseShader = null;
    
    // Default font
    var _kDefaultFont = "resources/fonts/system-default-font";
    var _GetDefaultFont = function() { return _kDefaultFont; };
    
    var _CreateShaders = function(callBackFunction) {
        gEngine.ResourceMap.SetLoadCompleteCallback(null);
        _mConstColorShader = new SimpleShader(_kSimpleVS, _kSimpleFS);
        _mTextureShader = new TextureShader(_kTextureVS, _kTextureFS);
        _mSpriteShader =  new SpriteShader(_kTextureVS, _kTextureFS);
        _mDiffuseShader = new DiffuseShader(_kTextureVS, _kDiffuseFS);
        callBackFunction();
    };
    
    var _GetConstColorShader = function() { return _mConstColorShader; };
    var _GetTextureShader = function() { return _mTextureShader; };
    var _GetSpriteShader = function() { return _mSpriteShader; };
    var _GetDiffuseShader = function() { return _mDiffuseShader; };
    
    var _Initialize = function(callBackFunction) {
        // constant color shader: SimpleVS, and SimpleFS
        gEngine.TextFileLoader.LoadTextFile(_kSimpleVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.LoadTextFile(_kSimpleFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        
        // texture shader: 
        gEngine.TextFileLoader.LoadTextFile(_kTextureVS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        gEngine.TextFileLoader.LoadTextFile(_kTextureFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        
        // Diffuse Shader
        gEngine.TextFileLoader.LoadTextFile(_kDiffuseFS, gEngine.TextFileLoader.eTextFileType.eTextFile);
        
        // load default font
        gEngine.Fonts.LoadFont(_kDefaultFont);
        
        gEngine.ResourceMap.SetLoadCompleteCallback(function() {_CreateShaders(callBackFunction);});
    };
    
    // Unload all resources
    var _CleanUp = function() {
        _mConstColorShader.CleanUp();
        _mTextureShader.CleanUp();
        _mSpriteShader.CleanUp();
        
        gEngine.TextFileLoader.UnloadTextFile(_kSimpleVS);
        gEngine.TextFileLoader.UnloadTextFile(_kSimpleFS);
        
        // texture shader: 
        gEngine.TextFileLoader.UnloadTextFile(_kTextureVS);
        gEngine.TextFileLoader.UnloadTextFile(_kTextureFS);
        
        // Diffuse Shader
        gEngine.TextFileLoader.UnloadTextFile(_kDiffuseFS);
        
        // default font
        gEngine.Fonts.UnloadFont(_kDefaultFont);
    };
    
    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        Initialize: _Initialize,
        GetConstColorShader: _GetConstColorShader,
        GetTextureShader: _GetTextureShader,
        GetSpriteShader: _GetSpriteShader,
        GetDiffuseShader: _GetDiffuseShader,
        GetDefaultFont: _GetDefaultFont,
        GetGlobalAmbientColor: _GetGlobalAmbientColor,
        SetGlobalAmbientColor: _SetGlobalAmbientColor,
        CleanUp: _CleanUp
    };
    return oPublic;
}();