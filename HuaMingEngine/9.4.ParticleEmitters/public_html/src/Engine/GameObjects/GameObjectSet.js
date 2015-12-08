/* File: GameObjectSet.js 
 *
 * Support for working with a set of GameObjects
 */

/*jslint node: true, vars: true */
/*global  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function GameObjectSet() {
    this.mSet = [];
    currentScene.mAllObjectSet.push(this);
}

GameObjectSet.prototype.size = function () { return this.mSet.length; };

GameObjectSet.prototype.getObjectAt = function (index) {
    return this.mSet[index];
};

GameObjectSet.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
    if(currentScene.mObjectSetTable.hasItem(obj)){
        var set=currentScene.mObjectSetTable.getItem(obj);
        set.push(this);
        currentScene.mObjectSetTable.setItem(obj,set);
    }
    else{
        var set=[];
        set.push(this);
        currentScene.mObjectSetTable.setItem(obj,set);
    }
};

GameObjectSet.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1){
        this.mSet.splice(index, 1);
        var set=currentScene.mObjectSetTable.getItem(obj);
        index = set.indexOf(this);
        set.splice(index, 1);
        currentScene.mObjectSetTable.setItem(obj,set);
    }
};

GameObjectSet.prototype.update = function () {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].update();
    }
};
GameObjectSet.prototype.start = function () {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].start();
    }
};
GameObjectSet.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera);
    }
};

GameObjectSet.prototype.findObject = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        return true;
    else return false;
};

