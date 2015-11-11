/* File: GameObjectSet.js 
 *
 * Support for working with a set of GameObjects
 */

/*jslint node: true, vars: true */
/*global  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Default Constructor<p>
 * Support for working with a set of GameObjects
 * @returns {GameObjectSet}
 * @memberOf GameObjectSet
 */
function GameObjectSet() {
    this.mSet = [];
}

/**
 * 
 * @returns {GameObjectSet.mSet.length}
 * @memberOf GameObjectSet
 */
GameObjectSet.prototype.size = function () { return this.mSet.length; };

/**
 * 
 * @param {type} index
 * @returns {Array}
 * @memberOf GameObjectSet
 */
GameObjectSet.prototype.getObjectAt = function (index) {
    return this.mSet[index];
};

/**
 * 
 * @param {type} obj
 * @returns {undefined}
 * @memberOf GameObjectSet
 */
GameObjectSet.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};

/**
 * 
 * @param {type} obj
 * @returns {undefined}
 * @memberOf GameObjectSet
 */
GameObjectSet.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        this.mSet.splice(index, 1);
};

/**
 * 
 * @param {type} obj
 * @returns {undefined}
 * @memberOf GameObjectSet
 */
GameObjectSet.prototype.moveToLast = function (obj) {
    this.removeFromSet(obj);
    this.addToSet(obj);
};

/**
 * 
 * @returns {undefined}
 * @memberOf GameObjectSet
 */
GameObjectSet.prototype.update = function () {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].update();
    }
};

/**
 * 
 * @param {type} aCamera
 * @returns {undefined}
 * @memberOf GameObjectSet
 */
GameObjectSet.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera);
    }
};
