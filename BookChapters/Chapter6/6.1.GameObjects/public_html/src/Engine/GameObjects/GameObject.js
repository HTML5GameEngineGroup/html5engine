/* 
 *
 */
function GameObject(renderableObj) {
    this._mRenderComponent = renderableObj;
};

GameObject.prototype.GetXform = function(){return this._mRenderComponent.GetXform();};

GameObject.prototype.update = function(){};

GameObject.prototype.Draw = function(vpMatrix){
    this._mRenderComponent.Draw(vpMatrix);
};
