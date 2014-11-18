/* 
 * A base class for logic.
 */
function LogicComponent(transform)
{
    this.mTransform = transform;
}

LogicComponent.prototype.getTransform = function()
{
    return this.mTransform;
};

LogicComponent.prototype.setTransform = function(transform)
{
    this.mTransform = transform;
};

LogicComponent.prototype.update = function()
{
    
};
