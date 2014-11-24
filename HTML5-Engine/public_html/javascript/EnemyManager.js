/* 
 * Manages enemies that react to player.
 */
function EnemyManager(player, enemyShader)
{
    this.mPlayer = player;
    
    this.mEnemyShader = enemyShader;
    
    this.mEnemyList = [];
    
    // initial enemy spawn.
    var spawnX = this.mPlayer.getTransform().getX() + 10;
    var spawnWidth = 50;
    var spawnY = 0;
    var spawnHeight = 25;
    
    for(var i = 0; i < 40; i++)
    {
        this.addEnemy(spawnX + (Math.random() * spawnWidth),
                      spawnY + (Math.random() * spawnHeight),
                      this.mEnemyShader);
    }
}

EnemyManager.prototype.preloadResources = function()
{
    EngineCore.Resources.loadImage("resources/anF.png");
};

EnemyManager.prototype.addToDrawSet = function()
{
    // draw all enemies
    for(var i = 0; i < this.mEnemyList.length; i++)
    {
        if(!this.mEnemyList[i].mIsDead)
        {
            this.mEnemyList[i].addToDrawSet();
        }
    }
};

EnemyManager.prototype.update = function()
{    
    // Spawn as neccessary.
    if(EngineCore.Input.isKeyDown(EngineCore.Input.SPACE))
    {
        this.addEnemy(this.mPlayer.getTransform().getX() + (Math.random() * 20 - 10),
                      this.mPlayer.getTransform().getY() + (Math.random() * 20 - 10),
                      this.mEnemyShader);
    }
    
    // Update all enemies
    for(var i = 0; i < this.mEnemyList.length; i++)
    {
        if(!this.mEnemyList[i].mIsDead)
        {
            this.mEnemyList[i].update();
        }
    }
    
    // Move enemies as the player moves right
    for(var h = 0; h < this.mEnemyList.length; h++)
    {
        if(this.mEnemyList[h].getTransform().getX() + 20 < 
                this.mPlayer.getTransform().getX())
        {
            this.mEnemyList[h].getTransform().
                    setX(this.mPlayer.getTransform().getX()+ 30);
        }
    }
    
    // Do collision detection and resolution.
    for(var j = 0; j < this.mEnemyList.length; j++)
    {
        if(this.mEnemyList[j].hasCollidedWithGameObj(this.mPlayer))
        {
            //EngineCore.SceneManager.setCurrentScene(new GameOverLevel());
            this.mEnemyList[j].mIsDead = true;
        }
    }
    
    // Clean up enemies from enemylist.
    for(var k = 0; k < this.mEnemyList.length; k++)
    {
        if(this.mEnemyList[k].mIsDead)
        {
            // Remove from this list
            this.mEnemyList.splice(k,1);
        }
    }
};

EnemyManager.prototype.addEnemy = function(xPos, yPos, enemyShader)
{
    var transform = new Transform();
    transform.setPosition(xPos, yPos);
    transform.setSize(1,1);
    transform.setZOrder(0);
    
    this.mEnemyList.push(new Enemy(transform, this.mPlayer, enemyShader));
};

//-----------------------------------------------------------------------------

function Enemy(transform, player, enemyShader)
{
    var logic = new EnemyLogic(transform, player);
    
    var renderObj = new Renderable2DObject(transform,
        enemyShader,
        "resources/anF.png");
        
    renderObj.setTicksPerFrame(5);
    
    this.mIsDead = false;
    
    GameObject.call(this, transform, logic, renderObj);
}
Enemy.prototype = Object.create(GameObject.prototype);

//-----------------------------------------------------------------------------

function EnemyLogic(transform, player)
{
    this.mPlayer = player;
    
    this.mPlayerProximityDistance = 20.0;
    
    this.mMoveSpeed = 0.01;
    
    LogicComponent.call(this, transform);
}
EnemyLogic.prototype = Object.create(LogicComponent.prototype);

EnemyLogic.prototype.update = function()
{
    // Random movement within boundery.
    
    
    
    // If player is near, move towards it.
    if(vec2.distance(this.mPlayer.getTransform().getPosition(),
                     this.mTransform.getPosition()) < 
            this.mPlayerProximityDistance)
    {
        var dir = vec2.create();
        vec2.subtract(dir, this.mPlayer.getTransform().getPosition(),
                     this.mTransform.getPosition());
                     
        vec2.normalize(dir, dir);
        
        this.mTransform.setPosition(this.mTransform.getX() + dir[0]* this.mMoveSpeed,
            this.mTransform.getY() + dir[1] * this.mMoveSpeed);
    }
};

