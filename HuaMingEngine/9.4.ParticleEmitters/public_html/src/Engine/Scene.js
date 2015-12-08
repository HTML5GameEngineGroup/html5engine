/* 
 * The template for a scene.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Constructor
function Scene() {
    this.mCamera = null;
    this.mAllCamera = null;
    this.mAllObject = null;
    this.mAllObjectSet = null;
    this.mAllRenderable = null;
    this.mObjectSetTable=null;
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
    this.mAllObjectSet = [];
    this.mAllObject = new GameObjectSet();
    this.mAllCamera = [];
    this.mAllRenderable = [];
    this.mObjectSetTable=new HashTable();
};


Scene.prototype.start = function () {

    this.mAllObject.start();

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


    // create dye pack and remove the expired ones ...

};

// draw function to be called from EngineCore.GameLoop
Scene.prototype.draw = function () {
    var i;
    var j;
    for (i = 0; i < this.mAllCamera.length; i++) {
        this.mAllCamera[i].setupViewProjection();
        for (j = 0; j < this.mAllRenderable.length; j++) {
            this.mAllRenderable[j].draw(this.mAllCamera[i]);
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
            else if(i>j){
                if (this.mAllObject.mSet[i].mCollidableFlag&&!this.mAllObject.mSet[j].mCollidableFlag) {
                    this.mAllObject.mSet[i].collisionTest(this.mAllObject.mSet[j]);
                }
            }
        }
    }
};

function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    };

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    };

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    };
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    };

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    };

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    };

    this.clear = function()
    {
        this.items = {};
        this.length = 0;
    };
}