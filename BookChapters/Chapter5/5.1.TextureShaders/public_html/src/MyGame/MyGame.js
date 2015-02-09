/*
 * File: MyGame.js 
 * This is the the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{           
     // audio clips: supports both mp3 and wav formats
    this._kBgClip = "resources/sounds/BGClip.mp3";
    this._kCue = "resources/sounds/MyGame_cue.wav";
    
    // textures: 
    this._kPortal = "resources/minion_portal.png";      // supports png with transparency
    this._kCollector = "resources/minion_collector.png";      
    
    // The camera to view the rectangles
    this._mCamera = null;
    
    // the hero and the support objects
    this._mHero = null;
    this._mPortal = null;
    this._mCollector = null;
};
gEngine.Core.InheritPrototype(MyGame, Scene);

MyGame.prototype.LoadAndBeginScene = function() 
{
   // Step A: loads the audios
   gEngine.AudioClips.LoadAudio(this._kBgClip);
   gEngine.AudioClips.LoadAudio(this._kCue);
    
   // Step B: loads the textures
   gEngine.Textures.LoadTexture(this._kPortal);
   gEngine.Textures.LoadTexture(this._kCollector);

    // Step C: Start the game loop running
    gEngine.GameLoop.Start(this);
};

MyGame.prototype.UnloadScene = function() 
{
    // Step A: Game loop not running, unload all assets
    // stop the background audio
    gEngine.AudioClips.StopBackgroundAudio();
    
    // unload the scene resources
    // gEngine.AudioClips.UnloadAudio(this._kBgClip);
    //      You know this clip will be used else where in the game
    //      So you decide to not unload this clip!!
    gEngine.AudioClips.UnloadAudio(this._kCue);
   
    gEngine.Textures.UnloadTexture(this._kPortal);
    gEngine.Textures.UnloadTexture(this._kCollector);

    // Step B: starts the next level
    var nextLevel = new BlueLevel();  // next level to be loaded
    nextLevel.LoadAndBeginScene();
};

MyGame.prototype.Initialize = function() 
{
    // Step A: set up the cameras
    this._mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
    this._mCamera.SetBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    // Step B: Create the support objects
    this._mPortal = new TextureRenderable(gEngine.DefaultResources.GetTextureShader(), this._kPortal);
    this._mPortal.SetColor([1, 0, 0, 0.2]);  // tints red
    this._mPortal.GetXform().SetPosition(25, 60);
    this._mPortal.GetXform().SetSize(3, 3);
    
    this._mCollector = new TextureRenderable(gEngine.DefaultResources.GetTextureShader(), this._kCollector);
    this._mCollector.SetColor([0, 0, 0, 0]);  // No tinting
    this._mCollector.GetXform().SetPosition(15, 60);
    this._mCollector.GetXform().SetSize(3, 3);
    
    // Setp C: Create the hero object in blue
    this._mHero = new Renderable(gEngine.DefaultResources.GetConstColorShader());
    this._mHero.SetColor([0, 0, 1, 1]);
    this._mHero.GetXform().SetPosition(20, 60);
    this._mHero.GetXform().SetSize(2, 3);
    
    // now start the bg music ...
    gEngine.AudioClips.PlayBackgroundAudio(this._kBgClip);
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.Draw = function() 
{   
    // Step A: clear the canvas
    gEngine.Core.ClearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Step  B: Activate the drawing Camera
    this._mCamera.SetupViewProjection();
    
        // Step  C: Draw everything
        this._mPortal.Draw(this._mCamera.GetVPMatrix());
        this._mCollector.Draw(this._mCamera.GetVPMatrix());
        this._mHero.Draw(this._mCamera.GetVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.Update = function()
{
    // For this very simple, let's only allow the movement of hero, 
    // and if hero moves too far off, this level ends, we will
    // load the next level
    var deltaX = 0.05;
    var xform = this._mHero.GetXform();
    
    // Support hero movements
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Right)) {
        gEngine.AudioClips.PlaySound(this._kCue);
        xform.IncXPosBy(deltaX);
        if (xform.GetXPos() > 30)  // this is the right-bound of the window
            xform.SetPosition(12, 60);
    }
    
    if (gEngine.Input.IsKeyPressed(gEngine.Input.Keys.Left)) {
        gEngine.AudioClips.PlaySound(this._kCue);
        xform.IncXPosBy(-deltaX);
        if (xform.GetXPos() < 11) {  // this is the left-bound of the window
            gEngine.GameLoop.Stop();
        }
    }
    
    // continously change texture tinting
    var c = this._mPortal.GetColor();
    var ca = c[3] + deltaX;
    if (ca > 1)
        ca = 0;
    c[3] = ca;
};