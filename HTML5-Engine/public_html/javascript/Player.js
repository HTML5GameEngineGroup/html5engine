"use strict";
/*
 * A player which a camera is locked onto its position.
 */
function Player(transform, camera, shaderName)
{
    var logic = new PlayerLogic(transform, camera);
    
    var renderObj = new Sprite(transform,
        shaderName,
        "resources/sprites/megaman.png",
        "resources/sprites/megaman.xml",
        "resources/normal_4.png");
        
    renderObj.mTicksPerFrame = 5;
       
    GameObject.call(this, transform, logic, renderObj);
}
Player.prototype = Object.create(GameObject.prototype);

Player.prototype.preloadResources = function()
{
    EngineCore.Resources.loadSpritesheet("resources/sprites/megaman.png",
                                         "resources/sprites/megaman.xml");
};

function PlayerLogic(transform, camera)
{
    this.mMoveSpeed = 0.3;
    
    this.mCamera = camera;
    
    LogicComponent.call(this, transform);
}

PlayerLogic.prototype.update = function()
{
    if(EngineCore.Input.isKeyDown(EngineCore.Input.LEFT))
    {
        this.mTransform.setX(this.mTransform.getX() - this.mMoveSpeed);
    }
    else if(EngineCore.Input.isKeyDown(EngineCore.Input.RIGHT))
    {
        this.mTransform.setX(this.mTransform.getX() + this.mMoveSpeed);
    }

    if(EngineCore.Input.isKeyDown(EngineCore.Input.DOWN))
    {
        this.mTransform.setY(this.mTransform.getY() - this.mMoveSpeed);
    }
    else if(EngineCore.Input.isKeyDown(EngineCore.Input.UP))
    {
        this.mTransform.setY(this.mTransform.getY() + this.mMoveSpeed);
    }
    
    // Clamp player to camera.
    if(this.mTransform.getY() + this.mTransform.getScale()[1] > this.mCamera.getCameraY() + (this.mCamera.getCameraHieght() /2))
    {
        this.mTransform.setY( this.mCamera.getCameraY() + (this.mCamera.getCameraHieght() / 2) - this.mTransform.getScale()[1]);
    }
    else if (this.mTransform.getY() < this.mCamera.getCameraY() - (this.mCamera.getCameraHieght() /2))
    {
        this.mTransform.setY( this.mCamera.getCameraY() - (this.mCamera.getCameraHieght() / 2));
    }
    
    if(this.mTransform.getX() < this.mCamera.getCameraX() - (this.mCamera.getCameraWidth() /2))
    {
        this.mTransform.setX( this.mCamera.getCameraX() - (this.mCamera.getCameraWidth() / 2));
    }
    
    // Move camera with player
    if(this.mTransform.getX() > this.mCamera.getCameraX() + 1)
    {
        this.mCamera.setCameraX(this.mCamera.getCameraX() + .3);
    }
    
    
    // Lock camera to position of the player.
    //this.mCamera.setCameraX(this.mTransform.getX());
    //this.mCamera.setCameraY(this.mTransform.getY());
};



