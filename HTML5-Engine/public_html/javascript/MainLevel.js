"use strict";
/* 
 * 
 */
function MainLevel()
{
    Scene.call(this);
    this.mMainShader = "Texture-Sprite-Rectangle";
    this.mNormalShader = "Normal-Sprite-Rectangle";
    this.mShadowShader = "Shadow-Rectangle";
    this.mCamera;
    this.mPlayer;
    this.mEnemyManager;
    this.mBackgroundManager;
    this.mShadowTester;
    
    //create lights for testing
    this.mLight;
    this.mLightList = [];
    this.mFakeTime = 0;
    this.mLightZ = 5;
    this.mInner = 180;
    this.mOuter = 50;
    this.mNumLights = 10;
};
MainLevel.prototype = Object.create(Scene.prototype);

MainLevel.prototype.contentLoad = function()
{
    //Puts a shader into our game engine to use.
    EngineCore.Resources.addShader(this.mMainShader,
        "shaders/texturedLighting-vs.glsl",
        "shaders/texturedLighting-fs.glsl");
        
    EngineCore.Resources.addShader(this.mNormalShader,
        "shaders/textured-vs.glsl",
        "shaders/textured-fs.glsl"); 
        
    EngineCore.Resources.addShader(this.mShadowShader,
        "shaders/shadow-vs.glsl",
        "shaders/shadow-fs.glsl");      
    
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
    this.mCamera = new Camera([10,7.7], 50,
        0, 
        0,
        EngineCore.Resources.getCanvasWidth(),
        EngineCore.Resources.getCanvasHeight());
        
    EngineCore.Resources.setActiveCamera(this.mCamera);
    
    // Setup a player transform.
    var transform = new Transform();

    transform.setPosition(10, 8);
    transform.setSize(2,2);
    transform.setZOrder(9);

    this.mPlayer = new Player(transform, this.mCamera, this.mMainShader);
    
    this.mEnemyManager = new EnemyManager(this.mPlayer, this.mMainShader);
    
    this.mBackgroundManager = new BackgroundGenerator(this.mPlayer, this.mMainShader);
    
     // Setup a shadow  testing transform.
    var t = new Transform();

    t.setPosition(0, 0);
    t.setSize(12,12);
    t.setZOrder(10);
    //use temp texture for shadow test
    this.mShadowTester = new Renderable2DObject(t, this.mNormalShader, "resources/sprites/megaman.png", "resources/normal_4.png");
    
    // added by jeb
    var playerPos = transform.getPosition();
    var lightColor = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1.0);
    var pos = vec3.fromValues(playerPos[0], playerPos[1], this.mLightZ);
    this.mLight = new Light(pos, lightColor);
    this.mPlayer.mRenderComponent.addLight(this.mLight); //hacky
    
    // Crudely setup lights
    for(var i = 0; i < this.mNumLights; i++)
    {
        lightColor = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1.0);
        var newPos = vec3.fromValues(i*5,  8, this.mLightZ);
        this.mLightList.push(new Light(newPos, lightColor));
        this.mPlayer.mRenderComponent.addLight(this.mLightList[i]); //hacky
    }
    
    //setup the framebuffer
    //EngineCore.Resources.SetupShadowRecieverFrameBuffer();
    
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
    
    if(EngineCore.Input.isKeyDown(EngineCore.Input.R))
    {
        this.mOuter += 5;
    }
    
    if(EngineCore.Input.isKeyDown(EngineCore.Input.F))
    {
        this.mOuter -= 1;
    }
    
    if(EngineCore.Input.isKeyDown(EngineCore.Input.I))
    {
        this.mInner += 1;
    }
    
    if(EngineCore.Input.isKeyDown(EngineCore.Input.K))
    {
        this.mInner -= 1;
    }
    
    // Update Scene
    this.mPlayer.update();
    this.mEnemyManager.update();
    this.mBackgroundManager.update();
    var playerPos = this.mPlayer.getTransform().getCenterPosition();
    this.mLight.setPosition(vec3.fromValues(playerPos[0], playerPos[1], this.mLightZ));
    
    this.mFakeTime += 0.1;
    for(var i = 0; i < this.mLightList.length; i++)
    { 
        var pos = this.mLightList[i].getPosition();
        pos[1] += Math.sin(this.mFakeTime + pos[0])/20;
        this.mLightList[i].setPosition(vec3.fromValues(pos[0], pos[1], this.mLightZ));
        this.mLightList[i].setInnerRadiusSize(this.mInner);
        this.mLightList[i].setOuterRadiusSize(this.mOuter);
    }
};

MainLevel.prototype.draw = function()
{
    EngineCore.Resources.clearCanvas();
    //very hacky
    //draw to the framebuffer texture

//    EngineCore.Resources.ShadowRecieverFramebufferOn();
//    this.mBackgroundManager.addToDrawSet();
//    this.mCamera.draw();
//    EngineCore.Resources.ShadowRecieverFramebufferOff();

//    EngineCore.Resources.ShadowRecieverStencilOn();
//    this.mBackgroundManager.addToDrawSet();
//    this.mCamera.draw();
//    EngineCore.Resources.ShadowRecieverStencilOff();
    
    //draw all objects that have shadows
    //this.mPlayer.mRenderComponent.SwitchShader(this.mShadowShader, true);
    //this.mPlayer.addToDrawSet();
    //this.mCamera.draw();
    //this.mPlayer.mRenderComponent.SwitchShader(this.mMainShader, false); //remember to switch back
    
    //test results
    //this.mShadowTester.mTextureID = EngineCore.Resources.GetFramebufferTexture();
    //this.mShadowTester.addToDrawSet();
    //this.mCamera.draw();
    
    //draw all objects
    this.mBackgroundManager.addToDrawSet();
    this.mEnemyManager.addToDrawSet();
    this.mPlayer.addToDrawSet();
    this.mCamera.draw();
    EngineCore.Resources.ShadowRecieverStencilDisable();
    
};