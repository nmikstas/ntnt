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
    static get GS_OVER()     { return 0 };
    static get GS_PLAY()     { return 1 };
    static get GS_PAUSE()    { return 2 };
    static get GS_WAIT()     { return 3 };
    static get GS_WAIT_BLK() { return 4 };

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
    static get GR_RESUME_BLK() { return 11 };

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

    constructor(rndSeed, statusCallback, currentLevel = 0)
    {
        this.statusCallback = statusCallback;

        //Seed the RNG.
        this._seed;
        this.rndSeed = rndSeed;
  
        //Interval timer.
        this.timer;

        //Game engine variables.
        this.gameStatus        = NTEngine.GS_OVER;
        this.lastRequest       = NTEngine.GR_NONE;
        this.lastRequestStatus = NTEngine.LRS_NONE;
        this.currentLevel      = currentLevel;
        this.currentScore      = 0;
        this.linesCleared      = 0;

        this.rowsToErase    = [];
        this.rowsToAddNow   = 0;
        this.rowsToAddTotal = 0;
        this.blanks         = [];

        this.pieceY = 19;
        this.pieceX = 5;
        this.pieceRotation = 0;

        //Fill the random number pipeline.
        this.pieceCurrent;
        this.pieceNext;
        this.pieceThird;
        this.ntRandPrime();

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
            _gameField.push([]);
            for(let j = 0; j < this.gameField[i].length; j++)
            {
                _gameField[i].push(this.gameField[i][j]);
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

    //Returns the game field to render without the current piece shown.
    ntGetGameField()
    {
        return this.gameField;
    }

    /********************************** Random Number Functions **********************************/
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

    //Reseed the RNG.
    ntReseed(newSeed)
    {
        this.rndSeed = newSeed;
        this.ntRandom(this.rndSeed);
        this.ntNext();
    }

    //Prime the random number sequence with unique numbers.
    ntRandPrime()
    {
        this.ntReseed(this.rndSeed);
        this.pieceCurrent = this.ntNext();

        do
        {
            this.pieceNext = this.ntNext();
        } 
        while(this.pieceNext === this.pieceCurrent);

        do
        {
            this.pieceThird = this.ntNext();
        } 
        while(this.pieceThird === this.pieceCurrent || this.pieceThird === this.pieceNext);
    }

    //Get next unique random number.
    ntNextRand()
    {
        this.pieceCurrent = this.pieceNext;
        this.pieceNext = this.pieceThird;

        do
        {
            this.pieceThird = this.ntNext();
        } 
        while(this.pieceThird === this.pieceCurrent || this.pieceThird === this.pieceNext);
    }

    /******************************************* Reset *******************************************/

    //Used by outside code to get the current game status.
    ntStatus()
    {
        return {
            gameStatus:        this.gameStatus,
            lastRequest:       this.lastRequest,
            lastRequestStatus: this.lastRequestStatus,
            currentLevel:      this.currentLevel,
            currentScore:      this.currentScore,
            linesCleared:      this.linesCleared,
            rowsToErase:       this.rowsToErase,
            rowsToAddNow:      this.rowsToAddNow,
            rowsToAddTotal:    this.rowsToAddTotal,
            blanks:            this.blanks,
            pieceY:            this.pieceY,
            pieceX:            this.pieceX,
            pieceRotation:     this.pieceRotation,
            pieceCurrent:      this.pieceCurrent,
            pieceNext:         this.pieceNext,
            pieceThird:        this.pieceThird,
            recommendedColors: this.recommendedColors,
            gameField:         this.getPlayField()
        }
    }

    ntReset(gameLevel)
    {
        this.gameStatus        = NTEngine.GS_PLAY;
        this.lastRequest       = NTEngine.GR_RESET;
        this.lastRequestStatus = NTEngine.LRS_ACCEPT;
        this.currentLevel      = parseInt(gameLevel);
        this.currentScore      = 0;
        this.linesCleared      = 0;
        this.rowsToErase       = [];
        this.rowsToAddNow      = 0;
        this.rowsToAddTotal    = 0;
        this.blanks            = [];
        this.pieceY            = 19;
        this.pieceX            = 5;
        this.pieceRotation     = 0;
        this.ntRandPrime();
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

        //Set the piece timer based on the current level.
        clearInterval(this.timer);
        this.timer = setInterval(() => this.ntRequest(NTEngine.GR_DOWN), this.levelTimer(this.currentLevel));
    }

    checkGameOver()
    {
        let gameOver = false;

        if(this.gameField[19][5] !== 0)
        {
            gameOver = true;
        }

        switch(this.pieceCurrent)
        {
            case NTEngine.PIECE_T:
                if(this.gameField[19][4] || this.gameField[19][6] || this.gameField[18][5])
                {
                    gameOver = true;
                }
                break;

            case NTEngine.PIECE_BKL:
                if(this.gameField[19][4] || this.gameField[19][6] || this.gameField[18][6])
                {
                    gameOver = true;
                }
                break;

            case NTEngine.PIECE_Z:
                if(this.gameField[19][4] || this.gameField[18][6] || this.gameField[18][5])
                {
                    gameOver = true;
                }
                break;

            case NTEngine.PIECE_SQR:
                if(this.gameField[19][4] || this.gameField[18][4] || this.gameField[18][5])
                {
                    gameOver = true;
                }
                break;

            case NTEngine.PIECE_S:
                if(this.gameField[19][5] || this.gameField[18][4] || this.gameField[18][5])
                {
                    gameOver = true;
                }
                break;

            case NTEngine.PIECE_L:
                if(this.gameField[19][4] || this.gameField[19][6] || this.gameField[18][4])
                {
                    gameOver = true;
                }
                break;

            default:
                if(this.gameField[19][4] || this.gameField[19][6] || this.gameField[18][3])
                {
                    gameOver = true;
                }
                break;
        }

        if(gameOver)
        {
            clearInterval(this.timer);
            this.gameStatus = NTEngine.GS_OVER;
        }
    }

    updateStats()
    {
        //Update score.
        if(this.rowsToErase.length === 1)
        {
            this.currentScore += 40 * (this.currentLevel + 1);
        }
        else if(this.rowsToErase.length === 2)
        {
            this.currentScore += (100 * (this.currentLevel + 1));
        }
        else if(this.rowsToErase.length === 3)
        {
            this.currentScore += (300 * (this.currentLevel + 1));
        }
        else if(this.rowsToErase.length === 4)
        {
            this.currentScore += (1200 * (this.currentLevel + 1));
        }

        this.linesCleared += this.rowsToErase.length;
        let newLevel = parseInt(this.linesCleared / 10);

        //Increase the level, if necessary.
        if(newLevel > this.currentLevel)
        {
            this.currentLevel = newLevel;
            this.recommendedColors = this.levelColors(this.currentLevel);
        }

        //See if the player lost.
        this.checkGameOver();
    }

    removeLines()
    {
        //Always remove the 2 non-rendered lines.
        this.gameField[20] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.gameField[21] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        //If more than one line is to be erased, the row numbers need to be adjusted.
        for(let i = 0; i < this.rowsToErase.length; i++)
        {
            this.rowsToErase[i] -= i;
        }

        //Remove any completed lines.
        for(let i = 0; i < this.rowsToErase.length; i++)
        {
            for(let j = this.rowsToErase[i]; j < this.gameField.length - 1; j++)
            {
                this.gameField[j] = this.gameField[j+1];
            }
        }

        //Update all the player's stats.
        this.updateStats();

        //The work is done. Reset the line to erase.
        this.rowsToErase = [];
    }

    //Push line numbers for lines that need to be removed.
    checkRemoveLines()
    {
        for(let i = 0; i < this.gameField.length; i++)
        {
            //loop through every line to see if it is full.
            let lineFull = true;
            for(let j = 0; j < this.gameField[i].length; j++)
            {
                if(this.gameField[i][j] === 0)
                {
                    lineFull = false;
                }
            }

            //Full line found.
            if(lineFull)
            {
                this.rowsToErase.push(i);
            }
        }
    }

    //This function locks a piece onto the playing field.
    gluePiece()
    {
        //Add piece as permanent part of play field.
        this.gameField = this.getPlayField();

        this.ntNextRand();
        this.lastRequestStatus = NTEngine.LRS_ACCEPT;
        this.pieceY = 19;
        this.pieceX = 5;
        this.pieceRotation = 0;

        //Check for lines to remove.
        this.checkRemoveLines();

        //Shut off the timer and wait for the application to start the engine again.
        clearInterval(this.timer);
        this.gameStatus = NTEngine.GS_WAIT;
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

    //Rotate a piece clockwise.
    rotateCW()
    {
        this.pieceRotation++;
        if(this.pieceRotation > 3) this.pieceRotation = 0;
        this.lastRequestStatus = NTEngine.LRS_ACCEPT;
    }

    //Rotate a piece counter clockwise.
    rotateCCW()
    {
        this.pieceRotation--;
        if(this.pieceRotation < 0) this.pieceRotation = 3;
        this.lastRequestStatus = NTEngine.LRS_ACCEPT;
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

    //Add lines to the play field.
    addLines()
    {
        //Move all the rows up by and add blocks below.
        for(let i = 0; i < this.rowsToAddNow; i++)
        {
            for(let j = this.gameField.length-2; j > 0; j--)
            {
                this.gameField[j] = this.gameField[j-1];
            }

            //Clear out the top rows and the bottom row.
            this.gameField[21] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.gameField[20] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.gameField[0]  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            for(let j = 0; j < this.gameField[0].length; j++)
            {
                if(j === this.blanks[i])
                {
                    this.gameField[0][j] = 0;
                }
                else
                {
                    this.gameField[0][j] = 4;
                }
            }
        }
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

                this.lastRequest = NTEngine.GR_NONE;
                break;

            /********************************* Rotate Clockwise **********************************/

            case NTEngine.GR_ROTATE_CW:
                this.lastRequest = NTEngine.GR_ROTATE_CW;
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
                                (this.checkCollisions([{y: 1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;
                                
                            case 1:
                                (this.pieceX === 9 || this.checkCollisions([{y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            case 2:
                                (this.checkCollisions([{y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 0, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.checkCollisions([{y: 1, x: 0}, {y: -1, x: -1}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            case 1:
                                (this.pieceX === 9 || this.checkCollisions([{y: 1, x: -1}, {y: 0, x: -1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            case 2:
                                (this.checkCollisions([{y: 1, x: 0}, {y: 1, x: 1}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 0, x: -1}, {y: 0, x: 1}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.checkCollisions([{y: 1, x: 1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 0, x: -1}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        this.rotateCW();
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.checkCollisions([{y: 1, x: 0}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: -1, x: -1}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.checkCollisions([{y: 1, x: -1}, {y: 1, x: 0}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            case 1:
                                (this.pieceX === 9 || this.checkCollisions([{y: 1, x: 1}, {y: 0, x: -1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            case 2:
                                (this.checkCollisions([{y: 1, x: 0}, {y: -1, x: 0}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 0, x: -1}, {y: -1, x: -1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.checkCollisions([{y: 2, x: 0}, {y: 1, x: 0}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.pieceX === 1 || this.pieceX === 9 ||
                                    this.checkCollisions([{y: 0, x: -2}, {y: 0, x: -1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCW();
                                break;
                        }
                        break;
                };
                break;

            /***************************** Rotate Counter Clockwise ******************************/
            
            case NTEngine.GR_ROTATE_CCW:
                this.lastRequest = NTEngine.GR_ROTATE_CCW;
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
                                (this.checkCollisions([{y: 1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            case 1:
                                (this.pieceX === 9 || this.checkCollisions([{y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            case 2:
                                (this.checkCollisions([{y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 0, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.checkCollisions([{y: 1, x: 0}, {y: -1, x: 0}, {y: 1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            case 1:
                                (this.pieceX === 0 || this.checkCollisions([{y: 1, x: -1}, {y: 0, x: -1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            case 2:
                                (this.checkCollisions([{y: 1, x: 0}, {y: -1, x: -1}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            default:
                                (this.pieceX === 9 || this.checkCollisions([{y: 0, x: -1}, {y: 0, x: 1}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.checkCollisions([{y: 1, x: 1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 0, x: -1}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        this.rotateCCW();
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.checkCollisions([{y: 1, x: 0}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: -1, x: -1}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.checkCollisions([{y: 1, x: 0}, {y: -1, x: 0}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            case 1:
                                (this.pieceX === 0 || this.checkCollisions([{y: 0, x: -1}, {y: 1, x: 1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            case 2:
                                (this.checkCollisions([{y: 1, x: -1}, {y: 1, x: 0}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            default:
                                (this.pieceX === 9 || this.checkCollisions([{y: 0, x: -1}, {y: -1, x: -1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.checkCollisions([{y: 2, x: 0}, {y: 1, x: 0}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;

                            default:
                                (this.pieceX === 0 || this.pieceX === 1 || this.pieceX === 9 ||
                                    this.checkCollisions([{y: 0, x: -2}, {y: 0, x: -1}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.rotateCCW();
                                break;
                        }
                        break;
                };
                break;

            /********************************* Move Piece Left **********************************/

            case NTEngine.GR_LEFT:
                this.lastRequest = NTEngine.GR_LEFT;
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
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -1}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            case 1:
                                (this.pieceX === 1 || this.checkCollisions([{y: 1, x: -1}, {y: 0, x: -2}, {y: -1, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            case 2:
                                (this.pieceX === 1 || this.checkCollisions([{y: 1, x: -1}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 1, x: -1}, {y: 0, x: -1}, {y: -1, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: 0}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            case 1:
                                (this.pieceX === 1 || this.checkCollisions([{y: 1, x: -1}, {y: 0, x: -1}, {y: -1, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            case 2:
                                (this.pieceX === 1 || this.checkCollisions([{y: 1, x: -2}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 1, x: -1}, {y: 0, x: -1}, {y: -1, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -1}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 1, x: 0}, {y: 0, x: -1}, {y: -1, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -2}, {y: 0, x: -2}])) ?
                            this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -2}, {y: 0, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 1, x: -1}, {y: 0, x: -1}, {y: -1, x: 0}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.pieceX === 1 || this.checkCollisions([{y: -1, x: -2}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            case 1:
                                (this.pieceX === 1 || this.checkCollisions([{y: 1, x: -2}, {y: 0, x: -1}, {y: -1, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;
                            case 2:
                                (this.pieceX === 1 || this.checkCollisions([{y: 1, x: 0}, {y: 0, x: -2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            default:
                                (this.pieceX === 0 || this.checkCollisions([{y: 1, x: -1}, {y: 0, x: -1}, {y: -1, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.pieceX === 2 || this.checkCollisions([{y: 0, x: -3}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;

                            default:
                                (this.pieceX === 0 ||
                                    this.checkCollisions([{y: 2, x: -1}, {y: 1, x: -1}, {y: 0, x: -1}, {y: -1, x: -1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceLeft();
                                break;
                        }
                        break;
                };
                break;

            /********************************* Move Piece Right **********************************/

            case NTEngine.GR_RIGHT:
                this.lastRequest = NTEngine.GR_RIGHT;
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
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 1}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            case 1:
                                (this.pieceX === 9 || this.checkCollisions([{y: 1, x: 1}, {y: 0, x: 1}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            case 2:
                                (this.pieceX === 8 || this.checkCollisions([{y: 1, x: 1}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            default:
                                (this.pieceX === 8 || this.checkCollisions([{y: 1, x: 1}, {y: 0, x: 2}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 2}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            case 1:
                                (this.pieceX === 9 || this.checkCollisions([{y: 1, x: 1}, {y: 0, x: 1}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            case 2:
                                (this.pieceX === 8 || this.checkCollisions([{y: 1, x: 0}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            default:
                                (this.pieceX === 8 || this.checkCollisions([{y: 1, x: 2}, {y: 0, x: 1}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 2}, {y: 0, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            default:
                                (this.pieceX === 8 || this.checkCollisions([{y: 1, x: 2}, {y: 0, x: 2}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        (this.pieceX === 9 || this.checkCollisions([{y: -1, x: 1}, {y: 0, x: 1}])) ?
                            this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 1}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            default:
                                (this.pieceX === 8 || this.checkCollisions([{y: 1, x: 1}, {y: 0, x: 2}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.pieceX === 8 || this.checkCollisions([{y: -1, x: 0}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            case 1:
                                (this.pieceX === 9 || this.checkCollisions([{y: 1, x: 1}, {y: 0, x: 1}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            case 2:
                                (this.pieceX === 8 || this.checkCollisions([{y: 1, x: 2}, {y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            default:
                                (this.pieceX === 8 || this.checkCollisions([{y: 1, x: 1}, {y: 0, x: 1}, {y: -1, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.pieceX === 8 || this.checkCollisions([{y: 0, x: 2}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;

                            default:
                                (this.pieceX === 9 || this.checkCollisions([{y: 2, x: 1}, {y: 1, x: 1}, {y: 0, x: 1}, {y: -1, x: 1}])) ?
                                    this.lastRequestStatus = NTEngine.LRS_REJECT : this.movePieceRight();
                                break;
                        }
                        break;
                };
                break;

            /********************************** Move Piece Down **********************************/

            case NTEngine.GR_DOWN:
                this.lastRequest = NTEngine.GR_DOWN;
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
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}, {y: -1, x: -1}, {y: -1, x: 1}])) ? 
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            case 1:
                                (this.pieceY === 1 || this.checkCollisions([{y: -1, x: -1}, {y: -2, x: 0}])) ? 
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            case 2:
                                (this.pieceY === 0 || this.checkCollisions([{y: -1, x: -1}, {y: -1, x: 0}, {y: -1, x: 1}])) ? 
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            default:
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}, {y: -1, x: 1}])) ? 
                                    this.gluePiece() : this.MovePieceDown();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_BKL:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 1}, {y: -1, x: 0}, {y: -1, x: -1}])) ? 
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            case 1:
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: -1}, {y: -2, x: 0}])) ? 
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            case 2:
                                (this.pieceY === 0 || this.checkCollisions([{y: -1, x: -1}, {y: -1, x: 0}, {y: -1, x: 1}])) ? 
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            default:
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}, {y: 0, x: 1}])) ? 
                                    this.gluePiece() : this.MovePieceDown();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_Z:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}, {y: -1, x: -1}, {y: -2, x: 1}])) ?
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            default:
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}, {y: -1, x: 1}])) ? 
                                    this.gluePiece() : this.MovePieceDown();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_SQR:
                        (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}, {y: -2, x: -1}])) ?
                            this.gluePiece() : this.MovePieceDown();
                        break;

                    case NTEngine.PIECE_S:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}, {y: -2, x: -1}, {y: -1, x: 1}])) ?
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            default:
                                (this.pieceY === 1 || this.checkCollisions([{y: -1, x: 0}, {y: -2, x: 1}])) ?
                                    this.gluePiece() : this.MovePieceDown();
                                break;
                        }
                        break;

                    case NTEngine.PIECE_L:
                        switch(this.pieceRotation)
                        {
                            case 0:
                                (this.pieceY === 1 || this.checkCollisions([{y: -1, x: 0}, {y: -1, x: 1}, {y: -2, x: -1}])) ?
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            case 1:
                                (this.pieceY === 1 || this.checkCollisions([{y: 0, x: -1}, {y: -2, x: 0}])) ?
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            case 2:
                                (this.pieceY === 0 || this.checkCollisions([{y: -1, x: -1}, {y: -1, x: 0}, {y: -1, x: 1}])) ?
                                    this.gluePiece() : this.MovePieceDown();
                                break;

                            default:
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}, {y: -2, x: 1}])) ?
                                    this.gluePiece() : this.MovePieceDown();
                                break;
                        }
                        break;

                    default:
                        switch(this.pieceRotation)
                        {
                            case 0:
                            case 2:
                                (this.pieceY === 0 ||
                                    this.checkCollisions([{y: -1, x: 0}, {y: -1, x: 1}, {y: -1, x: -1}, {y: -1, x: -2}])) ?
                                    this.gluePiece() : this.MovePieceDown();
                                break
                    
                            default:
                                (this.pieceY === 1 || this.checkCollisions([{y: -2, x: 0}])) ?
                                    this.gluePiece() : this.MovePieceDown();
                                break;
                        }
                        break;
                };
                break;

            case NTEngine.GR_PAUSE:
                this.lastRequest = NTEngine.GR_PAUSE;
                if(this.gameStatus === NTEngine.GS_PLAY || this.gameStatus === NTEngine.GS_PAUSE)
                {
                    
                    if(this.gameStatus === NTEngine.GS_PLAY)
                    {
                        this.gameStatus = NTEngine.GS_PAUSE;
                        clearInterval(this.timer);
                    }
                    else
                    {
                        this.gameStatus = NTEngine.GS_PLAY;
                        //Set the piece timer based on the current level.
                        clearInterval(this.timer);
                        this.ntRequest(NTEngine.GR_DOWN);
                        this.timer = setInterval(() => this.ntRequest(NTEngine.GR_DOWN), this.levelTimer(this.currentLevel));
                    }
                }
                else
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                }
                break;

            //This resumes gameplay after a piece has been glued to the play field.
            case NTEngine.GR_RESUME:
                this.lastRequest = NTEngine.GR_RESUME;
                //Resume the game after an animation wait.
                if(this.gameStatus === NTEngine.GS_WAIT)
                {
                    //Remove any lines that need to be cleared.
                    this.removeLines();

                    //Check if lines need to be added.
                    if(this.rowsToAddTotal > 0 && this.gameStatus !== NTEngine.GS_OVER)
                    {
                        this.rowsToAddNow = parseInt(this.rowsToAddTotal);
                        this.rowsToAddTotal -= this.rowsToAddNow;
                        this.gameStatus = NTEngine.GS_WAIT_BLK;

                        //Get the random blank spots so the renderer can show them.
                        for(let i = 0; i < this.rowsToAddNow; i++)
                        {
                            this.blanks.push(Math.floor(Math.random() * 10));
                        }
                    }
                    //Only resume play if the game is not over.
                    else if(this.gameStatus !== NTEngine.GS_OVER)
                    {
                        clearInterval(this.timer);
                        this.timer = setInterval(() => this.ntRequest(NTEngine.GR_DOWN), this.levelTimer(this.currentLevel));
                        this.gameStatus = NTEngine.GS_PLAY;
                    }
                    //Otherwise reject the request.
                    else
                    {
                        this.lastRequestStatus = NTEngine.LRS_REJECT;
                    }  
                }
                else
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                }
                break;

            case NTEngine.GR_RESUME_BLK:
                this.lastRequest = NTEngine.GR_RESUME_BLK;
                //Resume the game after a block animation wait.
                if(this.gameStatus === NTEngine.GS_WAIT_BLK)
                {
                    //Add the lines to the play field.
                    this.addLines();

                    if(this.gameStatus !== NTEngine.GS_OVER)
                    {
                        this.rowsToAddNow = 0;
                        this.blanks = [];
                        clearInterval(this.timer);
                        this.timer = setInterval(() => this.ntRequest(NTEngine.GR_DOWN), this.levelTimer(this.currentLevel));
                        this.gameStatus = NTEngine.GS_PLAY;
                    }   
                }
                else
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                }

                break;

            case NTEngine.GR_ADD_LINES:
                this.lastRequest = NTEngine.GR_ADD_LINES;
                //The number of lines must be set.
                let addParamInt = param;

                if(isNaN(addParamInt) || addParamInt <=0 || addParamInt > 18)
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                    break;
                }

                this.rowsToAddTotal += param;

                //Only allow 18 lines max.
                if(this.rowsToAddTotal > 18)
                {
                    this.rowsToAddTotal = 18;
                }
                
                this.lastRequestStatus = NTEngine.LRS_ACCEPT;
                break;

            case NTEngine.GR_RESET:
                this.lastRequest = NTEngine.GR_RESET;
                //The level to start on must be set.
                let paramInt = parseInt(param);

                if(isNaN(paramInt) || paramInt < 0 || paramInt > 29)
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                    break;
                }

                this.ntReset(param);
                break;

            //This allows the RNG to be reseeded so all players have the same piece sequence.
            case NTEngine.GR_RESEED:
                this.lastRequest = NTEngine.GR_RESEED;
                let reseedParam = parseInt(param);

                if(isNaN(param))
                {
                    this.lastRequestStatus = NTEngine.LRS_REJECT;
                    break;
                }

                this.lastRequestStatus = NTEngine.LRS_ACCEPT;
                this.ntReseed(reseedParam);
                break;

            default:
                break;
        }

        this.statusCallback(this.ntStatus());
    }
}