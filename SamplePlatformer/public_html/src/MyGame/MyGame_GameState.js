"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gMyGame = gMyGame || {};

gMyGame.GameState = function()
{
    // resources
    var kBgAudio = "resources/sounds/Mind_Meld.mp3";
    var kDye = "resources/Dye.png";
    var kPlatform = "resources/platform.png";
    var kBgImage1 = "resources/bg1.png";
    var kBgImage2 = "resources/bg2.png";
    
    var kStatus = "Status: ";
    
    // the shaders
    var _mSpriteShader = null;
    var _mTextureShader = null;
    var _mRedShader = null;
    var _mWhiteShader = null;
    
    var _mStatus = null; // this is the global status!
    var _mStatusMsg = kStatus;
    
    var _LoadResources = function() {
        // Audio
        gEngine.AudioClips.LoadAudio(kBgAudio);
        
        // images
        gEngine.Textures.LoadTexture(kDye);
        gEngine.Textures.LoadTexture(kPlatform);
        gEngine.Textures.LoadTexture(kBgImage1);
        gEngine.Textures.LoadTexture(kBgImage2);
    };
    
    var _ToggleBgMusic = function() {
        if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Zero)) {
            if (gEngine.AudioClips.IsBackgroundAudioPlaying())
                gEngine.AudioClips.StopBackgroundAudio();
            else
                gEngine.AudioClips.PlayBackgroundAudio(kBgAudio);
        }        
    };
    
    var AddMsg = function(msg) { _mStatusMsg += msg; };
    
    var Update = function() {
        _ToggleBgMusic();
        
        _mStatusMsg = kStatus;
    };
    
    var Draw = function(vpMatrix) {
        // draws the global status, what else?
        _mStatus.SetText(_mStatusMsg);
        _mStatus.Draw(vpMatrix);
    };
    

    var GetRedShader = function() { return _mRedShader; };
    var GetWhiteShader = function() { return _mWhiteShader; };
    var GetTextureShader = function() { return _mTextureShader; };
    var GetSpriteShader = function() { return _mSpriteShader; };
    
    var GetDyeTexture = function() { return kDye; };
    var GetPlatformTexture = function() { return kPlatform; };
    var GetBg1Texture = function() { return kBgImage1; };
    var GetBg2Texture = function() { return kBgImage2; };
    
    
    
    var Initialize = function() {
        // shaders
        _mTextureShader = new TextureShader(
            "shaders/TextureVS.glsl",      // Path to the VertexShader 
            "shaders/TextureFS.glsl");    // Path to the White FragmentShader
    
        _mRedShader = new SimpleShader( 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
        _mWhiteShader = new SimpleShader( 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");      // Path to the Red FragmentShader
            
        _mSpriteShader = new SpriteShader(
            "shaders/TextureVS.glsl",
            "shaders/TextureFS.glsl");    

        // initialize the global status
        _mStatus = new TextObject(_mSpriteShader, kStatus);
        _mStatus.GetXform().SetPosition(-1, 43);
        _mStatus.GetXform().SetSize(8, 1);
        
        _LoadResources();
    };
    
    
    
    var oPublic = {
        Update: Update,
        Draw: Draw,
        Initialize: Initialize,
        
        // shaders
        GetWhiteShader: GetWhiteShader,
        GetRedShader: GetRedShader,
        GetTextureShader: GetTextureShader,
        GetSpriteShader: GetSpriteShader,
        
        // access global textures
        GetDyeTexture: GetDyeTexture, 
        GetPlatformTexture: GetPlatformTexture,
        GetBg1Texture: GetBg1Texture,
        GetBg2Texture: GetBg2Texture,
        
        // access global status
        AddMsg: AddMsg
    };
    return oPublic;
}();
