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

var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

gEngine.eLayer = Object.freeze({
    eBackground: 0,
    eShadowReceiver: 1,
    eActors: 2,
    eFront: 3,
    eHUD: 4
});

gEngine.LayerManager = (function () {
    // instance variables
    var kNumLayers = 5;
    
    var mAllLayers = [];
    
    var initialize = function() {
        mAllLayers[gEngine.eLayer.eBackground] = new GameObjectSet();
        mAllLayers[gEngine.eLayer.eShadowReceiver] = new GameObjectSet();
        mAllLayers[gEngine.eLayer.eActors] = new GameObjectSet();
        mAllLayers[gEngine.eLayer.eFront] = new GameObjectSet();
        mAllLayers[gEngine.eLayer.eHUD] = new GameObjectSet();
    };
    
    var drawAllLayers = function(aCamera) {
        var i;
        for (i=0; i<kNumLayers; i++) {
            mAllLayers[i].draw(aCamera);
        }
    };
    
    var updateAllLayers = function() {
        var i;
        for (i=0; i<kNumLayers; i++) {
            mAllLayers[i].update();
        }
    };
    
    
    // operations on the layers
    var drawLayer = function(layerEnum, aCamera) {
        mAllLayers[layerEnum].draw(aCamera);
    };
    var updateLayer = function(layerEnum) {
        mAllLayers[layerEnum].update();
    };
    
    var addToLayer = function(layerEnum, obj) {
        mAllLayers[layerEnum].addToSet(obj);
    };
    var removeFromLayer = function(layerEnum, obj) {
        mAllLayers[layerEnum].removeFromSet(obj);
    };
    var drawLastInLayer = function(layerEnum, obj) {
        mAllLayers[layerEnum].drawLast(obj);
    };
    var layerSize = function(layerEnum) {
        return mAllLayers[layerEnum].size();
    };

    var mPublic = {
      initialize: initialize,
      drawAllLayers: drawAllLayers,
      updateAllLayers: updateAllLayers,
      
      drawLayer: drawLayer,
      updateLayer: updateLayer,
      addToLayer: addToLayer,
      removeFromLayer: removeFromLayer,
      drawLastInLayer: drawLastInLayer,
      layerSize: layerSize
    };

    return mPublic;
}());