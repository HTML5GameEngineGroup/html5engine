/* ShaderProgram contains and loads shaders. These shaders are compiled and
 * linked for a webgl context.
 */
function ShaderProgram(webglContext, vertexSourcePath, fragmentSourcePath)
{
    // The program that can be loaded into WebGL.
    var webGLProgram;
    this.getProgram = function() { return webGLProgram; };

    // Whether or not the program is ready and error free.
    var SucessState = false;
    this.isReady = function() { return SucessState; };

    // The gl context is needed for compiling and such.
    var gl = webglContext;
    this.getGL = function() { return gl; };

    var vertexShader = this.getShader(vertexSourcePath, this.ShaderType.VERTEX);
    var fragmentShader = this.getShader(fragmentSourcePath, this.ShaderType.FRAGMENT);

    if (vertexShader !== null && fragmentShader !== null)
    {
        // Create and link the program.
        webGLProgram = gl.createProgram();
        gl.attachShader(webGLProgram, vertexShader);
        gl.attachShader(webGLProgram, fragmentShader);
        gl.linkProgram(webGLProgram);

        // Show error if failed.
        if (!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS))
        {
            alert("Error linking shader");
        }
        else
        {
            // Delete the shaders when you are done with them. The program already has a copy.
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);

            // Ready to use.
            SucessState = true;
        }
    }
};

/*
 * The only two types of shaders for webgl are currently
 * vertex and fragment shaders.
 */
ShaderProgram.prototype.ShaderType =
{
    VERTEX: 0,
    FRAGMENT: 1
};

// Loads the program into the webgl context if 
// the shader loading was successful.
ShaderProgram.prototype.setActive = function() 
{
    this.getGL().useProgram(this.getProgram());
};

// Returns a complied shader from shader file.
// Returns null on on failure.
ShaderProgram.prototype.getShader = function (filepath, shaderType)
{
    var xmlReq, shaderSource, compiledShader = null;

    // Request the text from given file location.
    xmlReq = new XMLHttpRequest();
    xmlReq.open('GET', filepath, false);
    xmlReq.send();
    shaderSource = xmlReq.responseText;

    if (shaderSource === null)
        return null;

    // Create the shader based on the source type.
    if (shaderType === this.ShaderType.FRAGMENT) {
        compiledShader = this.getGL().createShader(this.getGL().FRAGMENT_SHADER);
    }
    else if (shaderType === this.ShaderType.VERTEX) {
        compiledShader = this.getGL().createShader(this.getGL().VERTEX_SHADER);
    }
    else
    {
        return null;
    }

    // Give the source to the shader to be compiled.
    this.getGL().shaderSource(compiledShader, shaderSource);

    // Complie shader program
    this.getGL().compileShader(compiledShader);

    // Check if successful, if not display log and return null.
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!this.getGL().getShaderParameter(compiledShader, this.getGL().COMPILE_STATUS)) {
        alert("A shader compliling error occurred: " + this.getGL().getShaderInfoLog(compiledShader));
        return null;
    };

    return compiledShader;
};