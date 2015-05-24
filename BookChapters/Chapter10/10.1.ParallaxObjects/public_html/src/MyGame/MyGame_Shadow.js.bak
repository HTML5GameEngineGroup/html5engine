/*
 * File: MyGame_Shadow: Initializes and sets up shadow
 */
/*jslint node: true, vars: true */
/*global gEngine, MyGame, ShadowReceiverRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._setupShadow = function (bg) {
    this.mBgShadow = new ShadowReceiverRenderable(bg);
    this.mBgShadow.addShadowCaster(this.mLgtHero.getRenderable());
    this.mBgShadow.addShadowCaster(this.mIllumMinion.getRenderable());
    this.mBgShadow.addShadowCaster(this.mLgtMinion.getRenderable());

    this.mMinionShadow = new ShadowReceiverRenderable(this.mIllumMinion.getRenderable());
    this.mMinionShadow.addShadowCaster(this.mIllumHero.getRenderable());
    this.mMinionShadow.addShadowCaster(this.mLgtHero.getRenderable());
    this.mMinionShadow.addShadowCaster(this.mLgtMinion.getRenderable());
};
