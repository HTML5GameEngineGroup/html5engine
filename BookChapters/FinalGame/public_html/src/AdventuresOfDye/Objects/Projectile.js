"use strict";

function Projectile(atX, atY, velocity, radius) {
    this.kTexture = "assets/EMPPulse.png";
    this.kSpeed = 0.2;
    this.mParticle = new ParticleRenderable(this.kTexture);

    this.mParticle.setColor([1, 1, 1, 1]);
    this.mParticle.getXform().setPosition(atX, atY);
    this.mParticle.getXform().setSize(radius, radius);
                                
    ParticleGameObject.call(this, this.mParticle, 500);
    this.setSpeed(this.kSpeed);
    this.setCurrentFrontDir(velocity);
    
    var rigidShape = new RigidCircle(this.getXform(), radius);
    rigidShape.setMass(0.1);
    rigidShape.setGravity([0, 0]);
    this.setPhysicsComponent(rigidShape);
    
    this.setSizeDelta(1);
}
gEngine.Core.inheritPrototype(Projectile, ParticleGameObject);


