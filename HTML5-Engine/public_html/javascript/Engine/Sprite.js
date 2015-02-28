/* 
 * 
 */
function Sprite(transform, shaderName, spriteTextureName, spritesheetInfo, normalMap)
{   
    Renderable2DObject.call(this, transform, shaderName, spriteTextureName, normalMap);
    this.mCurrentFrame = 0;
    this.mSpritesheetInfo = spritesheetInfo;
    this.mTicksPerFrame = 0;
    this.mCurrentTick = 0;
}
Sprite.prototype = Object.create(Renderable2DObject.prototype);

Sprite.prototype._setupTextureCoordAttrib = function(gl, shaderProgram, textureBuffer)
{
    // Get the information for whole spritesheet.
    var spriteInfo = EngineCore.Resources.getSpriteInfo(this.mSpritesheetInfo);
    
    // Setup texture coordinates and update depending on if it is a sprite or not.
    var textureCoordinates = this._setupSpriteDrawing(spriteInfo);
    
    // Update it's sprite information for next draw.
    this._updateAnimation(spriteInfo.totalSpriteFrames);

    // Retrieve the texture coordinate attribute memory location to pass in.
    var textureCoordsAttribute = gl.getAttribLocation(shaderProgram,
        "aTextureCoordinate");

    // Bind the textureBuffer to modify it.    
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    // Update our buffer.
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(textureCoordinates));
    // Point gl to our data.
    gl.vertexAttribPointer(textureCoordsAttribute, 2, gl.FLOAT, false,
        0, 0); 
    gl.enableVertexAttribArray(textureCoordsAttribute);
};

Sprite.prototype._setupSpriteDrawing = function(spriteInfo)
{
    // Check if frame not already out of range, if so reset to zero.
    if(this.mCurrentFrame >= spriteInfo.length)
    {
        this.mCurrentFrame = 0;
    }

    // Parse xml to retrieve an array of all frame infomration, then choose the
    // curent one.
    var frameInfo = spriteInfo.getElementsByTagName("SubTexture")[this.mCurrentFrame];

    var texWidth = EngineCore.Resources.getGLTexture(this.mTextureString).width;
    var texHeight = EngineCore.Resources.getGLTexture(this.mTextureString).height;

    // Set the texture coordinates as a percentage of texture.
    var x1 = frameInfo.getAttribute("x") / texWidth;
    var y1 = frameInfo.getAttribute("y") / texHeight;
    var spriteWidth = frameInfo.getAttribute("width") / texWidth;
    var spriteHeight = frameInfo.getAttribute("height") / texHeight;
    var x2 = x1 + spriteWidth;
    var y2 = y1 + spriteHeight;


    // This is how the texture coordinates would ordinarily
    // map to to the verticies.
    //textureCoordinates = [x1,  y1,
    //                      x2,  y1,
    //                      x1,  y2,
    //                      x2,  y2];

    // The input xml data's coordinate system starts from
    // the upper left corner, while our textures use the
    // lower left corner as the origin (because we set
    // UNPACK_FLIP_Y_WEBGL to true earlier). So we flip
    // the y-coord here.
    var textureCoordinates = [x1,  1 - y2,
                              x2,  1 - y2,
                              x1,  1 - y1,
                              x2,  1 - y1];     

    return textureCoordinates;
};

/*
 * Updates a sprite to its next frame every number of ticks.
 * 
 * @param {Sprite} The sprite to modify.
 * @param {} The sprite information contained in the spritesheetMap.
 */
Sprite.prototype._updateAnimation = function(totalFrames)
{
    // Update our ticks if it hasn't been reached yet.
    if(this.mCurrentTick < this.mTicksPerFrame)
    {
        this.mCurrentTick++;
    }
    else // Update our frame and reset tick if total ticks has been reached.
    {
        this.mCurrentTick = 0;

        // Go to the next frame if not at end of spritesheet, then loop back.
        if(this.mCurrentFrame < totalFrames - 1)
        {
            this.mCurrentFrame++;
        }
        else
        {
            this.mCurrentFrame = 0;
        }
    }
};
        