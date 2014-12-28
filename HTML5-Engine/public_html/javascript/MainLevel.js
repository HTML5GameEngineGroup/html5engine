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
    this.mLight;
};
MainLevel.prototype = Object.create(Scene.prototype);

MainLevel.prototype.contentLoad = function()
{
    //Puts a shader into our game engine to use.
    EngineCore.Resources.addShader(this.mMainShader,
        "shaders/texturedLighting-vs.glsl",
        "shaders/texturedLighting-fs.glsl");
    
    // Preload Object Assets
    Player.prototype.preloadResources();
    EnemyManager.prototype.preloadResources();
    BackgroundGenerator.prototype.preloadResources();
    
    // Load sounds
    EngineCore.Resources.loadAudio("resources/game-sound.wav");
    EngineCore.Resources.loadAudio("resources/Mind_Meld.mp3");
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
    
    // added by jeb
    var playerPos = transform.getPosition();
    var lightColor = vec4.fromValues(0, 1.0, 0.0, 1.0);
    var pos = vec3.fromValues(playerPos[0], playerPos[1], 0);
    this.mLight = new Light(pos, lightColor);
    this.mPlayer.mRenderComponent.addLight(this.mLight);
    
    // Setup background audio, can't take it any more.
    //EngineCore.Resources.playBackgroundAudio("resources/Mind_Meld.mp3");
};

MainLevel.prototype.update = function()
{
    if(EngineCore.Input.isKeyDown(EngineCore.Input.E))
    {
        EngineCore.Resources.playSound("resources/game-sound.wav");
    }
    
    if(EngineCore.Input.isKeyDown(EngineCore.Input.W))
    {
        EngineCore.Resources.playBackgroundAudio("resources/Mind_Meld.mp3");
    }
    
    if(EngineCore.Input.isKeyDown(EngineCore.Input.S))
    {
        EngineCore.Resources.stopBackgroundAudio();
    }
    
    // Update Scene
    this.mPlayer.update();
    this.mEnemyManager.update();
    this.mBackgroundManager.update();
    var playerPos = this.mPlayer.getTransform().getCenterPosition();
    this.mLight.update(vec3.fromValues(playerPos[0], playerPos[1], 0));
};

MainLevel.prototype.draw = function()
{
    EngineCore.Resources.clearCanvas();
    this.mEnemyManager.addToDrawSet();
    this.mBackgroundManager.addToDrawSet();
    this.mPlayer.addToDrawSet();
    this.mCamera.draw();
};