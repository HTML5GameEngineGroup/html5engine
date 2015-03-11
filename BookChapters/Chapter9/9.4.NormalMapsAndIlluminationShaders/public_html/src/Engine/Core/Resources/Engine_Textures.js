/*
 * File: EngineCore_Texture.js 
 * Provides support for loading and unloading of textures (images)
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

function TextureInfo(name, w, h, id)
{
    this.mName = name;
    this.mWidth = w;
    this.mHeight = h;
    this.mGLTexID = id;
    this.mColorArray = null;
};

gEngine.Textures = function()
{        
    /*
     * This converts an image in the mTextureMap from the HTML/Javascript format to the
     * webmGL texture format. This should only be called once the texture is loaded.
     */
    var _ProcessLoadedImage = function(textureName, image)
    {
        var gl = gEngine.Core.GetGL();
        
        // Generate a texture reference to the webGL context
        var textureID = gl.createTexture();
        
        // bind the texture reference with the current texture functionality in the webGL
        gl.bindTexture(gl.TEXTURE_2D, textureID);
        
        // Load the texture into the texture data structure with descriptive info.
        // Parameters:
        //  1: Which "binding point" or target the texture is being loaded to.
        //  2: Level of detail. Used for mipmapping. 0 is base texture level.
        //  3: Internal format. The composition of each element. Pixels in this case.
        //  4: Format of texel data. Must match internal format.
        //  5: The data type of the texel data.
        //  6: Texture Data.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // Creates a mipmap of the data at the mGL.TEXTURE_2D target / binding point.
        gl.generateMipmap(gl.TEXTURE_2D);
        
        // Tells WebGL that we are done manipulating data at the mGL.TEXTURE_2D target.
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        var texInfo = new TextureInfo(textureName, image.naturalWidth, image.naturalHeight, textureID);
        gEngine.ResourceMap.AsyncLoadCompleted(textureName, texInfo);
    };

    // Loads an texture so that it can be drawn.
    // If already in the map, will do nothing.
    var LoadTexture = function(textureName)
    {
        if (!(gEngine.ResourceMap.IsAssetLoaded(textureName)))
        {
            // Create new Texture object.
            var img = new Image();
            
            // Update resources in loading counter.
            gEngine.ResourceMap.AsyncLoadRequested(textureName);
            
            // When the texture loads, convert it to the openmGL format then put
            // it back into the mTextureMap.
            img.onload = function () {
                _ProcessLoadedImage(textureName, img);
            };
            img.src = textureName;
        } else {
            gEngine.ResourceMap.IncAssetRefCount(textureName);
        }
    };
    
    // Remove the reference to allow associated memory 
    // be available for subsequent garbage collection
    var UnloadTexture = function(textureName)
    {
        var gl = gEngine.Core.GetGL();
        var texInfo = gEngine.ResourceMap.RetrieveAsset(textureName);
        gl.deleteTexture(texInfo.mGLTexID);
        gEngine.ResourceMap.UnloadAsset(textureName);
    };
    
    var ActivateTexture = function(textureName) {
        var gl = gEngine.Core.GetGL();
        var texInfo = gEngine.ResourceMap.RetrieveAsset(textureName);
        
        // Binds our texture reference to the current webGL texture functionality
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);

        // Handles how magnification filters will work.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        
        // For pixel-graphics where you want the texture to look "sharp" do the following:
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        
        // Prevent texture wrapping.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    
    // texture1 is always normal map for this game engine
    var ActivateNormalMap = function(textureName) {
        var gl = gEngine.Core.GetGL();
        var texInfo = gEngine.ResourceMap.RetrieveAsset(textureName);
        
        // Binds our texture reference to the current webGL texture functionality
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);
    };
    
    var DeActivateTexture = function() {
       var gl = gEngine.Core.GetGL();
       gl.bindTexture(gl.TEXTURE_2D, null);
    };
    
    var GetTextureInfo = function(textureName)
    {
        return gEngine.ResourceMap.RetrieveAsset(textureName);
    };
    
    var GetColorArray = function(textureName)
    {
        var texInfo = GetTextureInfo(textureName);
        if (texInfo.mColorArray === null) {
            // create a framebuffer binds it to the texture, and reads the color content
            // Hint from: http://stackoverflow.com/questions/13626606/read-pixels-from-a-webgl-texture 
            var gl = gEngine.Core.GetGL();
            var fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.mGLTexID, 0);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                var pixels = new Uint8Array(texInfo.mWidth * texInfo.mHeight * 4);
                gl.readPixels(0, 0, texInfo.mWidth, texInfo.mHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                texInfo.mColorArray = pixels;
            } else {
                alert("WARNING: Engine.Textures.GetColorArray() faliled!");
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.deleteFramebuffer(fb);
        }
        return texInfo.mColorArray;
    };
    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        LoadTexture: LoadTexture,
        UnloadTexture: UnloadTexture,
        ActivateTexture: ActivateTexture,
        ActivateNormalMap: ActivateNormalMap,
        DeActivateTexture: DeActivateTexture,
        GetTextureInfo: GetTextureInfo,
        GetColorArray: GetColorArray
    };
    return oPublic;
}();