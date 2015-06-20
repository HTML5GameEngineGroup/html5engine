/* File: Particle.js 
 *
 * Creates and initializes one particle
 */

/*jslint node: true, vars: true */
/*global gEngine, ParticleGameObject, ParticleRenderable, VerletParticle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Particle(atX, atY) {
    this.kTexture = "assets/particle.png";
    this.mParticle = new ParticleRenderable(this.kTexture);

    this.mParticle.setColor([1, 0, 0, 1]);
    this.mParticle.getXform().setPosition(atX, atY);
    var r = 3.5 + Math.random() * 2.5;
    this.mParticle.getXform().setSize(r, r);
                                // show each element for mAnimSpeed updates
    ParticleGameObject.call(this, this.mParticle, 30 + Math.random() * 200);

    var p = new VerletParticle(this.getXform().getPosition());
    // p.setDrawBounds(true);
    this.setPhysicsComponent(p);
    var fr = 2.5 + Math.random();
    var fg = 0.2 + 0.1 * Math.random();
    var fb = 0.1 + 0.1 * Math.random();
    this.setFinalColor([fr, fg, fb, 0.6]);
    
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.setForce([fx, fy]);
    
    this.setSizeDelta(0.98);
}
gEngine.Core.inheritPrototype(Particle, ParticleGameObject);