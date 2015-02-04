/*
 * File: Engine_ResourceMap.js 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.ResourceMap = function()
{   
    var _MapEntry = function(rName) {
        this.mAsset = rName;
        this.mRefCount = 1;
    };
    
    //<editor-fold desc="Asynchronous resource loading support">
    // Number of outstanding load operations
    var _mNumOutstandingLoads = 0;
    
    // Callback function when all textures are loaded
    var _mLoadCompleteCallback = null;
    
    // Resource storage and reference count
    var _mResourceMap = {};
    
    /*
     * Register one more resource to load
     */
    var AsyncLoadRequested = function(rName)
    {
        _mResourceMap[rName] = new _MapEntry(rName); // place holder
        ++_mNumOutstandingLoads;
    };
    
    var AsyncLoadCompleted = function(rName, loadedAsset)
    {
        if (!IsAssetLoaded(rName))
            alert("gEnine.AsyncLoadCompleted: [" + rName + "not in map!");
        
        _mResourceMap[rName].mAsset = loadedAsset;
        --_mNumOutstandingLoads;
        _CheckForAllLoadCompleted();
    };
    
    var _CheckForAllLoadCompleted = function() {
        if ((_mNumOutstandingLoads === 0) && (_mLoadCompleteCallback !== null) )
            _mLoadCompleteCallback();
    };
    
    // Make sure to set the callback _AFTER_ all load commands are issued
    var SetLoadCompleteCallback = function (funct)
    {
        _mLoadCompleteCallback = funct;
        // in case all loading are done
        _CheckForAllLoadCompleted();
    };
    //</editor-fold>
    
    var RetrieveAsset = function(rName) {
        var r = null;
        if (rName in _mResourceMap)
            r = _mResourceMap[rName].mAsset;
        return r;
    };
    
    var IsAssetLoaded = function(rName) {
        return (RetrieveAsset(rName) !== null);
    };
        
    var IncAssetRefCount = function(rName) {
        _mResourceMap[rName].mRefCount += 1;
    };
    
    var DecAssetRefCount = function(rName) {
        var c = 0;
        if (rName in _mResourceMap) {
            _mResourceMap[rName].mRefCount -= 1;
            c = _mResourceMap[rName].mRefCount;
            if (c === 0)
                delete _mResourceMap[rName];
        }
        return c;
    };
    
    var GetAssetRefCount = function(rName) {
        var c = 0;
        if (rName in _mResourceMap)
            c = _mResourceMap[rName].mRefCount;
        return c;
    };
    //</editor-fold>
    
    
    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        //<editor-fold desc="asynchronous resource loading support">
        AsyncLoadRequested: AsyncLoadRequested,
        AsyncLoadCompleted: AsyncLoadCompleted,
        SetLoadCompleteCallback: SetLoadCompleteCallback,
        //</editor-fold>
        //<editor-fold desc="resource storage and reference count support">
        RetrieveAsset: RetrieveAsset,
        IsAssetLoaded: IsAssetLoaded,
        
        IncAssetRefCount: IncAssetRefCount,
        DecAssetRefCount: DecAssetRefCount,
        GetAssetRefCount: GetAssetRefCount
        //</editor-fold>
    };
    return oPublic;
}();