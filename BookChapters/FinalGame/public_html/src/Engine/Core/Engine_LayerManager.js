/*
 * File: Engine_LayerManager.js 
 * Central storage for all elements that would be drawn 
 */
/*jslint node: true, vars: true, white: true*/
/*global GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

//  Global variable EngineCore
//  the following syntax enforces there can only be one instance of EngineCore object
"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Static refrence to gEngine
 * @type gEngine
 */
var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

/**
 * Layer enum
 * @type enum|eLayer
 */
gEngine.eLayer = Object.freeze({
    eBackground: 0,
    eShadowReceiver: 1,
    eActors: 2,
    eFront: 3,
    eHUD: 4
});

/**
 * Global variable EngineLayerManager
 * @type gEngine.LayerManager
 */
gEngine.LayerManager = (function () {
    // instance variables
    var kNumLayers = 5;
    
    var mAllLayers = [];
    
    /**
     * 
     * @returns {undefined}
     */
    var initialize = function() {
        mAllLayers[gEngine.eLayer.eBackground] = new GameObjectSet();
        mAllLayers[gEngine.eLayer.eShadowReceiver] = new GameObjectSet();
        mAllLayers[gEngine.eLayer.eActors] = new GameObjectSet();
        mAllLayers[gEngine.eLayer.eFront] = new GameObjectSet();
        mAllLayers[gEngine.eLayer.eHUD] = new GameObjectSet();
    };
    
    /**
     * 
     * @returns {undefined}
     */
    var cleanUp = function() {
        initialize();
    };
    
    /**
     * 
     * @param {type} aCamera
     * @returns {undefined}
     */
    var drawAllLayers = function(aCamera) {
        var i;
        for (i=0; i<kNumLayers; i++) {
            mAllLayers[i].draw(aCamera);
        }
    };
    
    /**
     * 
     * @returns {undefined}
     */
    var updateAllLayers = function() {
        var i;
        for (i=0; i<kNumLayers; i++) {
            mAllLayers[i].update();
        }
    };
    
    
    // operations on the layers
    /**
     * 
     * @param {type} layerEnum
     * @param {type} aCamera
     * @returns {undefined}
     */
    var drawLayer = function(layerEnum, aCamera) {
        mAllLayers[layerEnum].draw(aCamera);
    };
    
    /**
     * 
     * @param {type} layerEnum
     * @returns {undefined}
     */
    var updateLayer = function(layerEnum) {
        mAllLayers[layerEnum].update();
    };
    
    /**
     * 
     * @param {type} layerEnum
     * @param {type} obj
     * @returns {undefined}
     */
    var addToLayer = function(layerEnum, obj) {
        mAllLayers[layerEnum].addToSet(obj);
    };
    
    /**
     * 
     * @param {type} obj
     * @returns {undefined}
     */
    var addAsShadowCaster = function(obj) {
        var i;
        for (i = 0; i<mAllLayers[gEngine.eLayer.eShadowReceiver].size(); i++) {
            mAllLayers[gEngine.eLayer.eShadowReceiver].getObjectAt(i).addShadowCaster(obj);
        }
    };
    
    /**
     * 
     * @param {type} layerEnum
     * @param {type} obj
     * @returns {undefined}
     */
    var removeFromLayer = function(layerEnum, obj) {
        mAllLayers[layerEnum].removeFromSet(obj);
    };
    
    /**
     * 
     * @param {type} layerEnum
     * @param {type} obj
     * @returns {undefined}
     */
    var moveToLayerFront = function(layerEnum, obj) {
        mAllLayers[layerEnum].moveToLast(obj);
    };
    
    /**
     * 
     * @param {type} layerEnum
     * @returns {GameObjectSet.mSet.length}
     */
    var layerSize = function(layerEnum) {
        return mAllLayers[layerEnum].size();
    };

    var mPublic = {
      initialize: initialize,
      drawAllLayers: drawAllLayers,
      updateAllLayers: updateAllLayers,
      cleanUp: cleanUp,
      
      drawLayer: drawLayer,
      updateLayer: updateLayer,
      addToLayer: addToLayer,
      addAsShadowCaster: addAsShadowCaster,
      removeFromLayer: removeFromLayer,
      moveToLayerFront: moveToLayerFront,
      layerSize: layerSize
    };

    return mPublic;
}());
