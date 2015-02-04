/* 
 *
 */
function MotionPlatform(cx, cy, w, h, min, max, speed)
{
    this._mMinPos = min;
    this._mMaxPos = max;
    this._mCurrentSpeed = speed;
    PlatformObject.call(this, cx, cy, w, h);
}
gEngine.Core.InheritPrototype(MotionPlatform, PlatformObject);

MotionPlatform.prototype.CreateRenderable = function()
{
    var renderableObj = new SpriteRenderable(gMyGame.GameState.GetSpriteShader(), gMyGame.GameState.GetPlatformTexture());
    renderableObj.SetTextureCoordinate(0, 1.0, 0.02, (50/256)-0.02);
    return renderableObj;
};

MotionPlatform.prototype.Update = function(hero)
{
    PlatformObject.prototype.Update.call(this, hero);
    this._SetCurrentValue( this._GetCurrentValue() + this._mCurrentSpeed );
    
    if (this._GetCurrentValue() < this._mMinPos) {
        this._SetCurrentValue(this._mMinPos);
        this._mCurrentSpeed = - this._mCurrentSpeed;
    } else if (this._GetCurrentValue() > this._mMaxPos) {
            this._SetCurrentValue(this._mMaxPos);
            this._mCurrentSpeed = - this._mCurrentSpeed;
        }
};

MotionPlatform.prototype._GetCurrentValue = function()
{
    console.error("MotionPlatform: pure virture _CurrentValue called!");
};

MotionPlatform.prototype._SetCurrentValue = function()
{
    console.error("MotionPlatform: pure virture _SetCurrentValue called!");
};


// ------------- horizontal motion
function MotionHPlatform(cx, cy, size, min, max, speed)
{
    MotionPlatform.call(this, cx, cy, size, _gPlatformThickness, min, max, speed);
}
gEngine.Core.InheritPrototype(MotionHPlatform, MotionPlatform);
MotionHPlatform.prototype._GetCurrentValue = function()
{
    return this.GetXform().GetPosition()[0];
};

MotionHPlatform.prototype._SetCurrentValue = function(v)
{
    this.GetXform().GetPosition()[0] = v;
};

//-------------- the vertical version
function MotionVPlatform(cx, cy, size, min, max, speed)
{
    MotionPlatform.call(this, cx, cy, _gPlatformThickness, size, min, max, speed);
}
gEngine.Core.InheritPrototype(MotionVPlatform, MotionPlatform);
MotionVPlatform.prototype._GetCurrentValue = function()
{
    return this.GetXform().GetPosition()[1];
};

MotionVPlatform.prototype._SetCurrentValue = function(v)
{
    this.GetXform().GetPosition()[1] = v;
};
