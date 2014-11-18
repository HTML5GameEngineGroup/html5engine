/* 
 * 
 */
function Sprite(transform, shaderName, spriteTextureName, spritesheetInfo)
{   
    Renderable2DObject.call(this, transform, shaderName, spriteTextureName);
    this.mCurrentFrame = 0;
    this.mSpritesheetInfo = spritesheetInfo;
    this.mTotalTicks = 0;
    this.mCurrentTick = 0;
}

Sprite.prototype = Object.create(Renderable2DObject.prototype);

Renderable2DObject.prototype.getCurrentFrame = function(){return this.mCurrentFrame;};
        
Renderable2DObject.prototype.setCurrentFrame = function(currentFrame){this.mCurrentFrame = currentFrame;};

Renderable2DObject.prototype.getTicksPerFrame = function(){return this.mTotalTicks;};

Renderable2DObject.prototype.setTicksPerFrame = function(ticks){this.mTotalTicks = ticks;};

Renderable2DObject.prototype.getCurrentTick = function(){return this.mCurrentTick;};

Renderable2DObject.prototype.setCurrentTick = function(tick){this.mCurrentTick = tick;};

Renderable2DObject.prototype.getSpritesheetInfo = function(){return this.mSpritesheetInfo;};
        