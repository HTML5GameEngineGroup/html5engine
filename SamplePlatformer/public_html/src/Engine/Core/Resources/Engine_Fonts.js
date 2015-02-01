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
    var _kDefaultFont = "resources/fonts/dos-font";
    
    var InitFont = function()
    {
        LoadFont(_kDefaultFont);
    };
    
    var StoreLoadedFont = function(fontInfoSourceString) {
        var fontName = fontInfoSourceString.slice(0, -4);  // trims the .fnt extension
        var fontInfo = gEngine.ResourceMap.RetrieveAsset(fontInfoSourceString);
        fontInfo.FontImage = fontName + ".png";
        gEngine.ResourceMap.AsyncLoadRequested(fontName); // to register an entry in the map
        gEngine.ResourceMap.AsyncLoadCompleted(fontName, fontInfo); // to store the actual font info
    };
    
    var LoadFont = function(fontName) {
        if (!(gEngine.ResourceMap.IsAssetLoaded(fontName)))
        {
            var fontInfoSourceString = fontName + ".fnt";
            var textureSourceString = fontName + ".png";
            
            gEngine.Textures.LoadTexture(textureSourceString);
            gEngine.TextFileLoader.LoadTextFile(fontInfoSourceString, gEngine.TextFileLoader.eTextFileType.eXMLFile, StoreLoadedFont);   
        } else {
            gEngine.ResourceMap.IncAssetRefCount(fontName);
        }
    };
    
    // Remove the reference to allow associated memory 
    // be available for subsequent garbage collection
    var UnloadFont = function(fontName)
    {
        gEngine.ResourceMap.DecAssetRefCount(fontName);
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
        var width = charInfo.getAttribute("width") / texInfo.mWidth;
        var height = charInfo.getAttribute("height") / texInfo.mHeight;

        // texture coordinate information
        returnInfo.mTexCoordLeft = charInfo.getAttribute("x") / texInfo.mWidth;
        returnInfo.mTexCoordTop = 1 - (charInfo.getAttribute("y") / texInfo.mHeight);
        returnInfo.mTexCoordRight = returnInfo.mTexCoordLeft + width;
        returnInfo.mTexCoordBottom = returnInfo.mTexCoordTop - height;
        
        // relative character size
        var charWidth = charInfo.getAttribute("xadvance");
        returnInfo.mCharWidth = charInfo.getAttribute("width") / charWidth;
        returnInfo.mCharHeight = charInfo.getAttribute("height") / charHeight;
        returnInfo.mCharWidthOffset = charInfo.getAttribute("xoffset") / charWidth;
        returnInfo.mCharHeightOffset = charInfo.getAttribute("yoffset") / charHeight;

        return returnInfo;
    };
    
    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        LoadFont: LoadFont,
        UnloadFont: UnloadFont,
        GetCharInfo: GetCharInfo,
        InitFont: InitFont,
        DefaultFont: _kDefaultFont
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
};