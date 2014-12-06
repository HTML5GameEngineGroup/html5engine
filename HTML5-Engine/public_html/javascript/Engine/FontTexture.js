/* 
 * 
 */
function FontTexture(transform, shaderName, fontTexture, fontInfo, text)
{   
    Renderable2DObject.call(this, transform, shaderName, fontTexture);
    this._mFontInfo = fontInfo;
    this.mText = text;
    
}
FontTexture.prototype = Object.create(Renderable2DObject.prototype);

FontTexture.prototype.draw = function(gl, vertexBuffer, textureCoordBuffer)
{
    var shaderProgram = this._activateAndGetShader();

    this._setupVertexAttrib(gl, shaderProgram, vertexBuffer);

    this._setupGLTexture(gl, shaderProgram);
    
    this._drawText(gl, shaderProgram, textureCoordBuffer);
};

FontTexture.prototype._getCharInfo = function(fontInfoXML, charCode)
{
    // Get the information for the specific character, via xpath quering language.
    var path = "font/chars/char[@id=" + charCode + "]";

    var nodes = fontInfoXML.evaluate(path, fontInfoXML, null, XPathResult.ANY_TYPE, null);
    return nodes.iterateNext();
};

FontTexture.prototype._drawText = function(gl, shaderProgram, textureCoordBuffer)
{
    var fontInfoXML = EngineCore.Resources.getFontInfo(this._mFontInfo);
    
    // How much to offset each letter to draw the string.
    var xAdvance = 0;
    var stringSize = this.mTransformMatrix.getScale();
    
    for(var charIndex = 0; charIndex < this.mText.length; charIndex++)
    {   
        var charInfo = this._getCharInfo(fontInfoXML, this.mText.charCodeAt(charIndex));

        // If the char does not exist, dont draw.
        if(charInfo !== null)
        {
            // Setup texture coordinates
            var texWidth = EngineCore.Resources.getGLTexture(this.mTextureString).width;
            var texHeight = EngineCore.Resources.getGLTexture(this.mTextureString).height;

            // Set the texture coordinates as a percentage of texture.
            var x1 = charInfo.getAttribute("x") / texWidth;
            var y1 = charInfo.getAttribute("y") / texHeight;
            var spriteWidth = charInfo.getAttribute("width") / texWidth;
            var spriteHeight = charInfo.getAttribute("height") / texHeight;
            var x2 = x1 + spriteWidth;
            var y2 = y1 + spriteHeight;

            var textureCoordinates = [x1,  1 - y2,
                                      x2,  1 - y2,
                                      x1,  1 - y1,
                                      x2,  1 - y1];   


            // Retrieve the texture coordinate attribute memory location to pass in.
            var textureCoordsAttribute = gl.getAttribLocation(shaderProgram,
                "aTextureCoordinate");

            // Bind the textureBuffer to modify it.    
            gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
            // Update our buffer.
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(textureCoordinates));
            // Point gl to our data.
            gl.vertexAttribPointer(textureCoordsAttribute, 2, gl.FLOAT, false,
                0, 0); 
            gl.enableVertexAttribArray(textureCoordsAttribute);

            // Finally, set up the Model-View-Perspective matrix
            var vpMatrix = EngineCore.Resources.getActiveCamera().getViewPerspectiveMatrix();
            var mvpMatrix = mat4.create();

            // Offset for each letter.
            var offsetVector = vec3.create();
            var xOffset = charInfo.getAttribute("xoffset") / texWidth;
            
            // SpriteHeight must be added to offset to get the position as it will be in
            // world space, since the y-origin in the xml is on the top-left, while in our 
            // world it is on the bottom left.
            var yOffset = -(spriteHeight + (charInfo.getAttribute("yoffset") / texHeight)) ;
            
            vec3.set(offsetVector, xAdvance + xOffset , yOffset, 0);   

            // Resize for each letter.
            var scalingVector = vec3.create();
            vec3.set(scalingVector, spriteWidth, spriteHeight, 1);

            
            var transformMatrix = mat4.create();
            mat4.translate(transformMatrix, this.mTransformMatrix.getMatrix(), offsetVector);
            mat4.scale(transformMatrix, transformMatrix, scalingVector);
            
            
            
            mat4.multiply(mvpMatrix, vpMatrix, transformMatrix);

            var uniformMVP = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
            gl.uniformMatrix4fv(uniformMVP, false, mvpMatrix);

            // Draw triangles, with a max of this.numberOfVerticies verticies, from the zeroth element.
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, EngineCore.Resources.DEFAULT_NUM_VERTICES);
            
            var pxAdv = charInfo.getAttribute("xadvance"); 
            
            var bufXAdv;

            bufXAdv = pxAdv / texWidth;

            xAdvance +=  bufXAdv;
        }
    } 
};