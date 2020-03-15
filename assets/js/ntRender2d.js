class NTRender2d
{
    constructor(statsCallback, gfDiv, pieceDiv, useEngine = true)
    {
        this.statsCallback = statsCallback;
        this.enableInputCallback = null;
        this.useEngine = useEngine;
        this.gfDiv = gfDiv;
        this.pieceDiv = pieceDiv;
        this.ntEngine;
        this.getField;

        this.animCounter   = 0;
        this.blocksCounter = 0;

        this.currentLevel = 0;
        this.lastLevel    = -1;

        this.pieceCurrent = 0;
        this.pieceNext    = 0;
        this.pieceThird   = 0;

        this.glueTimer;
        this.animTimer;
        this.blocksTimer;

        this.playField   = [];
        this.nextPiece   = [];
        this.rowsToErase = [];
        this.blankBlocks = [];

        this.gameStatus = NTEngine.GS_OVER;
        this.lastStatus = NTEngine.GS_OVER;
        this.lastRequest = NTEngine.GR_NONE;
        this.lastRequestStatus = NTEngine.LRS_NONE;
        
        this.tPause;  //Pause SFX.
        this.tRotate; //Rotate SFX.
        this.tMove;   //Move SFX.
        this.tDrop;   //Drop SFX.
        this.tTetris; //Tetris SFX.
        this.tLine;   //Line clear SFX.
        this.tLevel;  //Level up SFX.
        this.tStart;  //Start SFX.
        this.tOver;   //Game over SFX.

        this.colors =
        [
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(  0,  87, 246)", "rgb( 62, 190, 255)", "rgb(116, 116, 116)"],
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(  0, 168,   0)", "rgb(128, 208,  16)", "rgb(116, 116, 116)"],
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(219,   0, 205)", "rgb(248, 120, 248)", "rgb(116, 116, 116)"],
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(  0,  88, 248)", "rgb( 91, 219,  87)", "rgb(116, 116, 116)"],
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(231,   0,  91)", "rgb( 88, 248, 152)", "rgb(116, 116, 116)"],
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb( 88, 248, 152)", "rgb(107, 136, 255)", "rgb(116, 116, 116)"],
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(248,  56,   0)", "rgb(127, 127, 127)", "rgb(116, 116, 116)"],
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(107,  71, 255)", "rgb(171,   0,  35)", "rgb(116, 116, 116)"],
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(  0,  88, 248)", "rgb(248,  56,   0)", "rgb(116, 116, 116)"],
            ["rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(248,  56,   0)", "rgb(255, 163,  71)", "rgb(116, 116, 116)"]
        ];

        this.gfInit();
        this.npInit();
    }

    /************************************** Sizing Function **************************************/

    resize()
    {
        //Resize gamefield.
        let gfDivWidth = this.gfDiv.width();
        let gfDivHeight = this.gfDiv.height();
        let gfWidth;
        let gfHeight;

        if(gfDivWidth <= (gfDivHeight / 2))
        {
            gfWidth = gfDivWidth;
            gfHeight = 2 * gfDivWidth;
        }
        else
        {
            gfWidth = Math.floor(gfDivHeight / 2);
            gfHeight = gfDivHeight;
        }

        let thisDivHeight = gfHeight / 23;
        let thisDivWidth  = gfWidth  / 11.5;

        $(".this-span").height(thisDivHeight);
        $(".this-span").width(thisDivWidth);

        //Resize next piece.
        $(".next-span").height(thisDivHeight * .75);
        $(".next-span").width(thisDivWidth * .75);
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

        for(let i = this.playField.length-1; i > 0; i--)
        {
            for(let j = 0; j < 10; j++)
            {
                this.playField[i][j].css("background-color", this.playField[i-1][j].css("background-color"));    
            }
        }

        for(let j = 0; j < 10; j++)
        {
            if(j === this.blankBlocks[this.blocksCounter])
            {
                this.playField[0][j].css("background-color", "rgb(0,0,0)");
            }
            else
            {
                this.playField[0][j].css("background-color", "rgb(116,116,116)");
            }        
        }

        this.tDrop.play();
        this.blocksCounter++;
    }

    eraseAnim()
    {
        //Finish up the animation.
        if(this.animCounter >= 10)
        {
            this.ntEngine.ntRequest(NTEngine.GR_RESUME);
            clearInterval(this.animTimer);
            this.enableInputCallback(true);
            this.animCounter = 0;
            return;
        }

        if(this.rowsToErase.length !== 4)
        {
            for(let i = 0; i < this.rowsToErase.length; i++)
            {
                this.playField[this.rowsToErase[i]][this.animCounter].css("background-color", "rgb(0,0,0)");
            }
        }
        else //Special animation for tetris.
        {
            for(let i = 0; i < this.rowsToErase.length; i++)
            {
                for(let j = 0; j < 10; j++)
                {
                    //Get the current background color.
                    let rgb = this.playField[this.rowsToErase[i]][j].css("background-color");

                    //Remove the unecessary string parts.
                    rgb = rgb.replace(/rgb\(/, "");
                    rgb = rgb.replace(/\)/, "");

                    //Convert the remining string numbers into integers.
                    let colorArr = rgb.split(",");
                    let red = parseInt(colorArr[0]);
                    let green = parseInt(colorArr[1]);
                    let blue = parseInt(colorArr[2]);

                    //Subtract 1/10th of total possible color.
                    red   -= 26;
                    green -= 26;
                    blue  -= 26;

                    //Make sure color does not go below 0.
                    if(red < 0)   red   = 0;
                    if(green < 0) green = 0;
                    if(blue < 0)  blue  = 0;

                    //Update colors.
                    this.playField[this.rowsToErase[i]][j].css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
                } 
            }
        }

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

    /*************************************** SFX Functions ***************************************/

    initAudio()
    {
        this.tPause = new Howl({ src: ["https://nmikstas.github.io/resources/audio/tPause.ogg"] });
        this.tRotate = new Howl({ src: ["https://nmikstas.github.io/resources/audio/tRotate.ogg"] });
        this.tMove = new Howl({ src: ["https://nmikstas.github.io/resources/audio/tMove.ogg"] });
        this.tDrop = new Howl({ src: ["https://nmikstas.github.io/resources/audio/tDrop.ogg"] });
        this.tTetris = new Howl({ src: ["https://nmikstas.github.io/resources/audio/tTetris.ogg"] });
        this.tLine = new Howl({ src: ["https://nmikstas.github.io/resources/audio/tLine.ogg"] });
        this.tLevel = new Howl({ src: ["https://nmikstas.github.io/resources/audio/tlLevel.ogg"] });
        this.tStart = new Howl({ src: ["https://nmikstas.github.io/resources/audio/tStart.ogg"] });
        this.tOver = new Howl({ src: ["https://nmikstas.github.io/resources/audio/tOver.ogg"] });
    }

    /************************************ Rendering Function *************************************/

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
        let colors             = status.recommendedColors;

        //Send stats to function to be displayed to the user.
        this.statsCallback(this.currentLevel, status.currentScore, status.linesCleared, this.gameStatus, this.lastRequestStatus);

        //Pause SFX.
        if(this.lastRequest === NTEngine.GR_PAUSE && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.tPause.play();
        }

        //Rotate SFX.
        if(this.lastRequest === NTEngine.GR_ROTATE_CW && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.tRotate.play();
        }

        //Rotate SFX.
        if(this.lastRequest === NTEngine.GR_ROTATE_CCW && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.tRotate.play();
        }

        //Move SFX.
        if(this.lastRequest === NTEngine.GR_LEFT && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.tMove.play();
        }

        //Move SFX.
        if(this.lastRequest === NTEngine.GR_RIGHT && this.lastRequestStatus === NTEngine.LRS_ACCEPT)
        {
            this.tMove.play();
        }

        //Drop SFX.
        if(this.gameStatus === NTEngine.GS_WAIT && !this.rowsToErase.length)
        {
            this.tDrop.play();
        }

        //Tetris SFX.
        if(this.gameStatus === NTEngine.GS_WAIT && this.rowsToErase.length === 4)
        {
            this.tTetris.play();
        }
        //Level SFX.
        else if(this.lastLevel >= 0 && this.currentLevel !== this.lastLevel)
        {
            this.tLevel.play();
            this.lastLevel = this.currentLevel;
        }
        //Line SFX.
        else if(this.gameStatus === NTEngine.GS_WAIT && this.rowsToErase.length > 0)
        {
            this.tLine.play();
        }

        //Check if game was just started.
        if(this.gameStatus === NTEngine.GS_PLAY && this.lastStatus === NTEngine.GS_OVER)
        {
            this.tStart.play();
        }

        //Check if game just ended.
        if(this.gameStatus === NTEngine.GS_OVER && this.lastStatus !== NTEngine.GS_OVER)
        {
            this.tOver.play();
            this.lastLevel = -1;
        }

        //Update the level on the first piece.
        if(this.lastLevel < 0 && this.gameStatus !== NTEngine.GS_OVER)
        {
            this.lastLevel = this.currentLevel;
        }

        //Update the last status.
        this.lastStatus = this.gameStatus;

        //Check if block add wait state,
        if(this.gameStatus === NTEngine.GS_WAIT_BLK && this.useEngine)
        {
            this.enableInputCallback(false);
            this.blankBlocks = status.blanks;
            clearInterval(this.blocksTimer);
            this.blocksTimer = setInterval(() => {this.addBlocksAnim()}, 50);
            return;
        }

        //Check if animation wait state.
        if(this.gameStatus === NTEngine.GS_WAIT && this.useEngine)
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

        //Update the last status.
        this.lastStatus = this.gameStatus;

        //Render the game field.
        if(this.gameStatus !== NTEngine.GS_WAIT_BLK)
        {
            field = status.gameField;
        }
        else if(this.useEngine)
        {
            field = ntEngine.ntGetGameField();
        }
        else
        {
            field = status.gameField;
        }

        for(let i = 0; i < 20; i++)
        {
            for(let j = 0; j < 10; j++)
            {
                //Render the play field only if the game is not paused.
                this.playField[i][j].css("background-color", this.gameStatus !== NTEngine.GS_PAUSE ?
                    this.colors[this.currentLevel % 10][field[i][j]] : "rgb(0, 0, 0)");
            }
        }

        //Indicate the game is paused.
        if(this.gameStatus === NTEngine.GS_PAUSE)
        {
            let pauseText = $("<h1>");
            pauseText.addClass("pause-text");
            pauseText.text("PAUSED");
            this.playField[10][2].append(pauseText);
        }
        else
        {
            $(".this-span").empty();
        }

        //Clear the old colors.
        for(let  i = 0; i < this.nextPiece.length; i++)
        {
            for(let j = 0; j < this.nextPiece[i].length; j++)
            {
                this.nextPiece[i][j].css("background-color", colors[0]);
            }
        }

        //Exit if the game is over.
        if(this.gameStatus === NTEngine.GS_OVER) return;

        //Render the next piece only if game is not paused.
        if(this.gameStatus !== NTEngine.GS_PAUSE)
        {
            switch(this.pieceNext)
            {
                case NTEngine.PIECE_T:
                    this.nextPiece[1][3].css("background-color", colors[1]);
                    this.nextPiece[2][3].css("background-color", colors[1]);
                    this.nextPiece[2][4].css("background-color", colors[1]);
                    this.nextPiece[2][2].css("background-color", colors[1]);
                    break;

                case NTEngine.PIECE_BKL:
                    this.nextPiece[1][4].css("background-color", colors[2]);
                    this.nextPiece[2][4].css("background-color", colors[2]);
                    this.nextPiece[2][3].css("background-color", colors[2]);
                    this.nextPiece[2][2].css("background-color", colors[2]);
                    break;

                case NTEngine.PIECE_Z:
                    this.nextPiece[1][3].css("background-color", colors[3]);
                    this.nextPiece[2][3].css("background-color", colors[3]);
                    this.nextPiece[1][4].css("background-color", colors[3]);
                    this.nextPiece[2][2].css("background-color", colors[3]);
                    break;

                case NTEngine.PIECE_SQR:
                    this.nextPiece[1][2].css("background-color", colors[1]);
                    this.nextPiece[1][3].css("background-color", colors[1]);
                    this.nextPiece[2][2].css("background-color", colors[1]);
                    this.nextPiece[2][3].css("background-color", colors[1]);
                    break;

                case NTEngine.PIECE_S:
                    this.nextPiece[1][2].css("background-color", colors[2]);
                    this.nextPiece[1][3].css("background-color", colors[2]);
                    this.nextPiece[2][3].css("background-color", colors[2]);
                    this.nextPiece[2][4].css("background-color", colors[2]);
                    break;

                case NTEngine.PIECE_L:
                    this.nextPiece[1][2].css("background-color", colors[3]);
                    this.nextPiece[2][2].css("background-color", colors[3]);
                    this.nextPiece[2][3].css("background-color", colors[3]);
                    this.nextPiece[2][4].css("background-color", colors[3]);
                    break;

                default:
                    this.nextPiece[1][1].css("background-color", colors[1]);
                    this.nextPiece[1][2].css("background-color", colors[1]);
                    this.nextPiece[1][3].css("background-color", colors[1]);
                    this.nextPiece[1][4].css("background-color", colors[1]);
                    break;
            }
        }
    }

    /*********************************** Initialize Functions ************************************/

    //This function renders the game field.
    gfInit()
    {
        //Empty out any canvases that might exist.
        this.gfDiv.empty();
        this.pieceDiv.empty();

        this.initAudio(); //Initialize all the SFX.

        //Create 20 divs. with 10 spans each.
        for(let i = 0; i < 20; i++)
        {
            let thisRow = [];

            for(let j = 0; j < 10; j++)
            {
                let thisSpan = $("<span>");
                thisSpan.addClass("this-span");
                thisRow.push(thisSpan);
            }

            this.playField.push(thisRow);
        }

        //Put the divs on the web page.
        for(let i = this.playField.length - 1; i >= 0; i--)
        {
            let rowDiv = $("<div>");
            rowDiv.addClass("this-div");
            rowDiv.append(this.playField[i]);
            this.gfDiv.append(rowDiv);
        }
    }

    //This function renders the next piece.
    npInit()
    {
        //Create 4 divs. with 6 spans each.
        for(let i = 0; i < 4; i++)
        {
            let thisRow = [];

            for(let j = 0; j < 6; j++)
            {
                let thisSpan = $("<span>");
                thisSpan.addClass("next-span");
                thisRow.push(thisSpan);
            }

            this.nextPiece.push(thisRow);
        }

        //Put the divs on the web page.
        for(let i = this.nextPiece.length - 1; i >= 0; i--)
        {
            let rowDiv = $("<div>");
            rowDiv.addClass("this-div");
            rowDiv.append(this.nextPiece[i]);
            this.pieceDiv.append(rowDiv);
        }

        this.resize();
    }
}