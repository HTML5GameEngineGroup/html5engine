/*
 * File: LineRenderable.js
 *  
 * Renderable objects for lines
 */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// p1, p2: either both there, or none
function LineRenderable(x1, y1, x2, y2)
{
    Renderable.call(this);
    Renderable.prototype.SetColor.call(this, [0, 0, 0, 1]);  
    Renderable.prototype._SetShader.call(this, gEngine.DefaultResources.GetLineShader());
    
    this._mPointSize = 1;
    this._mDrawVertices = false;
    this._mShowLine = true;
    
    this._mP1 = vec2.fromValues(0, 0);
    this._mP2 = vec2.fromValues(0, 0);
    
    if (x1 !== "undefined") 
        this.SetVertices(x1, y1, x2, y2);
};
gEngine.Core.InheritPrototype(LineRenderable, Renderable);

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
LineRenderable.prototype.Draw = function(aCamera) {
    this._mShader.SetPointSize(this._mPointSize);
    // Draw line instead of triangle!
    var gl = gEngine.Core.GetGL();    
    this._mShader.ActivateShader(this._mColor, aCamera);  // always activate the shader first!
    
    var sx = this._mP1[0] - this._mP2[0];
    var sy = this._mP1[1] - this._mP2[1];
    var cx = this._mP1[0] - sx/2;
    var cy = this._mP1[1] - sy/2;
    var xf = this.GetXform();
    xf.SetSize(sx, sy);
    xf.SetPosition(cx, cy);
    
    this._mShader.LoadObjectTransform(this._mXform.GetXform());
    if (this._mShowLine)
        gl.drawArrays(gl.LINE_STRIP, 0, 2);
    if (!this._mShowLine || this._mDrawVertices)
        gl.drawArrays(gl.POINTS, 0, 2);
};

LineRenderable.prototype.SetDrawVertices = function(s) { this._mDrawVertices = s; }
LineRenderable.prototype.SetShowLine = function(s) { this._mShowLine = s; };
LineRenderable.prototype.SetPointSize = function(s) { this._mPointSize = s; };

LineRenderable.prototype.SetVertices = function(x1, y1, x2, y2) { 
    this.SetFirstVertex(x1, y1);
    this.SetSecondVertex(x2, y2);
};

LineRenderable.prototype.SetFirstVertex = function(x, y) { 
    this._mP1[0] = x;
    this._mP1[1] = y;
};

LineRenderable.prototype.SetSecondVertex = function(x, y) { 
    this._mP2[0] = x;
    this._mP2[1] = y;
};

//--- end of Public Methods
//</editor-fold>