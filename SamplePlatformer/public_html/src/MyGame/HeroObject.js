/* 
 *
 */
function HeroObject(renderableObj)
{
    GameObject.call(this, renderableObj);
    
    this._mShouldFall = true;
    this._mVelocity = vec2.fromValues(0, 0);
    
    this._mGravity = 0.001;
    this._mFly = 0.01;
  
}
gEngine.Core.InheritPrototype(HeroObject, GameObject);

HeroObject.prototype.Update = function() {
    var xf = this.GetXform();
    
    this._MoveXform(gEngine.Input.LEFT,
               gEngine.Input.RIGHT,
               gEngine.Input.UP,
               gEngine.Input.DOWN);
               
     if (gEngine.Input.IsKeyDown(gEngine.Input.SPACE)) {
         this._mVelocity[1] += this._mFly;
         this.SetShouldFall(true);
     }
     
     if (this._mShouldFall) {
        this._mVelocity[1] -= this._mGravity;
        this.GetXform().IncYPosBy(this._mVelocity[1]);
     }
};

HeroObject.prototype.SetShouldFall = function(b) {
    this._mShouldFall = b;
    if (!b)
        this._mVelocity[1] = 0;
};

HeroObject.prototype.SetVelocity = function(v) {
    this._mVelocity = v;
};

HeroObject.prototype._MoveXform = function(left, right, up, down)
{
    var xform = this.GetXform();
    var delta = 0.5;
    if (gEngine.Input.IsKeyDown(left)) {
        xform.IncXPosBy(-delta);
    }
    if (gEngine.Input.IsKeyDown(right)) {
        xform.IncXPosBy(delta);
    }
    
    if (gEngine.Input.IsKeyDown(up)) {
        xform.IncYPosBy(delta);
        this.SetShouldFall(true);
    }
    if (gEngine.Input.IsKeyDown(down)) {
        xform.IncYPosBy(-delta);
    } 
};