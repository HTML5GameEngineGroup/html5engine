/*
 * File: ShadowReceiverRenderable.js
 * ShadowReceiverRenderable support's stencil settings
 */

/*jslint node: true, vars: true, white: true */
/*global ShadowReceiverRenderable, gEngine */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/* 
* GL Stencil settings to support rendering to and checking of 
* the stencil buffer
*/
ShadowReceiverRenderable.prototype._shadowRecieverStencilOn = function () {
        var gl = gEngine.Core.getGL();
        gl.enable(gl.STENCIL_TEST);
        gl.colorMask(false, false, false, false);
//gl.depthMask(false);
        gl.stencilFunc(gl.NEVER, this.kShadowStencilBit, this.kShadowStencilMask);
        gl.stencilOp(gl.REPLACE,gl.KEEP, gl.KEEP);
        gl.stencilMask(this.kShadowStencilMask);
        gl.clear(gl.STENCIL_BUFFER_BIT);
    };
    
ShadowReceiverRenderable.prototype._shadowRecieverStencilOff = function () {
    var gl = gEngine.Core.getGL();
    // gl.depthMask(gl.TRUE);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
//        gl.colorMask( gl.FALSE, gl.FALSE, gl.FALSE, gl.FALSE);
//        gl.stencilMask(0x00);
    gl.stencilFunc(gl.EQUAL, this.kShadowStencilBit, this.kShadowStencilMask);
    gl.colorMask( true, true, true, true );
};
    
ShadowReceiverRenderable.prototype._shadowRecieverStencilDisable = function () {
    var gl = gEngine.Core.getGL();
    gl.disable(gl.STENCIL_TEST); 
};