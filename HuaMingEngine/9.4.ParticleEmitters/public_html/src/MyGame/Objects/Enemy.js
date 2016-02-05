/* File: Enemy.js 
 *
 * Creates and initializes a Enemy object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, SpriteAnimateRenderable, RigidCircle, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Enemy(spriteTexture, atX, atY) {
    this.mEnemy = new SpriteAnimateRenderable(spriteTexture);

    this.mEnemy.setColor([1, 1, 1, 0]);
    this.mEnemy.getXform().setPosition(atX, atY);
    this.mEnemy.getXform().setSize(11, 11);
    this.mEnemy.setSpriteSequence(512, 0, // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164, // widthxheight in pixels
            5, // number of elements in this sequence
            0);          // horizontal padding in between
    this.mEnemy.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mEnemy.setAnimationSpeed(30);
    // show each element for mAnimSpeed updates
    GameObject.call(this, this.mEnemy);
    var count = 0;
    var r = new RigidCircle(this.getXform(), 4, 4);
    r.setMass(2);
    r.setAcceleration([0, 0]);
    r.setFriction(0);
    r.setColor([0, 1, 0, 1]);
    r.setDrawBounds(true);
    this.setPhysicsComponent(r);

   
}
gEngine.Core.inheritPrototype(Enemy, GameObject);
Enemy.prototype.start = function (){
     GameObject.prototype.start.call(this);
    this.count=0; 
    this.mHasCollision = 0;
}
Enemy.prototype.update = function () {
    GameObject.prototype.update.call(this);

  /*  if (this.count == 100)
        this.getXform().getPosition()[0] += 10;
    if (this.count == 200)
        this.getXform().getPosition()[1] += 10;
    if (this.count == 300)
        this.getXform().getPosition()[0] -= 10;
    if (this.count == 400) {
        this.count=0;
        this.getXform().getPosition()[1] -= 10;
    }*/
    this.count++;
    if(this.mHasCollision==3)
        this.destory();
    
};
Enemy.prototype.addNum = function (otherObj) {
    this.mHasCollision++;
};
Enemy.prototype.reduceNum = function (otherObj) {
    this.mHasCollision--;
};