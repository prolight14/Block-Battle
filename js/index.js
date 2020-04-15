function main()
{

size(600, 600);



/**BLOCK BATTLE**/

/**
 * @Intro
 *   Gameplay & Engine prolight,
 *   Graphics Ӿɛהσה 
 * 
 *  Fight other players to win!
 * If there are any errors restart the program or the level
 * 
 * @How: Don't read if confused
 *      {
 * Defeat the other players, you can either fight another player or a cpu. Down to shoot unless autoFire is on. If you collect a special power-up press your upperright key or depending on your setup press enter (With arrow keys) to use it. (So either [e, y, o, enter]) You get 3 lives once everyone except you is defeated the round is over. Also have fun.}
 * vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
 * vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
 * vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
 * vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
 * @IMPORTANT
 * Use the settings to change the game
 * WASD will be the default keys
 * 
 * Also to change the level go to MENU>SETTINGS switch the level then press SAVELEVEL, then go back and press NEWGAME (or play and then pause and restart)
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * 
 * @Note: Cpus are only effective in levels with little to no hazards
 * 
 * @Logs :
 *      July 28th engine complete
 *      29th collision complete
 *      30th other stuff and menu complete
 *      31st 
 *          Fixed a button problem
 *          Fixed shooting
 *          Added graphics (from Ӿɛהσה)
 *      
 * ּ    August 1st
 *          Added ladders
 *          Made lava not kill while standing above or below of it
 *          Player changer complete
 *          Fixed minor bugs
 * 
 *      August 2nd
 *          cpu half done
 * 
 *          Added power-ups:
 *              rapidFire,
 *              bomb,
 *              heal,
 *              boom bomb
 *          
 *          Cpus can now chase and use power-ups
 * 
 *      3rd
 *          Cpu now use ladders easier,
 *          Updated boom bomb power-up
 *          Added a shield
 *          Got power up graphics
 *          Made minor changes
 *          Changed buttons
 *          Added shooters
 *          Made more minor changes
 *          Improved power-ups
 * 
 *      4th
 *          Added how screen
 *          Enhanced pause-screen
 *      
 *      5th 
 *          There are now 20 levels
 *          You can now see levels you have discovered
 * 
 *      cpu need to:
 *              collect items
 *              Freeze state
 *              evade holes and lava
 * 
**/

/*
    Instructions
        Use your keys to move down, to shoot.
*/
      
var game = {
    gameState : "menu",
    fps : 60,
};

var levelInfo = {
    level : "FairBattle",
    unitWidth : 30,
    unitHeight : 30,
    xPos : 0,
    yPos : -60,
    width : width,
    height : height,
};

/*GAME SETTINGS*/
var settings = {
    accurateBullets : true, //true (slower) false (faster)
    AUTO_FIRE : true,//You might want to keep this on
    LIVES : 3,
    HP : 20,
};

//Our fonts
var fonts = {
    f1 : createFont("carbon block"),
    c1 : createFont("cursive"),
};

var graphics, gameObjects, Button, Rect, BUTTON_COLOR, playerChangers, observer, levels;

var WIDTH = width,
    HEIGHT = height;

noStroke();
smooth();

var keys = [];
keyPressed = function()
{
    keys[keyCode] = true;
};
keyReleased = function()
{
    keys[keyCode] = false;
};

var createArray = function(object, inArray)
{
    var array = inArray || [];
    array.references = {};
    array.labeledIndexes = {};
    array.add = function()
    {
        if(object.apply !== undefined)
        {
            //Instatiate
            var oNew = Object.create(object.prototype);
            object.apply(oNew, Array.prototype.slice.call(arguments));
            this.push(oNew);
        }else{
            array.push(Array.prototype.slice.call(arguments)[0]);
        }
        
        //Set props
        var lastIndex = array.length - 1;
        array[lastIndex].arrayName = array.name;
        array[lastIndex].name = array.tempArg || array.name;
        array[lastIndex].index = lastIndex;
        array[lastIndex].firstIndex = lastIndex;
        array.labeledIndexes[array[lastIndex].firstIndex] = lastIndex;
        
        (array[lastIndex].afterCreate || function() {})(array[lastIndex]);
    };
    //Add an object with a name addObject(name, arg1, arg2...)
    array.addObject = function(name) 
    {
        if(this.references[name] === undefined)
        {
            this.references[name] = this.length;
        }else{
            println("Warning: You cannot have multiple objects \n" + 
                    "with the same name \'" + name + "\', Object removed.");
            //Exit the function immediately.
            return;
        }
        
        var args = Array.prototype.slice.call(arguments);
        this.tempArg = args[0];
        args.shift();
        this.add.apply(null, args);
    };
    array.getObject = function(name)
    {
        if(this[this.references[name]] !== undefined)
        {
            return this[this.references[name]];
        }else{
            println("Error referencing object '" + name + "'"); 
            delete this.references[name];
            return {};
        }
    };
    array.removeObject = function(name)
    {
        if(this.references[name] !== undefined)
        {
            this.splice(this.references[name], 1);
            delete this.references[name];
        }
    };
    //Want to reference your array as if when it was first created?
    array.inputLabeledIndex = function(index)
    {
        if(this.labeledIndexes[index] !== undefined)
        {
            if(this[this.labeledIndexes[index]] !== undefined)
            {
                return this[this.labeledIndexes[index]];
            }else{
                //If the reference refers to nothing delete it
                delete this.labeledIndexes[index];
            }
        }
        return {};
    };
    //Call this while iterating if you're constantly moving objects around
    array.applyObject = function(i)
    {
        if(this[i].delete)
        {
            this.splice(i, 1);
            return;
        }
        
        this[i].index = i;
        this[i].arrayName = this.name || this[i].arrayName;
        
        if(this[i].name !== this[i].arrayName)
        {
            this.references[this[i].name] = i;
        }
        
        this.labeledIndexes[this[i].firstIndex] = i;
    };
    array.clear = function()
    {
        this.length = 0;
        this.references = {};
        this.labeledIndexes = {};
    };
    array.input = function(index) //Use this for safe references
    {
        if(this[index] !== undefined)
        {
            return this[index];
        }else{
            return {};
        }
    };
    array.getLast = function()
    {
        return this.input(this.length - 1);
    };
    array.last = array.getLast;
    array.draw = function()
    {
        for(var i = 0; i < this.length; i++)
        {
            this[i].draw();
        }
    };
    array.update = function(applyObject)
    {
        for(var i = 0; i < this.length; i++)
        {
            this[i].update();
            
            if(applyObject)
            {
                this.applyObject(i);   
            }
        }
    };
    return array;
};

var playerConfigs = [
    {
        type : "cpu",
        userName : "cpu1",
        controls : {
            left : 70,//f
            right : 72,//h
            up : 84,//t
            down : 71,//g
            second : 89//y
        },
    },
    {
        type : "cpu",
        userName : "cpu2",
        //off : true,
        controls : {
            left : 74,//j
            right : 76,//l
            up : 73,//i
            down : 75,//k
            second : 79,//o
        },
    },
    {
        type : "player",
        userName : "player1",
        controls : {
            left : 65,//a
            right : 68,//d
            up : 87,//w
            down : 83,//s
            second : 69//e
        },
    },
    {
        type : "player",
        userName : "player2",
        off : true,
        controls : {
            left : LEFT,
            right : RIGHT,
            up : UP,
            down : DOWN,
            second : ENTER,
        },
    },
];
playerConfigs.set = function(i, player)
{
    var t = this[i];
    
    if(t === undefined || t.off)
    {
        return true;    
    }
    
    player.type = t.type;
    player.userName = t.userName;
    if(t.type === "player")
    {
        player.controls.left = function()
        {
            return keys[t.controls.left];    
        };
        player.controls.right = function()
        {
            return keys[t.controls.right];    
        };
        player.controls.up = function()
        {
            return keys[t.controls.up];    
        };
        player.controls.down = function()
        {
            return keys[t.controls.down];    
        };
        player.controls.second = function()
        {
            return keys[t.controls.second];    
        };
    }
};
playerConfigs.setPlayers = function()
{
    var players = gameObjects.getObject("player");
        
    for(var i = 0; i < players.length; i++)
    {
        if(this.set(i, players[i]))
        {
            players[i].dead = true;
            players[i].lives = 0;
        }
    }
};

var PlayerChanger = function(xPos, yPos, width, height)
{
    Rect.call(this, xPos, yPos, width, height);
    
    this.color = BUTTON_COLOR;
    
    this.typeButton = new Button(this.xPos, this.yPos, this.width * 0.23, this.height, BUTTON_COLOR, "");
    
    this.userNameButton = new Button(this.xPos + this.width * 0.23, this.yPos, this.width * 0.23, this.height, BUTTON_COLOR, "");
    
    this.offButton = new Button(this.xPos + this.width - this.width * 0.1, this.yPos, this.width * 0.1, this.height, BUTTON_COLOR, "x");
    
    this.controlsButton = new Button(this.xPos + this.width * 0.46, this.yPos, this.width * 0.25, this.height, BUTTON_COLOR, "Controls");
    
    this.typeButton.textColor = color(0, 0, 0, 120);
    this.userNameButton.textColor = color(0, 0, 0, 120);
    this.offButton.textColor = color(0, 0, 0, 120);
    this.controlsButton.textColor = color(0, 0, 0, 120);
    
    this.getPC = function()
    {
        return playerConfigs[this.index] || {}; 
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos,this.yPos,this.width,this.height,8);
        
        this.typeButton.draw();
        this.userNameButton.draw();
        this.offButton.draw();
        this.controlsButton.draw();
        
        fill(0, 0, 0, 120);
        
        textSize(11);
        var pc = this.getPC();
        if(pc.controls.up === UP)
        {
            textAlign(LEFT, CENTER);
            text("arrow&E", this.xPos + this.width * 0.71,
            this.yPos + this.height / 2);
        }
        else if(pc.controls.up === 87)
        {
            textAlign(LEFT, CENTER);
            text("wasd&e", this.xPos + this.width * 0.73,
            this.yPos + this.height / 2);
        }
        else if(pc.controls.up === 84)
        {
            textAlign(LEFT, CENTER);
            text("tfgh&y", this.xPos + this.width * 0.73,
            this.yPos + this.height / 2);
        }
        else if(pc.controls.up === 73)
        {
            textAlign(LEFT, CENTER);
            text("ijkl&o", this.xPos + this.width * 0.73,
            this.yPos + this.height / 2);
        }
    };
    
    this.update = function()
    {
        var pc = this.getPC();
        this.typeButton.message = pc.type; 
        this.userNameButton.message =  pc.userName;
        
        if(!this.setup)
        {
            this.setup = true;
            this.offButton.color = (pc.off) ? color(180, 0, 0, 150) : BUTTON_COLOR;
        }
    };
    
    this.mousePressed = function()
    {
        var pc = this.getPC();
        if(this.typeButton.clicked())
        {
            pc.type = (pc.type === "cpu") ? "player" : "cpu"; 
            
            var pcs = playerConfigs;
            var players = 0;
            var cpus = 0;
            for(var i = 0; i < pcs.length; i++)
            {
                if(pcs[i].type === "player")
                {
                    players++;
                    pcs[i].userName = pcs[i].type + players;
                }
                else if(pcs[i].type === "cpu")
                {
                    cpus++;
                    pcs[i].userName = pcs[i].type + cpus;
                }
            }
        }
        else if(this.offButton.clicked())
        {
            pc.off = !pc.off;
            this.offButton.color = (pc.off) ? color(180, 0, 0, 150) : BUTTON_COLOR;
        }
        else if(this.controlsButton.clicked())
        {
            if(pc.controls.up === UP)
            {
                pc.controls = {
                    left : 65,//a
                    right : 68,//d
                    up : 87,//w
                    down : 83,//s
                    second : 69//e
                };
            }
            else if(pc.controls.up === 87)
            {
                pc.controls = {
                    left : 70,//f
                    right : 72,//h
                    up : 84,//t
                    down : 71,//g
                    second : 89//y
                };
            }
            else if(pc.controls.up === 84)
            {
                pc.controls = {
                    left : 74,//j
                    right : 76,//l
                    up : 73,//i
                    down : 75,//k
                    second : 79,//o
                };
            }
            else if(pc.controls.up === 73)
            {
                pc.controls = {
                    left : LEFT,
                    right : RIGHT,
                    up : UP,
                    down : DOWN,
                    second : ENTER
                };
            }
        }
    };
};

var playerChangers = createArray(PlayerChanger);
playerChangers.setAll = function()
{
    playerChangers.length = 0;
    
    for(var i = 0; i < playerConfigs.length; i++)
    {
        this.push(new PlayerChanger(185, 345-i*35,230,35));
        var pg = this.getLast();
        pg.index = i; 
    }
};
playerChangers.mousePressed = function()
{
    for(var i = 0; i < this.length; i++)
    {
        this[i].mousePressed();
    }
};

var scaler = {
    x : 1,
    y : 1,
    set : function()
    {
        var x1 = min(1, width / levelInfo.width - levelInfo.xPos);
        var y1 = min(1, height / levelInfo.height - levelInfo.yPos);
        
        this.x = min(x1, y1);
        this.y = min(x1, y1);
    },
};

var fpsCatcher = {
    lastSecond : second(),
    countedFrames : 0,
    actualFps : game.fps,
    update : function()
    {
        if(this.lastSecond !== second())
        {
            this.actualFps = this.countedFrames;
            this.countedFrames = 0;
        }
        this.countedFrames++;
        this.lastSecond = second();
    },
};

var tempt = function(error)
{
    println(error);  
};

var backgrounds = {
    background : "",
    backgrounds : {
        "grid" : {
            primeLoad : function()
            {
                //background(255, 255, 255);
                background(130, 116 + 60, 101 + 60);
                strokeWeight(0.8);
                stroke(0, 0, 0, 35);
                for(var x = 0; x < width; x += 30)
                {
                    line(x + 12, 0, x + 12, height);    
                }
                
                for(var y = 0; y < height; y += 30)
                {
                    line(0, y, width, y);    
                }
                noStroke();
                
                for(var i = 0; i < 15; i++)
                {
                    fill(0, 0, 0, random(10, 30));
                    rect(random(0, width), random(0, height), random(10, 50) + 70, random(10, 50) + 40, 10);
                }
            },
        },
        "metal" : {
            primeLoad : function()
            {
                var backpx = [];
                // background(77, 54, 19);
                //background(101, 125, 52);
                background(128, 168, 144);
                for(var i = 0; i < 600; i += 10)
                {
                    for(var j = 0; j < 600; j += 20)
                    {
                        noStroke();
                        fill(31, 28, 23, 20);
                        rect(i, j, 5, 5);
                        rect(i + 5, j + 10, 5, 5);
                    }
                }
            },
        },
    },
    load : function()
    {
        if(this.backgrounds[this.background].load !== undefined)
        {
            this.backgrounds[this.background].load();
        }
    },
    setBackground : function(name)
    {
        if(this.backgrounds[name] !== undefined)
        {
            this.background = name;
        }
    },
    drawBackground : function()
    {
        if(this.backgrounds[this.background].drawBackground !== undefined)
        {
            this.backgrounds[this.background].drawBackground();
        }
    },
    primeLoad : function()
    {
        var drawBackground = function()
        {
            image(this.loadedImage, 0, 0, width, height); 
        };
        
        for(var i in this.backgrounds)
        {
            if(this.backgrounds[i].primeLoad !== undefined)
            {
                if(!this.backgrounds[i].primeLoad())
                {
                    this.backgrounds[i].loadedImage = get(0, 0, width, height);
                }
            }
            
            if(this.backgrounds[i].drawBackground === undefined)
            {
                this.backgrounds[i].drawBackground = drawBackground;
            }
        }
    },
};

var Bar = function(xPos, yPos, width, height, color1)
{
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    
    this.color = color1 || color(0, 200, 80);
    
    this.draw = function(amtH, maxH) 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, max(0, (this.width * amtH) / maxH), this.height);
        noFill();
        rect(this.xPos, this.yPos, this.width, this.height);
    };
};

var HpBar = Bar;

var Button = function(xPos, yPos, width, height, colorVal, message, textSize1)
{
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.color = colorVal;
    //this.font = createFont("sans serif");
    this.message = message;
    
    this.origColor = this.color;
    
    this.textSize = textSize1;
    
    this.origXPos = xPos;
    this.origYPos = yPos;
    this.noCollision = false;
    
    this.textColor = color(0, 0, 0);
    this.highLighting = false;
    
    this.draw = function()
    {
        if(!this.stroke)
        {
            noStroke();
        }else{
            strokeWeight(this.strokeWeight || 1);
            stroke(this.strokeColor || 0);
        }
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height, this.round);
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(this.textSize || 12);
        if(this.font !== undefined)
        {
            textFont(this.font, this.textSize || 12);
        }
        fill(this.textColor || this.color);
        text(this.message, this.xPos + this.width / 2, this.yPos + this.height / 2);
        
        if(this.highLighting)
        {
            this.mouseInside = (!this.noCollision && 
            (mouseX > this.xPos && 
            mouseX < this.xPos + this.width) &&
            (mouseY > this.yPos && 
            mouseY < this.yPos + this.height));
            if(this.mouseInside)
            {
                fill(255, 255, 255, 70);
                rect(this.xPos, this.yPos, this.width, this.height, this.round);
            }
        }
    };
    
    this.clicked = function()
    {
        if(!this.highLighting)
        {
            this.mouseInside = (!this.noCollision && 
            (mouseX > this.xPos && 
            mouseX < this.xPos + this.width) &&
            (mouseY > this.yPos && 
            mouseY < this.yPos + this.height));
        }
        return (mouseIsPressed && this.mouseInside);  
    };
};

var BUTTON_COLOR = color(0, 80, 190, 200);
var buttons = {
    play : new Button(230, 230, 128, 50, BUTTON_COLOR,
    "Play"),
    newGame : new Button(230, 280, 128, 50, BUTTON_COLOR,
    "New Game"),
    settings : new Button(230, 330, 128, 50, BUTTON_COLOR,
    "Settings"),
    credits : new Button(230, 380, 128, 50, BUTTON_COLOR,
    "Credits"),
    how : new Button(230, 430, 128, 50, BUTTON_COLOR,
    "How"),
    pause : new Button(width - 30, 0, 30, 30, BUTTON_COLOR,
    "||"),
    menu : new Button(230, 283.5, 128, 48, BUTTON_COLOR, "Menu"),
    resume : new Button(230, 235, 128, 48, 
    BUTTON_COLOR, "Resume"),
    restart : new Button(230, 235 + 48 * 2, 128, 48, 
    BUTTON_COLOR, "Restart"),
    back : new Button(0, height - 50, 70, 50, 
    BUTTON_COLOR, "Back"),
    levelLeft : new Button(width / 2 - 117.5, 380, 35, 35,
    BUTTON_COLOR, "<"),
    levelRight : new Button(width / 2 + 82.5, 380, 35, 35,
    BUTTON_COLOR, ">"),
    levelName : new Button(width / 2 - 82, 380, 165, 35,
    BUTTON_COLOR, "---"),
    save : new Button(width / 2 - 40, height - 35, 80, 35, 
    BUTTON_COLOR, "Save Level"),
};
buttons.format = function()
{
    //Format the buttons for me
    for(var i in this)
    {
        if(i !== "format")
        {
            //here
            this[i].round = 7;
            this[i].stroke = true;
            this[i].strokeWeight = 3;
            this[i].strokeColor = color(0, 180, 120);
            this[i].textColor = color(0, 0, 0, 130);
            this[i].font = fonts.c1;
            this[i].textSize = 15;
        }
    }
};

/*Xenon's graphics*/
var blockG = function(x, y, t)
{
    pushMatrix();
    translate(x, y);
    switch(t)
    {
        case 0://floor
            noStroke();
            fill(130, 116, 101);
            rect(0,0,30,30);
            fill(143, 128, 112);
            rect(0,0,30,20);
            fill(163, 145, 128);
            rect(10,5,10,10);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            return "floor";
       // break;    
        case 1://underfloor
            noStroke();
            fill(130, 116, 101);
            rect(0,0,30,30);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            return "underfloor";
       // break;    
        case 2://platform
            noStroke();
            fill(143, 128, 112);
            rect(0,0,30,10);
            fill(130, 112, 95);
            rect(0,0,30,5);
            fill(163, 148, 132);
            rect(0,0,5,15);
            rect(25,0,5,15);
            return "platform";
       // break;    
        case 3://platform2
            noStroke();
            fill(97, 88, 79);
            rect(0,0,30,10);
            fill(212, 189, 40);
            rect(10,0,5,10);
            rect(15,0,5,10);
            fill(130, 112, 95);
            rect(0,0,30,5);
            fill(163, 148, 132);
            rect(0,0,5,15);
            rect(25,0,5,15);
            fill(212, 189, 40);
            rect(25,5,5,5);
            rect(0,5,5,5);
            fill(196, 75, 75);
            rect(25,-5,5,5);
            rect(0,-5,5,5);
            return "platform2";
       // break;    
        case 4://crate
            noStroke();
            fill(100, 122, 128);
            rect(0,0,30,30);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            return "crate";
       // break;    
        case 5://lava
            noStroke();
            fill(227, 111, 48);
            rect(0,0,30,30);
            fill(245, 123, 57);
            rect(0,0,30,10);
            fill(255, 152, 97);
            rect(0,0,30,5);
            return "lava";
       // break;
        case 6://ladder
            noStroke();
            fill(209, 86, 86);
            rect(0,0,10,10);
            rect(20,0,10,10);
            fill(130, 112, 95);
            rect(0,0,30,5);
            fill(99, 85, 72);
            rect(0,15,30,5);
            fill(199, 172, 40);
            rect(5,15,5,5);
            rect(20,15,5,5);
            fill(163, 148, 132);
            rect(0,0,5,30);
            rect(25,0,5,30);
            return "ladder";
       // break;    
    }
    popMatrix();
    return "done";
};
var playerG = function(x, y, t) 
{
    pushMatrix();
    translate(x, y);
    switch(t)
    {
        case 0://player1
            noStroke();
            fill(164, 182, 191);
            rect(0,0,30,30);
            fill(199, 98, 98);
            rect(5,10,5,10);
            rect(20,10,5,10);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            fill(129, 142, 148);
            rect(5,30,20,5);
            fill(129, 142, 148);
            rect(15,50,10,10);
            rect(5,50,10,10);
            fill(113, 125, 130);
            rect(10,50,10,10);
            fill(96, 108, 112);
            rect(0,35,10,10);
            fill(83, 94, 97);
            rect(5,35,5,10);
            fill(53, 63, 66);
            rect(10,35,20,10);
            fill(71, 84, 87);
            rect(20,45,10,5);
            fill(144, 164, 168);
            rect(10,45,10,5);
            return "player1";
       // break;    
        case 1://player2
            noStroke();
            fill(173, 140, 100);
            rect(0,0,30,30);
            fill(58, 107, 133);
            rect(5,10,5,10);
            rect(20,10,5,10);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            fill(133, 105, 73);
            rect(5,30,20,5);
            fill(133, 105, 73);
            rect(15,50,10,10);
            rect(5,50,10,10);
            fill(150, 119, 84);
            rect(10,50,10,10);
            fill(117, 93, 67);
            rect(0,35,10,10);
            fill(102, 80, 56);
            rect(5,35,5,10);
            fill(84, 66, 47);
            rect(10,35,20,10);
            fill(110, 87, 63);
            rect(20,45,10,5);
            fill(168, 141, 113);
            rect(10,45,10,5);
            return "player2";
       // break;    
        case 2://cpu
            noStroke();
            fill(82, 82, 82);
            rect(0,0,30,30);
            fill(88, 171, 84);
            rect(0,15,10,5);
            rect(20,15,10,5);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            fill(94, 94, 94);
            rect(5,30,20,5);
            fill(99, 99, 99);
            rect(15,50,10,10);
            rect(5,50,10,10);
            fill(87, 87, 87);
            rect(10,50,10,10);
            fill(122, 122, 122);
            rect(0,35,10,10);
            fill(143, 143, 143);
            rect(5,35,5,10);
            fill(156, 156, 156);
            rect(10,35,20,10);
            fill(140, 140, 140);
            rect(20,45,10,5);
            fill(79, 79, 79);
            rect(10,45,10,5);
            return "cpu";
       // break;    
        
    }
    popMatrix();
    return "done";
};
var powerG = function(x, y, t)
{
    pushMatrix();
    translate(x, y);
    switch(t)
    {
        case 0://health
            noStroke();
            fill(112, 148, 186);
            rect(0,0,30,30);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            fill(209, 65, 65);
            rect(5,10,20,10);
            rect(10,5,10,20);
            return "heal";
       ///break;
        case 1://rapid fire
            noStroke();
            fill(112, 102, 91);
            rect(0,0,30,30);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            fill(71, 70, 71);
            rect(5,5,20,20);
            fill(212, 85, 0);
            rect(5,5,10,5);
            rect(20,5,5,5);
            rect(5,20,5,5);
            rect(15,20,10,5);
            fill(82, 75, 67);
            rect(5,10,20,10);
            return "rapidFire";
       // break;
        case 2://bomb
            noStroke();
            fill(158, 143, 126);
            rect(0,0,30,30);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            fill(158, 143, 126);
            rect(5,5,20,20);
            fill(69, 69, 69);
            rect(10,10,10,10);
            fill(168, 67, 67);
            rect(20,5,5,5);
            rect(20,20,5,5);
            rect(5,5,5,5);
            rect(5,20,5,5);
            return "bomb";
//break;
        case 3://shield
            noStroke();
            fill(184, 152, 113);
            rect(0,0,30,30);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            fill(75, 99, 128);
            rect(5,5,20,15);
            rect(10,5,10,20);
            return "shield";
        //break;
        case 4://boom bomb
            noStroke();
            fill(67, 100, 115);
            rect(0,0,30,30);
            fill(0, 0, 0,20);
            rect(0,0,5,30);
            fill(255, 255, 255,20);
            rect(25,0,5,30);
            fill(153, 153, 153);
            rect(10,10,10,10);
            fill(214, 113, 58);
            rect(20,5,5,5);
            rect(20,20,5,5);
            rect(5,5,5,5);
            rect(5,20,5,5);
            return "boom";
        //break;
    }
    popMatrix();
    return "done";
};
var graphics = {
    blocks : {},
    players : {},   
    powers : {},
};
graphics.load = function()
{
    noStroke();
    
    var i = 0;
    while(true)
    {
        background(0,0,0,0);
        var g = blockG(0,0,i);
        graphics.blocks[g] = get(0,0,30,30);
        i++;
        if(g === "done")
        {
            break;
        }
    }
    
    var i = 0;
    while(true)
    {
        background(0,0,0,0);
        var g = playerG(0,0,i);
        graphics.players[g] = get(0,0,30,60);
        i++;
        if(g === "done")
        {
            break;
        }
    }
    
    var i = 0;
    while(true)
    {
        background(0,0,0,0);
        var g = powerG(0,0,i);
        graphics.powers[g] = get(0,0,30,30);
        i++;
        if(g === "done")
        {
            break;
        }
    }
};

var screenUtils = {
    shakeDuration : 0,
    startMillis : millis(),
    timer : 0,
    setShake : function(duration)
    {
        this.shakeDuration = duration;
        this.startMillis = millis();
    },
    shake : function()
    {
        if(this.shakeDuration !== 0 &&
           millis() - this.startMillis < this.shakeDuration)
        {
            if(millis() % 4 >= 3)
            {
                translate(random(-15, 15), random(-15, 15));
            }
        }
    },
    showGame : function()
    {
        var players = gameObjects.getObject("player");
        
        textSize(12);
        textAlign(LEFT, NORMAL);
        fill(0, 0, 0, 150);
        for(var i = 0; i < players.length; i++)
        {
            text(players[i].userName + " lives " + players[i].lives + ((players[i].type === "cpu") ? (" (" + players[i].mode + ((players[i].mode === "targeting") ? " " + players[i].cp : "") + ")") : ""), 20, 100 + i * 15);
        }
    },
    powerUpSpawner : function()
    {
        var powerUps = gameObjects.getObject("powerUp");
        if(millis() % 305 >= 304 && random(0, 1) > 0.5)
        {
            powerUps.add(levelInfo.xPos + round(random(0, levelInfo.width)), levelInfo.yPos, levelInfo.unitWidth, levelInfo.unitHeight);
        }
    },
    draw : function()
    {
        if(game.gameState === "play")
        {
            if(this.timer === 5 && 
            levels[levelInfo.level] !== undefined) //&&
            //(levels[levelInfo.level].img === undefined))
            {
                levels[levelInfo.level].img = get
                (0, 0, WIDTH, HEIGHT);
            }
            
            screenUtils.showGame();
            
            this.timer++;
        }else{
            this.timer = 0;    
        }
        
        screenUtils.powerUpSpawner();
        
        textSize(13);
        textAlign(LEFT, TOP);
        fill(0, 0, 0, 150);
        fpsCatcher.update();
        
        text("fps " + fpsCatcher.actualFps, 5, 5);
    },
};

var observer = {
    collisionTypes : {
        "blank" : {
            colliding : function() {},
            solveCollision : function() {},
        },
        "pointrect" : {
            colliding : function(point, rect, normal) 
            {
                if(rect.noFitBoundingBox || normal)
                {
                    return (point.xPos > rect.xPos && 
                            point.xPos < rect.xPos + rect.width &&
                            point.yPos > rect.yPos && 
                            point.yPos < rect.yPos + rect.height);
                }else{
                    return (point.xPos > rect.boundingBox.minXPos && 
                            point.xPos < rect.boundingBox.maxXPos &&
                            point.yPos > rect.boundingBox.minYPos && 
                            point.yPos < rect.boundingBox.maxYPos);
                }
            },
            solveCollision : function() {},
        },
        "circlerect" : {
            colliding : function(circle, rect) 
            {
                //Or according to Talal Zulfiqar
                // The distance from the center X of the circle to the rect.x at minimum or rect.x + rect.w at maximum
                var xPos = circle.xPos - constrain(circle.xPos, rect.xPos, rect.xPos + rect.width);
                // The distance from the center Y of the circle to the rect.y at minimum or rect.y + rect.h at maximum
                var yPos = circle.yPos - constrain(circle.yPos, rect.yPos, rect.yPos + rect.height);
                // The overall distance squared 
                var distance = xPos * xPos + yPos * yPos;
                // Regular method of testing whether a point is on or inside a circle
                return (distance <= circle.radius * circle.radius);
            },
            solveCollision : function() {},
        },
        "boundingBoxboundingBox" : {
            colliding : function(box1, box2)
            {
                return  (box1.maxXPos > box2.minXPos &&
                         box1.minXPos < box2.maxXPos &&
                         box1.maxYPos > box2.minYPos && 
                         box1.minYPos < box2.maxYPos);
            },
            solveCollision : function() {},
        },
        "rectrect" : {
            colliding : function(rect1, rect2)
            {
                return ((rect1.xPos + rect1.width > rect2.xPos && 
                         rect1.xPos < rect2.xPos + rect2.width) && 
                        (rect1.yPos + rect1.height > rect2.yPos && 
                         rect1.yPos < rect2.yPos + rect2.height));
            },
            getSide : function(rect1, rect2)
            {
                var vx = ((rect1.xPos + rect1.halfWidth) - (rect2.xPos + rect2.halfWidth)),
                    vy = ((rect1.yPos + rect1.halfHeight) - (rect2.yPos + rect2.halfHeight));
                
                var hWidths = (rect1.halfWidth + rect2.halfWidth),
                    hHeights = (rect1.halfHeight + rect2.halfHeight);
                
                var ox = hWidths - Math.abs(vx - rect1.xVel * 0.5),
                    oy = hHeights - Math.abs(vy - rect1.yVel * 0.7);
                
                if(ox < oy)
                {
                    if(vx < 0)
                    {
                        return "left";
                    }else{
                        return "right";
                    }
                }else{
                    if(vy < 0)
                    {
                        return "up";  
                    }else{
                        return "down";  
                    }
                }
            },
            applySide : function(side, rect1, rect2, noZero)
            {
                switch(side)
                {
                    case "left" :
                        rect1.xVel = (!noZero) ? 0 : min(-0.001, rect1.xVel);
                        rect1.xPos = rect2.xPos - rect1.width;
                        break;
                    
                    case "right" :
                        rect1.xVel = (!noZero) ? 0 : max(0.001, rect1.xVel);
                        rect1.xPos = rect2.xPos + rect2.width;
                        break;
                             
                    case "up" :
                        rect1.inAir = false;
                        rect1.yVel = (!noZero) ? 0 : min(-rect1.gravity, rect1.yVel);
                        rect1.yPos = rect2.yPos - rect1.height;
                        break;
                    
                    case "down" :
                        rect1.inAir = true;
                        rect1.yVel = (!noZero) ? 0 : min(0, rect1.yVel);
                        rect1.yPos = rect2.yPos + rect2.height;
                        
                        if(noZero)
                        {
                            rect2.yVel = max(0, rect2.yVel);
                        }
                        if(noZero && rect2.upForce && rect1.yVel < 0)
                        {
                            rect2.yVel = min(rect2.yVel, -rect2.upForce);    
                        }
                        break;
                }
            },
            getSideOneWay : function(side, rect1, oneWay) //For oneways
            {
                switch(side)
                {
                    case "left" :
                        if(oneWay.sides.left && rect1.xVel > 0 && 
                        rect1.xPos + rect1.width <= oneWay.xPos + abs(rect1.xVel))
                        {
                            return "left";    
                        }
                        break;
                    
                    case "right" :
                        if(oneWay.sides.right && rect1.xVel < 0 && 
                        rect1.xPos + abs(rect1.xVel) >= oneWay.xPos + oneWay.width)
                        {
                            return "right";    
                        }
                        break;
                        
                    case "up" :
                        if(oneWay.sides.up && rect1.yVel > 0 && 
                        rect1.yPos + rect1.height <= oneWay.yPos + abs(rect1.yVel))
                        {
                            return "up";    
                        }
                        break;
                        
                    case "down" :
                        if(oneWay.sides.down && rect1.yVel < 0 && 
                        rect1.yPos + abs(rect1.yVel) >= oneWay.yPos + oneWay.height)
                        {
                            return "down";    
                        }
                        break;
                }
                return "";
            },
            applyVelSide : function(side, rect1, rect2) //For crates
            {
                switch(side)
                {
                    case "left" :
                        if(rect1.xVel > 0)
                        {
                            rect2.xVel += rect1.xForce || rect1.xAcl * (rect1.mass || 1);  
                        }
                        return true;
                    
                    case "right" :
                        if(rect1.xVel < 0) 
                        {
                            rect2.xVel -= rect1.xForce || rect1.xAcl * (rect1.mass || 1);  
                        }
                        return true;
                        
                    case "up" :
                        if(rect1.yVel > 0)
                        {
                            rect2.yVel += rect1.yForce || (rect1.yAcl || 2) * (rect1.mass || 1);
                        }
                        return true;
                        
                    case "down" :
                        if(rect1.yVel < 0)
                        {
                            rect2.yVel -= rect1.yForce || (rect1.yAcl || 2) * (rect1.mass || 1); 
                        }
                        return true;
                }
                return false;
            },
            solveCollision : function(rect1, rect2)
            {
                var side = this.getSide(rect1, rect2);
                
                if(rect2.sides !== undefined)
                {
                    side = this.getSideOneWay(side, rect1, rect2);
                }
                
                var noZero;
                if(rect2.physics.movement === "dynamic")
                {
                    noZero = this.applyVelSide(side, rect1, rect2);
                }
                
                this.applySide(side, rect1, rect2, noZero);
                
                return {
                    side : side,
                };
            },
        },
    },
    access : function(object1, object2, access)
    {
        var info = observer.getType(
            object1.physics.shape,
            object2.physics.shape,
            observer.collisionTypes
        );
        var colliding = false;

        if(!info.flipped)
        {
            colliding = observer.collisionTypes[info.type][access](object1, object2);
        }else{
            colliding = observer.collisionTypes[info.type][access](object2, object1);
        }
        return colliding;
    },
    colliding : function(object1, object2)
    {
        return this.access(object1, object2, "colliding");
    },
    solveCollision : function(object1, object2)
    {
        return this.access(object1, object2, "solveCollision");
    },
    boundingBoxesColliding : function(box1, box2)
    {
        return observer.collisionTypes.boundingBoxboundingBox.colliding(box1, box2);
    },
    getType : function(name1, name2, delegate)
    {
        var typeToReturn = "blank";
        var flipped = false;
        var type = name1 + name2;
        if(delegate[type] !== undefined)
        {
            typeToReturn = type;
        }else{
            //Flip shapes
            flipped = true;
            type = name2 + name1;
            if(delegate[type])
            {
                typeToReturn = type;
            }
        }
        return {
            type : typeToReturn,
            flipped : flipped,
        };
    },
};

var gameObjects = createArray([]);
gameObjects.empty = function()
{
    for(var i = 0; i < this.length; i++)
    {
        this[i].splice(0, this[i].length);  
    }
};
gameObjects.apply = function()
{
    for(var i = 0; i < this.length; i++)
    {
        for(var j = 0; j < this[i].length; j++)
        {
            this[i][j].draw();
            this[i][j].update();
            
            this.applyCollision(this[i][j]);
            this[i].applyObject(j);
        }
    }
};
gameObjects.applyCollision = function(objectA)
{
    if(objectA.physics.movement === "static")
    {
        return;
    }
    
    for(var i = 0; i < this.length; i++)
    {
        for(var j = 0; j < this[i].length; j++)
        {
            var objectB = this[i][j];
          
            //Don't check an object itself
            if(objectA.arrayName === objectB.arrayName &&
            objectA.index === objectB.index)
            {
                continue;  
            }
            
            //Check bounding boxes
            if((objectA.boundingBox && objectB.boundingBox) && 
               !observer.boundingBoxesColliding(objectA.boundingBox, objectB.boundingBox))
            {
                continue;
            }
            
            var colliding = true;
            
            if(!(objectA.physics.shape === "rect" && objectB.physics.shape === "rect")) //Assuming rects fill their boundingBox
            {
                colliding = observer.colliding(objectA, objectB);
            }

            if(colliding)
            {
                var returned;
                
                if(objectA.physics.solidObject && objectB.physics.solidObject)
                {
                    returned = observer.solveCollision(objectA, objectB);
                }
                
                objectA.onCollide(objectB, returned);
                objectB.onCollide(objectA, returned);
            }
        }
    }
};

var GameObject = function(xPos, yPos)
{
    this.xPos = xPos;
    this.yPos = yPos;
    
    this.physics = {
        movement : "static",  
        solidObject : true,
    };
    
    this.boundingBox = {};
    
    this.remove = function()
    {
        this.delete = true;  
    };
    
    this.draw = function() {};
    this.update = function() {};
    this.onCollide = function() {};
};

var Circle = function(xPos, yPos, diameter)
{
    GameObject.call(this, xPos, yPos);
    
    this.diameter = diameter;
    this.radius = this.diameter / 2;
    this.physics.shape = "circle";
    
    this.setBoundingBox = function()
    {
        this.boundingBox.minXPos = this.xPos - this.radius;
        this.boundingBox.minYPos = this.yPos - this.radius;
        this.boundingBox.maxXPos = this.xPos + this.radius;
        this.boundingBox.maxYPos = this.yPos + this.radius;
    };
    
    this.draw = function()
    {
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.diameter, this.diameter);
    };
};

var Point = function(xPos, yPos)
{
    GameObject.call(this, xPos, yPos);
    
    this.physics.shape = "point";
    this.boundingBox = undefined;
    
    this.draw = function()
    {
        strokeWeight(2);
        point(this.xPos, this.yPos);
    };
};

var Rect = function(xPos, yPos, width, height)
{
    GameObject.call(this, xPos, yPos);
    
    this.width = width;
    this.height = height;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    
    this.physics.shape = "rect";
    
    this.setBoundingBox = function()
    {
        this.boundingBox.minXPos = this.xPos;
        this.boundingBox.minYPos = this.yPos;
        this.boundingBox.maxXPos = this.xPos + this.width;
        this.boundingBox.maxYPos = this.yPos + this.height;
    };
    
    this.setBoundingBox();
    
    this.draw = function()
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
    };
};

var DynamicRect = function(xPos, yPos, width, height)
{
    Rect.call(this, xPos, yPos, width, height);
    
    this.physics.movement = "dynamic";
    
    this.autoXDeacl = true;
    this.xAcl = 1;
    this.xDeacl = 0.25;
    this.xVel = 0;
    this.maxXVel = 5;
    
    this.inAir = true;
    this.jumpHeight = 12;
    this.gravity = 0.5;
    this.yVel = 0;
    this.maxYVel = 14;
   
    this.climbSpeed = 2;
   
    this.update = function()
    {
        if(this.autoXDeacl)
        {
            if(this.xVel < 0)
            {
                this.xVel += this.xDeacl;  
            }
            else if(this.xVel > 0)
            {
                this.xVel -= this.xDeacl;
            }
            
            if(Math.abs(this.xVel) < this.xDeacl)
            {
                this.xVel = 0;  
            }
        }
        
        this.xVel = constrain(this.xVel, -this.maxXVel, this.maxXVel);
        
        this.xPos += this.xVel;
        
       // this.xPos += constrain(this.xVel * game.fps / fpsCatcher.actualFps, -this.maxXVel, this.maxXVel);
        
        this.xPos = constrain(this.xPos, levelInfo.xPos, levelInfo.xPos + levelInfo.width - this.width);
    
        if(!this.onLadder)
        {
            this.yVel += this.gravity;
        }
        
        this.inAir = true;

        this.onLadder = false;
        
        this.yVel = constrain(this.yVel, -this.maxYVel, this.maxYVel);
        
        this.yPos += this.yVel;
        //this.yPos += constrain(this.yVel * game.fps / fpsCatcher.actualFps, -this.maxYVel, this.maxYVel);
        
        this.yPos = max(this.yPos, levelInfo.yPos);//constrain(this.yPos, levelInfo.yPos, levelInfo.yPos + levelInfo.height - this.height);
        
        this.setBoundingBox();
    };
};

var Block = function(xPos, yPos, width, height, colorValue, type)
{
    Rect.call(this, xPos, yPos, width, height);
    this.color = colorValue || 155;
    
    this.type = type;
    this.draw = function() 
    {
        image(graphics.blocks[this.type || "floor"], this.xPos, this.yPos, this.width, this.height);
    };
};
gameObjects.addObject("block", createArray(Block));

var OneWay = function(xPos, yPos, width, height, colorValue, sides)
{
    Rect.call(this, xPos, yPos, width, height);
    this.color = colorValue || 155;
    this.sides = sides || {
         up : true, 
    };
    
    this.draw = function()
    {
        pushMatrix();
        if(this.sides.left)
        {
            translate(this.xPos,
                      this.yPos + this.height);
            rotate(270);
            image(graphics.blocks.platform2, 0, 0, this.width, this.height);
            popMatrix();
        }
        if(this.sides.right)
        {
            translate(this.xPos + this.width,
                      this.yPos);
            rotate(90);
            image(graphics.blocks.platform2, 0, 0, this.width, this.height);
            popMatrix();
        }
        if(this.sides.up)
        {
            image(graphics.blocks.platform, 
            this.xPos, this.yPos, this.width, this.height);
            popMatrix();
        }
        if(this.sides.down)
        {
            translate(this.xPos + this.width,
                      this.yPos + this.height);
            rotate(180);
            image(graphics.blocks.platform, 0, 0, this.width, this.height);
            popMatrix();
        }
        
        noStroke();
    };
};
gameObjects.addObject("oneWay", createArray(OneWay));

var Lava = function(xPos, yPos, width, height, colorValue)
{
    Rect.call(this, xPos, yPos, width, height);
    this.color = colorValue || color(200, 0, 0, 100);
    
    this.physics.solidObject = false;
    
    this.damage = 1;
    this.onCollide = function(object)
    {
        if((object.physics.shape !== "rect" ||
        (object.yPos + object.height > this.yPos + 1 && 
         object.yPos + 1 < this.yPos + this.height)) &&
        object.takeDamage !== undefined)
        {
            object.takeDamage(this.damage);
        }
    };
    
    this.draw = function() 
    {
        image(graphics.blocks.lava, this.xPos, this.yPos, this.width, this.height);
    };
};
gameObjects.addObject("lava", createArray(Lava));

var Crate = function(xPos, yPos, width, height, colorValue)
{
    DynamicRect.call(this, xPos, yPos, width, height);
    this.color = colorValue || color(200, 130, 0);
    this.yAcl = 3;
    this.xAcl = 3;
    this.upForce = 3.51 * 1.5;
    
    this.draw = function() 
    {
        image(graphics.blocks.crate, this.xPos, this.yPos, this.width, this.height);
    };
    
    this.lastUpdate = this.update;
    this.update = function()
    {
        this.lastUpdate();
        
        if(this.yPos + this.height > levelInfo.yPos + levelInfo.height)
        {
            this.remove();    
        }
    };
};
gameObjects.addObject("crate", createArray(Crate));

var Ladder = function(xPos, yPos, width, height, colorValue)
{
    Rect.call(this, xPos, yPos, width, height);
    
    this.physics.solidObject = false;
    
    this.draw = function() 
    {
        for(var i = 0; i < this.height / 30; i++)
        {
        image(graphics.blocks.ladder, this.xPos, this.yPos + i * 30);
        }
    };
    
    this.onCollide = function(object)
    {
        if(object.physics.movement === "dynamic" && object.type !== "powerUp")
        {
            object.yVel = 0;    
        }
        object.onLadder = true;
    };
};
gameObjects.addObject("ladder", createArray(Ladder));

var PowerUp = function(xPos, yPos, width, height, kind)
{
    DynamicRect.call(this, xPos, yPos, width, height);
    this.physics.solidObject = false;
    
    this.type = "powerUp";
    
    this.gravity = 0.03;
    
    var kinds = ["rapidFire", "bomb", "heal", "boom", "shield"];
    
    this.kind = kind || kinds[floor(random(0, kinds.length))];
    
    this.maxYVel = 3;
    
    this.draw = function()
    {
        
        image(graphics.powers[this.kind], this.xPos, this.yPos, this.width, this.height);
    };
    
    this.lastUpdate = this.update;
    this.update = function()
    {
        this.lastUpdate();
        
        if(this.yPos >= levelInfo.yPos + levelInfo.height)
        {
            this.remove();    
        }
    };
    
    this.onCollide = function(object)
    {
        if(object.arrayName === "player")
        {
            if(!object.powerUps[this.kind].on)
            {
                if(this.kind === "heal")
                {
                    object.hp += object.powerUps[this.kind].amt;
                    object.hp = min(
                    object.hp, object.maxHp);
                }else{
                    object.powerUps[this.kind].on = true;
                    object.powerUps[this.kind].startMillis = millis();
                    if(this.kind === "bomb" || this.kind === "boom")
                    {
                        object.powerUps[this.kind].thrown = false;
                    }
                }
            }
            this.remove();
        }
    };
};
gameObjects.addObject("powerUp", createArray(PowerUp));

var Bullet = function(xPos, yPos, diameter, colorValue)
{
    Circle.call(this, xPos, yPos, diameter); 
    this.color = colorValue || color(200, 80, 20);//color(130, 130, 130);
    
    if(!settings.accurateBullets)
    {
        this.physics.shape = "point";
        this.boundingBox = undefined;
        this.setBoundingBox = function() {};
    }
    this.physics.movement = "dynamic";
    this.physics.solidObject = false;
    
    this.xVel = 0;
    this.yVel = 0;
    
    this.damage = 2;
    
    this.angle = 0;
    this.speed = 1;
    this.maxSpeed = 4;
    
    this.gravity = 0;
    
    this.draw = function()
    {
        noStroke();
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.diameter, this.diameter);
    };
    
    this.winding = 0;
    
    this.set = function(angle, speed, maxSpeed)
    {
        angle -= 90;
        angle %= 360;
        
        this.angle = angle;
        this.speed = speed || 1;
        this.maxSpeed = maxSpeed || this.maxSpeed;
    };
    
    this.isBoom = false;
    
    this.lastUpdate = this.update;
    this.update = function()
    {
        this.lastUpdate();

        if(this.speed !== this.maxSpeed)
        {
            this.angle += this.winding;
        
            this.xVel += cos(this.angle) * this.speed;
            this.yVel += sin(this.angle) * this.speed;
              
            var d = dist(0, 0, this.xVel, this.yVel);
            var a = atan2(this.yVel, this.xVel);
                
            this.xVel = cos(a) * min(d, this.maxSpeed);
            this.yVel = sin(a) * min(d, this.maxSpeed);
        }else{
            this.xVel = cos(this.angle) * this.speed;
            this.yVel = sin(this.angle) * this.speed;
        }
        
        this.xPos += this.xVel;
        this.yPos += this.yVel;
        
        //If bullet is outside of the arena delete it
        if(this.xPos < levelInfo.xPos || 
           this.xPos > levelInfo.xPos + levelInfo.width ||
           this.yPos < levelInfo.yPos || 
           this.yPos > levelInfo.yPos + levelInfo.height)
        {
            if(this.isBoom)
            {
                this.detonate();   
            }else{
                this.remove();
            }
        }
        
        this.setBoundingBox();   
    };
    
    this.multiply = function(amt, color)
    {
        var bullets = gameObjects.getObject("bullet");
        
        for(var i = 0; i < amt; i++)
        {
            bullets.add(this.xPos + random(-8, 8), this.yPos + random(-8, 8), 7, color);
            var obj = bullets.last();
            obj.set(random(0, 360), 1, round(random(2, 4)) * 2);
            
            obj.damage = 2.3;//1.5;
            obj.fromObject = this.fromObject;
        }
    };
    
    this.detonate = function()
    {
        screenUtils.setShake(2000);
        this.multiply(floor(random(10, 20)) * 23, this.color);  
        this.remove();
    };
    
    this.onCollide = function(object)
    {
        if(object.arrayName === "player" && object.powerUps.shield.on && !(this.fromObject.arrayName === "player" && this.fromObject.index === object.index))
        {
            this.remove();
            return;
        }
        
        if(this.isBoom && (object.arrayName === "block" || object.arrayName === "crate"))
        {
            this.detonate();
            return;
        }
        
        if(object.arrayName === "lava" || object.arrayName === "oneWay" || object.arrayName === "ladder" || object.arrayName === "powerUp" || (this.isBoom && object.arrayName === "player"))
        {
            return;    
        }
        
        if(this.arrayName !== object.arrayName &&
        (this.fromObject === undefined || 
        !(object.arrayName === this.fromObject.arrayName && 
          object.index === this.fromObject.index)))
        {
            if(object.takeDamage !== undefined)
            {
                object.takeDamage(this.damage);
                
                this.fromObject.landedHits += 1;
                
                this.fromObject.lastLandedHit = millis();
                
                //Knockback
                object.xVel += this.xVel;
            }
            
            this.remove();
            this.onCollide = function() {};
        }
    };
};
gameObjects.addObject("bullet", createArray(Bullet));

var Shooter = function(xPos, yPos, diameter)
{
    Circle.call(this, xPos, yPos, diameter);
    
    this.physics.solidObject = false;
    
    this.color = 135;
    
    this.rotation = 260;
    
    this.draw = function()
    {
        noStroke();
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.diameter, this.diameter);
        pushMatrix();
            translate(this.xPos, this.yPos);
            rotate(this.rotation);
            rect(-5, 0, 10, this.diameter); 
        popMatrix();
    };
    
    this.createBullet = function()
    {
        var bullets = gameObjects.getObject("bullet");
        
        bullets.add(this.xPos + cos(this.rotation + 90) * this.diameter, this.yPos + sin(this.rotation + 90) * this.diameter - 2.5, 5);
        
        var obj = bullets.last();
        obj.set((this.rotation + 180) % 360, 1, 4);
        obj.damage = 2.75;//3;//4;
        obj.fromObject = this;
    };
    
    var players = gameObjects.getObject("player");
        
    var obj = players.last();
    this.pointAtClosestPlayer = function()
    {
        if(millis() % 50 >= 48)
        {
            players = gameObjects.getObject("player");
            obj = players.last();
            var closest = Infinity;
            for(var i = 0; i < players.length; i++)
            {
                var d = dist(this.xPos, this.yPos, players[i].xPos, players[i].yPos);
                if(d < closest) 
                {
                    closest = d;
                    obj = players[i];
                }
            }
        }
        
        this.rotation = atan2(obj.yPos + obj.halfHeight - this.yPos, 
                              obj.xPos + obj.halfWidth - this.xPos) - 90;
    };
    
    var timer = random(0, 100);
    this.update = function()
    {
        //this.rotation++;
        
        this.pointAtClosestPlayer();
        
        if(timer < 0)
        {
            this.createBullet();
            timer = random(150, 200);
        }
        
        timer--;
    };
};
gameObjects.addObject("shooter", createArray(Shooter));

var Player = function(xPos, yPos, width, height,colorValue)
{
    DynamicRect.call(this, xPos, yPos, width, height);
    this.color = colorValue || color(0, 130, 200);
    this.autoXDeacl = false; 
    this.maxXVel = 4.2;
    
    this.xForce = 1;
    this.yForce = 1;
    
    this.lives = settings.LIVES || 3;
    this.dead = false;
     
    this.type = "player"; 
     
    this.facing = "left"; 
     
    this.hp = settings.HP || 35;
    this.maxHp = this.hp;
    this.percentDefense = 0.2;
    
    this.hpBar = new HpBar(this.xPos, this.yPos, 60, 5);
    
    this.xDir = "";
    this.yDir = "";
    
    this.takeDamage = function(attack)
    {
        if(this.dead || this.powerUps.shield.on)
        {
            return;  
        }
      
        if(typeof attack === "object")
        {
            this.hp -= attack.damage;
        }else{
            this.hp -= attack;
        }
    };
    
    this.respawnTimer = 0;
    this.respawnMillis = millis();
    this.respawnTime = 2000;
    
    this.jumping = false;
    this.jumpSpeed = 1.85;
    this.jumpTimer = 0;
    this.jumpTime = 6;
    
    this.lastLandedHit = 0;
    
    this.controls = {
        left : function()
        {
            return (keys[65]);
        },
        right : function()
        {
            return (keys[68]);
        },
        up : function()
        {
            return (keys[87]);
        },
        down : function()
        {
            return (keys[83]);
        },
        second : function()
        {
            return (keys[32]);  
        },
    };
    
    this.afterCreate = function(self)
    {
        self.userName = self.arrayName + self.index;
    };
    
    this.getImageName = function()
    {
        if(this.type === "cpu")
        {
            return "cpu";    
        }
        
        var name = this.type + (((this.index) % 2) + 1);
        if(name !== "player2")
        {
            name = "player1";
        }
        return name;
    };
        
    this.draw = function() 
    {
        if(this.imageName === undefined)
        {
            this.imageName = this.getImageName();
        }
        var name = this.imageName;
        
        if(this.facing === "left")
        {
            image(graphics.players[name],
            this.xPos, this.yPos, this.width, this.height);
        }else{
            pushMatrix();
            translate(this.width + this.xPos, this.yPos);
            scale(-1.0, 1.0);
            image(graphics.players[name],
            0, 0, this.width, this.height);
            popMatrix();
        }
        
        if(this.powerUps.shield.on)
        {
            noFill();
            strokeWeight(4);
            stroke(0, 220, 160, 100);
            ellipse(this.xPos + this.halfWidth, this.yPos + this.halfHeight, this.width * 2.1, this.width * 2.1);
            noStroke();
        }
    };
    
    this.lastDraw = this.draw;
    this.draw = function()
    {
        if(this.dead)
        {
            return;    
        }
        
        this.lastDraw();
        this.handleHpBar();
        this.hpBar.draw(this.hp, this.maxHp);
        this.drawPowerUps();
        
        var cp;
        var players = gameObjects.getObject("player");
        var toTarget = (players[this.targetPerson] || {
            userName : "",
        });
        cp = ((this.type === "cpu") ? ((toTarget.userName.charAt(0) + toTarget.userName.match(/.$/)).toUpperCase()) : "");
        cp = ((cp === "NULL") ? "" : cp);
        this.cp = cp;
        
        textAlign(LEFT);
        fill(0, 0, 0, 100);
        textSize(12);
        text(((this.userName.charAt(0) + this.userName.match(/.$/)).toUpperCase()) + "         " + cp, this.xPos - 15, this.yPos);
    };
    
    this.updateMovement = function()
    {
        if(this.controls.left())
        {
            this.xVel -= this.xAcl;
            if(this.type !== "cpu")
            {
                this.facing = "left";
            }
        }
        else if(this.controls.right())
        {
            this.xVel += this.xAcl;
            if(this.type !== "cpu")
            {
                this.facing = "right";
            }
        }else{
            if(this.xVel < 0)
            {
                this.xVel += this.xDeacl;  
            }
            else if(this.xVel > 0)
            {
                this.xVel -= this.xDeacl;
            }
            
            if(Math.abs(this.xVel) < this.xDeacl)
            {
                this.xVel = 0;
            }
        }
        
        if(this.controls.up())
        {
            if(this.onLadder)
            {
                this.yVel = -this.climbSpeed;
            }
            else if(this.jumpTimer <= this.jumpTime && this.yVel > -this.jumpHeight)
            {
                if(!this.inAir)
                {
                    this.jumping = true;
                    this.jumpTimer = 0;
                }
                
                if(this.jumping)
                {
                    this.yVel -= this.jumpSpeed;
                    this.jumpTimer++;
                }
            }else{
                this.jumping = false;
                this.jumpTimer = 0;
            }
        }
        
        if(this.controls.down())
        {
            if(this.onLadder)
            {
                this.yVel = this.climbSpeed;
            }
        }
    };
    
    this.updateLife = function()
    {
        if(!this.dead && (this.hp <= 0 || this.yPos > levelInfo.yPos + levelInfo.height))
        {
            this.dead = true;
            this.respawnMillis = millis();
            this.lives--;
            this.xVel = 0;
        }
        
        if(this.dead)
        {
            this.lastFight = false;
            
            if(this.hp <= 0)
            {
                this.yPos = levelInfo.yPos;
                this.yVel = 0;
            }
            
            if(this.lives <= 0 && millis() - this.respawnMillis > 100)
            {
                this.remove();
            }
            
            if(millis() - this.respawnMillis > this.respawnTime)
            {
                this.dead = false;
                this.hp = this.maxHp;
                this.yPos = levelInfo.yPos;
                this.xPos = levelInfo.xPos + round(random(0, levelInfo.width - this.width));
            }
        }
    };
    
    this.handleHpBar = function()
    {
        this.hpBar.xPos = this.xPos + this.halfWidth - this.hpBar.width / 2;
        this.hpBar.yPos = this.yPos - this.hpBar.height * 2;
    };
    
    this.nextBullet = 0;
    this.landedHits = 0;
    
    this.createBullet = function(d, s1, s2, diameter, a, w, isBoom, color)
    {
        var bullets = gameObjects.getObject("bullet");
        
        bullets.add((this.xPos + this.halfWidth) + this.halfWidth * ((this.facing === "left") ? -1 : 1), this.yPos + this.halfHeight * 1.3, diameter || 5, color);
        var bullet = bullets.last();
        
        // if(this.controls.up())
        // {
        //     bullet.set(360, 2.8, 3);
        // }else{
            bullet.set(a || {
                "right" : 90,
                "left" : 270,
            }[this.facing], s1 || 1, s2 || 7);
        // }
        
        bullet.damage = d || 2;
        bullet.fromObject = this;
        bullet.winding = w || 0;
        bullet.isBoom = isBoom;
    };
    
    this.handleBullets = function(control)
    {
        if(control && this.nextBullet <= 0)
        {
            this.createBullet();
            
            this.nextBullet = 50;
            
            if(this.powerUps.rapidFire.on)
            {
                this.nextBullet = 15;
            }
        }
        
        this.nextBullet--;
    };
    
    this.pickTargetPerson = function(tt)
    {
        var players = gameObjects.getObject("player");
        
        if(players.length > 1)
        {
            var loops = 0;
            while(this.targetPerson === undefined || 
                  this.targetPerson === this.index ||
                  (!tt && players[this.targetPerson] !== undefined && players[this.targetPerson].dead))
            {
                this.targetPerson = floor(random(0, players.length));
                loops++;
                
                if(loops > 50)
                {
                    break;
                }
            }
        }
    };
    
    this.mode = "";
    
    this.getMode = function()
    {
        if(this.cpuMode === 0)
        {
                
        }
        else if(this.cpuMode === 1)
        {
            //return "run";
            
            if((this.hp < this.maxHp * 0.35 || (millis() - this.lastLandedHit > 600 &&  millis() - this.lastLandedHit < 800)) && !this.lastFight)
            {
                if(this.mode === "targeting")
                {
                    if(this.xDir === "left")
                    {
                        this.rightTimer = 30;
                    }
                    else if(this.xDir === "right")
                    {
                        this.leftTimer = 30;
                    }
                    this.yDir = "up";
                    this.leftTimer = 0;
                    this.rightTimer = 0;
                    this.cpuJumpTimer = 0;
                }
                return "run";
            }
            else if(this.yPos < levelInfo.yPos + levelInfo.height * 0.13)
            {
                return "goDown";
            }
            else if(this.mode !== "targeting" &&
            millis() % 30 >= 29 &&
            random(0, 1) > 0.5)
            {
                this.pickTargetPerson();
                return "targeting";
            }
            
            if(this.lastFight)
            {
                return "targeting";  
            }
            
            if(this.mode === "goDown")
            {
                return "";
            }
        }
        return this.mode;
    };
    
    this.setControls = function(self)
    {
        this.controls.left = function()
        {
            return (self.xDir === "left");    
        };
        this.controls.right = function()
        {
            return (self.xDir === "right");    
        };
        this.controls.up = function()
        {
            return (self.yDir === "up" || this.goUp);    
        };
        this.controls.down = function()
        {
            return (self.yDir === "down" || self.activeShoot);
        };
        this.controls.second = function()
        {
            return (self.second);
        };
    };
    
    this.warnLava = function()
    {
        var lavas = gameObjects.getObject("lava");
        
        var ret = {};
        
        for(var i = 0; i < lavas.length; i++)
        {
            var lava = lavas[i];
            var left = lava.xPos + lava.width;
            var right = this.xPos + this.width;
            var up = lava.yPos + lava.height;
            var down = this.yPos + this.height;
            
            if(left > this.xPos && lava.xPos > right)
            {
                var up = lava.yPos + lava.height;
                if(up < this.yPos)
                {
                    ret.up = this.yPos - up;
                    ret.lup = lava;
                }
                else if(!ret.down && lava.yPos > down)
                {
                    ret.down = lava.yPos - down;
                    ret.ldown = lava;
                }
            }
            else if(up > this.yPos && lava.yPos < down)
            {
                if(left < this.xPos)
                {
                    ret.left = this.xPos - left;
                    
                    ret.lleft = lava;
                }
                else if(lava.xPos < right)
                {
                    ret.right = abs(lava.xPos - right);
                    ret.lright = lava;
                }
            }
            
            if(ret.left && ret.right && ret.up && ret.down)
            {
                break;    
            }
        }
        
        return ret;
    };
    
    this.getClosestLava = function()
    {
        var warnLava = this.warnLava();
        var minimum = Infinity;
        var dir = "";
        var xDir = "";
        var yDir = "";
        var llava = {};
        
        if(warnLava.left && warnLava.left < minimum)
        {
            minimum = warnLava.left;
            dir = "left";
            xDir = "left";
            llava = warnLava.lleft;
        }
        if(warnLava.right && warnLava.right < minimum)
        {
            minimum = warnLava.right;
            dir = "right";
            xDir = "right";
            llava = warnLava.lright;
        }
        if(warnLava.up && warnLava.up < minimum)
        {
            minimum = warnLava.up;
            dir = "up";
            yDir = "up";
            llava = warnLava.lup;
        }
        if(warnLava.down && warnLava.down < minimum)
        {
            minimum = warnLava.down;
            dir = "down";
            yDir = "down";
            llava = warnLava.ldown;
        }
        return {
            range : (minimum !== Infinity) ? minimum : 0,
            dir : dir,
            yDir : yDir,
            xDir : xDir,
            warnLava : warnLava,
            llava : llava,
        };
    };
    
    this.cpuJumpTimer = 0;
    this.leftTimer = 0;
    this.rightTimer = 0;
    this.toSetXDir = "";
    this.normalDist = 150;
    
    this.blocksBelow = function()
    {
        var rect1 = {
            xPos : this.xPos + this.halfWidth,
            yPos : this.yPos + this.height,
            width : 1,
            height : levelInfo.height
        };
        
        var blocks = gameObjects.getObject("block");
        for(var i = 0; i < blocks.length; i++)
        {
            if(observer.collisionTypes.rectrect.
            colliding(blocks[i], rect1))
            {
                return false;
            }
        }
        
        var platforms = gameObjects.getObject("oneWay");
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].sides.up &&
            observer.collisionTypes.rectrect.
            colliding(platforms[i], rect1))
            {
                return false;
            }
        }
        
        return true;
    };
    
    this.cpuUpTimer = 0;
    
    this.cpuMode = 1;
    
    this.getClosest = function(name)
    {
        var objs = gameObjects.getObject(name);
                
        var obj = objs[objs.length - 1];
        
        var d = Infinity;
        var closest = Infinity;
        for(var i = 0; i < objs.length; i++)
        {
            d = dist(this.xPos, this.yPos, objs[i].xPos, objs[i].yPos);
            if(d < closest)
            {
                closest = d;
                obj = objs[i];
            }
        }
        
        return {
            d : d,
            closest : closest,
            obj : obj,
        };
    };
    
    this.avoidLava = function()
    {
        var lavas = gameObjects.getObject("lava");
                
        var obj = lavas[lavas.length - 1];
        
        var d = Infinity;
        var closest = Infinity;
        for(var i = 0; i < lavas.length; i++)
        {
            d = dist(this.xPos, this.yPos, lavas[i].xPos, lavas[i].yPos);
            if(d < closest)
            {
                closest = d;
                obj = lavas[i];
            }
        }
        
        if(closest < 200 && 
        //this.yPos + this.height < obj.yPos &&
        this.inAir &&
        this.xPos + this.width > obj.xPos &&
        this.xPos < obj.xPos + obj.width)
        {
            if(!this.setSave)
            {
                if(random(0, 1) < 0.5)
                {
                    this.xDir = "left";
                }else{
                    this.xDir = "right";
                }
            }
            this.setSave = true;
        }
        else if(closest < 60)
        {
            if(obj.xPos + obj.halfWidth < 
            this.xPos + this.halfWidth)
            {
                this.xDir = "right";    
            }else{
                this.xDir = "left";
            }
            
            this.setSave = false;
        }else{
            this.xDir = "";   
            this.setSave = false;
        }
    };
    
    this.updateCpu0 = function()
    {
        this.avoidLava();
    };
    
    this.trippedLadder = 0;
    this.updateCpu = function()
    {
        if(this.type === "cpu")// && millis() % 1 >= 0)
        {
            if(!this.setControls)
            {
                this.setControls(this);
                this.pickTargetPerson();
                this.setControls = true;
            }
            
            var players = gameObjects.getObject("player");
            var powerUps = gameObjects.getObject("powerUp");
            this.mode = this.getMode();

            /*Prevent from selecting nobody*/
            if((players[this.targetPerson] === undefined || this.targetPerson === this.index) && millis() % 100 >= 98 && players.length > 1)
            {
                this.targetPerson = this.index + 1;
                if(this.targetPerson >= players.length)
                {
                    this.targetPerson = 0;
                }
            }

            if(this.cpuMode === 0)
            {
                this.updateCpu0();
                
                this.setControls(this);
            }
            else if(this.cpuMode === 1)
            {
                var tripped = false;
                
                if(this.mode === "")
                {
                    this.xDir = "";
                    this.yDir = "";
                }
                else if(this.mode === "run")
                {
                    if(players[this.targetPerson] !== undefined)
                    {
                        var toTarget = players[this.targetPerson];
                        if(random(0, 1) > 0.9)
                        {
                            if(toTarget.xPos + toTarget.width < this.xPos)
                            {
                                this.toSetXDir = "right";
                                this.facing = "left";
                            }
                            else if(toTarget.xPos > this.xPos + this.width)
                            {
                                this.toSetXDir = "left";
                                this.facing = "right";
                            }
                        }else{
                            if(toTarget.xPos + toTarget.width < this.xPos)
                            {
                                this.facing = "left";
                            }
                            else if(toTarget.xPos > this.xPos + this.width)
                            {
                                this.facing = "right";
                            }
                        }
                    }
                    
                    this.xDir = this.toSetXDir;
                    
                    if(millis() % 30 >= 29 && 
                    random(0, 1) > 0.4)
                    {
                        if(this.xDir === "")
                        {
                            if(random(0, 1) > 0.5)
                            {
                                this.xDir = "left";    
                            }else{
                                this.xDir = "right";    
                            }
                        }
                        
                        if(this.xDir === "left" && this.rightTimer <= 0)
                        {
                            this.rightTimer = 30;
                        }
                        else if(this.xDir === "right" && this.leftTimer <= 0)
                        {
                            this.leftTimer = 30;
                        }
                    }
                    
                    if(millis() % 200 >= 199 && 
                    random(0, 1) > 0.5)
                    {
                        this.leftTimer = 0;
                        this.rightTimer = 0;
                        
                        if(random(0, 1) > 0.5)
                        {
                            this.xDir = "left";    
                        }else{
                            this.xDir = "right";
                        }
                        this.cpuJumpTimer = 20;
                    }
                    
                    if(millis() % 6500 >= 6500 - 1)
                    {
                        this.mode = "targeting";
                        this.lastFight = true;
                    }
                }
                else if(this.mode === "goDown")
                {
                    
                }
                else if(this.mode === "targeting" && 
                players[this.targetPerson] !== undefined)
                {
                    var toTarget = players[this.targetPerson];
                    
                    if(powerUps.length > 0 && random(0, 1) > 0.3)
                    {
                        toTarget = (this.getClosest
                        ("powerUp").obj || players[this.targetPerson]);
                        tripped = true;
                    }
            
                    // if(toTarget.dead)
                    // {
                    //     this.pickTargetPerson();
                    // }
                    
                    var ds = dist(this.xPos + this.halfWidth, 
                    this.yPos + this.halfHeight,
                    toTarget.xPos + toTarget.halfWidth, 
                    toTarget.yPos + toTarget.halfHeight);
                    
                    if(toTarget.dead || (ds > 300 && 
                    millis % 4 >= 3) || random(0, 1) < 0.02)
                    {
                        this.pickTargetPerson();
                    }
                    if(ds < 300 || tripped)
                    {
                        if(toTarget.xPos + toTarget.width <
                        this.xPos)
                        {
                            if(tripped || ds > this.normalDist)
                            {
                                this.toSetXDir = "left";
                            }else{
                                //if(ds < this.normalDist)
                                {
                                    if(//millis() % 5 >= 4 &&
                                    random(0, 1) < 0.03 && 
                                    this.yPos >= toTarget.yPos-40&&
                                    this.rightTimer <= 0)
                                    {
                                        //this.toSetXDir = "left";
                                        this.cpuJumpTimer = 10; 
                                        this.rightTimer = 0;
                                        this.leftTimer = 40;
                                    }else{
                                        this.toSetXDir = "right";
                                        if(this.leftTimer < 0)
                                        {
                                            this.rightTimer = 20;
                                        }
                                    }
                                }
                            } 
                            this.facing = "left";
                        }
                        else if(toTarget.xPos > 
                        this.xPos + this.width)
                        {
                            if(tripped || ds > this.normalDist)
                            {
                                this.toSetXDir = "right";
                            }else{
                                //if(ds < this.normalDist)
                                {
                                    if(//millis() % 5 >= 4 &&
                                    random(0, 1) < 0.03 && 
                                    this.yPos >= toTarget.yPos-40&&
                                    this.leftTimer <= 0)
                                    {
                                        //this.toSetXDir = "right";
                                        this.cpuJumpTimer = 10; 
                                        this.leftTimer = 0;
                                        this.rightTimer = 40;
                                    }else{
                                        this.toSetXDir = "left";
                                        if(this.rightTimer < 0)
                                        {
                                            this.leftTimer = 20;
                                        }
                                    }
                                }
                            }
                            this.facing = "right";
                        }
                    }
                    else if(this.xDir === "" && millis() % 15 >= 14)
                    {
                        this.toSetXDir = ((random(0, 1) > 0.5) ? "left" : "right");   
                    }
                    
                    if(!this.dangerRangeX)
                    {
                        this.xDir = this.toSetXDir;
                    }else{
                        this.xDir = "";    
                    }
                    
                    if(this.inAir && !this.onLadder &&
                    toTarget.yPos + toTarget.height * 2.2 <
                    this.yPos && random(0,1) < 0.05&& ds < 230)
                    {
                        this.cpuJumpTimer = 10;
                    }
                    else if(this.yDir === "up")
                    {
                        this.yDir = "";   
                    }
                    
                    if(ds < 200 && random(0, 1) < 0.05)
                    {
                        this.second = true;
                    }else{
                        this.second = false;
                    }
                    
                    if(millis() % 200 >= 199 && 
                    random(0, 1) > 0.5)
                    {
                        this.leftTimer = 0;
                        this.rightTimer = 0;
                        
                        if(random(0, 1) > 0.5)
                        {
                            this.xDir = "left";    
                        }else{
                            this.xDir = "right";
                        }
                        this.cpuJumpTimer = 20;
                    }
                    
                    if(this.onLadder)
                    {
                        this.cpuJumpTimer = 0;
                        if(toTarget.yPos < this.yPos)
                        {
                            this.yDir = "up";
                        }else{
                            this.yDir = "down";
                        }
                    }
                    this.normalDist -= 0.4;
                    
                    if(this.normalDist < 100)
                    {
                        this.normalDist = 150;
                    }
                    
                    if(toTarget.dead)
                    {
                        this.pickTargetPerson(true);    
                    }
                }
                
                if(millis() % 10 >= 9 && this.blocksBelow())
                {
                    if(this.lastXPlace &&
                    this.yPos > levelInfo.yPos + levelInfo.height * 0.4)//random(0, 1) < 0.3)
                    {
                        //this.leftTimer = 0;
                        //this.rightTimer = 0;
                        if(this.lastXPlace < this.xPos)
                        {
                            //if(this.leftTimer < -15 ||
                            //if(this.leftTimer > -15)
                           // if(this.leftTimer < 0)
                            {
                                this.leftTimer = 30;
                                this.yDir = "left";
                            }
                        }else{
                        //    if(this.rightTimer < -15 ||
                            //if(this.rightTimer > -15)
                           // if(this.rightTimer < 0)
                            {
                                this.rightTimer = 30;
                                this.xDir = "right";
                            }
                        }
                    }
                }
                
                /*Prevent from getting stuck on ladders*/
                if(this.onLadder && this.banded && 
                millis() % 200/1.8 >= 195/1.8)
                {
                    if(random(0, 1) < 0.5)
                    {
                        this.rightTimer = 100;
                    }else{
                        this.leftTimer = 100;
                    }
                    
                    this.banded = false;
                }
                
                // var tryPowerUp = this.getClosest("powerUp");
                // if(tryPowerUp.closest < 230)
                // {
                //     if(this.xPos + this.halfWidth >
                //     tryPowerUp.obj.xPos +
                //     tryPowerUp.obj.halfWidth)
                //     {
                //         this.rightTimer = 0;
                //         this.leftTimer = 30;
                //     }else{
                //         this.leftTimer = 0;
                //         this.rightTimer = 30;
                //     }
                // }
                
                this.leftTimer--;
                this.rightTimer--;
                
                if(this.leftTimer > 0)
                {
                    this.toSetXDir = "left";
                }
                if(this.rightTimer > 0)
                {
                    this.toSetXDir = "right";
                }
                
                this.cpuJumpTimer--;
                
                if(this.cpuJumpTimer > 0 && !this.onLadder)
                {
                    this.yDir = "up";
                }
                
                if(millis() % 5 >= 4)
                {
                    var closestLava = this.getClosestLava();
                    
                    var lava = closestLava.llava;
                    
                    var dsL = dist(this.xPos + this.halfWidth, 
                    this.yPos + this.halfHeight,
                    lava.xPos + lava.halfWidth, 
                    lava.yPos + lava.halfHeight);
                    
                    if(closestLava.range < 50 && dsL < 100)
                    {
                        if(closestLava.warnLava.left > 
                        closestLava.warnLava.right)
                        //closestLava.xDir === "left")
                        {
                            //if(this.xDir === "left")
                            {
                                if(this.rightTimer <= 5)
                                {
                                    this.leftTimer = 0;
                                    this.rightTimer = 30; 
                                    
                                    this.xDir = "right";
                                    
                                    this.yDir = "";
                                }
                            }
                        }
                        else 
                        // if(closestLava.xDir === "right")
                        {
                            //if(this.xDir === "right")
                            {
                                if(this.leftTimer <= 5)
                                {
                                    this.rightTimer = 0;
                                    this.leftTimer = 30;
                                    
                                    this.xDir = "left";
                                    
                                    this.yDir = "";
                                }
                            }
                        }
                        
                        if(closestLava.yDir === "down" && 
                        this.onLadder)
                        {
                            this.cpuUpTimer = 20;
                        }
                        
                        // if(closestLava.xDir === "left" ||
                        //   closestLava.xDir === "right") //&& random(0, 1) > 0.5)
                        // {
                        //     if(this.xDir === "left")
                        //     {
                        //         this.xDir = "right";
                        //     }
                        //     else if(this.xDir === "right")
                        //     {
                        //         this.xDir = "left";    
                        //     }
                        //     if(random(0, 1) < 0.6)
                        //     {
                        //         //this.xDir = "left";
                        //         this.yDir = "up";
                        //     }
                        // }
                        // else if(closestLava.xDir === "right")
                        // {
                        //     this.xDir = "left";
                            
                        //     if(random(0, 1) < 0.6)
                        //     {
                        //         //this.xDir = "right";
                        //         this.yDir = "up";
                        //     }
                        // }
                        this.dangerRangeX = true;
                    }else{
                        this.dangerRangeX = false;
                    }
                }
               
                if(this.onLadder)
                {
                    this.cpuUpTimer--;
                
                    if(this.cpuUpTimer > 0)
                    {
                        this.yDir = "up";
                    }
                }
                
                if(this.xPos <= levelInfo.xPos)
                {
                   this.rightTimer = 40;
                }
                else if(this.xPos + this.width >= levelInfo.xPos + levelInfo.width)
                {
                    this.leftTimer = 40; 
                }
                
                if(!this.onLadder)
                {
                    this.activeShoot = true;   
                }else{
                    if(this.inAir && !tripped && this.trippedLadder < 0)
                    {
                        this.xDir = "";
                    }
                    this.activeShoot = false;  
                }
                
                if(this.trippedLadder > 0)
                {
                    this.yDir = "down";
                }
                
                this.landedHits--;
                
                this.trippedLadder--;
                
                //this.avoidLava();
                
                this.setControls(this);
            }
        }
    };
    
    this.powerUps = {
        "rapidFire" : {
            startMillis : millis(),
            duration : 15 * 1000, // 15 seconds
        },
        "bomb" : {
            thrown : false,  
        },
        "heal" : {
            amt : 15,  
        },
        "boom" : {
              
        },
        "shield" : {
            startMillis : millis(),
            duration : 10 * 1000, // 10 seconds
        },
    };
    
    this.updatePowerUps = function()
    {
        for(var i in this.powerUps)
        {
            if(this.powerUps[i].on)
            {
                if(millis() - this.powerUps[i].startMillis > this.powerUps[i].duration)
                {
                    this.powerUps[i].on = false;
                }
                
                if(i === "bomb")
                {
                    if(this.controls.second()&& 
                    !this.powerUps[i].thrown)
                    {
                        this.createBullet(25, 1, 6, 10, {
                            "right" : 90 - 30,
                            "left" : 270 + 30,
                        }[this.facing], {
                            "right" : 0.9 + 0.1,
                            "left" : -0.9 - 0.1,
                        }[this.facing]);
                        
                        
                        this.powerUps[i].thrown = true;
                        this.powerUps[i].on = false;
                    }
                }
                else if(i === "boom")
                {
                    if(this.controls.second() && 
                    !this.powerUps[i].thrown)
                    {
                        this.createBullet(0, 1, 6, 10, {
                            "right" : 90 - 30,
                            "left" : 270 + 30,
                        }[this.facing], {
                            "right" : 1 + 0.35,
                            "left" : -1 - 0.35,
                        }[this.facing], true, 
                        color(0, 130, 180));
                        
                        this.powerUps[i].thrown = true;
                        this.powerUps[i].on = false;
                    }
                }
            }
        }
    };
    
    this.drawPowerUps = function()
    {
        for(var i in this.powerUps)
        {
            if(this.powerUps[i].on)
            {
                switch(i)
                {
                    case "rapidFire" :
                        fill(200, 80, 0, millis() / 2 % 255);
rect(this.xPos + 5, this.yPos + 35, this.width * 0.5 + 5, 10);
                    break;
                }
            }
        }
    };
    
    var gTime = 20;
    
    this.lastUpdate = this.update;
    this.update = function()
    {   
        this.updateLife();
        
        this.updatePowerUps();
        
        this.handleBullets(this.controls.down() ||
        this.autoFire);
      
        if(settings.AUTO_FIRE && gTime < 0)
        {
            this.autoFire = true;
        }else{
            gTime--;   
        }
        
        this.updateCpu();
      
        if(keys[32] && millis() % 50 >= 49)
        {
            this.autoFire = !this.autoFire;    
        }
      
        if(!this.dead)
        {
            this.updateMovement();
        }
        
        this.lastUpdate();
    };
    
    this.lastYPlace = 0;
    
    this.onCollide = function(object, info)
    {
        if(this.type === "cpu")
        {
            if(info !== undefined &&
            info.side !== undefined)
            {
                if(info.side === "up" || info.side === "down")
                {
                    this.banded = true;    
                }
                
                if(this.cpuMode === 0)
                {
                    
                }
                else if(this.cpuMode === 1)
                {
                    if(object.arrayName === "lava")
                    {
                        this.yDir = "up";
                        this.yVel = -this.jumpHeight;
                    }
                    
                    else if(object.arrayName === "player" &&
                    info.side === "up")
                    {
                        this.cpuJumpTimer = 30;
                    }
                    
                    else if(object.arrayName === "block")
                    {
                        if(info.side === "up" || 
                        this.lastSide === "up")
                        {
                            if(this.lastSide === "right" ||
                            info.side === "right")
                            {
                                this.cpuJumpTimer = 20;
                                this.xDir = "left";
                                if(!this.inAir)
                                {
                                    this.xVel = 1;
                                }
                            }
                            else if(this.lastSide === "left" ||
                            info.side === "left")
                            {
                                this.cpuJumpTimer = 20;
                                this.xDir = "right";
                                if(!this.inAir)
                                {
                                    this.xVel = -1;
                                }
                            }
                        }
                    }
                    
                if(this.yDir === "up" && info.side === "up")
                    {
                        this.trippedLadder = 10;
                    }
                    
                    if(this.onLadder && 
                    object.arrayName === "player" &&
                    info.side === "up")
                    {
                        this.cpuJumpTimer = 20;
                        this.yVel = -this.jumpHeight * 0.9;
                        this.xVel += random(-3, 3);
                        
                        if(random(0, 1) > 0.5 && 
                        this.leftTimer <= 0)
                        {
                            this.leftTimer = 20;    
                        }
                        else if(this.rightTimer <= 0)
                        {
                            this.rightTimer = 20;
                        }
                    }
                    else if(this.mode === "goDown")
                    {
                        if(info.side === "up")
                        {
                            this.yDir = "up";
                            
                            if(this.xPos + this.halfWidth > levelInfo.xPos + levelInfo.width / 2)
                            {
                                this.xDir = "left";
                            }else{
                                this.xDir = "right";
                            }
                            
                        }
                    }
                    else if(this.mode === "run")
                    {
                        if(object.arrayName === "ladder")
                        {
                            this.yDir = "up";
                        }
                        else if(object.arrayName === "block")
                        {
                            if(info.side === "up")
                            {
                                this.yDir = "";    
                            }
                        }
                        else if(object.arrayName === "oneWay")
                        {
                            if(object.sides.up && info.side === "up")
                            {
                                this.cpuJumpTimer = 30;
                                
                                if(random(0, 1) > 0.5)
                                {
                                    this.xDir = "left";    
                                }else{
                                    this.xDir = "right"; 
                                }
                            }
                        }
                    }
                    
                    this.setControls(this);
                     
                    if(info.side === "up")
                    {
                        if(object.yPos < this.lastYPlace ||
                        this.lastYPlace === 0)
                        {
                            this.lastYPlace = object.yPos;
                            this.lastXPlace = object.xPos +
                            object.halfWidth;   
                        }
                    }
                }
                
                this.lastSide = info.side;
            }
        }
    };
};
gameObjects.addObject("player", createArray(Player));

var levels = {
    "basic" : {
        plan : [
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "                    ",
            "    p x             ",
            "  bbbbbb            ",
            "              x     ",
            "             ^^^^   ",
            "                   p",
            "         b         b",
            "         b         b",
            "   p     b         b",
            "  ^^^^   b^^^      b",
            "         b         b",
            "         b         b",
            "b                  b",
            "b###   x     p     b",
            "bbbbbbbbbbbbbbbb   b",
        ],
    },
    "trouble" : {
        plan : [
            "                    ",
            "                    ",
            "p                 p ",
            "^^                ^^",
            "                    ",
            "                    ",
            "         xx         ",
            "       ^^^^^^       ",
            "                    ",
            " p               p  ",
            "bbb              bbb",
            "b%                %b",
            "b                  b",
            "b                  b",
            "    ^^##^^^##^^     ",
            "        uNu         ",
            "                    ",
            "        uNu         ",
            "^^^              ^^^",
            "        uNu         ",
            "   xxx ##B## xxx    ",
            "bbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "speed" : {
        plan : [  
            "                       ",
            "                       ",
            "                       ",
            "                       ",
            "                       ",
            "           ^^^^^       ",
            "           u           ",
            "  p                    ",
            "bbbb       u           ",
            "                       ",
            "           u       bbbb",
            "                       ",
            "   bbbbbb    p         ",
            "  u     bbbb^^^^       ",
            "               u       ",
            "  u                    ",
            "               u       ",
            "  u            ^^^^^^^ ",
            "^^^^^                  ",
            "        ^^^            ",
            "          u         bbb",
            "                       ",
            "          u            ",
            "       p  U    p       ",
            "bbbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "hill" : {
        plan : [                    
            "                    ",
            "                    ",
            "                    ",
            "p                  p",
            "^^                ^^",
            "                    ",
            "         xx         ",
            "       ^^^^^^       ",
            "                    ",
            " p               p  ",
            "bbb      N       bbb",
            "b       b b        b",
            "b       b b        b",
            "b      x   x       b",
            "    ^^#^^^^^#^^     ",
            "         N          ",
            "                    ",
            "       b N b        ",
            "^^^  bb     bb   ^^^",
            "     b   N   b      ",
            "   bbb ##B## bbb    ",
            "bbbbbbbbbbbbbbbbbbbb",                                ],
    },
    "test" : {
        plan : [
            "                      ",
            "                      ",
            "       bbbbbbbbbbbbbbb",
            "           #          ",
            "         p #          ",
            "       bbbb#          ",
            "     ^      ##        ",
            "     ^    p  #######  ",
            "     ^^^    ^^^^^^^## ",
            "       ^            ##",
            "       ^             #",
            "       ^             #",
            "   %   ^^^^^^^       #",
            "           ^         #",
            "           ^         #",
            "           ^         #",
            "           ^         #",
            "           ^         #",
            "     p     ^     p   #",
            "                     #",
            "bbbbbbbbbbbbbbbbbbbb##",
        ],  
    },
    "tower" : {
        plan : [
            "                       ",
            "                       ",
            "                       ",
            "                       ",
            "                       ",
            "                       ",
            "bbb     ^^^^^^^     bbb",
            "         u   u         ",
            "         U   U         ",
            "     p           p     ",
            "    ^^^  u   u  ^^^    ",
            "         U   U         ",
            "                       ",
            "^^^      u   u      ^^^",
            "  u      #####      u  ",
            "      bbbbbbbbbbb      ",
            "  u                 u  ",
            "                       ",
            "p u                 u p",
            "bbb                 bbb",
            "                       ",
            "        bbbbbbb        ",
            "         >   <         ",
            "###      >   <      ###",
            "bbbbbbbbbb b bbbbbbbbbb", 
        ],
    },
    "safety" : {
        plan : [
            "                              ",
            "                              ",
            "                              ",
            "                              ",
            "^^^^                      ^^^^",
            "          bbbbbbbbbb          ",
            "         b    ^^    b         ",
            "        b     ^^     b        ",
            "              ^^              ",
            "              ^^              ",
            "^^^bbbb     bbbbbb     bbbb^^^",
            "  u   #b      ^^      b#   u  ",
            "       #b     ^^     b#       ",
            "  u     #b p  ^^    b#     u  ",
            "         #bbb ^^ bbb#         ",
            "  u           ^^           u  ",
            "              ^^              ",
            "  u  p        ^^           u  ",
            "##^^^^^       ^^       ^^^^^##",
            "              ^^              ",
            "          Ubbb^^bbbU       p  ",
            "bbb           ^^           bbb",
            "          u   ^^   u          ",
            "              ^^              ",
            " p        u   bb   u          ",
            "^^^^   ^^^^^^bbbb^^^^^^   ^^^^",
            "   u         #bb#         u   ",
            "             #bb#             ",
            "   u         #bb#         u   ",
            "             #bb#             ",
            "###u         #bb#         u###",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "safety2" : {
        plan : [
            "                              ",
            "                              ",
            "                              ",
            "                              ",
            "^^^^          %%          ^^^^",
            "          bbbbbbbbbb          ",
            "         b    ^^    b         ",
            "        b     ^^     b        ",
            "              ^^              ",
            "              ^^              ",
            "^^^bbbb     bbbbbb     bbbb^^^",
            "  u   #b      ^^      b#   u  ",
            "       #b     ^^     b#       ",
            "  u     #b p  ^^    b#     u  ",
            "         #bbb ^^ bbb#         ",
            "  u       %   ^^   %       u  ",
            "              ^^              ",
            "  u  p        ^^           u  ",
            "##^^^^^       ^^       ^^^^^##",
            "              ^^              ",
            "          Ubbb^^bbbU       p  ",
            "bbb          %^^%          bbb",
            "          u   ^^   u          ",
            "              ^^              ",
            " p        u   bb   u          ",
            "^^^^   ^^^^^^bbbb^^^^^^   ^^^^",
            "   u         #bb#         u   ",
            "             #bb#             ",
            "   u         #bb#         u   ",
            "             #bb#             ",
            "###u         #bb#         u###",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "FairBattle" : {
        plan : [
            "b                      b",
            "b                      b",
            "b                      b",
            "b                      b",
            "bbbbbb%          %bbbbbb",
            "b                      b",
            "b                      b",
            "b                      b",
            "b                      b",
            "b                      b",
            "b       ^^^^^^^^       b",
            "b                      b",
            "b                      b",
            "bbbb%              %bbbb",
            "bu>                  <ub",
            "bU>        pp        <Ub",
            "b >       ^^^^       < b",
            "bu>                  <ub",
            "b >                  < b",
            "bu                    ub",
            "b                      b",
            "bubbb              bbbub",
            "b   >              <   b",
            "b   >              <   b",
            "b   > p          p <   b",
            "bbbbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "FairBattle2" : {
        plan : [
            "b                      b",
            "b                      b",
            "b                      b",
            "b    bvvvvvvvvvvvvb    b",
            "bbbbbb%          %bbbbbb",
            "b                      b",
            "b                      b",
            "b                      b",
            "b                      b",
            "bbb                  bbb",
            "bu>    ^^^^^^^^^^    <ub",
            "b >                  < b",
            "bu>                  <ub",
            "b bb%              %bb b",
            "bu>                  <ub",
            "bU>        pp        <Ub",
            "b >       ^^^^       < b",
            "bu>                  <ub",
            "b >                  < b",
            "bu                    ub",
            "b                      b",
            "bubbb              bbbub",
            "b   >              <   b",
            "b   >              <   b",
            "b   > p          p <   b",
            "bbbbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "FairBattle3" : {
        plan : [
            "b                      b",
            "b                      b",
            "b                      b",
            "b                      b",
            "bbbbbb%vvvvvvvvvv%bbbbbb",
            "bUUb                bUUb",
            "b                      b",
            "buub                buub",
            "b       ^^^^^^^^       b",
            "buub   ^bbbbbbbb^   buub",
            "b bb                bb b",
            "bu                    ub",
            "bU                    Ub",
            "b^^bb%            %bb^^b",
            "b^^b                b^^b",
            "b^^b    b  pp  b    b^^b",
            "b^^b    b^^^^^^b    b^^b",
            "b^^b                b^^b",
            "b^^b                b^^b",
            "b                      b",
            "b                      b",
            "bvbbb              bbbvb",
            "b   >              <   b",
            "b   >              <   b",
            "b   > p          p <   b",
            "bbbbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "Crates" : {
        plan : [
            "x                     x",
            "x                     x",
            "x                     x",
            "x                     x",
            "x                     x",
            "x      p   p          x",
            "x                     x",
            "x     xxxxxxx         x",
            "x     ^^^^^^^         x",
            "x                     x",
            "x                  p  x",
            "x                ^^^^^^",
            "x p              u     ",
            "^^^^             U     ",
            "   u             U     ",
            "   U             U     ",
            "   U             U     ",
            "   Uxxxxxx       U     ",
            "    ^^^^^^       Uxxxxx",
            "bb   uNNu   bbb  ^^^^^^",
            "     UBBU         uNNu ",
            "     UBBU         UBBU ",
            "     UBBU         UBBU ",
            "  bbbbbbbbbbb     UBBU ",
            "bbbbbbbbbbbbbbbbbbbbbbb",
        ],  
    },
    "Crates2" : {
        plan : [
            "                       ",
            "                       ",
            "                       ",
            "                       ",
            "                       ",
            "                   p   ",
            "xx              b^^^^^^",
            "xxxx            b      ",
            "xxxxx                  ",
            "^^^^^^^^               ",
            "          p            ",
            "        xxxx          x",
            "        xxxx         xx",
            "        ^^^^        xxb",
            "                   xxbb",
            "                   ^^^^",
            "              p        ",
            "              x        ",
            "    p        xBx       ",
            "    x        xBx       ",
            "   xBx       xBx       ",
            "   xBx      xBBBx      ",
            "  xbbbx     xbbbx      ",
            "xxxxxxxxxxxxxxxxxxxxxxx",
            "bbbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "JustCrates" : {
        plan : [
            "                       ",
            "                       ",
            "                       ",
            "     x                 ",
            "   x b                 ",
            " x b                   ",
            " b             x      x",
            "^^^^^^^^^^     x    xbb",
            "         u     x   xb N",
            "               x    b  ",
            "      x  u x x x  xb  N",
            "      x    x x x  xb   ",
            "      x  u x x x  b   N",
            "     ^^^^^^^^^^^^ ^^   ",
            "     u    N        u  N",
            "     U    B            ",
            "xxxx U    B        u  N",
            "bbbbxU    Bx           ",
            "x   xU   xbx  x    u  N",
            "xx  xU  x bbx       pxx",
            "xxxxxx xxpbxxxp    uxxx",
            "xxx xxxxxxxxxxxxxxxxxxx",
            "xxxpxxxxxxxxxxxxxxxxxxx",
            "xxxxxxxxxxxxxxxxxxxxxxx",
            "bbbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "JustCrates2" : {
        plan : [
            "                          ",
            "                          ",
            "                          ",
            "                          ",
            "                          ",
            "^^^^^^^^^^      ^^^^^^^^^^",
            "                          ",
            "                          ",
            "                          ",
            "%                        %",
            "%                        %",
            "                          ",
            "                          ",
            "                          ",
            "                          ",
            "                          ",
            "                          ",
            "   p      p    p      p   ",
            " xxxxxxxxxxxxxxxxxxxxxxxx ",
            " xxxxxxxxxxxxxxxxxxxxxxxx ",
            " xxxxxxxxxxxxxxxxxxxxxxxx ",
            " xxxxxxxxxxxxxxxxxxxxxxxx ",
            " xxxxxxxxxxxxxxxxxxxxxxxx ",
            " xxxxxxxxxxxxxxxxxxxxxxxx ",
            " xxxxxxxxxxxxxxxxxxxxxxxx ",
            " xxxxxxxxxxxxxxxxxxxxxxxx ",
            " bbbbbbbbbbbbbbbbbbbbbbbb ",
            " bbbbbbbbbbbbbbbbbbbbbbbb ",
        ],
    },
    "Slither" : {
        plan : [
            "                       ",
            "                       ",
            "         <             ",
            "         <             ",
            "       p >   b         ",
            "         >  bBvvvvvvvvv",
            "  bbbbbbbbbbB   b      ",
            "  N            b  u u  ",
            "                       ",
            "  N     b       UUubu  ",
            "      bb  bbubbb       ",
            "    b      bU     ubu  ",
            "           b b         ",
            "  Nvbvbvbvb u  b  ubu  ",
            "  B         Ub   ub buN",
            "  B         Ub   ub buN",
            "  B^bbbbbbbbbbb   b    ",
            "  Bu     U       b  buN",
            "  B      U       b  buN",
            "vvBub^b^b bbbb bb      ",
            "   U     u          buN",
            "   UB   b b         b  ",
            "   B     u<         >uN",       
            " pB     bp<         >pB",
            "bb       bbbbbbbbbbbbbb",    
        ],
    },
    "4Teams" : {
        plan : [
            "b                     b",
            "b                     b",
            "bvvvvvvbbbbbbbbbvvvvvvb",
            "      Ub       bU      ",
            "p     U         U     p",
            "      Ub       bU      ",
            "      U         U      ",
            "      Ub       bU      ",
            "      U         U      ",
            "bbUbUbUb       bUbUbUbb",
            "b                     b",
            "b                     b",
            "b         UUU         b",
            "b         UUU         b",
            "b         UUU         b",
            "b                     b",
            "b                     b",
            "bb b bUb       bUb b bb",
            "      Ub       bU      ",
            "      U         U      ",
            "      Ub       bU      ",
            "      U         U      ",
            "      Ub       bU      ",
            "p     U         U     p",
            "bbbbbbbb       bbbbbbbb",
        ],
    },
    "4Teams2" : {
        plan : [
            "b                     b",
            "b                     b",
            "bvvvvvvbbbbbbbbbvvvvvvb",
            "      U<       >U      ",
            "p     U<       >U     p",
            "      U<       >U      ",
            "      U<       >U      ",
            "      U<       >U      ",
            "      U<       >U      ",
            "bbUbUbUb       bUbUbUbb",
            "b                     b",
            "b                     b",
            "b         ^^^         b",
            "b         uuu         b",
            "b         UUU         b",
            "b                     b",
            "b                     b",
            "bb b bUb       bUb b bb",
            "      U<       >U      ",
            "      U<       >U      ",
            "      U<       >U      ",
            "      U<       >U      ",
            "      U<       >U      ",
            "p     U<       >U     p",
            "bbbbbbbb       bbbbbbbb",
        ],
    },
    "\"Small\"" : {
        plan : [
            "                                           ",
            "                                           ",
            "                                           ",
            "                                           ",
            "                                           ",
            "             bbbbbbbbbbbbvvvvvvvvvvbbbbbbbb",
            "                   %%                    b ",
            "                                        b  ",
            "                                       b   ",
            "                                      b    ",
            "uuubbbbbbbb                          b     ",
            "     %     b               ^^^^^^^^^b      ",
            "uuu          b             u               ",
            "              %b                           ",
            "uuu              b         u               ",
            "                   b                       ",
            "uuu                 %b     u               ",
            "                       b                   ",
            "uuu                      b u               ",
            "                   bbbbbb bbb              ",
            "uuu                                        ",
            "                              bbb     bbb  ",
            "uuu                                bbbb%bbb",
            "                                        ###",
            "uuu      p          p                   ###",
            "bbbbbbbbbbbU       bbbb b b b bbbU      ###",
            "           U                     U      ###",
            "           U                     U      ###",
            "           U                     U      ###",
            "  bbbbbbbbbbbbbUUbbbbbbbbbbbbbb  U      ###",
            "      %        UU       %        U      ###",
            "               UU                U      ###",
            "               UU                U     ####",
            "               UU                U     ####",
            "               UU                U     ####",
            "               UU                U     ####",
            "               UU           b^^^^^U    ####",
            "               UU          bb    NU   #####",
            "               UU         bb     BU    ####",
            "               bb        bb      BU    ####",
            "             bb  bb     bb       BU    ####",
            "       p   bb      bb  bb        BU  # ####",
            "         bb          bbb         BU  ######",
            "  p     b              b         BU  ######",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            
        ],
    },
    "FireArms" : {
        plan : [
            "U                    U",
            "U                    U",
            "U                    U",
            "U                    U",
            "U                    U",
            "U    b          b    U",
            "U     bbbbbbbbbb     U",
            "U                    U",
            "U                    U",
            "U^^^              ^^^U",
            "U                    U",
            "U        %%%%        U",
            "U        %BB%        U",
            "U        %BB%        U",
            "U        %%%%        U",
            "U                    U",
            "U  p              p  U",
            "U^^^              ^^^U",
            "U                    U",
            "U       b    b       U",
            "U      b      b      U",
            "U     b        b     U",
            "U    pb^^^^^^^^bp    U",
            "bbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
};
levels.build = function(plan)
{
    var level = this[plan.level];
    levelInfo.width = level.plan[0].length * levelInfo.unitWidth;
    levelInfo.height = level.plan.length * levelInfo.unitHeight;
    scaler.set();
    
    for(var row = 0; row < level.plan.length; row++)
    {
        for(var col = 0; col < level.plan[0].length; col++)
        {
            var xPos = levelInfo.xPos + col * levelInfo.unitWidth;
            var yPos = levelInfo.yPos + row * levelInfo.unitHeight;
            
            switch(level.plan[row][col])
            {
                case 'p' :
                    gameObjects.getObject("player").add(xPos, yPos - levelInfo.unitHeight, levelInfo.unitWidth, levelInfo.unitHeight * 2);
                    break;
              
                case 'b' :
                    gameObjects.getObject("block").add(xPos, yPos, levelInfo.unitWidth, levelInfo.unitHeight);
                    break;
                    
                case 'B' :
                    gameObjects.getObject("block").add(xPos, yPos, levelInfo.unitWidth, levelInfo.unitHeight, undefined, "underfloor");
                    break;
                    
                case 'N' : 
                    gameObjects.getObject("block").add(xPos, yPos - levelInfo.unitHeight, levelInfo.unitWidth, levelInfo.unitHeight * 2, undefined, "underfloor");
                    break;
                    
                case 'x' :
                    gameObjects.getObject("crate").add(xPos, yPos, levelInfo.unitWidth, levelInfo.unitHeight);
                    break;
                    
                case 'U' :
                    gameObjects.getObject("ladder").add(xPos, yPos, levelInfo.unitWidth, levelInfo.unitHeight);
                    break;
                
                case 'u' : 
                    gameObjects.getObject("ladder").add(xPos, yPos - levelInfo.unitHeight + 3, levelInfo.unitWidth, levelInfo.unitHeight * 2 - 6);
                    break;
                
                case '#' :
                    gameObjects.getObject("lava").add(xPos, yPos, levelInfo.unitWidth, levelInfo.unitHeight);
                    break;
                
                case '%' :
                    gameObjects.getObject("shooter").add(xPos + levelInfo.unitWidth / 2, yPos + levelInfo.unitHeight / 2, levelInfo.unitWidth);
                    break;
                
                case '^' :
                    gameObjects.getObject("oneWay").add(xPos, yPos, levelInfo.unitWidth, levelInfo.unitHeight);
                    break;
                    
                case 'v' :
                    gameObjects.getObject("oneWay").add(xPos, yPos, levelInfo.unitWidth, levelInfo.unitHeight, undefined, {
                        down : true,
                    });
                    break;
                
                case '>' :
                    gameObjects.getObject("oneWay").add(xPos, yPos, levelInfo.unitWidth, levelInfo.unitHeight, undefined, {
                        right : true,
                    });
                    break;
                    
                case '<' :
                    gameObjects.getObject("oneWay").add(xPos, yPos, levelInfo.unitWidth, levelInfo.unitHeight, undefined, {
                        left : true,
                    });
                    break;
            }
        }
    }
};

levels.loadList = function()
{
    levels.list = [];
    for(var i in levels)
    {
        if(levels[i].plan !== undefined)
        {
            levels.list.push(i);  
        }
    }
};

var buildLevel = function()
{
    try{
        gameObjects.empty();
        levels.build({
            level : levelInfo.level,
        });
        playerConfigs.setPlayers();
    }
    catch(e)
    {
        tempt(e.stack);
        return true;
    }
};

game.changeGameState = function(gameState, needsScreenImage)
{
    if(this[gameState] !== undefined)
    {
        this.lastGameState = this.gameState;
        this.gameState = gameState;
        
        if(this[gameState].onSwitch !== undefined)
        {
            this[gameState].onSwitch();
        }
        
        if(needsScreenImage)
        {
            this.screenImage = get(0, 0, width, height);
        }
    }
};

game.menu = function()
{
    textAlign(CENTER, CENTER);
    textFont(fonts.f1);
    
    fill(0, 40, 180, 120);
    textSize(50);
    text("Block Battle", width / 2, 120);
    
    buttons.play.draw();
    buttons.newGame.draw();
    buttons.settings.draw();
    buttons.credits.draw();
    buttons.how.draw();
    
    textSize(20);
    text("Click! ->", 180, 355);
    
    if(keys[ENTER])
    {
        this.changeGameState("play");
    }
};
game.menu.mousePressed = function()
{
    if(buttons.play.clicked())
    {
        if(gameObjects.getObject("player").length <= 1)
        {
            game.changeTo = "play";
            game.changeGameState("restartLevel");
        }else{
            game.changeGameState("play");
        }
    }
    else if(buttons.newGame.clicked())
    {
        game.changeTo = "play";
        game.changeGameState("restartLevel");
    }
    else if(buttons.settings.clicked())
    {
        game.changeGameState("settings");
    }
    else if(buttons.credits.clicked())
    {
        game.changeGameState("credits");
    }
    else if(buttons.how.clicked())
    {
        game.changeGameState("how");
    }
};

game.credits = function()
{
    buttons.back.draw();

    fill(0, 40, 180, 120);
    textFont(fonts.f1);
    textSize(40);
    text("Credits", width / 2, 120);

    fill(BUTTON_COLOR);
    rect(300 - 230 / 2, 300 - 55, 230, 110, 10);
    
    textAlign(CENTER, CENTER);
    textFont(fonts.f1);
    
    fill(0, 163, 179, 200);
    textSize(20);
    
    text("Code by Prolight\n" + "Graphics by Ӿɛהσה", 300, 300);
};
game.credits.mousePressed = function()
{
    if(buttons.back.clicked())
    {
        game.changeGameState("menu");
    }
};

game.how = function()
{
    buttons.back.draw();
    
    noStroke();
    fill(BUTTON_COLOR);
    rect(300 - 345 / 2, 300 - 200 / 2, 345, 200, 10);
    
    fill(0, 0, 0, 100);
    textAlign(CENTER, CENTER);
    text("Welcome to Block battle!\n A game where you fight cpus and players.\nIn this game you must shoot (Down or auto fire)\nother players/cpus, collect power-ups and win.\n To use a power-up use either [e, y, o,\nor ENTER] depending on your button setup.\nTo change your button setup go to settings\nand change it.(Use WASD for default\n key control)\nI hope you enjoy\nBlock Battle, so have fun!", 300, 300);
};
game.how.mousePressed = function()
{
    if(buttons.back.clicked())
    {
        game.changeGameState("menu");
    }
};

game.settings = function()
{
    textAlign(CENTER, CENTER);
    
    fill(0, 40, 180, 120);
    textFont(fonts.f1);
    textSize(40);
    text("Settings", width / 2, 120);
    
    buttons.back.draw();
    buttons.levelLeft.draw();
    
    var lvl = levels.list[game.settings.selectedLevelIndex];
    if(levels[lvl].img !== undefined)
    {
        image(levels[lvl].img, 225, 420, 150, 150);
    }else{
        textFont(fonts.c1);
        textSize(14);
        fill(0, 0, 0, 100);
        textAlign(CENTER, CENTER);
        text("Undiscovered", 300, 487.5);
        noFill();
        stroke(0, 0, 0, 80);
        strokeWeight(0.4);
        rect(225, 420, 150, 150, 7);
        noStroke();
    }
    
    buttons.levelRight.draw();
    buttons.levelName.draw();  
    buttons.save.draw();
    
    playerChangers.draw();
    playerChangers.update();
};
game.settings.onSwitch = function()
{
    game.settings.selectedLevelIndex = levels.list.indexOf(levelInfo.level);
    buttons.levelName.message = levelInfo.level;
};
game.settings.save = function()
{
    levelInfo.level = (buttons.levelName.message !== "---") ? buttons.levelName.message : levelInfo.level;
};
game.settings.mousePressed = function()
{
    var changed = false;
    if(buttons.back.clicked())
    {
        game.changeGameState("menu");
    }
    else if(buttons.save.clicked())
    {
        game.settings.save();
        game.changeGameState("menu");
    }
    else if(buttons.levelLeft.clicked())
    {
        game.settings.selectedLevelIndex--;
        if(game.settings.selectedLevelIndex < 0)
        {
            game.settings.selectedLevelIndex = levels.list.length - 1;
        }
        buttons.levelName.message = levels.list[game.settings.selectedLevelIndex];
    }
    else if(buttons.levelRight.clicked())
    {
        game.settings.selectedLevelIndex++;
        if(game.settings.selectedLevelIndex >= levels.list.length)
        {
            game.settings.selectedLevelIndex = 0;
        }
        buttons.levelName.message = levels.list[game.settings.selectedLevelIndex];
    }else{
        playerChangers.mousePressed();
    }
};

game.play = function()
{
    pushMatrix();
        scale(scaler.x, scaler.y);
        screenUtils.shake();
        gameObjects.apply();
    popMatrix();
    
    if(gameObjects.getObject("player").length === 1)
    {
        game.changeGameState("winScreen", true);
    }
    
    if(this.errorOnLevel)
    {
        textAlign(CENTER, CENTER);
        fill(100, 0, 0, 150);
        textSize(20);
        text("We couldn't load the level!", width / 2, height / 2);
    }
    
    buttons.pause.draw();
};
game.play.keyPressed = function()
{
    if(keys[80])
    {
        game.changeGameState("paused", true);
    }
};
game.play.mousePressed = function()
{
    if(buttons.pause.clicked())
    {
        game.changeGameState("paused", true);
    }
};

game.winScreen = function()
{
    image(this.screenImage, 0, 0);  
    
    noStroke();
    fill(0, 0, 0, 70);
    rect(0, 0, width, height);
    
    textFont(fonts.f1);
    
    textAlign(CENTER, CENTER);
    fill(0, 0, 0, 100);
    textSize(35);
    text("Round over!", width / 2, 80);
    textSize(25);
    text(game.winScreen.playerWhoWon + " won!", width / 2, 150);
    
    buttons.restart.draw();
    buttons.menu.draw();
};
game.winScreen.onSwitch = function()
{
    game.winScreen.playerWhoWon = gameObjects.getObject("player").input(0).userName;
};
game.winScreen.mousePressed = function()
{
    if(buttons.menu.clicked())
    {
        game.changeGameState("menu");
    }
    else if(buttons.restart.clicked())
    {
        game.changeGameState("restartLevel");
        game.changeTo = "play";
    }
};

game.restartLevel = function()
{  
    if(buildLevel())
    {
        this.errorOnLevel = true;
    }
    
    game.changeGameState(this.changeTo || game.lastGameState, true); 
    this.changeTo = undefined;
};
game.paused = function()
{
    frameRate(10);
  
    image(this.screenImage, 0, 0);  
    
    noStroke();
    fill(0, 0, 0, 70);
    rect(0, 0, width, height);
    
    buttons.pause.draw();
    buttons.restart.draw();
    buttons.menu.draw();
    buttons.resume.draw();
    
    this.errorOnLevel = false;
};
game.paused.mousePressed = function()
{
    if(buttons.pause.clicked() || buttons.resume.clicked())
    {
        game.changeGameState("play");
    }
    else if(buttons.restart.clicked())
    {
        game.changeGameState("restartLevel");
        game.changeTo = "play";
    }
    else if(buttons.menu.clicked())
    {
        game.changeGameState("menu");
    }
};
game.paused.keyPressed = function()
{
    if(keys[80])
    {
        game.changeGameState("play");
    }
};

var load = function()
{
    backgrounds.setBackground("metal");
    backgrounds.primeLoad();
    buttons.format();
    graphics.load();
    playerChangers.setAll();
    game.screenImage = get(0, 0, width, height);
    levels.loadList();
    (game[game.gameState].onSwitch || function() {})();
    buildLevel();
}();

var draw = function() 
{
    frameRate(game.fps);
    backgrounds.drawBackground();
    game[game.gameState]();
    screenUtils.draw();
};

var mousePressed = function()
{
    (game[game.gameState].mousePressed || function() {})();
};
var lastKeyPressed = keyPressed;
keyPressed = function()
{
    lastKeyPressed();
    (game[game.gameState].keyPressed || function() {})();
};




}

createProcessing(main);