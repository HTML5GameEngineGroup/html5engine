/*
 * File: EngineCore_TextFileLoader.js 
 * loads an text file into ResoruceMap, either as simple text or as XML
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// Note: loads the a textfile and when done calls the callbackFunction()
//     fileName is treated as resource map key, file content is stored as asset
//
gEngine.TextFileLoader = function()
{   
    var eTextFileType = Object.freeze({
        eXMLFile: 0,
        eTextFile: 1
    });
    
    // if fileType is a eTextFileType
    var LoadTextFile= function(fileName, fileType, callbackFunction) {
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
                var fileContent = null;
                if (fileType === eTextFileType.eXMLFile) {
                    var parser = new DOMParser();
                    fileContent = parser.parseFromString(req.responseText, "text/xml");
                } else {
                    fileContent = req.responseText;
                }
                gEngine.ResourceMap.AsyncLoadCompleted(fileName, fileContent);
                if ((callbackFunction !== null) && (callbackFunction !== undefined))
                    callbackFunction(fileName);
            };
            req.send();
            
        } else {
            if ((callbackFunction !== null) && (callbackFunction !== undefined))
                callbackFunction(fileName);
        }
    };
    
    var UnloadTextFile= function(fileName) {
        gEngine.ResourceMap.UnloadAsset(fileName);
    };
    
    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        LoadTextFile: LoadTextFile,
        UnloadTextFile: UnloadTextFile,
        eTextFileType: eTextFileType 
    };
    return oPublic;
}();
