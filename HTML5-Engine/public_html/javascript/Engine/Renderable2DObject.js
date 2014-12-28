function Renderable2DObject(transform, shaderName, textureName)
{
    this.mShader = shaderName;
    this.mTextureString = textureName;
    this.mTransformMatrix = transform;
    this._mLightList = [];
}

Renderable2DObject.prototype.getShaderName = function () {
    return this.mShader;
};

Renderable2DObject.prototype.getTextureName = function () {
    return this.mTextureString;
};

Renderable2DObject.prototype.getTransform = function () {
    return this.mTransformMatrix;
};

Renderable2DObject.prototype.addLight = function (light) {
    this._mLightList.push(light);
};

Renderable2DObject.prototype.removeLight = function (light) {
    for (var i = 0; i < this._mLightList; i++)
    {
        if (this._mLightList[i] === light)
        {
            this._mLightList.splice(i, 1);
            return;
        }
    }
};

Renderable2DObject.prototype.addToDrawSet = function ()
{
    EngineCore.Resources.addToDrawSet(this);
};

Renderable2DObject.prototype._activateAndGetShader = function ()
{
    var shaderWrapper = EngineCore.Resources.getShader(this.mShader);
    shaderWrapper.setActive();
    return shaderWrapper.getProgram();
};

Renderable2DObject.prototype._setupVertexAttrib = function (gl, shaderProgram, vertexBuffer)
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

Renderable2DObject.prototype._setupTextureCoordAttrib = function (gl, shaderProgram, textureBuffer)
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

Renderable2DObject.prototype._setupGLTexture = function (gl, shaderProgram)
{
    // Now give the shader program the texture data.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, EngineCore.Resources.getGLTexture(this.mTextureString));
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
};

Renderable2DObject.prototype._setupMVPMatrix = function (gl, shaderProgram)
{
    // Finally, set up the Model-View-Perspective matrix
    var vpMatrix = EngineCore.Resources.getActiveCamera().getViewPerspectiveMatrix();
    var mvpMatrix = mat4.create();

    mat4.multiply(mvpMatrix, vpMatrix, this.mTransformMatrix.getMatrix());

    var uniformMVP = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
    gl.uniformMatrix4fv(uniformMVP, false, mvpMatrix);
};

//added by jeb for model view matrix
Renderable2DObject.prototype._setupMVMatrix = function (gl, shaderProgram)
{
    var vMatrix = EngineCore.Resources.getActiveCamera().getViewMatrix();
    var mvMatrix = mat4.create();

    mat4.multiply(mvMatrix, vMatrix, this.mTransformMatrix.getMatrix());

    var uniformMV = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(uniformMV, false, mvMatrix);
};

//added by jeb for projection matrix
Renderable2DObject.prototype._setupPMatrix = function (gl, shaderProgram)
{
    var matrix = EngineCore.Resources.getActiveCamera().getOrthographicMatrix();
    var uniformP = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(uniformP, false, matrix);
};

//Renderable2DObject.prototype._setupPMatrix = function (gl, shaderProgram)
//{
//    var matrix = EngineCore.Resources.getActiveCamera().getOrthographicMatrix();
//    var uniformP = gl.getUniformLocation(shaderProgram, "uPMatrix");
//    gl.uniformMatrix4fv(uniformP, false, matrix);
//};

//Renderable2DObject.prototype._setupAttrib = function (gl, shaderProgram, data, stringName, glType, size)
//{
//    // Get references to the attributes within the shaders.
//    var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, stringName);
//    gl.bindBuffer(gl.ARRAY_BUFFER, data);
//    gl.vertexAttribPointer(vertexPositionAttribute, size, glType, false, 0, 0);
//    gl.enableVertexAttribArray(vertexPositionAttribute);
//
//};

Renderable2DObject.prototype._UpdateTextureProperties = function (gl, shaderProgram)
{
    try {
        var uTexturePos;
        var uTextureDimesions;
        
        //get pointers to data in shader 
        uTexturePos = gl.getUniformLocation(shaderProgram, "uObjPosition");
        uTextureDimesions = gl.getUniformLocation(shaderProgram, "uObjDimensions");

        //get the camera for tranforming between coord spaces
        var camera = EngineCore.Resources.getActiveCamera();
        //position wc to pixel coord
        var wcPos = this.mTransformMatrix.getCenterPosition();
        var pixPos = camera.computePixelPosition(wcPos);
        //size wc to pixel coord
        var wcSize = vec2.fromValues(this.mTransformMatrix.getWidth(), this.mTransformMatrix.getHeight());
        var pixSize = camera.computePixelSize(wcSize);

        // send values to the shader
        gl.uniform2fv(uTexturePos, pixPos);
        gl.uniform2fv(uTextureDimesions, pixSize);
    }
    catch (E)
    {
        console.log("ERROR: Texture properties failed to update");
    }
};

Renderable2DObject.prototype._UpdateLightProperties = function (gl, shaderProgram)
{
    try {

        if (this._mLightList.length > 0) {
            var uLight = [];
            for (var i = 0; i < this._mLightList.length; i++)
            {
                uLight[i] = {};
                uLight[i].Position = gl.getUniformLocation(shaderProgram, "lights[" + i + "].uLightPosition");
                uLight[i].Color = gl.getUniformLocation(shaderProgram, "lights[" + i + "].uLightColor");
            }

            for (var i = 0; i < this._mLightList.length; i++)
            {
                var wcPos = vec2.fromValues(this._mLightList[i].mPosition[0],
                        this._mLightList[i].mPosition[1]);
                var camera = EngineCore.Resources.getActiveCamera();
                var pixPos = camera.computePixelPosition(wcPos);
                
                gl.uniform4fv(uLight[i].Position, vec4.fromValues(pixPos[0], pixPos[1], 0, 0));
                gl.uniform4fv(uLight[i].Color, this._mLightList[i].mColor);
            }
        }
    }
    catch (E)
    {
        console.log("ERROR: Light properties failed to update");
    }
    ;
};

Renderable2DObject.prototype.draw = function (gl, vertexBuffer, textureBuffer)
{
    var shaderProgram = this._activateAndGetShader();

    this._setupVertexAttrib(gl, shaderProgram, vertexBuffer);

    this._setupTextureCoordAttrib(gl, shaderProgram, textureBuffer);

    this._setupGLTexture(gl, shaderProgram);

    //modified by jeb
    //this._setupMVPMatrix(gl, shaderProgram);
    this._setupMVMatrix(gl, shaderProgram);
    this._setupPMatrix(gl, shaderProgram);
    this._UpdateLightProperties(gl, shaderProgram);
    this._UpdateTextureProperties(gl, shaderProgram);

    // Draw triangles, with a max of this.numberOfVerticies verticies, from the zeroth element.
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, EngineCore.Resources.DEFAULT_NUM_VERTICES);
};

