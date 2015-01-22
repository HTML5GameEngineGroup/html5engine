/*
 * Line strip makes a series of line segments.
 * 
 * Has line strip mode, and polygon mode.
 * 
 * Note:
 *   - Unlike the other renderables, this has a possibly different vertexbuffer.
 * 
 *   - The vertexbuffer is initialized on a null check. This is horrible, but
 *     left in because the book version of the game engine has a getGL() function
 *     that should be used to initialize it in constructor.
 *     
 *   - The points array passed in must be of even length!
 *   
 *   - The LineStrip only works because RenderableObject and all derived classes
 *     reset the vertex buffer. EngineCore
 *     
 *   - There should be a abstract Renderable Class that RenderableObject and 
 *     LineStrip derive from. However, since there isn't, this is doesn't have
 *     parent class.
 */
function LineStrip(transform, isPolygon, pointsArray)
{
    this.mLineColor = vec4.fromValues(1.0,1.0,1.0,1.0);
    this.mPointColor = vec4.fromValues(1.0,0.0,0.0,1.0);
    this.mLineWidth = 1.0; // Only supported Width!!!!!!!!!
    this.mPointSize = 5.0;
    this.mTransformMatrix = transform;
    
    this._mLineShader = "line-vs-line-fs";
    this._mVertexBuffer = null; // Horrible, ---------------------------------------------------
    this._mLineModePolygon = false;
    
    this.setIsPolygon(isPolygon);
    this.setPointsArray(pointsArray);
}

LineStrip.prototype.getTransform = function()
{
    return this.mTransformMatrix;
};

LineStrip.prototype.setIsPolygon = function(isPolygon)
{
    this._mLineModePolygon = isPolygon;
};

LineStrip.prototype.setPointsArray = function(points)
{
    this._mPointsArray = points;
    this._mNumberOfPoints = points.length / 2;
};

// Adds shader to the engine. This must be run every scene, as it resets between scene.
LineStrip.prototype.preloadShader = function()
{
    EngineCore.Resources.addShader(this._mLineShader, "shaders/line-vs.glsl",
                                    "shaders/line-fs.glsl");
};

LineStrip.prototype.addToDrawSet = function()
{
    EngineCore.Resources.addToDrawSet(this);
};

LineStrip.prototype._activateAndGetShader = function()
{
    var shaderWrapper = EngineCore.Resources.getShader(this.mLineShader);
    shaderWrapper.setActive();
    return shaderWrapper.getProgram();
};

LineStrip.prototype._setupVertexAttrib = function(gl, shaderProgram)
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
    else // In case points array ever gets updated.
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

LineStrip.prototype._setupMVPMatrix = function(gl, shaderProgram)
{
    // Finally, set up the Model-View-Perspective matrix
    var vpMatrix = EngineCore.Resources.getActiveCamera().getViewPerspectiveMatrix();
    var mvpMatrix = mat4.create();

    mat4.multiply(mvpMatrix, vpMatrix, this.mTransformMatrix.getMatrix());

    var uniformMVP = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
    gl.uniformMatrix4fv(uniformMVP, false, mvpMatrix);
};

LineStrip.prototype.draw = function(gl, vertexBuffer, textureBuffer)
{
    var shaderProgram = this._activateAndGetShader();

    this._setupVertexAttrib(gl, shaderProgram);

    this._setupMVPMatrix(gl, shaderProgram);
    
    // Set Size parameters
    gl.lineWidth(this.mLineWidth);
    var uniformPointSize = gl.getUniformLocation(shaderProgram, "uPointSize");
    gl.uniform1f(uniformPointSize, this.mPointSize);
    
    // Get the uniform to switch between colors
    var uniformColor = gl.getUniformLocation(shaderProgram, "uColor");   
    
    // Draw points and lines with differnt colors
    gl.uniform4fv(uniformColor, this.mLineColor);
    if(this._mLineModePolygon)
    {
        gl.drawArrays(gl.LINE_LOOP, 0, this._mNumberOfPoints);
    }
    else
    {
        gl.drawArrays(gl.LINE_STRIP, 0, this._mNumberOfPoints);
    }
    gl.uniform4fv(uniformColor, this.mPointColor);
    gl.drawArrays(gl.POINTS, 0, this._mNumberOfPoints);
};
