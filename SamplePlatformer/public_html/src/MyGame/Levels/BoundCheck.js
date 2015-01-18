/*
 * File: BoundCheck.js 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function BoundCheck(htmlCanvasID)
{
    // variables of the shaders for drawing: 
    this._mRedShader = null;
    this._mTextureShader = null;
    this._mWhiteShader = null;
    this._mFontShader = null;
    
    // variable for renderable objects
    this._mHero = null;        // these are the renderable objects
    this._mRedSqs = {};
    this._mWhiteSq = null;
    this._mStatus = null;
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // textures to be loaded
    this._kTextureWithAlpha = "resources/UWB-Alpha.png";

    // audio clip
    this._kKeyClicked = "resources/sounds/game-sound.wav";
    
    // Initialize the game
    this.Initialize();
};
gEngine.Core.InheritPrototype(BoundCheck, Scene);

BoundCheck.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(30, 20),   // position of the camera
            64,                        // width of camera
            [0, 0, 640, 480]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.9, 0.9, 0.9, 1]);
            // sets the background to light gray
        
    // Step B: create the shaders
    this._mTextureShader = new TextureShader(
            "shaders/TextureVS.glsl",      // Path to the VertexShader 
            "shaders/TextureFS.glsl");    // Path to the White FragmentShader
    
    this._mRedShader = new SimpleShader( 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/RedFS.glsl");      // Path to the Red FragmentShader
    
    this._mWhiteShader = new SimpleShader( 
            "shaders/SimpleVS.glsl",      // Path to the VertexShader 
            "shaders/WhiteFS.glsl");      // Path to the Red FragmentShader
            
    this._mFontShader = new SpriteShader(
            "shaders/TextureVS.glsl",
            "shaders/TextureFS.glsl");    
    
    this._mStatus = new TextObject(this._mFontShader, "Status: ");
    this._mStatus.GetXform().SetPosition(-1, 43);
    this._mStatus.GetXform().SetSize(8, 1);
    
    // Step C: Create the renderable objects:
    var t = new TextureObject(this._mTextureShader, this._kTextureWithAlpha);
    this._mHero = new HeroObject(t);
    var w = new RenderableObject(this._mWhiteShader);
    this._mWhiteSq = new PlatformObject(w);
     
    w = new RenderableObject(this._mRedShader);
    var r = new PlatformObject(w);
    r.GetXform().SetPosition(30, -2);
    r.GetXform().SetSize(65, 1);
    this._mRedSqs[0] = r;
    
    // Step D: Initialize the alpha textured object
    this._mHero.GetXform().SetPosition(50, 30);
    this._mHero.GetXform().SetSize(5, 5);
    
    // Step E: Initialize the top-left object with no transparency
    this._mWhiteSq.GetXform().SetPosition(20, 10);
    this._mWhiteSq.GetXform().SetSize(25, 2);
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BoundCheck.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.3, 0.3, 0.3, 1.0]); // clear to dark gray
    
    this._mCamera.BeginDraw();
        
    
    this._mRedShader.ActivateShader(this._mCamera.GetVPMatrix());
        this._mRedSqs[0].Draw();
        
    this._mFontShader.ActivateShader(this._mCamera.GetVPMatrix());
        this._mStatus.Draw();

    this._mWhiteShader.ActivateShader(this._mCamera.GetVPMatrix());        
        this._mWhiteSq.Draw();
        
    this._mTextureShader.ActivateShader(this._mCamera.GetVPMatrix());
        this._mHero.Draw();
};

BoundCheck.prototype._MoveXform = function(xform, left, right, up, down)
{
    var delta = 0.1;
    if (gEngine.Input.IsKeyDown(left)) {
        xform.IncXPosBy(-delta);
    }
    if (gEngine.Input.IsKeyDown(right)) {
        xform.IncXPosBy(delta);
    }
    if (gEngine.Input.IsKeyDown(up)) {
        xform.IncYPosBy(delta);
    }
    if (gEngine.Input.IsKeyDown(down)) {
        xform.IncYPosBy(-delta);
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
BoundCheck.prototype.Update = function()
{
    var status = "Status: ";
    
    this._mHero.Update();
    
    this._MoveXform(this._mWhiteSq.GetXform(),   gEngine.Input.A,
                                            gEngine.Input.D,
                                            gEngine.Input.W,
                                            gEngine.Input.S);
                                            
    var landed = this._mWhiteSq.TouchesHero(this._mHero);
    landed = landed || this._mRedSqs[0].TouchesHero(this._mHero);
    
    
    if (!landed)  // landed should be tested a or-condition for all of the platforms
        this._mHero.SetShouldFall(true);
    
    var s = this._mCamera.CollideWCBound(this._mHero);
    switch (s) {
        case this._mCamera.eWCCollideStatus.eCollideLeft:
            status += "WC-Left";
            break;
            
        case this._mCamera.eWCCollideStatus.eCollideRight:
            status += "WC-Right";
            break;
        
        case this._mCamera.eWCCollideStatus.eCollideTop:
            status += "WC-Top";
            break;
        
        case this._mCamera.eWCCollideStatus.eCollideBottom:
            status += "WC-Bottom";
            break;
        
        case this._mCamera.eWCCollideStatus.eInside:
            status += "WC-Inside";
            break;
        
        case this._mCamera.eWCCollideStatus.eOutside:
            status += "WC-Outside";
            break;
    }
    
    this._mStatus.SetText(status);
    
};

BoundCheck.prototype.LoadContent = function() {
    gEngine.Textures.LoadTexture(this._kTextureWithAlpha);
    
    gEngine.AudioClips.LoadAudio(this._kKeyClicked);
};

BoundCheck.prototype.UnloadContent = function() {
    gEngine.Textures.UnloadTexture(this._kTextureWithAlpha);
    
    gEngine.AudioClips.UnloadAudio(this._kKeyClicked);
};