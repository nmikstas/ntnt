class NTRender
{
    constructor(statsCallback, useEngine = true)
    {
        this.statsCallback = statsCallback; //Callback used for displaying the game stats.
        this.gm            = 1.5;           //Glow multiplier.
        this.lightOffset   = 0;             //Used to move the lighting around the scene.
        this.currentLevel  = 0;
        this.pieceCurrent  = 0;
        this.pieceNext     = 0;
        this.pieceThird    = 0;
        this.gameStatus    = NTEngine.GS_OVER;
        this.lastStatus    = NTEngine.GS_OVER;
        this.cameraOffset  = 0;
        this.lastLevel     = -1;
        this.enableInputCallback = null;
        this.useEngine     = useEngine;
        this.getField;
        this.ntEngine;
        
        //Animation variables.
        this.rowsToErase   = [];
        this.animCounter   = 0;
        this.blocksCounter = 0;
        this.colorAdd      = .2;
        this.alphaAdd      = .7;
        this.clearedBlocks = [];
        this.blankBlocks   = [];
        this.glueTimer;
        this.animTimer;
        this.blocksTimer;

        //SFX trigger variables.
        this.pauseSFX  = false;
        this.rotateSFX = false;
        this.moveSFX   = false;
        this.dropSFX   = false;
        this.tetrisSFX = false;
        this.lineSFX   = false;
        this.levelSFX  = false;
        this.overSFX   = false;
        this.startSFX  = false; 

        this.boxArr = []; //Array of all the game field pieces.
        this.npArr  = []; //Array of next piece boxes.
        this.matArr = []; //Array of materials.

        this.renderFieldArr =  //2D array sent by game engine.
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        //Colors for the various levels in the game.
        this.blockColors =
        [
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(0, .087*this.gm, .246*this.gm), 
                new BABYLON.Color3(.062*this.gm, .190*this.gm, .255*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(0, .168*this.gm, 0), 
                new BABYLON.Color3(.128*this.gm, .208*this.gm, .016*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(.219*this.gm, 0, .205*this.gm), 
                new BABYLON.Color3(.248*this.gm, .120*this.gm, .248*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(0, .088*this.gm, .248*this.gm), 
                new BABYLON.Color3(.091*this.gm, .219*this.gm, .087*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(.231*this.gm, 0, .091*this.gm), 
                new BABYLON.Color3(.088*this.gm, .248*this.gm, .152*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(.088*this.gm, .248*this.gm, .152*this.gm), 
                new BABYLON.Color3(.107*this.gm, .136*this.gm, .255*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(.248*this.gm, .056*this.gm, 0), 
                new BABYLON.Color3(.127*this.gm, .127*this.gm, .127*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(.107*this.gm, .071*this.gm, .255*this.gm), 
                new BABYLON.Color3(.171*this.gm, 0, .035*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(0, .088*this.gm, .248*this.gm), 
                new BABYLON.Color3(.248*this.gm, .056*this.gm, 0), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm), new BABYLON.Color3(.248, .056, 0), 
                new BABYLON.Color3(.255*this.gm, .163*this.gm, .071*this.gm), new BABYLON.Color3(0, 0, 0)
            ]
        ]
    }

    /************************************ Animation Functions ************************************/

    addBlocksAnim()
    {
        //Reset after add rows animation is complete.
        if(this.blocksCounter >= this.blankBlocks.length  && this.useEngine)
        {
            this.ntEngine.ntRequest(NTEngine.GR_RESUME_BLK);
            clearInterval(this.blocksTimer);
            this.enableInputCallback(true);
            this.blocksCounter = 0;
            this.blankBlocks = [];
            return;
        }

        this.dropSFX = true;
        this.blocksCounter++;
    }

    eraseAnim()
    {
        //Finish up the animation.
        if(this.animCounter >= 10 && this.useEngine)
        {
            this.ntEngine.ntRequest(NTEngine.GR_RESUME);
            clearInterval(this.animTimer);
            this.enableInputCallback(true);
            this.animCounter   = 0;
            this.colorAdd      = .2;
            this.alphaAdd      = .7;
            this.clearedBlocks = [];
            return;
        }

        for(let i = 0; i < this.rowsToErase.length; i++)
        {
            this.clearedBlocks.push({ y: this.rowsToErase[i], x: this.animCounter });
        }

        this.alphaAdd -= .07;
        this.colorAdd += .08;
        this.animCounter++;
    }

    glueDelay()
    {
        if(this.useEngine)
        {
            this.ntEngine.ntRequest(NTEngine.GR_RESUME);
            clearInterval(this.glueTimer);
            this.enableInputCallback(true);
        }
    }

    /************************************ Rendering Functions ************************************/

    //Render the play field.
    gfRender(status)
    {
        //Copy variables needed to run the game.
        this.gameStatus        = status.gameStatus;
        this.lastRequest       = status.lastRequest;
        this.lastRequestStatus = status.lastRequestStatus;
        this.currentLevel      = status.currentLevel;
        this.pieceCurrent      = status.pieceCurrent;
        this.pieceNext         = status.pieceNext;
        this.pieceThird        = status.pieceThird;
        this.rowsToErase       = status.rowsToErase;
        let field              = [];

        //Pause SFX.
        if(this.lastRequest === NTEngine.GR_PAUSE && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.pauseSFX = true;
        }

        //Rotate SFX.
        if(this.lastRequest === NTEngine.GR_ROTATE_CW && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.rotateSFX = true;
        }

        //Rotate SFX.
        if(this.lastRequest === NTEngine.GR_ROTATE_CCW && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.rotateSFX = true;
        }

        //Move SFX.
        if(this.lastRequest === NTEngine.GR_LEFT && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.moveSFX = true;
        }

        //Move SFX.
        if(this.lastRequest === NTEngine.GR_RIGHT && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.moveSFX = true;
        }

        //Drop SFX.
        if(this.gameStatus === NTEngine.GS_WAIT && !this.rowsToErase.length)
        {
            this.dropSFX = true;
        }

        //Tetris SFX.
        if(this.gameStatus === NTEngine.GS_WAIT && this.rowsToErase.length === 4)
        {
            this.tetrisSFX = true;
        }
        //Level SFX.
        else if(this.lastLevel >= 0 && this.currentLevel !== this.lastLevel)
        {
            this.levelSFX = true;
            this.lastLevel = this.currentLevel;
        }
        //Line SFX.
        else if(this.gameStatus === NTEngine.GS_WAIT && this.rowsToErase.length > 0)
        {
            this.lineSFX = true;
        }

        //Check if game was just started.
        if(this.gameStatus === NTEngine.GS_PLAY && this.lastStatus === NTEngine.GS_OVER)
        {
            this.startSFX = true;
        }

        //Check if game just ended.
        if(this.gameStatus === NTEngine.GS_OVER && this.lastStatus !== NTEngine.GS_OVER)
        {
            this.overSFX = true;
            this.lastLevel = -1;
        }

        //Update the level on the first piece.
        if(this.lastLevel < 0 && this.gameStatus !== NTEngine.GS_OVER)
        {
            this.lastLevel = this.currentLevel;
        }

        //Update the last status.
        this.lastStatus = this.gameStatus;

        //During animations, hide the piece at the top of the play field.
        if(this.gameStatus === NTEngine.GS_WAIT_BLK || this.gameStatus === NTEngine.GS_WAIT)
        {
            if(this.useEngine)
            {
                field = this.getField();
            }
            else
            {
                field = status.gameField;
            }
        }
        else
        {
            field = status.gameField;
        }

        //Need to make a deep copy of the array.
        for(let i = 0; i < this.renderFieldArr.length; i++)
        {
            for(let j = 0; j < this.renderFieldArr[i].length; j++)
            {
                this.renderFieldArr[i][j] = field[i][j];
            }
        }

        let gameStatus = status.gameStatus;
        let level      = status.currentLevel;
        let score      = status.currentScore;
        let request    = status.lastRequestStatus;
        let lines      = status.linesCleared;

        //Send stats to function to be displayed to the user.
        this.statsCallback(level, score, lines, gameStatus, request);

        //Check if animation wait state.
        if(gameStatus === NTEngine.GS_WAIT && this.useEngine)
        {
            this.enableInputCallback(false);

            if(status.rowsToErase.length > 0)
            {
                clearInterval(this.animTimer);
                this.animTimer = setInterval(() => {this.eraseAnim()}, 50);
            }
            else
            {
                clearInterval(this.glueTimer);
                this.glueTimer = setInterval(() => {this.glueDelay()}, 200);
            }
            return;
        }

        //Check if block add wait state,
        if(gameStatus === NTEngine.GS_WAIT_BLK  && this.useEngine)
        {
            this.enableInputCallback(false);

            this.blankBlocks = status.blanks;
            clearInterval(this.blocksTimer);
            this.blocksTimer = setInterval(() => {this.addBlocksAnim()}, 50);
            return;
        }

        //Check if block add wait state,
        if(gameStatus === NTEngine.GS_WAIT_BLK)
        {
            if(this.useEngine)
            {
                this.ntEngine.ntRequest(NTEngine.GR_RESUME_BLK);
            }
        }
    }

    /********************************** Main Babylon Functions ***********************************/

    //This function renders the game field.
    gfCreateScene(engine, canvas)
    {
        //Create the scene space
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        //Add a camera to the scene and attach it to the canvas.  Centered on the playfield.
        let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 25, new BABYLON.Vector3(4.5, 9.5, 0), scene);
        camera.attachControl(canvas, true);
        camera.keysDown             = [98];
        camera.keysUp               = [104];
        camera.keysLeft             = [100];
        camera.keysRight            = [102];
        camera.lowerRadiusLimit     = 15;
        camera.upperRadiusLimit     = 50;
        camera.wheelDeltaPercentage = .01;
        camera.upperAlphaLimit      = 3 * Math.PI / 4;
        camera.lowerAlphaLimit      = Math.PI / 4;
        camera.upperBetaLimit       = 3 * Math.PI / 4;
        camera.lowerBetaLimit       = Math.PI / 4;

        //Pause SFX.
        var tPause = new BABYLON.Sound("pauseSFX", "https://nmikstas.github.io/resources/audio/tPause.ogg", scene, null);

        //Rotate SFX.
        var tRotate = new BABYLON.Sound("rotateSFX", "https://nmikstas.github.io/resources/audio/tRotate.ogg", scene, null);

        //Move SFX.
        var tMove = new BABYLON.Sound("moveSFX", "https://nmikstas.github.io/resources/audio/tMove.ogg", scene, null);

        //Drop SFX.
        var tDrop = new BABYLON.Sound("dropSFX", "https://nmikstas.github.io/resources/audio/tDrop.ogg", scene, null);

        //Tetris SFX.
        var tTetris = new BABYLON.Sound("tetrisSFX", "https://nmikstas.github.io/resources/audio/tTetris.ogg", scene, null);

        //Line clear SFX.
        var tLine = new BABYLON.Sound("lineSFX", "https://nmikstas.github.io/resources/audio/tLine.ogg", scene, null);

        //Level up SFX.
        var tLevel = new BABYLON.Sound("levelSFX", "https://nmikstas.github.io/resources/audio/tlLevel.ogg", scene, null);

        //Start SFX.
        var tStart = new BABYLON.Sound("startSFX", "https://nmikstas.github.io/resources/audio/tStart.ogg", scene, null);

        //Game over SFX.
        var tOver = new BABYLON.Sound("overSFX", "https://nmikstas.github.io/resources/audio/tOver.ogg", scene, null);

        //Add lights to the scene
        let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
        let gl = new BABYLON.GlowLayer("glow", scene);

        //Game field background material.
        let backMat = new BABYLON.StandardMaterial("backMat", scene);
        backMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris2.png", scene);
        backMat.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris2n.png", scene);
        backMat.emissiveColor = new BABYLON.Color3(0, 0, 0);

        //Special tetris material.
        let tetrisMat = new BABYLON.StandardMaterial("tetrisMat", scene);
        tetrisMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris4.png", scene);
        tetrisMat.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris4n.png", scene);
        tetrisMat.emissiveColor = new BABYLON.Color3(.200*this.gm, .200*this.gm, .200*this.gm);
        tetrisMat.alpha = .7;

        //Fill the materials array.
        for(let i = 0; i < 10; i++)
        {
            let matRow = [];

            for(let j = 0; j < 5; j++)
            {
                //Game block materials.
                let blockMat = new BABYLON.StandardMaterial("blockMat", scene);
                blockMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris4.png", scene);
                blockMat.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris4n.png", scene);
                blockMat.emissiveColor = this.blockColors[i][j];
                blockMat.alpha = .7;
                matRow.push(blockMat);
            }

            this.matArr.push(matRow);
        }

        var backOptions =
        {
            width:     10,
            height:    20,
            depth:     1,
		    tileSize:  1,
		    tileWidth: 1
        };

        let bkBox = BABYLON.MeshBuilder.CreateTiledPlane("background", backOptions, scene);
        bkBox.position = new BABYLON.Vector3(4.5, 9.5, -0.5);
        bkBox.material = backMat;
        bkBox.rotation.y = Math.PI;

        //Add foreground blocks to the scene.
        for(let i = 0; i < 20; i++)
        {
            let blockRow = [];
            for(let j = 0; j < 10; j++)
            {
                let fgBox = BABYLON.MeshBuilder.CreateBox("box" + i + j, {height: 1, width: 1, depth: 1}, scene);
                fgBox.position = new BABYLON.Vector3(9 - j, i, 0);
                blockRow.push(fgBox);
            }
            this.boxArr.push(blockRow);
        }

        //Create a banner that says "PAUSED".
        let font_size = 48;
	    let font = "bold " + font_size + "px Arial"; //Set font
        let planeHeight = 3;                         //Set height for plane
        let DTHeight = 1.5 * font_size;              //Set height for dynamic texture
        let ratio = planeHeight/DTHeight;            //Calculate ratio
        let text = "PAUSED";                         //Set text
	
	    //Use a temporay dynamic texture to calculate the length of the text on the dynamic texture canvas
        let temp = new BABYLON.DynamicTexture("DynamicTexture", 64, scene);
	    let tmpctx = temp.getContext();
	    tmpctx.font = font;
        let DTWidth = tmpctx.measureText(text).width + 8;
    
        //Calculate width the plane has to be 
        let planeWidth = DTWidth * ratio;

        //Create dynamic texture and write the text
        let dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:DTWidth, height:DTHeight}, scene, false);
        let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseTexture = dynamicTexture;
        mat.emissiveColor = new BABYLON.Color3(0, 0, 1);
        dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);
    
        //Create plane and set dynamic texture as material
        let plane = BABYLON.MeshBuilder.CreatePlane("plane", {width:planeWidth, height:planeHeight}, scene);
        plane.material = mat;
        plane.position =  new BABYLON.Vector3(4.5, 9.5, -.45);
        plane.rotation.y = Math.PI;
        
        //This is where all the changes in the game happen.
        scene.registerBeforeRender(() =>
        {
            let colorIndex    = this.currentLevel % 10;
            light2.position   = new BABYLON.Vector3(4.5 + 7 * Math.cos(this.lightOffset), 9.5 + 14 * Math.sin(this.lightOffset), 5);
            this.lightOffset += .002;

            //Check for SFX triggers.
            if(this.pauseSFX)
            {
                this.pauseSFX = false;
                tPause.play();
            }

            if(this.rotateSFX)
            {
                this.rotateSFX = false;
                tRotate.play();
            }

            if(this.moveSFX)
            {
                this.moveSFX = false;
                tMove.play();
            }

            if(this.dropSFX)
            {
                this.dropSFX = false;
                tDrop.play();
            }

            if(this.tetrisSFX)
            {
                this.tetrisSFX = false;
                tTetris.play();
            }

            if(this.lineSFX)
            {
                this.lineSFX = false;
                tLine.play();
            }

            if(this.levelSFX)
            {
                this.levelSFX = false;
                tLevel.play();
            }

            if(this.startSFX)
            {
                this.startSFX = false;
                tStart.play();
            }

            if(this.overSFX)
            {
                this.overSFX = false;
                tOver.play();
            }
            
            for(let i = 0; i < this.boxArr.length; i++)
            {
                for(let j = 0; j < this.boxArr[i].length; j++)
                {
                    if(this.renderFieldArr[i][j] && this.gameStatus !== NTEngine.GS_PAUSE)
                    {
                        this.boxArr[i][j].isVisible = true;
                        this.boxArr[i][j].material = this.matArr[colorIndex][this.renderFieldArr[i][j]];
                    }
                    else
                    {
                        this.boxArr[i][j].isVisible = false;
                    }
                }
            }

            //Check if the game is paused.
            if(this.gameStatus === NTEngine.GS_PAUSE)
            {
                plane.isVisible = true;
            }
            else
            {
                plane.isVisible = false;
            }
            
            //Special animation for 4 rows cleared.
            if(this.rowsToErase.length === 4)
            {
                for(let i = 0; i < 4; i++)
                {
                    for(let j = 0; j < 10; j++)
                    {
                        this.boxArr[this.rowsToErase[i]][j].material = tetrisMat;
                        this.boxArr[this.rowsToErase[i]][j].material.emissiveColor.r = this.colorAdd;
                        this.boxArr[this.rowsToErase[i]][j].material.emissiveColor.g = this.colorAdd;
                        this.boxArr[this.rowsToErase[i]][j].material.emissiveColor.b = this.colorAdd;
                        this.boxArr[this.rowsToErase[i]][j].material.alpha = this.alphaAdd;
                    }
                }
            }
            else
            {
                //Erase any animation blocks.
                for(let i = 0; i < this.clearedBlocks.length; i++)
                {
                    this.boxArr[this.clearedBlocks[i].y][this.clearedBlocks[i].x].isVisible = false;
                }
            }

            //Add blocks to the bottom of the game field animation.
            for(let i = this.boxArr.length-1; i >= this.blocksCounter; i--)
            {
                for(let j = 0; j < 10; j++)
                {
                    this.boxArr[i][j].material  = this.boxArr[i-this.blocksCounter][j].material;
                    this.boxArr[i][j].isVisible = this.boxArr[i-this.blocksCounter][j].isVisible;
                }
            }

            //Build up the added blocks incrementally.
            if(this.blankBlocks.length)
            {   
                let newBlocks = [];

                //Copy only the blocks we need.
                for(let i = 0; i < this.blocksCounter; i++)
                {
                    newBlocks.push(this.blankBlocks[i]);
                }

                //Reverse the new blocks array.
                newBlocks.reverse();

                for(let i = 0; i < this.blocksCounter; i++)
                {
                    for(let j = 0; j < 10; j++)
                    {
                        this.boxArr[i][j].material = this.matArr[colorIndex][4];

                        if(j === newBlocks[i])
                        {
                            this.boxArr[i][j].isVisible = false;
                        }
                        else
                        {
                            this.boxArr[i][j].isVisible = true;
                        }
                    }
                }
            }
        });

        return scene;
    };

    //This function renders the next piece.
    npCreateScene(npEngine)
    {
        //Create the scene space
        let scene = new BABYLON.Scene(npEngine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        //Add a camera to the scene and attach it to the canvas.
        let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 5, new BABYLON.Vector3(0, 0, 0), scene);

        //Add lights to the scene
        let light = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 0, 1), scene);
        let gl = new BABYLON.GlowLayer("glow", scene);

        //Game block materials.
        let blockMat = new BABYLON.StandardMaterial("blockMat", scene);
        blockMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris4.png", scene);
        blockMat.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris4n.png", scene);
        blockMat.alpha = .7;

        //Add 4 blocks to the scene.
        for(let i = 0; i < 4; i++)
        {
            let npBox = BABYLON.MeshBuilder.CreateBox("npBox" + i, {height: 1, width: 1, depth: 1}, scene);
            npBox.position = new BABYLON.Vector3(i, 0, 0);
            npBox.material = blockMat;
            this.npArr.push(npBox);
        }

        //This is where all the changes in the game happen.
        scene.registerBeforeRender(() =>
        {
            //Get index to color based on the current player level.
            let colorIndex  = this.currentLevel % 10;
            if(isNaN(colorIndex)) colorIndex = 0;
            let pieceColors = [1, 2, 3, 1, 2, 3, 1];

            blockMat.emissiveColor = this.blockColors[colorIndex][pieceColors[this.pieceNext]];

            if(this.gameStatus === NTEngine.GS_OVER || this.gameStatus === NTEngine.GS_PAUSE)
            {
                for(let i = 0; i < 4; i++)
                {
                    this.npArr[i].isVisible = false;
                }
            }
            else
            {
                camera.alpha = Math.PI / 2 + Math.cos(this.cameraOffset);
                camera.beta  = Math.PI / 2 + Math.sin(this.cameraOffset);               
                this.cameraOffset += .01;

                for(let i = 0; i < 4; i++)
                {
                    this.npArr[i].isVisible = true;
                }

                //Render the next piece.
                switch(this.pieceNext)
                {
                    case NTEngine.PIECE_T:
                        this.npArr[0].position = new BABYLON.Vector3(0, .5, 0);
                        this.npArr[1].position = new BABYLON.Vector3(0, -.5, 0);
                        this.npArr[2].position = new BABYLON.Vector3(1, .5, 0);
                        this.npArr[3].position = new BABYLON.Vector3(-1, .5, 0);
                        break;

                    case NTEngine.PIECE_BKL:
                        this.npArr[0].position = new BABYLON.Vector3(0, .5, 0);
                        this.npArr[1].position = new BABYLON.Vector3(1, .5, 0);
                        this.npArr[2].position = new BABYLON.Vector3(-1, .5, 0);
                        this.npArr[3].position = new BABYLON.Vector3(-1, -.5, 0);
                        break;

                    case NTEngine.PIECE_Z:
                        this.npArr[0].position = new BABYLON.Vector3(0, .5, 0);
                        this.npArr[1].position = new BABYLON.Vector3(1, .5, 0);
                        this.npArr[2].position = new BABYLON.Vector3(0, -.5, 0);
                        this.npArr[3].position = new BABYLON.Vector3(-1, -.5, 0);
                        break;

                    case NTEngine.PIECE_SQR:
                        this.npArr[0].position = new BABYLON.Vector3(.5, .5, 0);
                        this.npArr[1].position = new BABYLON.Vector3(-.5, .5, 0);
                        this.npArr[2].position = new BABYLON.Vector3(.5, -.5, 0);
                        this.npArr[3].position = new BABYLON.Vector3(-.5, -.5, 0);
                        break;

                    case NTEngine.PIECE_S:
                        this.npArr[0].position = new BABYLON.Vector3(0, .5, 0);
                        this.npArr[1].position = new BABYLON.Vector3(-1, .5, 0);
                        this.npArr[2].position = new BABYLON.Vector3(0, -.5, 0);
                        this.npArr[3].position = new BABYLON.Vector3(1, -.5, 0);
                        break;

                    case NTEngine.PIECE_L:
                        this.npArr[0].position = new BABYLON.Vector3(0, .5, 0);
                        this.npArr[1].position = new BABYLON.Vector3(1, .5, 0);
                        this.npArr[2].position = new BABYLON.Vector3(-1, .5, 0);
                        this.npArr[3].position = new BABYLON.Vector3(1, -.5, 0);
                        break;

                    default:
                        this.npArr[0].position = new BABYLON.Vector3(.5, 0, 0);
                        this.npArr[1].position = new BABYLON.Vector3(1.5, 0, 0);
                        this.npArr[2].position = new BABYLON.Vector3(-.5, 0, 0);
                        this.npArr[3].position = new BABYLON.Vector3(-1.5, 0, 0);
                        break;
                }
            }
        });
        
        return scene;
    };
}
