/*
 * File: ShadowCasterRenderable.js
 * Renders a colored image representing the shadowCaster on the receiver
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Renderable, SpriteRenderable, Light, vec3 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// shadowCaster:    must be at least a LightRenderable
// shadowReceiver:  must be at least a SpriteRenderable
function ShadowCasterRenderable (shadowCaster, shadowReceiver) {
    SpriteRenderable.call(this, shadowCaster.getTexture());
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getShadowCasterShader());
    
    this.mShadowCaster = shadowCaster;      // must be at least a LightRenderable
    this.mShadowReceiver = shadowReceiver;   // must be at least a SpriteRenderable
}
gEngine.Core.inheritPrototype(ShadowCasterRenderable, SpriteRenderable);
    

ShadowCasterRenderable.prototype._setShadowOffset = function(aLight) {
    // Remember z-values determine front/back
    //      The camera is located a z=some value, looking towards z=0
    //      The larger the z-value, the closer to the camera
    //      If z > camera.Z, will not be visile
    
    // if caster is closer to the eye than the light, no shadow from the caster
    if ()
    // if caster is closer to the light than receiver, no shadow
     
    
    // vector from light to receiver
    var lgtToReceiver = vec3.create();
    var lgtToCaster = vec3.create();
    if (aLight.getLightType() === Light.eLightType.eDirectionalLight) {
        vec3.copy(lgtToReceiver, aLight.getDirection());
        vec3.copy(lgtToCaster, aLight.getDirection());
    } else {    
        vec3.sub(lgtToReceiver, this.mShadowReceiver.getXform().getPosition(), aLight.getPosition());
        vec3.sub(lgtToCaster, this.mShadowCaster.getXform().getPosition(), aLight.getPosition());
    }
    var dot = vec3.dot(lgtToCaster, lgtToReceiver);
    
    if (dot < 0) {
        //  receiver and caster on different sides of the light
        return false;
    }
    
    var distToCaster = vec3.length(lgtToCaster);
    var distToReceiver = vec3.length(lgtToReceiver);
    
    if (distToCaster > distToReceiver)
};

ShadowCasterRenderable.prototype.draw = function(aCamera) {
    // loop through each light in this array, if shadow casting on the light is on
    // compute the proper shadow offset
    var l, lgt;
    for (l = 0; l < this.mShadowCaster.numLights(); l++) {
        lgt = this.mShadowCaster.getLightAt(l);
        if (lgt.isLightCastShadow()) {
            if (this._setShadowOffset(lgt)) {
                SpriteRenderable.prototype.draw.call(this, aCamera);
            }
        }
    }
};
