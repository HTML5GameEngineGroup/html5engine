/*
 * File: MyGame_lightControl: support UI manipulation of light parameters
 */

/*jslint node: true, vars: true */
/*global gEngine, MyGame, vec3 */
/* find out more about jslint: http://www.jslint.com/lint.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._lightControl = function () {
    var delta = 0.2;
    var msg = "";
    this._animateLight();
    // player select which light to work 
    this._selectLight();

    // manipulate the light
    var lgt = this.mGlobalLightSet.getLightAt(this.mLgtIndex);
    var p = lgt.getPosition();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        lgt.setXPos(p[0] - delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        lgt.setXPos(p[0] + delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        lgt.setYPos(p[1] + delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        lgt.setYPos(p[1] - delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        lgt.setZPos(p[2] + delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        lgt.setZPos(p[2] - delta);
    }

    // radius
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
        lgt.setInner(lgt.getInner() + delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.V)) {
        lgt.setInner(lgt.getInner() - delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.B)) {
        lgt.setOuter(lgt.getOuter() + delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.N)) {
        lgt.setOuter(lgt.getOuter() - delta);
    }

    // Intensity
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.K)) {
        lgt.setIntensity(lgt.getIntensity() + delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.L)) {
        lgt.setIntensity(lgt.getIntensity() - delta);
    }

    // on/off
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) {
        lgt.setLightTo(!lgt.isLightOn());
    }
    msg = "On(" + lgt.isLightOn() + ") " +
          this._printVec3("P", p) +
          "R(" + lgt.getInner().toPrecision(3) + "/" + lgt.getOuter().toPrecision(3) + ") " +
          "I(" + lgt.getIntensity().toPrecision(3) + ")";

    return msg;
};

MyGame.prototype._selectLight = function () {
    // select which light to work with
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Zero)) {
        this.mLgtIndex = 0;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.One)) {
        this.mLgtIndex = 1;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)) {
        this.mLgtIndex = 2;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)) {
        this.mLgtIndex = 3;
    }
};

MyGame.prototype._printVec3 = function (msg, p) {
    return msg + "(" + p[0].toPrecision(2) + " " + p[1].toPrecision(2) + " " + p[2].toPrecision(2) + ") ";
};

MyGame.prototype._animateLight = function () {
    var radius = 10;
    var delta = 0.01; // in radians

    // spin light #3 (the spot light)
    var nx = radius * Math.sin(this.mLgtRotateTheta);
    var ny = radius * Math.cos(this.mLgtRotateTheta);
    this.mLgtRotateTheta += delta;
    if (this.mLgtRotateTheta > (2 * Math.PI)) {
        this.mLgtRotateTheta -= (2 * Math.PI);
    }

    var lgt = this.mGlobalLightSet.getLightAt(3);
    var p = lgt.getPosition();
    var pt = vec3.fromValues(p[0] + nx, p[1] + ny, -2);
    vec3.sub(pt, pt, p);
    lgt.setDirection(pt);

    // scan light #1, the directional light
    lgt = this.mGlobalLightSet.getLightAt(1);
    var d = lgt.getDirection();
    p = lgt.getPosition();
    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
        var x = this.mCamera.mouseWCX();
        var y = this.mCamera.mouseWCY();
        d[0] = 0.1 * (x - p[0]);
        d[1] = 0.1 * (y - p[1]);
    }
};