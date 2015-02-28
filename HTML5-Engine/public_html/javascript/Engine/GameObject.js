/* 
 *
 */
function GameObject(transform, logicComponent, renderableObj)
{
    this.mTransform = transform;
    this.mLogic = logicComponent;
    this.mRenderComponent = renderableObj;
}

GameObject.prototype.getTransform = function(){return this.mTransform;};

GameObject.prototype.update = function(){this.mLogic.update();};

GameObject.prototype.addToDrawSet = function(){this.mRenderComponent.addToDrawSet();};

GameObject.prototype.hasCollidedWithGameObj = function(otherGameObj)
{
    var thisPos = this.mTransform.getPosition();
    var thisSize = this.mTransform.getScale();
    var otherPos = otherGameObj.mTransform.getPosition();
    var otherSize = otherGameObj.mTransform.getScale();
    
    return   thisPos[0]               < otherPos[0] + otherSize[0] &&
             thisPos[0] + thisSize[0] > otherPos[0]               &&
             thisPos[1]               < otherPos[1] + otherSize[1]&&
             thisPos[1] + thisSize[1] > otherPos[1];
};


