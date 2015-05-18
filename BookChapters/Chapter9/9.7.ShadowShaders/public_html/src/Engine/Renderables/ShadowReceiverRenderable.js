/*
 * File: ShadowReceiverRenderable.js
 * Shadow support
 * 
 * Instance variables:
 *     mReceiver: Reference to any Renderable
 *                Treats this target for shadow receiver
 *     mCasters: Reference to an array of Renderables that are at least LightRenderable
 *     
 * Draws the mReceiver, and the shadows of mCasters on this mReceiver
 * This object should be drawn _BEFORE_ drawing the casters
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Renderable, SpriteRenderable, ShadowCasterRenderable, Transform */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ShadowReceiverRenderable (theReceiverRenderable) {
    SpriteRenderable.call(this, theReceiverRenderable.getTexture());
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getShadowReceiverShader());
    this.kShadowStencilBit = 0x01;              // The stencil bit to switch on/off for shadow
    this.kShadowStencilMask = 0xFF;             // The stencil mask 
    
    // To support shadow drawing
    this.mShadowCaster = [];                    // array of ShadowCasterRenderables
    this.mReceiver = theReceiverRenderable;     // Shadow receiver is a copy of mReceiver
    this.mXform = this.mReceiver.getXform();    // accomplished by copying the Xform and texture
}
gEngine.Core.inheritPrototype(ShadowReceiverRenderable, SpriteRenderable);
    
// <editor-fold desc="support for setting and removing casters ">
ShadowReceiverRenderable.prototype.addShadowCaster = function (lgtRenderable) {
    var c = new ShadowCasterRenderable(lgtRenderable, this.mReceiver);
    this.mShadowCaster.push(c);
};
// for now, cannot remove shadow casters
// </editor-fold>

// <editor-fold  desc="shadow drawing support">
ShadowReceiverRenderable.prototype.draw = function (aCamera) {
    var c;
    
    // draw receiver as a regular renderable
    this.mReceiver.draw(aCamera);
    
    // now switch on stencil and swich on the pixels that corresponds
    // to the mReceiver
    this._shadowRecieverStencilOn();
    SpriteRenderable.prototype.draw.call(this, aCamera);
    this._shadowRecieverStencilOff();
    
    // now draw shadow color to the pixels in the stencil that are switched on
    for (c = 0; c < this.mShadowCaster.length; c++) {
        this.mShadowCaster[c].draw(aCamera);
    }
    
    // switch off stencil checking
    this._shadowRecieverStencilDisable();
};
// </editor-fold>