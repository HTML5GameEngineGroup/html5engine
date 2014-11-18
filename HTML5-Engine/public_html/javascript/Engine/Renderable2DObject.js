function Renderable2DObject(transform, shaderName, textureName)
{
    this.mShader = shaderName;
    this.mTextureString = textureName;    
    this.mTransformMatrix = transform;

    this.addToAutoDrawSet();
}

Renderable2DObject.prototype.getShaderName = function() {return this.mShader;};
        
Renderable2DObject.prototype.getTextureName = function() {return this.mTextureString;};

Renderable2DObject.prototype.getTransform = function() {return this.mTransformMatrix;};

Renderable2DObject.prototype.addToAutoDrawSet = function()
{
    EngineCore.Resources.addToDrawSet(this);
};

Renderable2DObject.prototype.removeFromAutoDrawSet = function()
{
    EngineCore.Resources.removeFromDrawSet(this);
};



