function Renderable2DObject(transform, shaderName, textureName)
{
    this.mShader = shaderName;
    this.mTextureString = textureName;    
    this.mTransformMatrix = transform;
}

Renderable2DObject.prototype.getShaderName = function() {return this.mShader;};
        
Renderable2DObject.prototype.getTextureName = function() {return this.mTextureString;};

Renderable2DObject.prototype.getTransform = function() {return this.mTransformMatrix;};

Renderable2DObject.prototype.addToDrawSet = function()
{
    EngineCore.Resources.addToDrawSet(this);
};

Renderable2DObject.prototype.DEFAULT_NUM_VERTICES = 4;

Renderable2DObject.prototype.draw = function(gl, vertexBuffer, textureBuffer)
{
    // Setup webgl for the current shader.
    var shaderWrapper = EngineCore.Resources.getShader(this.mShader);
    shaderWrapper.setActive();
    var shaderProgram = shaderWrapper.getProgram();

    // Connect the vertexAndTextureCoordBuffer to the ARRAY_BUFFER global gl binding point.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Get references to the attributes within the shaders.
    var vertexPositionAttribute = gl.getAttribLocation(shaderProgram,
        "aVertexPosition");     


    // Takes the data from the buffer into the shader.
    // Parameters:
    //  1: Reference to the attribute loading the data to.
    //  2: The number of components to each vertex attribute.
    //  3: The data type of each component.
    //  4: Whether to normalize or not, in the vector math sense.
    //  5: Stride, for interweaved data in a buffer. How much of the buffer will
    //      be skipped per query of an attribute. In bytes.
    //  6: Called a pointer to first component of the first attribute, but is
    //      an offset in the buffer.
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false,
        0, 0);


    // Tell OpenGL that we want to use an array for that attribute input.
    gl.enableVertexAttribArray(vertexPositionAttribute);

    // Setup texture coordinates and update depending on if it is a sprite or not.
    var textureCoordinates = [];
    if(this instanceof Sprite)
    {
        textureCoordinates = this.setupSpriteDrawing(this);
    }
    else
    {
        textureCoordinates = EngineCore.Resources.DEFAULT_TEXTURE_COORD;
    }

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

    // Now give the shader program the texture data.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, EngineCore.Resources.getGLTexture(this.mTextureString));
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

    // Finally, set up the Model-View-Perspective matrix
    var vpMatrix = EngineCore.Resources.getActiveCamera().getViewPerspectiveMatrix();
    var mvpMatrix = mat4.create();

    mat4.multiply(mvpMatrix, vpMatrix, this.mTransformMatrix.getMatrix());

    var uniformMVP = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
    gl.uniformMatrix4fv(uniformMVP, false, mvpMatrix);

    // Draw triangles, with a max of this.numberOfVerticies verticies, from the zeroth element.
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.DEFAULT_NUM_VERTICES);
};

Renderable2DObject.prototype.setupSpriteDrawing = function(currentObj)
{
    // Get the information for whole spritesheet.
    var spriteInfo = EngineCore.Resources.getSpriteInfo(this.mSpritesheetInfo);

    // Get information for current frame.
    var currentFrame = currentObj.getCurrentFrame();

    // Check if frame not already out of range, if so reset to zero.
    if(currentFrame >= spriteInfo.length)
    {
        currentFrame = 0;
        currentObj.setCurrentFrame(0);
    }

    // Parse xml to retrieve an array of all frame infomration, then choose the
    // curent one.
    var frameInfo = spriteInfo.getElementsByTagName("SubTexture")[currentFrame];

    
    var texWidth = EngineCore.Resources.getGLTexture(currentObj.getTextureName()).width;
    var texHeight = EngineCore.Resources.getGLTexture(currentObj.getTextureName()).height;

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

    // Lastly, update it's sprite information.
    this.updateAnimation(currentObj, spriteInfo);

    return textureCoordinates;
};

/*
 * Updates a sprite to its next frame every number of ticks.
 * 
 * @param {Sprite} The sprite to modify.
 * @param {} The sprite information contained in the spritesheetMap.
 */
Renderable2DObject.prototype.updateAnimation = function(sprite, spriteInfo)
{
    var totalTicks = sprite.getTicksPerFrame();
    var currentTick = sprite.getCurrentTick();

    // Update our ticks if it hasn't been reached yet.
    if(currentTick < totalTicks)
    {
        sprite.setCurrentTick(currentTick + 1);
    }
    else // Update our frame and reset tick if total ticks has been reached.
    {
        sprite.setCurrentTick(0);

        var currentFrame = sprite.getCurrentFrame();
        var totalFrames = spriteInfo.totalSpriteFrames;

        // Go to the next frame if not at end of spritesheet, then loop back.
        if(currentFrame < totalFrames - 1)
        {
            sprite.setCurrentFrame(currentFrame + 1);
        }
        else
        {
            sprite.setCurrentFrame(0);
        }
    }
};
