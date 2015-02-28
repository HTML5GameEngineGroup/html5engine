
"use strict";

/* 
 * The template for a scene.
 */
function StartScreenLevel()
{
    Scene.call(this);
    this.mCamera;
    this.mScreenImage;
    this.mMainShader = "Textured-Rectangle";
}

StartScreenLevel.prototype.contentLoad = function()
{
    //Puts a shader into our game engine to use.
    EngineCore.Resources.addShader(this.mMainShader,
        "shaders/texturedLighting-vs.glsl",
        "shaders/texturedLighting-fs.glsl");
    EngineCore.Resources.loadImage("resources/Intro.png");
    EngineCore.Resources.loadImage("resources/normal_4.png");
};

StartScreenLevel.prototype.initialize = function()
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
        "resources/Intro.png",
        "resources/normal_4.png");    
};

StartScreenLevel.prototype.update = function()
{
    if(EngineCore.Input.isKeyDown(EngineCore.Input.SPACE))
    {
        EngineCore.SceneManager.setCurrentScene(new MainLevel());
    }
};

StartScreenLevel.prototype.draw = function()
{
    EngineCore.Resources.clearCanvas();
    this.mScreenImage.addToDrawSet();
    this.mCamera.draw();
};

