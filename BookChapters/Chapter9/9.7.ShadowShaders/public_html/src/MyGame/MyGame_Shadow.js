/*
 * File: MyGame_Shadow: Initializes and sets up shadow
 */
/*jslint node: true, vars: true */
/*global gEngine, MyGame, ShadowReceiverRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._setupShadow = function (bg) {
    this.mBgShadow = new ShadowReceiverRenderable(bg);
    this.mBgShadow.addShadowCaster(this.mIllumHero.getRenderable());
    this.mBgShadow.addShadowCaster(this.mLgtHero.getRenderable());
};
