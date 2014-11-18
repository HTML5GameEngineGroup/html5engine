/* 
 * The namespace of the engine containing key components.
 */
"use strict";

var EngineCore = EngineCore || { };

EngineCore.initializeEngine = function(htmlCanvasID, startScene)
{
    EngineCore.Resources.init(htmlCanvasID);
    EngineCore.Input.init();
    EngineCore.SceneManager.setCurrentScene(startScene);
};

/*
 * The Resources handles assets such as texture and shader files.
 */
EngineCore.Resources = function () {
    
    // A private class to contain a shader set in the shaderDrawSets.
    function ShaderSet(shaderName,shaderObj)
    {
        this.name = shaderName;
        this.getName = function(){return this.name;};
        
        this.shader = shaderObj;
        this.getShaderObj = function(){return this.shader;};
        
        this.drawSet = [];
        this.getDrawSet = function(){return this.drawSet;};
        this.addToDrawSet = function (renderable2DObject)
        {
            this.drawSet.push(renderable2DObject);
        };
        this.removeFromDrawSet = function(renderable2DObject)
        {
            var objIndex = this.drawSet.indexOf(renderable2DObject);
            if(objIndex > -1)
            {
                this.drawSet.splice(objIndex, 1);
            }
        };
    };

    // The graphical context to draw to.
    var gl = null;
    
    // The audio context to play sounds.
    var audioContext = null;
    
    // The canvas the gl context comes from.
    var canvas = null;
    
    // The camera with viewport that will be used for drawing.
    var activeCamera = null;
    
    // Matches strings to image objects in key-value pairs.
    var imgMap = {};
    
    // Matches strings to xml spritesheet information.
    var spritesheetMap = {};

    // Matches strings to audio objects in key-value pairs.
    var audioMap = {};
    
    // Holds the current background audio looping, if one is playing. Otherwise null.
    var backgroundAudioNode = null;

    // The sets of drawing sets sorted by z-order.
    var zDrawSets = [];
    
    // A map of shader objects that who's name is they key.
    var shaderMap = {};

    // The number of assets currently needed to load.
    var assetsToBeLoaded = 0;

    // A callback function which will be called when there are no assets to load
    var onAllAssetsLoad = null;

    // The default vertex and texture data. Mapped as a plane with a texture on it.
    var vertexData =
    [
         0.0,  0.0,  0.0,     
         1.0,  0.0,  0.0,     
         0.0,  1.0,  0.0,     
         1.0,  1.0,  0.0     
    ];
    
    var defaultTextureCoordData =
    [
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        1.0,  1.0
    ];
    
    // The number of verticies each piece of geometry will have. Closely tied
    // with vertexAndTextureCoordData.
    var numberOfVertices = 4;
    
    // Contains the vertex and texture coordinates for webgl.
    var vertexBuffer = {};
    
    var textureBuffer = {};

    /*
     * Initializes the asset pipeline with WebGL given an html canvas id.
     * @param {string} htmlCanvasID
     */
    var init = function (htmlCanvasID)
    {
        if (gl === null)
        {
            initGL(htmlCanvasID);
            initGLBuffers();
            initAudioContext();
        }
    };
    
    /*
     * Initializes the Webgl context given an HTML canvas.
     * @param {string} canvasID
     */
    var initGL = function(canvasID)
    {
        // Get the canvas from the DOM.
        canvas = document.getElementById(canvasID);
        
        // Get standard webgl, or experimental if failed. Wrapped in debugging tool.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        
        //gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl") ||
        //    canvas.getContext("experimental-webgl"));
        
        // Allows transperency with textures.
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable ( gl.BLEND ) ;
        
        // Set images to have a fliped y axis to match the texture coordinate space.
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        
        // Sets the color to clear the screen with.
        gl.clearColor(0.0, 0.0, 1.0, 1.0);

        // Enable depth buffer untilites.
        //gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);   
        gl.depthMask(false);
    };
    
    /*
     * Initializes the audio context to play sounds.
     */
    var initAudioContext = function()
    {
        try
        {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
        }
        catch(e) {alert("Web Audio Is not supported.");};
    };
    
    var initGLBuffers = function()
    {
        // Create the buffer to store the vertex data for webgl.
        vertexBuffer = gl.createBuffer();

        // Connect the buffer to the ARRAY_BUFFER global gl binding point.
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // Put the vertices into the buffer, as non-changing drawing data (STATIC_DRAW)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), 
            gl.STATIC_DRAW);
            
        // Remove the buffer from the binding point now that we are done manipulating it.
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        // Do same for texture buffer
        textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        
        // Make sure our drawing data is DYNAMIC, because we will update frequently.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(defaultTextureCoordData),
            gl.DYNAMIC_DRAW);
            
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
    };


    var addShaderToZList = function(shaderName, zIndex)
    {
        var shadObj = shaderMap[shaderName];
        var shadSet = new ShaderSet(shaderName, shadObj);
        
        zDrawSets[zIndex].push(shadSet);
    };
    
    var addShader = function(shaderName, vertexFilepath, fragmentFilepath)
    {
        var shadObj = new ShaderProgram(gl, vertexFilepath, fragmentFilepath);
        shadObj.name = shaderName;    
        
        shaderMap[shaderName] = shadObj;
    };
    
    var setActiveCamera = function(camera)
    {
        activeCamera = camera;
        gl.viewport(activeCamera.getViewportX(),
                    activeCamera.getViewportY(),
                    activeCamera.getViewportWidth(),
                    activeCamera.getViewportHeight());
    };

    /*
     * This converts images in the imgMap from the HTML/Javascript format to the
     * webgl format. This should only be called once the image is loaded.
     */
    var convertImageToGLFormat = function(imageName)
    {
        // First keep relevent informations to later store in the new format (magic of javascript)
        var width = imgMap[imageName].naturalWidth;
        var height = imgMap[imageName].naturalHeight;
        
        // Generate a unique ID for the texture.
        var textureID = gl.createTexture();
        
        // Plug the texture into WebGL's mechinism for handling texture loading.
        gl.bindTexture(gl.TEXTURE_2D, textureID);

        // Handles how magnification filters will work.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        
        // Prevent texture wrapping.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        // Load the image into the texture data structure with descriptive info.
        // Parameters:
        //  1: Which "binding point" or target the image is being loaded to.
        //  2: Level of detail. Used for mipmapping. 0 is base image level.
        //  3: Internal format. The composition of each element. Pixels in this case.
        //  4: Format of texel data. Must match internal format.
        //  5: The data type of the texel data.
        //  6: Image Data.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgMap[imageName]);

        // Creates a mipmap of the data at the gl.TEXTURE_2D target / binding point.
        gl.generateMipmap(gl.TEXTURE_2D);
        
        // Tells WebGL that we are done manipulating data at the gl.TEXTURE_2D target.
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        // Replace the image in the hashmap with the gl format version.
        imgMap[imageName] = textureID;
        
        // Add in the width and height as extra properties.
        imgMap[imageName].width = width;
        imgMap[imageName].height = height;
    };

    var setOnAssetsLoadFunction = function (funct)
    {
        onAllAssetsLoad = funct;
    };

    // Loads an image so that it can be drawn.
    // If already in the map, will do nothing.
    var loadImage = function (sourceString)
    {
        if (!(sourceString in imgMap))
        {
            // Create new Image object.
            var img = new Image();
            // Update resources in load counter.
            assetsToBeLoaded++;
            
            // Cache the image in hash table.
            imgMap[sourceString] = img;
            
            // When the image loads, convert it to the opengl format then put
            // it back into the imgMap.
            img.onload = function () {
                convertImageToGLFormat(sourceString);
                
                assetsToBeLoaded--;
                if (assetsToBeLoaded === 0 && onAllAssetsLoad !== null)
                {
                    onAllAssetsLoad();
                }
            };
            // Load the image.
            img.src = sourceString;
        }
    };
    
    var loadSpritesheet = function(textureSourceString, sheetInfoSourceString)
    {
        loadImage(textureSourceString);
        
        if (!(sheetInfoSourceString in audioMap))
        {
            // Cache xml object in the spritesheetMap.
            spritesheetMap[sheetInfoSourceString] = null;
            
            // Update resources in load counter.
            assetsToBeLoaded++;
            
            // Asyncrounsly request the data from server.
            var req = new XMLHttpRequest();
            req.open('GET', sheetInfoSourceString, true);
            
            req.onload = function () 
            {
                spritesheetMap[sheetInfoSourceString] = req.responseXML;

                // Give the spritesheetinfo the total frames property.
                spritesheetMap[sheetInfoSourceString].totalSpriteFrames =
                        spritesheetMap[sheetInfoSourceString]
                        .getElementsByTagName("SubTexture").length;
                
                assetsToBeLoaded--;
                if (assetsToBeLoaded === 0 && onAllAssetsLoad !== null)
                {
                    onAllAssetsLoad();
                }
            };
            
            req.send();
        }
    };
    
    var loadAudio = function (sourceString)
    {
        if (!(sourceString in audioMap))
        {
            // Cache buffer object in the audioMap.
            audioMap[sourceString] = null;
            
            // Update resources in load counter.
            assetsToBeLoaded++;
            
            // Asyncrounsly request the data from server.
            var req = new XMLHttpRequest();
            req.open('GET', sourceString, true);
            // Specify that the request retrieves binary data.
            req.responseType = 'arraybuffer';
            
            req.onload = function () 
            {
                // Asyncronously decode, then call the function in parameter.
                audioContext.decodeAudioData(req.response,
                    function(buffer)
                    {
                        audioMap[sourceString] = buffer;
                        
                        assetsToBeLoaded--;
                        if (assetsToBeLoaded === 0 && onAllAssetsLoad !== null)
                        {
                            onAllAssetsLoad();
                        }
                    } 
                );
            };
            
            req.send();
        }
    };
    
    var playSound = function(sourceString)
    {
        if (sourceString in audioMap)
        {
            // SourceNodes are one use only.
            var sourceNode = audioContext.createBufferSource();
            sourceNode.buffer = audioMap[sourceString];
            sourceNode.connect(audioContext.destination);
            sourceNode.start(0);
        }
    };
    
    var playBackgroundAudio = function(sourceString)
    {
        if (sourceString in audioMap)
        {
            // Stop audio if playing.
            stopBackgroundAudio();
            
            backgroundAudioNode = audioContext.createBufferSource();
            backgroundAudioNode.buffer = audioMap[sourceString];
            backgroundAudioNode.connect(audioContext.destination);
            backgroundAudioNode.loop = true;
            backgroundAudioNode.start(0);
    
        }
    };
    
    var stopBackgroundAudio = function()
    {
        // Check if the audio is  playing.
        if(backgroundAudioNode !== null)
        {
            backgroundAudioNode.stop(0);
            backgroundAudioNode = null;
        }
    };

    var clearCanvas = function()
    {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };

    // Draws all of the content in the drawsets with the currently active camera.
    var drawAll = function()
    {
        // For each Z-Index
        for(var currentZIndex = 0; currentZIndex < zDrawSets.length; currentZIndex++ )
        {
            // Check if the index has anything in it, if not, skip it.
            if(zDrawSets[currentZIndex] === undefined || zDrawSets[currentZIndex] === null)
            {
                continue;
            }
            
            var shaderDrawSets = zDrawSets[currentZIndex];
            
            // For every non-empty shader drawset, draw its objects. 
            for(var currentShader = 0; currentShader < shaderDrawSets.length; currentShader++)
            {
                var currentDrawSet = shaderDrawSets[currentShader].getDrawSet();
                if(currentDrawSet.length > 0)
                {
                    // Setup webgl for the current shader.
                    shaderDrawSets[currentShader].getShaderObj().setActive();
                    var shaderProgram = shaderDrawSets[currentShader].getShaderObj().getProgram();

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

                    // For every different object to be rendered, setup its data and draw it.
                    for(var currentObjIndex = 0; currentObjIndex < currentDrawSet.length; currentObjIndex++)
                    {
                        var currentObj = currentDrawSet[currentObjIndex];

                        // Setup texture coordinates and update depending on if it is a sprite or not.
                        var textureCoordinates = [];
                        if(currentObj instanceof Sprite)
                        {
                            // Get the information for whole spritesheet.
                            var spriteInfo = spritesheetMap[currentObj.getSpritesheetInfo()];

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

                            var texWidth = imgMap[currentObj.getTextureName()].width;
                            var texHeight = imgMap[currentObj.getTextureName()].height;

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
                            textureCoordinates = [x1,  1 - y2,
                                                  x2,  1 - y2,
                                                  x1,  1 - y1,
                                                  x2,  1 - y1];     

                            // Lastly, update it's sprite information.
                            updateAnimation(currentObj, spriteInfo);
                        }
                        else
                        {
                            textureCoordinates = defaultTextureCoordData;
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
                        gl.bindTexture(gl.TEXTURE_2D, imgMap[currentObj.getTextureName()]);
                        gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

                        // Finally, set up the Model-View-Perspective matrix
                        var vpMatrix = activeCamera.getViewPerspectiveMatrix();
                        var mvpMatrix = mat4.create();

                        mat4.multiply(mvpMatrix, vpMatrix, currentObj.getTransform().getMatrix());

                        var uniformMVP = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
                        gl.uniformMatrix4fv(uniformMVP, false, mvpMatrix);

                        // Draw triangles, with a max of this.numberOfVerticies verticies, from the zeroth element.
                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, numberOfVertices);
                    }
                }
            }
        }
    };
    
    /*
     * Updates a sprite to its next frame every number of ticks.
     * 
     * @param {Sprite} The sprite to modify.
     * @param {} The sprite information contained in the spritesheetMap.
     */
    var updateAnimation = function(sprite, spriteInfo)
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

    /*
     * Adds to the drawsets of engine. 
     * Only accepts of type Renderable2DObject. The shaders should also be created.
     * Anything else will cause errors.
     */
    var addToDrawSet = function (renderable2DObject)
    {
        if(renderable2DObject !== null)
        {
            var shaderDrawSets = zDrawSets[renderable2DObject.getTransform().getZOrder()];
         
            // Check if the drawsets exist, if they don't add them to z-order set.
            if(shaderDrawSets === undefined)
            {
                zDrawSets[renderable2DObject.getTransform().getZOrder()] = [];
                shaderDrawSets = zDrawSets[renderable2DObject.getTransform().getZOrder()];
            }
            
            var shaderIndex;
            var foundShaderSet = false;
            // Sorted by shader type.
            for(shaderIndex = 0; shaderIndex < shaderDrawSets.length && !foundShaderSet; shaderIndex++)
            {
                if( renderable2DObject.getShaderName() === shaderDrawSets[shaderIndex].getName())
                {
                    shaderDrawSets[shaderIndex].addToDrawSet(renderable2DObject);
                    foundShaderSet = true;
                }
            } 
            // If the shader was not there, add it to the drawset.
            if(!foundShaderSet)
            {
                var zIndex = renderable2DObject.getTransform().getZOrder();
                var shaderIndex = shaderDrawSets.length;
                var shadName = renderable2DObject.getShaderName();
                addShaderToZList(renderable2DObject.getShaderName(), zIndex);
                // Shader index for this shader should now be the last one.
                shaderDrawSets[shaderIndex].addToDrawSet(renderable2DObject);
            }
        }
    };
     /*
     * Removes from the drawsets of engine. Only accepts of type Renderable2DObject.
     * Anything else will cause errors.
     */
    var removeFromDrawSet = function (renderable2DObject)
    {
        if(renderable2DObject !== null)
        {
            var shaderDrawSets = zDrawSets[renderable2DObject.getTransform().getZOrder()];
         
            // Check if the drawsets exist, if they don't, then the object isn't here.
            if(shaderDrawSets !== undefined)
            {
                for(var i = 0; i < shaderDrawSets.length; i++)
                {
                    if( renderable2DObject.getShaderName() === shaderDrawSets[i].getName())
                    {
                        shaderDrawSets[i].removeFromDrawSet(renderable2DObject);
                    }
                } 
            }
        }
    };
    
    // All Resources are unloaded by the garbage collector.
    var unloadAllResources = function()
    {
        stopBackgroundAudio();
        audioMap = {};
        imgMap = {};
        spritesheetMap = {};
        
        zDrawSets = [];
        shaderMap = {};
        
        assetsToBeLoaded = 0;
        onAllAssetsLoad = null;
    };
    
    var getCanvasWidth = function()
    {
        return canvas.clientWidth;
    };
    
    var getCanvasHeight = function()
    {
        return canvas.clientHeight;
    };

    // Public interface for this object. Anything not in here will
    // not be accessable.
    var oPublic =
    {
        init: init,
        loadImage: loadImage,
        loadSpritesheet: loadSpritesheet,
        clearCanvas: clearCanvas,
        drawAll: drawAll,
        setOnAssetsLoadFunction: setOnAssetsLoadFunction,
        addShader: addShader,
        setActiveCamera: setActiveCamera,
        addToDrawSet: addToDrawSet,
        removeFromDrawSet: removeFromDrawSet,
        getCanvasWidth: getCanvasWidth,
        getCanvasHeight: getCanvasHeight,
        loadAudio: loadAudio,
        playSound: playSound,
        playBackgroundAudio: playBackgroundAudio,
        stopBackgroundAudio: stopBackgroundAudio,
        unloadAllResources: unloadAllResources
    };

    return oPublic;
}();

EngineCore.Loop = function ()
{
    var kFPS = 60;          // Frames per second
    var kMPF = 1000 / kFPS; // Milleseconds per frame.
    var kUR = 1;            // Update rate. (logic, not draw)
    
    // Variables for timing gameloop.
    var mPreviousTime;
    var mLagTime;
    var mCurrentTime;
    var mElapsedTime;
    
    // The identifier of the current loop.
    var mIntervalID = null;

    // This function is exclusivly to be called in the context of a scene.
    var runLoop = function () {
        mCurrentTime = Date.now();
        mElapsedTime = mCurrentTime - mPreviousTime;
        mPreviousTime = mCurrentTime;
        mLagTime += mElapsedTime;
        
        // Update only every Milleseconds per frame.
        // If lag larger then update freames, update until catchup.
        while(mLagTime >= kMPF)
        {
            this.update();
            mLagTime -= kMPF;
        }
        
        this.draw();
    };

    // update and draw functions must be set before this.
    var start = function()
    {
        var sceneContext = EngineCore.SceneManager.getCurrentScene();
        mPreviousTime = Date.now();
        mLagTime = 0.0;
        
        mIntervalID = setInterval(function(){runLoop.call(sceneContext);}, 1000 / kFPS);
    };
    
    // Stops only after a loop is started.
    var stop = function()
    {
       if(mIntervalID !== null)
       {
           clearInterval(mIntervalID);
           mIntervalID = null;
       }
    };

    var oPublic =
    {
        start: start,
        stop: stop
    };

    return oPublic;
    
}();

EngineCore.Input = function ()
{
    // Scancode constants
    var LEFT = 37;
    var UP = 38;
    var RIGHT = 39;
    var DOWN = 40;
    var SPACE = 32;
    var W = 87;
    var A = 65;
    var S = 83;
    var D = 68;
    var E = 69;
    var R = 82;
    var F = 70;
    var J = 74;
    var I = 73;
    var L = 76;
    var K = 75;

    // The pressed keys.
    var isPressed = {};

    var init = function ()
    {
        isPressed[LEFT] = false;
        isPressed[UP] = false;
        isPressed[RIGHT] = false;
        isPressed[DOWN] = false;
        isPressed[SPACE] = false;
        isPressed[W] = false;
        isPressed[A] = false;
        isPressed[S] = false;
        isPressed[D] = false;
        isPressed[E] = false;
        isPressed[R] = false;
        isPressed[F] = false;
        isPressed[J] = false;
        isPressed[I] = false;
        isPressed[L] = false;
        isPressed[K] = false;

        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keydown', onKeyDown);
    };

    var isKeyDown = function (keyCode)
    {
        return isPressed[keyCode];
    };

    // Functions to pass to window.
    var onKeyDown = function (event)
    {
        isPressed[event.keyCode] = true;
    };

    var onKeyUp = function (event)
    {
        isPressed[event.keyCode] = false;
    };

    var oPublic =
    {
        init: init,
        isKeyDown: isKeyDown,
        UP: UP,
        DOWN: DOWN,
        LEFT: LEFT,
        RIGHT: RIGHT,
        SPACE: SPACE,
        W: W,
        A: A,
        S: S,
        D: D,
        E: E,
        R: R,
        F: F,
        J: J,
        I: I,
        L: L,
        K: K
    };

    return oPublic;
}();

EngineCore.SceneManager = function()
{
    var mCurrentScene = null;
    
    var setCurrentScene = function(scene)
    {
        // Stop the current gameloop
        EngineCore.Loop.stop();
        
        // Remove all content from previous scene
        EngineCore.Resources.unloadAllResources();
        
        mCurrentScene = scene;
        
        mCurrentScene.contentLoad();
        
        // When all content loaded, initailze the scene, then start loop with 
        // given update and draw.
        EngineCore.Resources.setOnAssetsLoadFunction(function(){
                    mCurrentScene.initialize.call(mCurrentScene);
                    EngineCore.Loop.start();
                    });
    };
    
    var getCurrentScene = function()
    {
        return mCurrentScene;
    };
    
    var oPublic = 
    {
        setCurrentScene: setCurrentScene,
        getCurrentScene: getCurrentScene
    };
    
    return oPublic;
}();


