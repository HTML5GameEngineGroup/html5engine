function LinePrimative(transform, x1,y1,x2,y2)
{
    this.mLineColor = vec4.fromValues(1.0,1.0,1.0,1.0);
    this.mPointColor = vec4.fromValues(1.0,0.0,0.0,1.0);
    this.mLineWidth = 1.0; // Only supported Width!!!!!!!!!
    this.mPointSize = 20.0;
    this.mTransformMatrix = transform;
    
    this._mLineShader = "line-vs-line-fs";
    this._mVertexBuffer = null; // Horrible, ---------------------------------------------------
    this._mPointsArray = [x1,y1,x2,y2];
}

LinePrimative.prototype.getTransform = function()
{
    return this.mTransformMatrix;
};

// Adds shader to the engine. This must be run every scene, as it resets between scene.
LinePrimative.prototype.preloadShader = function()
{
    EngineCore.Resources.addShader(this._mLineShader, "shaders/line-vs.glsl",
                                    "shaders/line-fs.glsl");
};

LinePrimative.prototype.addToDrawSet = function()
{
    EngineCore.Resources.addToDrawSet(this);
};

LinePrimative.prototype._activateAndGetShader = function()
{
    var shaderWrapper = EngineCore.Resources.getShader(this.mLineShader);
    shaderWrapper.setActive();
    return shaderWrapper.getProgram();
};

LinePrimative.prototype._setupVertexAttrib = function(gl, shaderProgram)
{
    // Get references to the attributes within the shaders.
    var vertexPositionAttribute = gl.getAttribLocation(shaderProgram,
        "aVertexPosition");
    
    // Creates or updates the vertex buffer

    if(this._mVertexBuffer === null) // Why this is horrible--------------------------------------
    {
       this._mVertexBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, this._mVertexBuffer);
       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._mPointsArray), 
            gl.DYNAMIC_DRAW); 
    }
    else
    {
        // Connect the vertexAndTextureCoordBuffer to the ARRAY_BUFFER global gl binding point.
        gl.bindBuffer(gl.ARRAY_BUFFER, this._mVertexBuffer);

        // Put the points into a vertex buffer    
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this._mPointsArray));
    }
    


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
    gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false,
        0, 0);


    // Tell OpenGL that we want to use an array for that attribute input.
    gl.enableVertexAttribArray(vertexPositionAttribute);

};

LinePrimative.prototype._setupMVPMatrix = function(gl, shaderProgram)
{
    // Finally, set up the Model-View-Perspective matrix
    var vpMatrix = EngineCore.Resources.getActiveCamera().getViewPerspectiveMatrix();
    var mvpMatrix = mat4.create();

    mat4.multiply(mvpMatrix, vpMatrix, this.mTransformMatrix.getMatrix());

    var uniformMVP = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
    gl.uniformMatrix4fv(uniformMVP, false, mvpMatrix);
};

LinePrimative.prototype.draw = function(gl, vertexBuffer, textureBuffer)
{
    var shaderProgram = this._activateAndGetShader();

    this._setupVertexAttrib(gl, shaderProgram);

    this._setupMVPMatrix(gl, shaderProgram);
    
    // Set Size parameters
    gl.lineWidth(this.mLineWidth);
    var uniformPointSize = gl.getUniformLocation(shaderProgram, "uPointSize");
    gl.uniform1f(uniformPointSize, this.mPointSize);
    
    
    //gl.pointSize(this.mPointSize);

    // Get the uniform to switch between colors
    var uniformColor = gl.getUniformLocation(shaderProgram, "uColor");
    
    
    gl.uniform4fv(uniformColor, this.mLineColor);
    // Draw triangles, with a max of 2, from the zeroth element.
    gl.drawArrays(gl.LINES, 0, 2);
    gl.drawArrays(gl.POINTS, 0, 2);
};
