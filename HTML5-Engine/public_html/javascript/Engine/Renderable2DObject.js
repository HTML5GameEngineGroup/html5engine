"use strict";

function Renderable2DObject(transform, shaderName, textureName, normalMap)
{
    this.mShaderOn = false;
    this.mShader = shaderName;
    this.mTextureString = textureName;
    this.mTextureID = null;
    this.mNormalMapString = normalMap;
    this.mTransformMatrix = transform;
    this._mLightList = [];
    this._mAmbientStrength = 0.1;
    this._mAmbientColor = vec4.fromValues(1, 1, 0, 1);
    this._mDiffuseStrength  = 1.0;
    this._mDiffuseColor = vec4.fromValues(0, 1, 0, 1);
    this._mShadowColor = vec4.fromValues(0, 0, 0, 0.5);
    this._mShadowOffset = vec3.fromValues(0, 0, 0);
}

Renderable2DObject.prototype.SwitchShader = function (shader, shaderState) {
    this.mShader = shader;
    this.mShaderOn = shaderState;
};

Renderable2DObject.prototype.getShaderName = function () {
    return this.mShader;
};

Renderable2DObject.prototype.getTextureName = function () {
    return this.mTextureString;
};

Renderable2DObject.prototype.getNormalMapName = function () {
    return this.mNormalMapString;
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
    var texID = this.mTextureID;
    if(texID === null)
        texID = EngineCore.Resources.getGLTexture(this.mTextureString);
        
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texID);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
};

Renderable2DObject.prototype._setupGLNormalMap = function (gl, shaderProgram)
{
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, EngineCore.Resources.getGLTexture(this.mNormalMapString));
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uNormalSampler"), 1);
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
    var renderableMatrix = this.mTransformMatrix.getMatrix();
    mat4.translate(renderableMatrix, renderableMatrix, vec3.fromValues(this._mShadowOffset[0], this._mShadowOffset[1], 0));
    
    var vMatrix = EngineCore.Resources.getActiveCamera().getViewMatrix();
    var mvMatrix = mat4.create();

    mat4.multiply(mvMatrix, vMatrix, renderableMatrix);

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

Renderable2DObject.prototype._UpdateTextureProperties = function (gl, shaderProgram)
{
    try {
        var uTexturePos;
        var uTextureDimesions;
        var ambientStrength;
        var ambientColor;
        var diffuseStrength;
        var diffuseColor;
        
        //get pointers to data in shader 
        uTexturePos = gl.getUniformLocation(shaderProgram, "uObjPosition");
        uTextureDimesions = gl.getUniformLocation(shaderProgram, "uObjDimensions");
        ambientStrength = gl.getUniformLocation(shaderProgram, "uAmbientStrength");
        ambientColor = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        diffuseStrength = gl.getUniformLocation(shaderProgram, "uDiffuseStrength");
        diffuseColor = gl.getUniformLocation(shaderProgram, "uDiffuseColor");

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
        gl.uniform1f(ambientStrength, this._mAmbientStrength);
        gl.uniform4fv(ambientColor, this._mAmbientColor);
        gl.uniform1f(diffuseStrength, this._mDiffuseStrength);
        gl.uniform4fv(diffuseColor, this._mDiffuseColor);
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
                uLight[i].Position = gl.getUniformLocation(shaderProgram, "lights[" + i + "].uPosition");
                uLight[i].Color = gl.getUniformLocation(shaderProgram, "lights[" + i + "].uColor");
                uLight[i].Inner = gl.getUniformLocation(shaderProgram, "lights[" + i + "].uInner");
                uLight[i].Outer = gl.getUniformLocation(shaderProgram, "lights[" + i + "].uOuter");
                uLight[i].Intensity = gl.getUniformLocation(shaderProgram, "lights[" + i + "].uIntensity");
            }

            for (var i = 0; i < this._mLightList.length; i++)
            {
                var wcPos = vec2.fromValues(this._mLightList[i].mPosition[0], this._mLightList[i].mPosition[1]);
                var camera = EngineCore.Resources.getActiveCamera();
                var pixPos = camera.computePixelPosition(wcPos);
                var z = camera.computeFakePixelPositionZ(this._mLightList[i].mPosition[2]);
                gl.uniform4fv(uLight[i].Position, vec4.fromValues(pixPos[0], pixPos[1], z, 0));
                gl.uniform4fv(uLight[i].Color, this._mLightList[i].mColor);
                var inner = this._mLightList[i].getInnerRadiusSize();
                var outer = this._mLightList[i].getOuterRadiusSize();
                var intensity = this._mLightList[i].getIntensity();
                gl.uniform1f(uLight[i].Inner, inner);
                gl.uniform1f(uLight[i].Outer, outer);
                gl.uniform1f(uLight[i].Intensity, intensity);
            }
        }
    }
    catch (E)
    {
        console.log("ERROR: Light properties failed to update");
    }
    ;
};

Renderable2DObject.prototype._UpdateCameraProp = function (gl, shaderProgram)
{
    //active camera
    var camera = EngineCore.Resources.getActiveCamera();
    
    //get position of the camera and convert to pixel space
    var pos = camera.getCameraPosition();
    var newPos = camera.computePixelPosition(pos);
    
    //estimate the z position and convert to pixel space
    var z = camera.getCameraZ() + camera.getCameraWidth();
    var newZ = camera.computeFakePixelPositionZ(z);
    
    //create vec3
    var finalPos3 = vec3.fromValues(newPos[0], newPos[1], newZ);
    
    //get the ref from the shader and load the values
    var uCameraPos = gl.getUniformLocation(shaderProgram, "uCameraPosition");
    gl.uniform3fv(uCameraPos, finalPos3);
    
};

Renderable2DObject.prototype._setupShadowTexture = function (gl, shaderProgram)
{
//    gl.activeTexture(gl.TEXTURE1);
//    gl.bindTexture(gl.TEXTURE_2D, EngineCore.Resources.GetFramebufferTexture());
//    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uShadowRecieverSampler"), 1);

};

Renderable2DObject.prototype._UpdateShadowRecieverProperties = function (gl, shaderProgram)
{ 
  
//    var reciever = vec2.fromValues(2048, 2048);
//    var view = vec2.fromValues(gl.viewportWidth, gl.viewportHeight);
//    
//    //get the ref from the shader and load the values
//    var uRecieverDim = gl.getUniformLocation(shaderProgram, "uShadowRecieverDimensions");
//    gl.uniform3fv(uRecieverDim, reciever);
//    
//    var uViewDim = gl.getUniformLocation(shaderProgram, "uViewportDimensions");
//    gl.uniform3fv(uViewDim, view);
};

Renderable2DObject.prototype._UpdateShadowColor = function (gl, shaderProgram)
{ 
        var color = gl.getUniformLocation(shaderProgram, "uColor");
        gl.uniform4fv(color, this._mShadowColor);
};

//Basicly draws with the modifed shadow position
Renderable2DObject.prototype._UpdateShadowAtPosition = function (gl, vertexBuffer, textureBuffer)
{ 
  
    var shaderProgram = this._activateAndGetShader();

    this._setupVertexAttrib(gl, shaderProgram, vertexBuffer);

    this._setupTextureCoordAttrib(gl, shaderProgram, textureBuffer);

    this._setupGLTexture(gl, shaderProgram);
    //this._setupShadowTexture(gl, shaderProgram);
    
    this._setupMVMatrix(gl, shaderProgram, this._mShadowOffset);
    this._setupPMatrix(gl, shaderProgram);
    
    this._UpdateShadowColor(gl, shaderProgram);
    
    
    
    // Draw triangles, with a max of this.numberOfVerticies verticies, from the zeroth element.
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, EngineCore.Resources.DEFAULT_NUM_VERTICES);
    
};

// Loops through all lights and draws shadows for them all
// warning very expensive should ignore lights at a distance
Renderable2DObject.prototype.DrawShadow = function (gl, vertexBuffer, textureBuffer)
{
    for(var i = 0; i < this._mLightList.length; i++ )
    {
        //should have an if statement to check if it is a directional light or 
        //a point light and respond accordingly, for now assuming a point light
        //and calculating position
        var vecToLight = vec3.create();
        vec3.subtract(vecToLight, vec3.fromValues(this.mTransformMatrix.getX(),this.mTransformMatrix.getY(), 0),   this._mLightList[i].mPosition);
        var length = vec3.length(vecToLight);
        var norm = vec3.create();
        if(length > 0)
            vec3.normalize(norm, vecToLight);
        else 
            norm = vec3.fromValues(0,0,0);
        
        //var shadowOffset = vec3.create();
        vec3.scale(this._mShadowOffset, norm, 0.2); //this should NOT be 0.2 but the distance from the renderable to the shadow reciever layer 
        this._UpdateShadowAtPosition(gl, vertexBuffer, textureBuffer);
        
    }
};

// draws with light properties
Renderable2DObject.prototype.draw = function (gl, vertexBuffer, textureBuffer)
{
    this._mShadowOffset = vec3.fromValues(0, 0, 0);
    var shaderProgram = this._activateAndGetShader();

    this._setupVertexAttrib(gl, shaderProgram, vertexBuffer);

    this._setupTextureCoordAttrib(gl, shaderProgram, textureBuffer);

    this._setupGLTexture(gl, shaderProgram);
    this._setupGLNormalMap(gl, shaderProgram);
    
    this._setupMVMatrix(gl, shaderProgram);
    this._setupPMatrix(gl, shaderProgram);
    
    this._UpdateLightProperties(gl, shaderProgram);
    this._UpdateTextureProperties(gl, shaderProgram);

    this._UpdateCameraProp(gl, shaderProgram);
    
    // Draw triangles, with a max of this.numberOfVerticies verticies, from the zeroth element.
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, EngineCore.Resources.DEFAULT_NUM_VERTICES);
};




