/* 
 * These guys have constant thickness
 */
function StaticVPlatform(cx, cy, size)
{
    PlatformObject.call(this, cx, cy, _gPlatformThickness, size);
}
gEngine.Core.InheritPrototype(StaticVPlatform, StaticPlatform);