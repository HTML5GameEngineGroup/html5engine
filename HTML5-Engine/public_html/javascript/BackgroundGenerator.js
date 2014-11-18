/* 
 * 
 */
function BackgroundGenerator(player, groundShader)
{
    this.mPlayer = player;
    this.mCurrentGroundList = 1;
    this.kGROUND_TEXTURE = "resources/GROUND_1.png";
    this.kGROUND_SHADER = groundShader;
    this.kGROUND_LIST_SIZE = 8;
    this.kGROUND_HEIGHT = 5;
    this.kGROUND_WIDTH = 5;
    this.kGROUND_OFFSET = 5;
    this.kBACKGROUND_Z = 1;
    
    // 2 arrays keeping track of ground background objects.
    var mGroundList1 = [];
    var mGroundList2 = [];
    this.mGrounds = [mGroundList1, mGroundList2];
    
    // Perform initial generation of background.
    for(var i = 0; i < this.kGROUND_LIST_SIZE; i++)
    {
        var transform = new Transform();

        transform.setPosition(i * this.kGROUND_OFFSET, 0);
        transform.setSize(this.kGROUND_HEIGHT,this.kGROUND_WIDTH);
        transform.setZOrder(this.kBACKGROUND_Z);
        
        var renderObj = new Renderable2DObject(transform,
        this.kGROUND_SHADER,
        this.kGROUND_TEXTURE);
        
        mGroundList1.push(renderObj);
    }
    for(var j = 0; j < this.kGROUND_LIST_SIZE; j++)
    {
        var transform = new Transform();

        transform.setPosition((this.kGROUND_OFFSET * this.kGROUND_LIST_SIZE) +
                j * this.kGROUND_OFFSET, 0);
        transform.setSize(this.kGROUND_HEIGHT,this.kGROUND_WIDTH);
        transform.setZOrder(this.kBACKGROUND_Z);
        
        var renderObj = new Renderable2DObject(transform,
        this.kGROUND_SHADER,
        this.kGROUND_TEXTURE);
        
        mGroundList2.push(renderObj);
    }
}

BackgroundGenerator.prototype.preloadResources = function()
{
    EngineCore.Resources.loadImage("resources/GROUND_1.png");    
};

BackgroundGenerator.prototype.draw = function()
{
    // draw all ground sections
    for(var i = 0; i < this.mGrounds[0].length; i++)
    {
        this.mGrounds[0][i].draw();
    }
    
    for(var j = 0; j < this.mGrounds[1].length; j++)
    {
        this.mGrounds[1][j].draw();
    }
};

BackgroundGenerator.prototype.update = function()
{
    // Depending on player position, generate or move around the background.
    
    // When the player is past the current ground list, the one visible,
    // move the other one in front.
    var playerX = this.mPlayer.getTransform().getX();
    var gMidX = this.mGrounds[this.mCurrentGroundList][this.kGROUND_LIST_SIZE / 2].getTransform().getX();
    
    if( playerX > gMidX )
    {
        var otherGroundList = 1 - this.mCurrentGroundList;
        
        // The x coordinate where the grounds end.
        var endOfCurrentGroundsX = 
                this.mGrounds[this.mCurrentGroundList][this.kGROUND_LIST_SIZE - 1].
                getTransform().getX() + this.kGROUND_OFFSET;
        
        for(var i = 0; i < this.kGROUND_LIST_SIZE; i++)
        {
            this.mGrounds[otherGroundList][i].getTransform().
                    setX(endOfCurrentGroundsX + (i * this.kGROUND_OFFSET));
        }
        
        this.mCurrentGroundList = otherGroundList;
    }
};