/* 
 *
 */
function TexturedPlatform()
{
    var renderableObj = new SpriteObject(gMyGame.GameState.GetSpriteShader(), gMyGame.GameState.GetPlatformTexture());
    renderableObj.SetTextureCoordinate(0, 1.0, 0.02, (50/256)-0.02);
    PlatformObject.call(this, renderableObj);
}
gEngine.Core.InheritPrototype(TexturedPlatform, PlatformObject);