
class NTRender
{
    constructor(statsCallback)
    {
        this.statsCallback = statsCallback; //Callback used for displaying the game stats.
        this.gm            = 1.5;           //Glow multiplier.
        this.lightOffset   = 0;             //Used to move the lighting around the scene.
        this.currentLevel  = 0;
        this.pieceCurrent  = 0;
        this.pieceNext     = 0;
        this.pieceThird    = 0;
        this.gameStatus    = NTEngine.GS_OVER;
        this.cameraOffset  = 0;

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

    /************************************ Rendering Functions ************************************/

    //Render the play field.
    gfRender = (status) =>
    {
        //Copy variables needed to run the game.
        this.gameStatus   = status.gameStatus;
        this.currentLevel = status.currentLevel;
        this.pieceCurrent = status.pieceCurrent;
        this.pieceNext    = status.pieceNext;
        this.pieceThird   = status.pieceThird;

        //Need to make a deep copy of the array.
        for(let i = 0; i < this.renderFieldArr.length; i++)
        {
            for(let j = 0; j < this.renderFieldArr[i].length; j++)
            {
                this.renderFieldArr[i][j] = status.gameField[i][j];
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
        if(gameStatus === NTEngine.GS_WAIT)
        {
            ntEngine.ntRequest(NTEngine.GR_RESUME);
        }

        //Check if block add wait state,
        if(gameStatus === NTEngine.GS_WAIT_BLK)
        {
            ntEngine.ntRequest(NTEngine.GR_RESUME_BLK);
        }
    }

    /********************************** Main Babylon Functions ***********************************/

    //This function renders the game field.
    gfCreateScene = () =>
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

        //Add lights to the scene
        let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
        let gl = new BABYLON.GlowLayer("glow", scene);

        //Game field background material.
        let backMat = new BABYLON.StandardMaterial("backMat", scene);
        backMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris2.png", scene);
        backMat.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/tetris2n.png", scene);
        backMat.emissiveColor = new BABYLON.Color3(0, 0, 0);

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

        //Add background blocks to the scene.
        for(let i = 0; i < 10; i++)
        {
            for(let j = 0; j < 20; j++)
            {
                let bkBox = BABYLON.MeshBuilder.CreateBox("box" + i + j, {height: 1, width: 1, depth: 1}, scene);
                bkBox.position = new BABYLON.Vector3(i, j, -1);
                bkBox.material = backMat;
            }
        }

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

        //This is where all the changes in the game happen.
        scene.registerBeforeRender(() =>
        {
            light2.position = new BABYLON.Vector3(4.5 + 7 * Math.cos(this.lightOffset), 9.5 + 14 * Math.sin(this.lightOffset), 5);
            this.lightOffset += .002;

            for(let i = 0; i < this.boxArr.length; i++)
            {
                for(let j = 0; j < this.boxArr[i].length; j++)
                {
                    if(this.renderFieldArr[i][j])
                    {
                        let colorIndex = this.currentLevel % 10;
                        this.boxArr[i][j].isVisible = true;
                        this.boxArr[i][j].material = this.matArr[colorIndex][this.renderFieldArr[i][j]];
                    }
                    else
                    {
                        this.boxArr[i][j].isVisible = false;
                    }
                }
            }
        });

        return scene;
    };

    //This function renders the next piece.
    npCreateScene = () =>
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
