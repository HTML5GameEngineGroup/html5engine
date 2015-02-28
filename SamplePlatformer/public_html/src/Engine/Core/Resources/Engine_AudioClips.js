/*
 * File: EngineCore_Audio.js 
 * Provides support for loading and unloading of Audio clips
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.AudioClips = function()
{    
    var _mAudioContext = null;
    var _mBgAudioNode = null;
    
    /*
     * Initializes the audio context to play sounds.
     */
    var InitAudioContext = function()
    {
        try
        {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            _mAudioContext = new AudioContext();
        }
        catch(e) {alert("Web Audio Is not supported.");};
    };
    
    
    var LoadAudio = function (clipName)
    {
        if (!(gEngine.ResourceMap.IsAssetLoaded(clipName)))
        {   
            // Update resources in load counter.
            gEngine.ResourceMap.AsyncLoadRequested(clipName);
            
            // Asyncrounsly request the data from server.
            var req = new XMLHttpRequest();
            req.open('GET', clipName, true);
            // Specify that the request retrieves binary data.
            req.responseType = 'arraybuffer';
            
            req.onload = function () 
            {
                // Asyncronously decode, then call the function in parameter.
                _mAudioContext.decodeAudioData(req.response,
                    function(buffer)
                    {
                        gEngine.ResourceMap.AsyncLoadCompleted(clipName, buffer);
                    }
                );
            };
            
            req.send();
        } else {
            gEngine.ResourceMap.IncAssetRefCount(clipName);
        }
    };
    
    var UnloadAudio = function(clipName) {
        gEngine.ResourceMap.DecAssetRefCount(clipName);
    };
    
    var PlayACue = function(clipName)
    {
        var clipInfo = gEngine.ResourceMap.RetrieveAsset(clipName);
        if (clipInfo !== null)
        {
            // SourceNodes are one use only.
            var sourceNode = _mAudioContext.createBufferSource();
            sourceNode.buffer = clipInfo;
            sourceNode.connect(_mAudioContext.destination);
            sourceNode.start(0);
        }
    };
    
    var PlayBackgroundAudio = function(clipName)
    {
        var clipInfo = gEngine.ResourceMap.RetrieveAsset(clipName);
        if (clipInfo !== null)
        {
            // Stop audio if playing.
            StopBackgroundAudio();
            
            _mBgAudioNode = _mAudioContext.createBufferSource();
            _mBgAudioNode.buffer = clipInfo;
            _mBgAudioNode.connect(_mAudioContext.destination);
            _mBgAudioNode.loop = true;
            _mBgAudioNode.start(0);
        }
    };
    
    var StopBackgroundAudio = function()
    {
        // Check if the audio is  playing.
        if(_mBgAudioNode !== null)
        {
            _mBgAudioNode.stop(0);
            _mBgAudioNode = null;
        }
    };
    
    var IsBackgroundAudioPlaying = function()
    {
        return (_mBgAudioNode !== null);
    };
    
    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        InitAudioContext: InitAudioContext,
        LoadAudio: LoadAudio,
        UnloadAudio: UnloadAudio,
        PlayACue: PlayACue,
        PlayBackgroundAudio: PlayBackgroundAudio,
        StopBackgroundAudio: StopBackgroundAudio,
        IsBackgroundAudioPlaying: IsBackgroundAudioPlaying
    };
    return oPublic;
}();