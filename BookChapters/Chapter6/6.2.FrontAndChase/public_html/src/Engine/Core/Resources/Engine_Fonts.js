/*
 * File: EngineCore_Fonts.js 
 * Provides support for loading and unloading of font image and font description
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// Note: font name is the path to the fnt file. (without the fnt extension!)
//    You must also provide the image file in the exact same folder
//    with the exact same name, with ".png" extension.
gEngine.Fonts = function()
{    
    var StoreLoadedFont = function(fontInfoSourceString) {
        var fontName = fontInfoSourceString.slice(0, -4);  // trims the .fnt extension
        var fontInfo = gEngine.ResourceMap.RetrieveAsset(fontInfoSourceString);
        fontInfo.FontImage = fontName + ".png";
        gEngine.ResourceMap.AsyncLoadCompleted(fontName, fontInfo); // to store the actual font info
    };
    
    var LoadFont = function(fontName) {
        if (!(gEngine.ResourceMap.IsAssetLoaded(fontName)))
        {
            var fontInfoSourceString = fontName + ".fnt";
            var textureSourceString = fontName + ".png";
            
            gEngine.ResourceMap.AsyncLoadRequested(fontName); // to register an entry in the map
            
            gEngine.Textures.LoadTexture(textureSourceString);
            gEngine.TextFileLoader.LoadTextFile(fontInfoSourceString, 
                            gEngine.TextFileLoader.eTextFileType.eXMLFile, StoreLoadedFont); 
        } else {
            gEngine.ResourceMap.IncAssetRefCount(fontName);
        }
    };
    
    // Remove the reference to allow associated memory 
    // be available for subsequent garbage collection
    var UnloadFont = function(fontName)
    {
        gEngine.ResourceMap.UnloadAsset(fontName);
        if (!(gEngine.ResourceMap.IsAssetLoaded(fontName))) {
            var fontInfoSourceString = fontName + ".fnt";
            var textureSourceString = fontName + ".png";
            
            gEngine.Textures.UnloadTexture(textureSourceString);
            gEngine.TextFileLoader.UnloadTextFile(fontInfoSourceString); 
        };
    };
    
    var GetCharInfo = function(fontName, aChar)
    {
        var returnInfo = null;
        var fontInfo = gEngine.ResourceMap.RetrieveAsset(fontName);
        var commonPath = "font/common";
        var commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        commonInfo = commonInfo.iterateNext();
        if (commonInfo === null)
            return returnInfo;
        var charHeight = commonInfo.getAttribute("base");
        
        var charPath = "font/chars/char[@id=" + aChar + "]";
        var charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        charInfo = charInfo.iterateNext();
        
        if (charInfo === null) 
            return returnInfo;

        returnInfo = new CharacterInfo();
        var texInfo = gEngine.Textures.GetTextureInfo(fontInfo.FontImage);
        var leftPixel = Number(charInfo.getAttribute("x"));
        var rightPixel = leftPixel + Number(charInfo.getAttribute("width")) - 1;
        var topPixel = (texInfo.mHeight-1) - Number(charInfo.getAttribute("y"));
        var bottomPixel = topPixel - Number(charInfo.getAttribute("height")) + 1;

        // texture coordinate information
        returnInfo.mTexCoordLeft = leftPixel / (texInfo.mWidth-1);
        returnInfo.mTexCoordTop = topPixel / (texInfo.mHeight-1);
        returnInfo.mTexCoordRight = rightPixel / (texInfo.mWidth-1);
        returnInfo.mTexCoordBottom = bottomPixel / (texInfo.mHeight-1);
        
        // relative character size
        var charWidth = charInfo.getAttribute("xadvance");
        returnInfo.mCharWidth = charInfo.getAttribute("width") / charWidth;
        returnInfo.mCharHeight = charInfo.getAttribute("height") / charHeight;
        returnInfo.mCharWidthOffset = charInfo.getAttribute("xoffset") / charWidth;
        returnInfo.mCharHeightOffset = charInfo.getAttribute("yoffset") / charHeight;
        returnInfo.mCharAspectRatio = charWidth / charHeight;

        return returnInfo;
    };
    
    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        LoadFont: LoadFont,
        UnloadFont: UnloadFont,
        GetCharInfo: GetCharInfo
    };
    return oPublic;
}();


// for convenenit communication of per-character information
// all size returned are in normalize unit (range between 0 to 1)
function CharacterInfo()
{
  // in texture coordinate (0 to 1) maps to the entier image
  this.mTexCoordLeft = 0;
  this.mTexCoordRight = 1;
  this.mTexCoordBottom = 0;
  this.mTexCoordTop = 0;
  
  // reference to nominal character size, 1 is "standard width/height" of a char
  this.mCharWidth = 1;
  this.mCharHeight = 1;
  this.mCharWidthOffset = 0;
  this.mCharHeightOffset = 0;
  
  // reference of char width/height ration
  this.mCharAspectRatio = 1;
};