/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, SpriteRenderable, RigidCircle, RigidRectangle, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Empty(spriteTexture, atX, atY) {
    this.mEmpty = new Renderable(spriteTexture);
    GameObject.call(this, this.mEmpty);
}
gEngine.Core.inheritPrototype(Empty, GameObject);

Empty.prototype.update = function () {
    // must call super class update
    GameObject.prototype.update.call(this);
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        var d = new Bullet(gCurrentScene.kBulletTexture,gCurrentScene.mAllCamera[0].mouseWCX(), gCurrentScene.mAllCamera[0].mouseWCY());
        d.mName = "Bullet";
        d.mCollidableFlag = true;
        //d.mCollisionPixelFlag=true;
        gCurrentScene.mAllBullets.addToSet(d);
    }
};

Empty.prototype.onCollisionStay = function (otherObj) {
};
Empty.prototype.onCollisionEnter = function (otherObj) {

};
Empty.prototype.onCollisionExit = function (otherObj) {

};