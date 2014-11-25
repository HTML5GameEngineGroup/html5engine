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

Renderable2DObject.prototype._activateAndGetShader = function()
{
    var shaderWrapper = EngineCore.Resources.getShader(this.mShader);
    shaderWrapper.setActive();
    return shaderWrapper.getProgram();
};

Renderable2DObject.prototype._setupVertexAttrib = function(gl, shaderProgram, vertexBuffer)
{
    // Get references to the attributes within the shaders.
    var vertexPositionAttribute = gl.getAttribLocation(shaderProgram,
        "aVertexPosition");     

    // Connect the vertexAndTextureCoordBuffer to the ARRAY_BUFFER global gl binding point.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);


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

};

Renderable2DObject.prototype._setupTextureCoordAttrib = function(gl, shaderProgram, textureBuffer)
{
    // Retrieve the texture coordinate attribute memory location to pass in.
    var textureCoordsAttribute = gl.getAttribLocation(shaderProgram,
        "aTextureCoordinate");

    // Bind the textureBuffer to modify it.    
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    // Update our buffer.
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(EngineCore.Resources.DEFAULT_TEXTURE_COORD));
    // Point gl to our data.
    gl.vertexAttribPointer(textureCoordsAttribute, 2, gl.FLOAT, false,
        0, 0); 
    gl.enableVertexAttribArray(textureCoordsAttribute);
};

Renderable2DObject.prototype._setupGLTexture = function(gl, shaderProgram)
{
    // Now give the shader program the texture data.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, EngineCore.Resources.getGLTexture(this.mTextureString));
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
};

Renderable2DObject.prototype._setupMVPMatrix = function(gl, shaderProgram)
{
    // Finally, set up the Model-View-Perspective matrix
    var vpMatrix = EngineCore.Resources.getActiveCamera().getViewPerspectiveMatrix();
    var mvpMatrix = mat4.create();

    mat4.multiply(mvpMatrix, vpMatrix, this.mTransformMatrix.getMatrix());

    var uniformMVP = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
    gl.uniformMatrix4fv(uniformMVP, false, mvpMatrix);
};

Renderable2DObject.prototype.draw = function(gl, vertexBuffer, textureBuffer)
{
    var shaderProgram = this._activateAndGetShader();

    this._setupVertexAttrib(gl, shaderProgram, vertexBuffer);

    this._setupTextureCoordAttrib(gl, shaderProgram, textureBuffer);

    this._setupGLTexture(gl, shaderProgram);

    this._setupMVPMatrix(gl, shaderProgram);

    // Draw triangles, with a max of this.numberOfVerticies verticies, from the zeroth element.
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, EngineCore.Resources.DEFAULT_NUM_VERTICES);
};
