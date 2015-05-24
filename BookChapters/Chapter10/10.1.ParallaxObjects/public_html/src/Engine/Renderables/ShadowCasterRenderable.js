/*
 * File: ShadowCasterRenderable.js
 * Renders a colored image representing the shadowCaster on the receiver
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Renderable, SpriteRenderable, Light, vec3, Math */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// shadowCaster:    must be at least a LightRenderable
// shadowReceiver:  must be at least a SpriteRenderable
function ShadowCasterRenderable (shadowCaster, shadowReceiver) {
    SpriteRenderable.call(this, shadowCaster.getTexture());
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getShadowCasterShader());
    
    this.mShadowCaster = shadowCaster;      // must be at least a LightRenderable
    this.mShadowReceiver = shadowReceiver;   // must be at least a SpriteRenderable
    
    this.kCasterMaxScale = 3;   // maximum size a caster will be scaled
    this.kVerySmall = 0.001;    // 
    this.kDistanceFudge = 0.01; // Ensure that the shadow caster geometry will not be on the exact same depth as the receiver
    this.kReceiverDistanceFudge = 0.6; // De-Emphasize the distance between Caster and Receiver, this slows down the size increase of the caster geometry
    
    this.setShadowColor([0, 0, 0, 0.2]);
}
gEngine.Core.inheritPrototype(ShadowCasterRenderable, SpriteRenderable);


ShadowCasterRenderable.prototype.setShadowColor = function (c) {
    // mColor (defined in Renderable) will be used as the color of the shadow!
    this.setColor(c);
};

ShadowCasterRenderable.prototype._computeShadowGeometry = function(aLight) {
    // Remember that z-value determines front/back
    //      The camera is located a z=some value, looking towards z=0
    //      The larger the z-value (larger height value) the closer to the camera
    //      If z > camera.Z, will not be visile
    
    // supports casting to the back of a receiver (if receiver is transparent)
    // then you can see shadow from the camera
    // this means, even when:
    //      1. caster is lower than receiver
    //      2. light is lower than the caster
    // it is still possible to cast shadow on receiver
           
    // vector from light to caster
    var lgtToCaster = vec3.create();
    var lgtToReceiverZ;
    var receiverToCasterZ;
    var distToCaster, distToReceiver;  // measured along the lgtToCaster vector
    var scale;
    var offset = vec3.fromValues(0, 0, 0);
    
    receiverToCasterZ = this.mShadowReceiver.getXform().getZPos() - this.mShadowCaster.getXform().getZPos();
    if (aLight.getLightType() === Light.eLightType.eDirectionalLight) {    
        if (((Math.abs(aLight.getDirection())[2]) < this.kVerySmall) || ((receiverToCasterZ * (aLight.getDirection())[2]) < 0)) {
            return false;   // direction light casting side way or
                            // caster and receiver on different sides of light in Z
        }
        vec3.copy(lgtToCaster, aLight.getDirection());
        vec3.normalize(lgtToCaster, lgtToCaster);
        
        distToReceiver = Math.abs(receiverToCasterZ / lgtToCaster[2]);  // distant measured along lgtToCaster
        scale = Math.abs(1/lgtToCaster[2]);
    } else {    
        vec3.sub(lgtToCaster, this.mShadowCaster.getXform().get3DPosition(), aLight.getPosition());
        lgtToReceiverZ = this.mShadowReceiver.getXform().getZPos() - (aLight.getPosition())[2];
        
        if ((lgtToReceiverZ * lgtToCaster[2]) < 0) {
            return false;  // caster and receiver on different sides of light in Z
        }

        if ((Math.abs(lgtToReceiverZ) < this.kVerySmall) || ((Math.abs(lgtToCaster[2]) < this.kVerySmall))) {
            // alomst the same Z, can't see shadow
            return false;
        }

        distToCaster = vec3.length(lgtToCaster);
        vec3.scale(lgtToCaster, lgtToCaster, 1/distToCaster);  // normalize lgtToCaster
        
        distToReceiver = Math.abs(receiverToCasterZ / lgtToCaster[2]);  // distant measured along lgtToCaster
        scale = (distToCaster + (distToReceiver * this.kReceiverDistanceFudge)) / distToCaster;
    }
    vec3.scaleAndAdd(offset, this.mShadowCaster.getXform().get3DPosition(), lgtToCaster, distToReceiver + this.kDistanceFudge);
        
    this.getXform().setRotationInRad( this.mShadowCaster.getXform().getRotationInRad());
    this.getXform().setPosition(offset[0], offset[1]);
    this.getXform().setZPos(offset[2]);
    this.getXform().setWidth(this.mShadowCaster.getXform().getWidth() * scale);
    this.getXform().setHeight(this.mShadowCaster.getXform().getHeight() * scale);
    
    return true;
};

ShadowCasterRenderable.prototype.draw = function(aCamera) {
    // if caster is a Sprite or SpriteAnimate, make sure to copy its sprite element settings
    var texCoord;
    if (this.mShadowCaster.getElementUVCoordinateArray !== undefined) {
        texCoord = this.mShadowCaster.getElementUVCoordinateArray();
        this.setElementUVCoordinate(
            texCoord[SpriteRenderable.eTexCoordArray.eLeft],
            texCoord[SpriteRenderable.eTexCoordArray.eRight],
            texCoord[SpriteRenderable.eTexCoordArray.eBottom],
            texCoord[SpriteRenderable.eTexCoordArray.eTop]);
    }
    // loop through each light in this array, if shadow casting on the light is on
    // compute the proper shadow offset
    var l, lgt;
    for (l = 0; l < this.mShadowCaster.numLights(); l++) {
        lgt = this.mShadowCaster.getLightAt(l);
        if (lgt.isLightOn() && lgt.isLightCastShadow()) {
            if (this._computeShadowGeometry(lgt)) {
                this.mShader.setLight(lgt);
                SpriteRenderable.prototype.draw.call(this, aCamera);
            }
        }
    }
};
