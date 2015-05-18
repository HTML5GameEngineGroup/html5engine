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
    
    this.kCasterMaxScale = 3;  // maximum size a caster will be scaled
    this.kVerySmall = 0.001;  // 
}
gEngine.Core.inheritPrototype(ShadowCasterRenderable, SpriteRenderable);
    

ShadowCasterRenderable.prototype._setShadowOffset = function(aLight) {
    // Remember Height (or z-value) determine front/back
    //      The camera is located a z=some value, looking towards z=0
    //      The larger the z-value (larger height value) the closer to the camera
    //      If z > camera.Z, will not be visile
    
    // For now, supports casting to the back of a receiver (if receiver is transparent)
    // then you can see shadow from the camera
    // this means, even when:
    //      1. caster is lower than receiver
    //      2. light is lower than the caster
    // it is still possible to cast shadow on receiver
           
    // vector from light to receiver
    var lgtToReceiver = vec3.create();
    var lgtToCaster = vec3.create();
    if (aLight.getLightType() === Light.eLightType.eDirectionalLight) {
        vec3.copy(lgtToReceiver, aLight.getDirection());
        vec3.copy(lgtToCaster, aLight.getDirection());
    } else {    
        vec3.sub(lgtToReceiver, this.mShadowReceiver.getXform().get3DPosition(), aLight.getPosition());
        vec3.sub(lgtToCaster, this.mShadowCaster.getXform().get3DPosition(), aLight.getPosition());
    }
    
    if ((lgtToReceiver[2] < this.kVerySmall) || (lgtToCaster[2] < this.kVerySmall)) {
        // alomst the same height, can't see shadow
        return false;
    }
    
    var dot = vec3.dot(lgtToCaster, lgtToReceiver);
    
    if (dot <= 0) {
        //  receiver and caster on different sides of the light
        return false;
    }
    
    var distToCaster = vec3.length(lgtToCaster);
    var distToReceiver = vec3.length(lgtToReceiver);
    
    if (distToCaster > distToReceiver) {
        return false;  // caster is further away from light than receiver
    }
    
    var scale = 1;
    var offset = vec3.fromValues(0, 0, 0);
    var t = 0;
    if (distToCaster < this.kVerySmall) { // caster very close to the light source
        scale = this.kCasterMaxScale;  // maximum will be scaled
        offset = lgtToReceiver;
    } else {
        // Let R = distToReceiver 
        //     C = distToCaster
        // approximate scale by:
        //     (R/C) *  (1 / cos-Theta)
        // where theta = angle between lgtToCaster and lgtToReceiver, and
        //      cos-theta = dot / (R*C)
        // so,
        //     (1/cost-Theta) = (R * C) / dot
        // so,
        //  scale = (R/C) * (R*C)  / dot
        //        =  (R*R) / dot
        scale = distToReceiver * distToReceiver / dot;
        
        // now compute offet of caster
        // 1. first to normalize lgtToCaster
        vec3.scale(lgtToCaster, lgtToCaster, 1/distToCaster);
        
        // 2. signed-distance to travel along lgtToCaster to reach the Height of receiver
        t = (this.mShadowReceiver.getXform().getHeight() - this.mShadowCaster.getXform().getHeight()) / lgtToCaster[2];
        
        // 3. offset required to reach receiver's height 
        vec3.scaleAndAdd(offset, this.mShadowCaster.getXform().get3DPosition(), lgtToCaster, t);
    }
    vec3.add(offset, offset, this.mShadowCaster.getXform().get3DPosition());
    this.getXform().setRotationInRad( this.mShadowCaster.getXform().getRotationInRad());
    this.getXform().setPosition(offset[0], offset[1]);
    this.getXform().setHeight(offset[2]);
    this.getXform().setWidth(this.mShadowCaster.getXform().getWidth() * scale);
    this.getXform().setHeight(this.mShadowCaster.getXform().getHeight() * scale);
    this.setTexture(this.mShadowCaster.getTexture());
    return true;
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
