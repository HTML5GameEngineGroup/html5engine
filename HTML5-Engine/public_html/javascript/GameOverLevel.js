/* 
 * 
 */
function GameOverLevel()
{
    Scene.call(this);
    this.mCamera;
    this.mScreenImage;
    this.mMainShader = "Textured-Rectangle";
}

GameOverLevel.prototype.contentLoad = function()
{
    //Puts a shader into our game engine to use.
    EngineCore.Resources.addShader(this.mMainShader,
        "shaders/textured-vs.glsl",
        "shaders/textured-fs.glsl");
    EngineCore.Resources.loadImage("resources/GameOver.png");
};

GameOverLevel.prototype.initialize = function()
{
    this.mCamera = new Camera([10,7.7], 20,
    0, 
    0,
    EngineCore.Resources.getCanvasWidth(),
    EngineCore.Resources.getCanvasHeight());

    var transform = new Transform();

    transform.setPosition(0, 0);
    transform.setSize(20,15);
    transform.setZOrder(10);
    
    this.mScreenImage = new Renderable2DObject(transform,
        this.mMainShader,
        "resources/GameOver.png");    
};

GameOverLevel.prototype.update = function()
{
    if(EngineCore.Input.isKeyDown(EngineCore.Input.SPACE))
    {
        EngineCore.SceneManager.setCurrentScene(new MainLevel());
    }
};

GameOverLevel.prototype.draw = function()
{
    this.mScreenImage.addToDrawSet();
    this.mCamera.draw();
};

