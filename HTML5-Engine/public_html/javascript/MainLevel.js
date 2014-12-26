/* 
 * 
 */
function MainLevel()
{
    Scene.call(this);
    this.mMainShader = "Texture-Sprite-Rectangle";
    this.mCamera;
    this.mPlayer;
    this.mEnemyManager;
    this.mBackgroundManager;
    this.mFPSText;
    this.mMouseText;
    
    // FPS variables
    this.mPrevTime = Date.now();
}
MainLevel.prototype = Object.create(Scene.prototype);

MainLevel.prototype.contentLoad = function()
{
    //Puts a shader into our game engine to use.
    EngineCore.Resources.addShader(this.mMainShader,
        "shaders/textured-vs.glsl",
        "shaders/textured-fs.glsl");
    
    // Preload Object Assets
    Player.prototype.preloadResources();
    EnemyManager.prototype.preloadResources();
    BackgroundGenerator.prototype.preloadResources();
    
    // Load sounds
    EngineCore.Resources.loadAudio("resources/game-sound.wav");
    EngineCore.Resources.loadAudio("resources/Mind_Meld.mp3");
    
    // Load Font
    EngineCore.Resources.loadFont("resources/fonts/dos-font.png",
                                  "resources/fonts/dos-font.fnt");
};

MainLevel.prototype.initialize = function()
{
    //Init the camera
    this.mCamera = new Camera([10,7.7], 20,
        0, 
        0,
        EngineCore.Resources.getCanvasWidth(),
        EngineCore.Resources.getCanvasHeight());
    
    // Setup a player transform.
    var transform = new Transform();

    transform.setPosition(10, 8);
    transform.setSize(2,2);
    transform.setZOrder(10);

    this.mPlayer = new Player(transform, this.mCamera, this.mMainShader);
    
    this.mEnemyManager = new EnemyManager(this.mPlayer, this.mMainShader);
    
    this.mBackgroundManager = new BackgroundGenerator(this.mPlayer, this.mMainShader);
    
    // Text
    var textTransform = new Transform();
    textTransform.setPosition(5,5);
    textTransform.setSize(10,10);
    textTransform.setZOrder(7);
    
    this.mFPSText = new FontTexture(textTransform, this.mMainShader,
                                       "resources/fonts/dos-font.png",
                                       "resources/fonts/dos-font.fnt",
                                       "Testing Textures! 87465@#RT...'");
    
    
    // Mouse Test text
    var mouseTextXForm = new Transform();
    mouseTextXForm.setPosition(1,10);
    mouseTextXForm.setSize(10,10);
    mouseTextXForm.setZOrder(7);
    
    this.mMouseText = new FontTexture(mouseTextXForm, this.mMainShader,
                                       "resources/fonts/dos-font.png",
                                       "resources/fonts/dos-font.fnt",
                                       "Mouse");
    
    
    // Setup background audio, can't take it any more.
    //EngineCore.Resources.playBackgroundAudio("resources/Mind_Meld.mp3");
};

MainLevel.prototype.update = function()
{
    if(EngineCore.Input.Keyboard.isKeyDown(EngineCore.Input.Keyboard.E))
    {
        EngineCore.Resources.playSound("resources/game-sound.wav");
    }
    
    if(EngineCore.Input.Keyboard.isKeyDown(EngineCore.Input.Keyboard.W))
    {
        EngineCore.Resources.playBackgroundAudio("resources/Mind_Meld.mp3");
    }
    
    if(EngineCore.Input.Keyboard.isKeyDown(EngineCore.Input.Keyboard.S))
    {
        EngineCore.Resources.stopBackgroundAudio();
    }
    
    if(EngineCore.Input.Keyboard.isKeyDown(EngineCore.Input.Keyboard.LEFT))
    {
        this.mFPSText.mTransformMatrix.getScale()[0] -= .1;
    }
    if(EngineCore.Input.Keyboard.isKeyDown(EngineCore.Input.Keyboard.RIGHT))
    {
        this.mFPSText.mTransformMatrix.getScale()[0] += .1;
    }
    if(EngineCore.Input.Keyboard.isKeyDown(EngineCore.Input.Keyboard.UP))
    {
        this.mFPSText.mTransformMatrix.getScale()[1] += .1;
    }
    if(EngineCore.Input.Keyboard.isKeyDown(EngineCore.Input.Keyboard.DOWN))
    {
        this.mFPSText.mTransformMatrix.getScale()[1] -= .1;
    }
    
    if(EngineCore.Input.Mouse.isButtonPressed(EngineCore.Input.Mouse.MOUSE_LEFT))
    {
        var mPos = EngineCore.Input.Mouse.getMouseDownPosition();
        var wPos = this.mCamera.pixelToWorldCoordinates(mPos.x, mPos.y);
        this.mMouseText.mText = "X: " + Math.round(wPos[0]) + " Y: " + Math.round(wPos[1]); 
        
        this.mMouseText.mTransformMatrix.setX(wPos[0]);
        this.mMouseText.mTransformMatrix.setY(wPos[1]);
    }
    
    this.mFPSText.mTransformMatrix.setX(this.mCamera.getCameraX() - (this.mCamera.getCameraWidth() / 2));
    this.mFPSText.mTransformMatrix.setY(this.mCamera.getCameraY() - (this.mCamera.getCameraHieght() * .4));
    
    // Update Scene
    this.mPlayer.update();
    this.mEnemyManager.update();
    this.mBackgroundManager.update();
};

MainLevel.prototype.draw = function()
{
    var elapsedTime = Date.now() - this.mPrevTime;
    var mpf = "MS Per Frame: " + elapsedTime;
    this.mFPSText.mText = mpf;
    
    EngineCore.Resources.clearCanvas();
    this.mEnemyManager.addToDrawSet();
    this.mBackgroundManager.addToDrawSet();
    this.mPlayer.addToDrawSet();
    this.mFPSText.addToDrawSet();
    this.mMouseText.addToDrawSet();
    this.mCamera.draw();
    this.mPrevTime = Date.now();
};