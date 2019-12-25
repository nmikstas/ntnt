
class NTRender
{
    constructor()
    {
        this.gm = 1.5; //Glow multiplier.
        this.lightOffset = 0; //Used to move the lighting around the scene.
        this.currentLevel;

        this.boxArr = []; //Array of all the game field pieces.
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
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(0, .087*this.gm, .246*this.gm), 
                new BABYLON.Color3(.062*this.gm, .190*this.gm, .255*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(0, .168*this.gm, 0), 
                new BABYLON.Color3(.128*this.gm, .208*this.gm, .016*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(.219*this.gm, 0, .205*this.gm), 
                new BABYLON.Color3(.248*this.gm, .120*this.gm, .248*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(0, .088*this.gm, .248*this.gm), 
                new BABYLON.Color3(.091*this.gm, .219*this.gm, .087*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(.231*this.gm, 0, .091*this.gm), 
                new BABYLON.Color3(.088*this.gm, .248*this.gm, .152*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(.088*this.gm, .248*this.gm, .152*this.gm), 
                new BABYLON.Color3(.107*this.gm, .136*this.gm, .255*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(.248*this.gm, .056*this.gm, 0), 
                new BABYLON.Color3(.127*this.gm, .127*this.gm, .127*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(.107*this.gm, .071*this.gm, .255*this.gm), 
                new BABYLON.Color3(.171*this.gm, 0, .035*this.gm), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(0, .088*this.gm, .248*this.gm), 
                new BABYLON.Color3(.248*this.gm, .056*this.gm, 0), new BABYLON.Color3(0, 0, 0)
            ],
            [
                new BABYLON.Color3(0, 0, 0), new BABYLON.Color3(.252*this.gm, .252*this.gm, .252*this.gm), new BABYLON.Color3(.248, .056, 0), 
                new BABYLON.Color3(.255*this.gm, .163*this.gm, .071*this.gm), new BABYLON.Color3(0, 0, 0)
            ]
        ]
    }

    /************************************ Rendering Functions ************************************/

    //Render the play field.
    gfRender = (status) =>
    {
        //Copy variables needed to run the game.
        this.currentLevel = status.currentLevel;

        //Need to make a deep copy of the array.
        for(let i = 0; i < this.renderFieldArr.length; i++)
        {
            for(let j = 0; j < this.renderFieldArr[i].length; j++)
            {
                this.renderFieldArr[i][j] = status.gameField[i][j];
            }
        }

        let gameStatus = status.gameStatus;

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
        scene.clearColor = new BABYLON.Color3(.3, 0, .5);

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
                //fgBox.material = blockMat;
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
}
