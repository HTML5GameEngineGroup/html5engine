/*
 * File: EngineCore_XmlLoader.js 
 * loads an XML file into ResoruceMap.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// Note: loads the XMLfile and when done calls the callbackFunction()
//     fileName is treated as resource map key, file content is stored as asset
//
gEngine.XmlLoader = function()
{        
    var LoadXMLFile= function(fileName, callbackFunction) {
        if (!(gEngine.ResourceMap.IsAssetLoaded(fileName)))
        {
            // Update resources in load counter.
            gEngine.ResourceMap.AsyncLoadRequested(fileName);
                        
            // Asyncrounsly request the data from server.
            var req = new XMLHttpRequest();
            req.open('GET', fileName, true);
            req.setRequestHeader('Content-Type', 'text/xml');
            
            req.onload = function () 
            {
                var parser = new DOMParser();
                var fileContent = parser.parseFromString(req.responseText, "text/xml");
                gEngine.ResourceMap.AsyncLoadCompleted(fileName, fileContent);
                callbackFunction(fileName);
            };
            req.send();
            
        } else {
            gEngine.ResourceMap.IncAssetRefCount(fileName);
            callbackFunction(fileName);
        }
    };
    
    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        LoadXMLFile: LoadXMLFile
    };
    return oPublic;
}();
