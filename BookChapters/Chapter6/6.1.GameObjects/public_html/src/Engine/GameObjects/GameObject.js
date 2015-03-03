/* 
 *
 */
function GameObject(renderableObj) {
    this._mRenderComponent = renderableObj;
};

GameObject.prototype.GetXform = function(){return this._mRenderComponent.GetXform();};

GameObject.prototype.update = function(){};

GameObject.prototype.GetRenderable = function() { return this._mRenderComponent; }

GameObject.prototype.Draw = function(aCamera){
    this._mRenderComponent.Draw(aCamera);
};
