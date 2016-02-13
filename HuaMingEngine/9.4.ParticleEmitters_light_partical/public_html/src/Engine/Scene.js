/* 
 * The template for a scene.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
var gCurrentScene;
// Constructor
function Scene() {
    this.mCamera = null;
    this.mAllCamera = null;
    this.mAllObject = null;
    this.mAllDrawSet = null;
    this.mAllLight = null;
    this.mAllShadow = null;
    this.mAllParticle=null;
}

//<editor-fold desc="functions subclass should override">

// Begin Scene: must load all the scene contents
// when done 
//  => start the GameLoop
// The game loop will call initialize and then update/draw
Scene.prototype.loadScene = function () {
    // override to load scene specific contents
};

// Performs all initialization functions
//   => Should call gEngine.GameLoop.start(this)!
Scene.prototype.initialize = function () {
    // initialize the level (called from GameLoop)
    this.mAllObject = new GameObjectSet();
    this.mAllCamera = [];
    this.mAllDrawSet = [];    
    this.mAllParticle=new ParticleGameObjectSet();
    gCurrentScene.mAllDrawSet.push(this.mAllParticle);
    this.mAllLight = new LightSet();
    this.mAllShadow = [];
};
// update function to be called form EngineCore.GameLoop
Scene.prototype.update = function () {
    // when done with this level should call:
    // GameLoop.stop() ==> which will call this.unloadScene();
    var func = function (x, y) {
        this.createParticle.call(this, x, y);
    };
    var i;
    for (i = 0; i < this.mAllCamera.length; i++) {
        this.mAllCamera[i].update()
    }
    this.mAllObject.update();
    this._physicsSimulation();

    // create dye pack and remove the expired ones ...

};

// draw function to be called from EngineCore.GameLoop
Scene.prototype.draw = function () {
    var i;
    var j;
    for (i = 0; i < this.mAllCamera.length; i++) {
        this.mAllCamera[i].setupViewProjection();       
        for (j = 0; j < this.mAllShadow.length; j++) {
            this.mAllShadow[j].draw(this.mAllCamera[i]);
        }
        for (j = 0; j < this.mAllDrawSet.length; j++) {
            if(!this.mAllDrawSet[j].mAutoDrawEnable)
                this.mAllDrawSet[j].draw(this.mAllCamera[i]);
        }
        for (j = 0; j < this.mAllDrawSet.length; j++) {
              this.mAllDrawSet[j].mDrawed=false;
        }
    }

};

// Must unload all resources
Scene.prototype.unloadScene = function () {
    // .. unload all resources
};
//</editor-fold>


Scene.prototype.collision = function () {

    var i;
    var j;
    for (i = 0; i < this.mAllObject.mSet.length; i++) {
        for (j = 0; j < this.mAllObject.mSet.length; j++) {
            if (i < j) {
                if (this.mAllObject.mSet[i].mCollidableFlag) {
                    this.mAllObject.mSet[i].collisionTest(this.mAllObject.mSet[j]);
                }
            }
            else if (i > j) {
                if (this.mAllObject.mSet[i].mCollidableFlag && !this.mAllObject.mSet[j].mCollidableFlag) {
                    this.mAllObject.mSet[i].collisionTest(this.mAllObject.mSet[j]);
                }
            }
        }
        if (this.mAllObject.mSet[i].mCollidableFlag) {
            this.mAllObject.mSet[i].collisionExitTest();
        }
    }
};

Scene.prototype._physicsSimulation = function () {

};