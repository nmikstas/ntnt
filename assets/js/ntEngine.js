/************************************ Output Object Structure ************************************/

//Game status:
//PLAY  - the game is being played.
//PAUSE - the game has been paused by the user.
//WAIT  - the game is waiting for a continue signal. used for animation delays.
//OVER  - the game is over.

//Last request status:
//NONE   - status is not the result of a request. when piece falls to next level, for example.
//ACCEPT - last request was excepted. Spin a piece, for example.
//REJECT - last request was rejected. Piece cannot be spun because it it blocked, for example.

//Current level - increases every 10 lines.
//Current score
//Lines cleared
//Rows to erase - an array of rows to erase. Should only have values when status = WAIT.

//Piece Y position
//Piece X position
//Piece current
//Piece rotation
//Piece next

//Recommended colors:
//An array of 5 colors recommended for rendering. Classic NES Tetris colors. 0 is always black.

//gameField array:
//22 high by 10 wide.  Represents the game field plus 2 top rows that are unrendered.
//An integer between 0 and 4. the number represents the color. 0 is always black. color 4
//is used for blocks that have been added by addLines request.

/************************************ Input Object Structure *************************************/

//Game requests:
//NONE      - get current status. 0 = return object, 1 = use callback.
//ROTATECW  - rotate piece clockwise.
//ROTATECCW - rotate piece counter clockwise.
//LEFT      - move piece left.
//RIGHT     - move piece right.
//DOWN      - move piece down.
//PAUSE     - toggle pause game.
//RESUME    - resume the game when engine is waiting.
//ADD_LINES - add lines to bottom of game field. param is number of lines to add.
//RESET     - reset the game. param is level to start on.
//RESEED    - reset the seed for the RNG. param is the new seed.

//param:
//Varies in function. See above.

/***************************************** Color Schemes *****************************************/

//There are 10 different color schemes that repeat every 10 levels (RGB values):
//Level 0: (0, 0, 0), (252, 252, 252), (  0,  87, 246), ( 62, 190, 255), (116, 116, 116)
//Level 1: (0, 0, 0), (252, 252, 252), (  0, 168,   0), (128, 208,  16), (116, 116, 116)
//Level 2: (0, 0, 0), (252, 252, 252), (219,   0, 205), (248, 120, 248), (116, 116, 116)
//Level 3: (0, 0, 0), (252, 252, 252), (  0,  88, 248), ( 91, 219,  87), (116, 116, 116)
//Level 4: (0, 0, 0), (252, 252, 252), (231,   0,  91), ( 88, 248, 152), (116, 116, 116)
//Level 5: (0, 0, 0), (252, 252, 252), ( 88, 248, 152), (107, 136, 255), (116, 116, 116)
//Level 6: (0, 0, 0), (252, 252, 252), (248,  56,   0), (127, 127, 127), (116, 116, 116)
//Level 7: (0, 0, 0), (252, 252, 252), (107,  71, 255), (171,   0,  35), (116, 116, 116)
//Level 8: (0, 0, 0), (252, 252, 252), (  0,  88, 248), (248,  56,   0), (116, 116, 116)
//Level 9: (0, 0, 0), (252, 252, 252), (248,  56,   0), (255, 163,  71), (116, 116, 116)

/***************************************** Level Points ******************************************/

//The scoring is as follows where n is the current level:
//1 line:    40 * (n + 1)
//2 lines:  100 * (n + 1)
//3 lines:  300 * (n + 1)
//4 lines: 1200 * (n + 1)

/****************************************** Drop Speeds ******************************************/

//Based on 60 frames per second, the following shows how many frames between row drops:
//Level 0:     48 frames (800ms)
//Level 1:     43 frames (717ms)
//Level 2:     38 frames (633ms)
//Level 3:     33 frames (550ms)
//Level 4:     28 frames (467ms)
//Level 5:     23 frames (383ms)
//Level 6:     18 frames (300ms)
//Level 7:     13 frames (217ms)
//Level 8:     8  frames (133ms)
//Level 9:     6  frames (100ms)
//Level 10–12: 5  frames (83ms)
//Level 13–15: 4  frames (67ms)
//Level 16–18: 3  frames (50ms)
//Level 19–28: 2  frames (33ms)
//Level 29+:   1  frame  (17ms)

/***************************************** Tetris Pieces *****************************************/

//There are 7 pieces.  The following are their corresponding numbers and color indexes:
//0 T           - Color index 1
//1 Backwards L - Color index 2
//2 Z           - Color index 3
//3 Square      - Color index 1
//4 S           - Color index 2
//5 L           - Color index 3
//6 I           - Color index 1

/**************************************** Piece Rotations ****************************************/

//The 0 position is the piece unrotated. The numbers increase as the piece rotates clockwise.
//See the Nintendo rotation system for details.

class NTEngine
{
    //Game status.
    static get GS_OVER()  { return 0 };
    static get GS_PLAY()  { return 1 };
    static get GS_PAUSE() { return 2 };
    static get GS_WAIT()  { return 3 };

    //Game requests.
    static get GR_NONE()       { return 0 };
    static get GR_ROTATE_CW()  { return 1 };
    static get GR_ROTATE_CCW() { return 2 };
    static get GR_LEFT()       { return 3 };
    static get GR_RIGHT()      { return 4 };
    static get GR_DOWN()       { return 5 };
    static get GR_PAUSE()      { return 6 };
    static get GR_RESUME()     { return 7 };
    static get GR_ADD_LINES()  { return 8 };
    static get GR_RESET()      { return 9 };
    static get GR_RESEED()     { return 10 };

    //Last request status
    static get LRS_NONE()   { return 0 };
    static get LRS_ACCEPT() { return 1 };
    static get LRS_REJECT() { return 2 };

    //Piece values.
    static get PIECE_T()   { return 0 };
    static get PIECE_BKL() { return 1 };
    static get PIECE_Z()   { return 2 };
    static get PIECE_SQR() { return 3 };
    static get PIECE_S()   { return 4 };
    static get PIECE_L()   { return 5 };
    static get PIECE_I()   { return 6 };

    constructor(rndSeed, statusCallback)
    {
        this.rndSeed        = rndSeed;
        this.statusCallback = statusCallback;

        //Seed the RNG.
        this._seed;
        this.ntRandom(this.rndSeed);
        this.ntNext();

        //Interval timer.
        this.timer;

        //Game engine variables.
        this.gameStatus = NTEngine.GS_OVER;
        this.lastRequestStatus = NTEngine.LRS_NONE;
        this.currentLevel = 0;
        this.currentScore = 0;
        this.linesCleared = 0;
        this.rowsToErase = [];

        this.pieceY = 19;
        this.pieceX = 5;
        this.pieceCurrent = this.ntNext();
        this.pieceRotation = 0;
        this.pieceNext = this.ntNext();

        this.recommendedColors = this.levelColors(this.currentLevel);
        this.pieceColors = [1, 2, 3, 1, 2, 3, 1];
        
        this.gameField =
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
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    }

    //Recommended colors array.
    levelColors(level)
    {
        let thisLevel = parseInt(level);
        thisLevel = Math.abs(level);
        thisLevel %= 10;

        const colors =
        [
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(  0,  87, 246)", "rgb( 62, 190, 255)", "rgb(116, 116, 116)" ],
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(  0, 168,   0)", "rgb(128, 208,  16)", "rgb(116, 116, 116)" ],
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(219,   0, 205)", "rgb(248, 120, 248)", "rgb(116, 116, 116)" ],
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(  0,  88, 248)", "rgb( 91, 219,  87)", "rgb(116, 116, 116)" ],
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(231,   0,  91)", "rgb( 88, 248, 152)", "rgb(116, 116, 116)" ],
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb( 88, 248, 152)", "rgb(107, 136, 255)", "rgb(116, 116, 116)" ],
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(248,  56,   0)", "rgb(127, 127, 127)", "rgb(116, 116, 116)" ],
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(107,  71, 255)", "rgb(171,   0,  35)", "rgb(116, 116, 116)" ],
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(  0,  88, 248)", "rgb(248,  56,   0)", "rgb(116, 116, 116)" ],
            [ "rgb(0, 0, 0)", "rgb(252, 252, 252)", "rgb(248,  56,   0)", "rgb(255, 163,  71)", "rgb(116, 116, 116)" ]
        ];

        return colors[thisLevel];
    };

    //Level timer values.
    levelTimer(level)
    {
        let thisLevel = parseInt(level);
        thisLevel = Math.abs(level);

        if     (thisLevel === 0) return 800;
        else if(thisLevel === 1) return 717;
        else if(thisLevel === 2) return 633;
        else if(thisLevel === 3) return 550;
        else if(thisLevel === 4) return 467;
        else if(thisLevel === 5) return 383;
        else if(thisLevel === 6) return 300;
        else if(thisLevel === 7) return 217;
        else if(thisLevel === 8) return 133;
        else if(thisLevel === 9) return 100;
        else if(thisLevel >= 10 && thisLevel <= 12) return 83;
        else if(thisLevel >= 13 && thisLevel <= 15) return 67;
        else if(thisLevel >= 16 && thisLevel <= 18) return 50;
        else if(thisLevel >= 19 && thisLevel <= 28) return 33;
        else if(thisLevel >= 29) return 17;
        else return 800;
    };

    getPlayField()
    {
        let _gameField = [];

        //Make a copy of the playfield.
        for(let i = 0; i < this.gameField.length; i++)
        {
            _gameField.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            for(let j = 0; j < this.gameField[i].length; j++)
            {
                _gameField[i][j] = this.gameField[i][j];
            }
        }

        //Get the color index for the current piece.
        let thisColorIndex = this.pieceColors[this.pieceCurrent];

        //Add in the current piece.
        switch(this.pieceCurrent)
        {
            case NTEngine.PIECE_T:
                _gameField[this.pieceY][this.pieceX] = thisColorIndex;
                switch(this.pieceRotation)
                {
                    case 0:
                        _gameField[this.pieceY-1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        break;

                    case 1:
                        _gameField[this.pieceY-1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY+1][this.pieceX  ] = thisColorIndex;
                        break;

                    case 2:
                        _gameField[this.pieceY+1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        break;

                    default:
                        _gameField[this.pieceY+1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        break;
                }
                break;

            case NTEngine.PIECE_BKL:
                _gameField[this.pieceY][this.pieceX] = thisColorIndex;
                switch(this.pieceRotation)
                {
                    case 0:
                        
                        _gameField[this.pieceY  ][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX+1] = thisColorIndex;
                        break;

                    case 1:
                        _gameField[this.pieceY-1][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY+1][this.pieceX  ] = thisColorIndex;
                        break;

                    case 2:
                        _gameField[this.pieceY  ][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        _gameField[this.pieceY+1][this.pieceX-1] = thisColorIndex;
                        break;

                    default:
                        _gameField[this.pieceY-1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY+1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY+1][this.pieceX+1] = thisColorIndex;
                        break;
                }
                break;

            case NTEngine.PIECE_Z:
                _gameField[this.pieceY][this.pieceX] = thisColorIndex;
                switch(this.pieceRotation)
                {
                    case 0:
                    case 2:
                        _gameField[this.pieceY  ][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX+1] = thisColorIndex;
                        break;

                    default:
                        _gameField[this.pieceY-1][this.pieceX]   = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        _gameField[this.pieceY+1][this.pieceX+1] = thisColorIndex;
                        break;
                }
                break;

            case NTEngine.PIECE_SQR:
                _gameField[this.pieceY][this.pieceX] = thisColorIndex;
                _gameField[this.pieceY][this.pieceX-1] = thisColorIndex;
                _gameField[this.pieceY-1][this.pieceX-1] = thisColorIndex;
                _gameField[this.pieceY-1][this.pieceX] = thisColorIndex;
                break;

            case NTEngine.PIECE_S:
                _gameField[this.pieceY][this.pieceX] = thisColorIndex;
                switch(this.pieceRotation)
                {
                    case 0:
                    case 2:
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX-1] = thisColorIndex;
                        break;

                    default:
                        _gameField[this.pieceY+1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX+1] = thisColorIndex;
                        break;
                }
                break;

            case NTEngine.PIECE_L:
                _gameField[this.pieceY][this.pieceX] = thisColorIndex;
                switch(this.pieceRotation)
                {
                    case 0:
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX-1] = thisColorIndex;
                        break;

                    case 1:
                        _gameField[this.pieceY-1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY+1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY+1][this.pieceX-1] = thisColorIndex;
                        break;

                    case 2:
                        _gameField[this.pieceY+1][this.pieceX+1] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY  ][this.pieceX+1] = thisColorIndex;
                        break;

                    default:
                        _gameField[this.pieceY+1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX  ] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX+1] = thisColorIndex;
                        break;
                }
                break;

            default:
                _gameField[this.pieceY][this.pieceX] = thisColorIndex;
                switch(this.pieceRotation)
                {
                    case 0:
                    case 2:
                        _gameField[this.pieceY][this.pieceX+1] = thisColorIndex;
                        _gameField[this.pieceY][this.pieceX-1] = thisColorIndex;
                        _gameField[this.pieceY][this.pieceX-2] = thisColorIndex;
                        break;

                    default:
                        _gameField[this.pieceY+1][this.pieceX] = thisColorIndex;
                        _gameField[this.pieceY+2][this.pieceX] = thisColorIndex;
                        _gameField[this.pieceY-1][this.pieceX] = thisColorIndex;
                        break;
                }
                break;
        }

        return _gameField;
    }

    //Copy the active piece into the game field. This happens after the piece is set in place.
    updatePlayField()
    {
        let _gameField = this.getPlayField();

        //Copy _gameField into gameField.
        for(let i = 0; i < this.gameField.length; i++)
        {
            for(let j = 0; j < this.gameField[i].length; j++)
            {
                this.gameField[i][j] = _gameField[i][j];
            }
        }
    }

    //Seeds the random number generator.
    ntRandom(seed)
    {
        this._seed = seed % 2147483647;
        if (this._seed <= 0) this._seed += 2147483646;
    }

    //Gets the next random number and updates the RNG.
    ntNext()
    {
        this._seed = this._seed * 16807 % 2147483647;
        return this._seed % 7;
    }

    //Used by outside code to get the current game status.
    ntStatus()
    {
        return {
            gameStatus:        this.gameStatus,
            lastRequestStatus: this.lastRequestStatus,
            currentLevel:      this.currentLevel,
            currentScore:      this.currentScore,
            linesCleared:      this.linesCleared,
            rowsToErase:       this.rowsToErase,
            pieceY:            this.pieceY,
            pieceX:            this.pieceX,
            pieceCurrent:      this.pieceCurrent,
            pieceRotation:     this.pieceRotation,
            pieceNext:         this.pieceNext,
            recommendedColors: this.recommendedColors,
            gameField:         this.getPlayField()
        }
    }

    ntReset(gameLevel)
    {
        this.gameStatus        = NTEngine.GS_PLAY;
        this.lastRequestStatus = NTEngine.LRS_ACCEPT;
        this.currentLevel      = gameLevel;
        this.currentScore      = 0;
        this.linesCleared      = 0;
        this.rowsToErase       = [];
        this.pieceY            = 19;
        this.pieceX            = 5;
        this.pieceCurrent      = this.ntNext();
        this.pieceRotation     = 0;
        this.pieceNext         = this.ntNext();
        this.recommendedColors = this.levelColors(this.currentLevel);
        this.gameField =
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
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]

        let self = this;

        //Set the piece timer based on the current level.
        clearInterval(this.timer);
        this.timer = setInterval(function(){ self.ntRequest(NTEngine.GR_DOWN) }, self.levelTimer(self.currentLevel));
    }

    //This function locks a piece onto the playing field.
    gluePiece()
    {
        this.updatePlayField();
        this.pieceCurrent = this.pieceNext;
        this.lastRequestStatus = NTEngine.LRS_ACCEPT;
        this.pieceNext = this.ntNext();
        this.pieceY = 19;
        this.pieceX = 5;
    }

    //Check for collisions on the X,Y pairs.
    checkCollisions(collisionsArr)
    {
        let collisionFound = false;
        for(let i = 0; i < collisionsArr.length; i++)
        {
            if(this.gameField[this.pieceY+collisionsArr[i].y][this.pieceX+collisionsArr[i].x] !== 0)
            {
                collisionFound = true;
            } 
        }
        return collisionFound;
    }

    //Move a piece 1 place to the left.
    movePieceLeft()
    {
        this.pieceX--;
        this.lastRequestStatus = NTEngine.LRS_ACCEPT;
    }

    //Move a piece to the right.
    movePieceRight()
    {
        this.pieceX++;
        this.lastRequestStatus = NTEngine.LRS_ACCEPT;
    }

    //Move a piece down.
    MovePieceDown()
    {
        this.pieceY--;
        this.lastRequestStatus = NTEngine.LRS_ACCEPT;
    }

    //Used by outside code to make a request of the NT engine.
    ntRequest(request, param)
    {
        switch(request)
        {
            case NTEngine.GR_NONE:
                //Check if the object should be returned instead of being sent by the callback.
                if(param !== 1)
                {
                    return this.ntStatus();
                }
                break;

            /********************************* Rotate Clockwise **********************************/

            case NTEngine.GR_ROTATE_CW:
                switch(this.pieceCurrent)
                {
                    case NTEngine.PIECE_T:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;
                };
                break;

            /***************************** Rotate Counter Clockwise ******************************/
            
            case NTEngine.GR_ROTATE_CCW:
                switch(this.pieceCurrent)
                {
                    case NTEngine.PIECE_T:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                break;
                            case 1:
                                break;
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                break;
                            default:
                                break;
                        }
                        break;
                };
                break;

            /********************************* Move Piece Left **********************************/

            case NTEngine.GR_LEFT:
                //Make sure the game is playing.
                if(this.gameStatus !== NTEngine.GS_PLAY)
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                    break;
                }
                
                switch(this.pieceCurrent)
                {
                    case NTEngine.PIECE_T:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                //Check for collision left.
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -1}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            case 1:

                                break;

                            case 2:

                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                //Check for collision left.
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: 0}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            case 1:

                                break;

                            case 2:

                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                //Check for collision left.
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -1}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        //Check for collision left.
                        (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -2}, {y: 0, x: -2}])) ?
                            this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                //Check for collision left.
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -2}, {y: 0, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                //Check for collision left.
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -2}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            case 1:

                                break;
                            case 2:

                                break;

                            default:

                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                //Check for collision left.
                                (this.pieceX === 2 || this.checkCollisions([{y: 0, x: -3}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            default:

                                break;
                        }
                        break;
                };
                break;

            /********************************* Move Piece Right **********************************/

            case NTEngine.GR_RIGHT:
                //Make sure the game is playing.
                if(this.gameStatus !== NTEngine.GS_PLAY)
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                    break;
                }

                switch(this.pieceCurrent)
                {
                    case NTEngine.PIECE_T:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                //Check for collision right.
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 1}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            case 1:

                                break;

                            case 2:

                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                //Check for collision right.
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 2}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            case 1:

                                break;

                            case 2:

                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                //Check for collision right.
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 2}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        //Check for collision right.
                        (this.pieceX === 9 || this.checkCollisions([{y: -1, x: 1}, {y: 0, x: 1}])) ?
                            this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                //Check for collision right.
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 1}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                //Check for collision right.
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 0}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            case 1:

                                break;

                            case 2:

                                break;

                            default:

                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                //Check for collision right.
                                (this.pieceX === 8 || this.checkCollisions([{y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            default:

                                break;
                        }
                        break;
                };
                break;

            /********************************** Move Piece Down **********************************/

            case NTEngine.GR_DOWN:
                //Make sure the game is playing.
                if(this.gameStatus !== NTEngine.GS_PLAY)
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                    break;
                }

                switch(this.pieceCurrent)
                {
                    case NTEngine.PIECE_T:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                //Check for collision below.
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0},
                                    {y: -1, x: -1}, {y: -1, x: 1}])) ? this.gluePiece() : this.MovePieceDown();
                                break;

                            case 1:

                                break;

                            case 2:

                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                //Check for collision below.
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 1},
                                    {y: -1, x: 0}, {y: -1, x: -1}])) ? this.gluePiece() : this.MovePieceDown();
                                break;

                            case 1:

                                break;

                            case 2:

                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                //Check for collision below.
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}, 
                                    {y: -1, x: -1}, {y: -2, x: 1}])) ? this.gluePiece() : this.MovePieceDown();
                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        //Check for collision below.
                        (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0},
                            {y: -2, x: -1}])) ? this.gluePiece() : this.pieceY--;
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                //Check for collision below.
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0},
                                    {y: -2, x: -1}, {y: -1, x: 1}])) ? this.gluePiece() : this.MovePieceDown();
                                break;

                            default:

                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                //Check for collision below.
                                (this.pieceY === 1 || this.checkCollisions([{y: -1, x: 0},
                                    {y: -1, x: 1}, {y: -2, x: -1}])) ? this.gluePiece() : this.MovePieceDown();
                                break;

                            case 1:

                                break;

                            case 2:

                                break;

                            default:

                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                //Check for collision below.
                                (this.pieceY === 0 || this.checkCollisions([{y: -1, x: 0}, {y: -1, x: 1},
                                    {y: -1, x: -1}, {y: -1, x: -2}])) ? this.gluePiece() : this.MovePieceDown();
                                break
                    
                            default:

                                break;
                        }
                        break;
                };
                break;

            case NTEngine.GR_PAUSE:

                break;

            case NTEngine.GR_RESUME:

                break;

            case NTEngine.GR_ADD_LINES:

                break;

            case NTEngine.GR_RESET:
                //The level to start on must be set.
                let paramInt = parseInt(param);

                if(isNaN(paramInt) || param < 0 || param > 29)
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                    break;
                }

                this.ntReset(param);
                break;

            case NTEngine.GR_RESEED:

                break;

            default:
                break;
        }

        this.statusCallback(this.ntStatus());
    }
}