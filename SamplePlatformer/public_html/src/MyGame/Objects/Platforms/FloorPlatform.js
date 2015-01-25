/* 
 *
 */
function FloorPlatform(cx, cy, w, h)
{
    PlatformObject.call(this, cx, cy, w, h);
}
gEngine.Core.InheritPrototype(FloorPlatform, PlatformObject);

FloorPlatform.prototype.CreateRenderable = function()
{
    var renderableObj = new RenderableObject(gMyGame.GameState.GetRedShader());
    return renderableObj;
};