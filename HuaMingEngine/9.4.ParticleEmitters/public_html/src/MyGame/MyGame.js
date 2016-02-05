/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
 FontRenderable, ParticleGameObjectSet, ParticleEmitter
 GameObject, Hero, Enemy, Dye, Platform, Wall, Bullet, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
var gCurrentScene;
gEngine.Core.inheritPrototype(MyGame, Scene);
function MyGame() {
    this.kEnemySprite = "assets/minion_sprite.png";
    this.kBulletTexture = "assets/dye_pack.png";
    this.kParticleTexture = "assets/particle.png";
    
    gCurrentScene = this;
}


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kEnemySprite);
    gEngine.Textures.loadTexture(this.kBulletTexture);
    gEngine.Textures.loadTexture(this.kParticleTexture);
    
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kEnemySprite);
    gEngine.Textures.unloadTexture(this.kBulletTexture);
    gEngine.Textures.unloadTexture(this.kParticleTexture);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    
    // sets the background to gray
    Scene.prototype.initialize.call(this);
    
    this.mAllHeros = new GameObjectSet();
    this.mAllEnemies = new GameObjectSet();
    this.mAllBullets = new GameObjectSet();
    
    this.mCamera = new Camera(
            vec2.fromValues(100, 56.25), // position of the camera
            200, // width of camera
            [0, 0, 1280, 720]            // viewport (orgX, orgY, width, height)
            );
    this.mCamera.setBackgroundColor([0.7, 0.7, 0.7, 1]);

    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    // create a few objects ...
    var i, j, rx, ry, obj, dy, dx;
    dx = 80;

    // the floor and ceiling
    rx = 20;
    for (i = 0; i < 7; i++) {
        obj = new Enemy(this.kEnemySprite, rx, 50);
        obj.mName = "Enemy";
        this.mAllEnemies.addToSet(obj);
        //    this.mAllObject.addToSet(obj);
        
        obj = new Enemy(this.kEnemySprite, rx, 70);
        obj.mName = "Enemy";
        this.mAllEnemies.addToSet(obj);
        //    this.mAllObject.addToSet(obj);

         obj = new Enemy(this.kEnemySprite, rx, 90);
        obj.mName = "Enemy";
        this.mAllEnemies.addToSet(obj);
        rx += 25;
    }
    
    // 
    // the important objects

    this.mEmpty = new Empty(null, null, null);
    this.mEmpty.mName = "Empty";
};
