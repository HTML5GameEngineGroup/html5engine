/* 
 * File: ShadowCasterShader.js
 * Subclass from SpriteShader
 *          Supports rendering the shadow caster
 */
/*jslint node: true, vars: true */
/*global gEngine, SpriteShader, ShaderLightAtIndex, vec4 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

//<editor-fold desc="constructor">
// constructor 
function ShadowCasterShader(vertexShaderPath, fragmentShaderPath) {
    // Callsuper class constructor
    SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor
}
gEngine.Core.inheritPrototype(ShadowCasterShader, SpriteShader);
//</editor-fold>

// <editor-fold desc="Public Methods">


//</editor-fold>