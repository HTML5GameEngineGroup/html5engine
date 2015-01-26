/*
 * File: BeginScene.js 
 * This is the first Scene of our game
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Constructor
function BeginLevel()
{
    // constant string
    this._kUserPrompt = "Your Choice?";
    
    // Simple font object and its shader
    this._mFontShader = null;
    this._mWelcomeMsg = null;
    this._mSimpleColorMsg = null;
    this._mTextureSceneMsg = null;
    this._mUserMsg = null;
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // Initialize the game
    this.Initialize();
};
gEngine.Core.InheritPrototype(BeginLevel, Scene);  // subclass from Scene

BeginLevel.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(4, 3),   // Position at center
            8,                       // width of camera (4:3 ration says, height will be 6)
            [0, 0, 640, 480]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.9, 1]);
            // sets the background to light gray
        
    // Step  B: create the shaders   
    this._mFontShader = new SpriteShader(
            "shaders/TextureVS.glsl",
            "shaders/TextureFS.glsl");    
    
    // Step  C: Create the renderable objects:
    this._mMessage = new TextObject(this._mFontShader, "Welcome!");
    this._mMessage.GetXform().SetSize(4, 1);
    this._mMessage.GetXform().SetPosition(2, 5);
    
    this._mSimpleColorMsg = new TextObject(this._mFontShader, "Type 1: to choose the SimpleColor Level!");
    this._mSimpleColorMsg.GetXform().SetSize(4.2, 0.3);
    this._mSimpleColorMsg.GetXform().SetPosition(2, 3.5);
    
    this._mTextureSceneMsg = new TextObject(this._mFontShader, "Type 2: to choose the Texture Level!");
    this._mTextureSceneMsg.GetXform().SetSize(3.8, 0.3);
    this._mTextureSceneMsg.GetXform().SetPosition(2, 3);
    
    this._mUserMsg = new TextObject(this._mFontShader,  this._kUserPrompt);
    this._mUserMsg.GetXform().SetSize(1.5, 0.4);
    this._mUserMsg.GetXform().SetPosition(2, 1);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BeginLevel.prototype.Draw = function() 
{   
    gEngine.Core.ClearCanvas([0.3, 0.3, 0.3, 1.0]); // clear to dark gray
    
    // Draw with mCamera
    this._mCamera.BeginDraw();
    
    // Activates textured shader and draw the texturedSq
        this._mMessage.Draw(this._mCamera.GetVPMatrix());
        this._mSimpleColorMsg.Draw(this._mCamera.GetVPMatrix());
        this._mTextureSceneMsg.Draw(this._mCamera.GetVPMatrix());
        this._mUserMsg.Draw(this._mCamera.GetVPMatrix());

};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function! 
BeginLevel.prototype.Update = function()
{
    // Move the textured square and the text
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Zero)) {
        this._mUserMsg.SetText(this._kUserPrompt + " 0 (not legal)!");
        this._mUserMsg.GetXform().SetWidth(3.2);
    }
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.One)) {
        this._mUserMsg.SetText(this._kUserPrompt + " 1 => Simple Color");
        this.LoadNextScene( new SimpleColorLevel() );
    }
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Two)) {
        this._mUserMsg.SetText(this._kUserPrompt + " 2 => Texture Level");
        this.LoadNextScene( new TextureLevel() );
    }
    
    if (gEngine.Input.IsKeyClicked(gEngine.Input.Keys.Three)) {
        this._mUserMsg.SetText(this._kUserPrompt + " 3 => Level One ");
        this.LoadNextScene( new LevelOne() );
    }
};

BeginLevel.prototype.LoadContent = function() {
    // nothing to do here!
};

BeginLevel.prototype.UnloadContent = function() {
    // Again nothing
};
