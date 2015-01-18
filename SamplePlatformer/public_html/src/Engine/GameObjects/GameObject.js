/* 
 *
 */
function GameObject(renderableObj)
{
    this._mRenderComponent = renderableObj;
}

GameObject.prototype.GetXform = function(){return this._mRenderComponent.GetXform();};

GameObject.prototype.update = function(){};

GameObject.prototype.Draw = function(){this._mRenderComponent.Draw();};

GameObject.prototype.HasCollidedWithGameObj = function(otherGameObj)
{
    return this.GetXform().HasTouched(otherGameObj.GetXform());
};