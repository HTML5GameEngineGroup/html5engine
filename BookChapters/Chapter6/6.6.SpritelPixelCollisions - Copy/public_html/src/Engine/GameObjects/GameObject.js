/* 
 *
 */
function GameObject(renderableObj) {
    this._mRenderComponent = renderableObj;
    this._mVisible = true;
    this._mObjFrontDir = vec2.fromValues(0, 1);   // this is the default front direction of the object
    this._mCurrentFrontDir = vec2.fromValues(0, 1);  // this is the current front direction of the object
    this._mSpeed = 0;
};
GameObject.prototype.GetXform = function(){ return this._mRenderComponent.GetXform();};
GameObject.prototype.GetBBox = function() { 
    var xform = this.GetXform();
    var b = new BoundingBox(xform.GetPosition(), xform.GetWidth(), xform.GetHeight());
    return b;
};
GameObject.prototype.SetVisibility = function(f){ this._mVisible = f;};
GameObject.prototype.IsVisible = function(){ return this._mVisible;};

GameObject.prototype.SetSpeed = function(s){ this._mSpeed = s;};
GameObject.prototype.GetSpeed = function(){ return this._mSpeed;};
GameObject.prototype.IncSpeedBy = function(delta){ this._mSpeed += delta;};

GameObject.prototype.SetObjFrontDir = function(f) { vec2.normalize(this._mObjFrontDir, f);};
GameObject.prototype.GetObjFrontDir = function() { return this._mObjFrontDir;};

GameObject.prototype.SetCurrentFrontDir = function(f){ vec2.normalize(this._mCurrentFrontDir, f);};
GameObject.prototype.GetCurrentFrontDir = function(){ return this._mCurrentFrontDir;};

GameObject.prototype.GetRenderable = function() { return this._mRenderComponent; }

// Orientate the entire object to point towards point p
// will rotate Xform() accordingly
GameObject.prototype.RotateObjPointTo = function(p, rate){
    var dir = [];
    vec2.sub(dir, p, this.GetXform().GetPosition());
    var len = vec2.length(dir);
    if (len < Number.MIN_VALUE)
        return; // we are there.
    vec2.scale(dir, dir, 1/len);
    
    // now compute the angle to rotate
    var fdir = this.GetCurrentFrontDir();
    var cosTheta = vec2.dot(dir, fdir);
    
    if (cosTheta > 0.999999) // pointing very close to exactly 
        return;
    
    // now compute if rotate towards the left, or right
    var dir3d = vec3.fromValues(dir[0], dir[1], 0);
    var f3d = vec3.fromValues(fdir[0], fdir[1], 0);
    var r3d = [];
    vec3.cross(r3d, f3d, dir3d);

    var rad = Math.acos(cosTheta);  // radian to roate
    if (r3d[2] < 0)
        rad = -rad;
    
    rad *= rate;  // actual angle need to rotate from Obj's front
    vec2.rotate(this.GetCurrentFrontDir(), this.GetCurrentFrontDir(), rad);
    this.GetXform().IncRotationByRad(rad);
};

GameObject.prototype.Update = function() {
    // simple default behavior
    var pos = this.GetXform().GetPosition();
    vec2.scaleAndAdd(pos, pos, this.GetCurrentFrontDir(), this.GetSpeed());
};

GameObject.prototype.Draw = function(vpMatrix){
    if (this.IsVisible())
        this._mRenderComponent.Draw(vpMatrix);
};
