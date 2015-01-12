/* 
 * This is a camera.
 */
function Camera(cameraPosition, cameraWidth, viewportX, viewportY, viewportWidth, viewportHeight)
{
    // The matrix that transform objects for an orthographic view.
    // Bounds how big the display from the camera is.
    var mOrthoMatrix = mat4.create();
    
    // The position and oriantation of the camera.
    var mViewMatrix = mat4.create();;
    
    // How far the near plane of the view is from camera.
    var mNearPlane = 10;
    
    // How far the far plane of the view is from the camera.
    var mFarPlane = 10000;
    
    
    // The viewport data 
    var mViewportX = viewportX;
    var mViewportY = viewportY;
    var mViewportWidth = viewportWidth;
    var mViewportHeight = viewportHeight;
    
    // The size of the view the camera has.
    // Height is based on the aspect ratio given by viewport.
    var mCameraWidth = cameraWidth;
    var mCameraHeight = mCameraWidth * ( mViewportHeight / mViewportWidth );
    
    // Creates a viewMatrix.
    // Parameters respectively:
    //  1: Output.
    //  2: The position of the camera.
    //  3: The position where the camera is looking at.
    //  4: The direction considered "up" for the camera.
    mat4.lookAt(mViewMatrix,
    [cameraPosition[0], cameraPosition[1], 10],
    [cameraPosition[0], cameraPosition[1], 0],
    [0,1,0]);

    
    mat4.ortho(mOrthoMatrix,
        -(mCameraWidth / 2),
        mCameraWidth / 2,
        -(mCameraHeight / 2),
        mCameraHeight / 2,
        0,
        10000);
    
    // Retrieves the lookAtMatrix that is the camera position and oriantation.
    this.getViewMatrix = function()
    {
        return mViewMatrix;
    };
    
    // Retrieves the orthographic matrix that is how the camera displays its view.
    this.getOrthographicMatrix = function()
    {
        return mOrthoMatrix;
    };
    
    // Returns a multiplication of the orthographic and view matrix
    this.getViewPerspectiveMatrix = function()
    {
        var vpMatrix = mat4.create();
        mat4.multiply(vpMatrix, mOrthoMatrix,mViewMatrix);
        return vpMatrix;
    };
    
    //  Change the width of what the camera can see by delta (adding/substracting)
    this.zoomCameraBy = function(deltaX)
    {
        if(deltaX !== 0)
        {
            var newWidth = mCameraWidth + deltaX;
            var newHeight = newWidth * (mViewportHeight / mViewportWidth);

            if(newWidth > 0.0 && newHeight > 0.0)
            {
                mCameraWidth = newWidth;
                mCameraHeight = newHeight;

                mat4.ortho(mOrthoMatrix,
                -(mCameraWidth / 2),
                mCameraWidth / 2,
                -(mCameraHeight / 2),
                mCameraHeight / 2,
                mNearPlane,
                mFarPlane);
            }
        }
    };
    
    // Uses this camera to draw renderable objects given to the engine.
    this.draw = function()
    {
        EngineCore.Resources.setActiveCamera(this);
        EngineCore.Resources.drawAll();
    };
    
    this.getCameraWidth = function()
    {
        return mCameraWidth;
    };
    
    this.getCameraHieght = function()
    {
        return mCameraHeight;
    };
    
    this.getCameraPosition = function()
    {
        return [mViewMatrix[12], mViewMatrix,[13]];
    };
    
    this.setCameraX = function(xPos)
    {
        mViewMatrix[12] = -xPos;
    };
    
    this.setCameraY = function(yPos)
    {
        mViewMatrix[13] = -yPos;
    };
    
    this.getCameraX = function()
    {
        return -mViewMatrix[12];
    };
    
    this.getCameraY = function()
    {
        return -mViewMatrix[13];
    };
    
    /*
     * Reorients the camera. Useful when changing the viewport. The reoriantation
     * is based on the width of the camera.
     */
    var reorientCamera = function()
    {
        var newHeight = mCameraWidth * (mViewportHeight / mViewportWidth);

        if(newHeight > 0.0)
        {
            mCameraHeight = newHeight;

            mat4.ortho(mOrthoMatrix,
            -(mCameraWidth / 2),
            mCameraWidth / 2,
            -(mCameraHeight / 2),
            mCameraHeight / 2,
            mNearPlane,
            mFarPlane);
        }
    };
    
    this.getViewportX = function()
    {
        return mViewportX;
    };
    
    this.setViewportX = function(x)
    {
        mViewportX = x;
    };
    
    this.getViewportY = function()
    {
        return mViewportY;
    };
    
    this.setViewportY = function(y)
    {
        mViewportY = y;
    };
    
    this.getViewportHeight = function()
    {
        return mViewportHeight;
    };
    
    this.getViewportWidth = function()
    {
        return mViewportWidth;
    };
    
    this.setViewportHeight = function(height)
    {
        mViewportHeight = height;
        reorientCamera();
    };
    
    this.setViewportWidth = function(width)
    {
        mViewportWidth = width;
        reorientCamera();
    };
    
    this.pixelToWorldCoordinates = function(xPix,yPix)
    { 
        // Canvas to viewport
        var viewX = xPix - mViewportX;
        var viewY = yPix - mViewportY;
        
        // Transform Y coordinate so origin is on bottom.
        viewY = mViewportHeight - viewY;
        
        
        // viewport to gl normalized Viewport
        var nvX = ((2 * viewX) / mViewportWidth) - 1;
        var nvY = ((2 * viewY) / mViewportHeight) - 1;
        
        // As a vector
        var nvPos = vec4.fromValues(nvX, nvY, 0, 1); // ---------------------------------------------------------- check with 0 as w.
        
        // Use view-perspective matrix inverted to obtain the position in world space.
        var wPos = vec4.create();
        var invertedVPM = mat4.create();
        mat4.invert(invertedVPM, this.getViewPerspectiveMatrix());
        vec4.transformMat4( wPos, nvPos, invertedVPM);
        
        return wPos;
    };
};

