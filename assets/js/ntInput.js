class NTInput
{
    //Game input values. Matches the corresponding game requests.
    static get IN_ROTATE_CW()  { return 1 };
    static get IN_ROTATE_CCW() { return 2 };
    static get IN_LEFT()       { return 3 };
    static get IN_RIGHT()      { return 4 };
    static get IN_DOWN()       { return 5 };
    static get IN_PAUSE()      { return 6 };

    //Input types.
    static get IT_KEYBOARD()        { return 0 };
    static get IT_GAMEPAD_ANALOG()  { return 1 };
    static get IT_GAMEPAD_DIGITAL() { return 2 };
    static get IT_GAMEPAD_DPAD()    { return 3 };

    //Button press states.
    static get BS_NOT_PRESSED() { return 0 };
    static get BS_PRESSED()     { return 1 };
    static get BS_WAIT()        { return 2 };
    static get BS_RETRIGGER()   { return 3 };

    //Timer value.
    static get TIMEOUT() { return 20} ;
   
    constructor
    (
        ntEngineCallback,
        { 
            leftBtn    = 37,
            leftIndex  = 0,
            leftType   = NTInput.IT_KEYBOARD,
            rightBtn   = 39,
            rightIndex = 0,
            rightType  = NTInput.IT_KEYBOARD,
            downBtn    = 40,
            downIndex  = 0,
            downType   = NTInput.IT_KEYBOARD,
            cwBtn      = 76,
            cwIndex    = 0,
            cwType     = NTInput.IT_KEYBOARD,
            ccwBtn     = 75,
            ccwIndex   = 0,
            ccwType    = NTInput.IT_KEYBOARD,
            pauseBtn   = 80,
            pauseIndex = 0,
            pauseType  = NTInput.IT_KEYBOARD
        } = {}
    )
    {
        this.debug = true;

        this.ntEngineCallback = ntEngineCallback;
        this.enableOutput     = true;

        this.leftBtn    = leftBtn;
        this.leftType   = leftType;
        this.leftIndex  = leftIndex;
        this.rightBtn   = rightBtn;
        this.rightType  = rightType;
        this.rightIndex = rightIndex;
        this.downBtn    = downBtn;
        this.downType   = downType;
        this.downIndex  = downIndex
        this.cwBtn      = cwBtn;
        this.cwType     = cwType;
        this.cwIndex    = cwIndex;
        this.ccwBtn     = ccwBtn;
        this.ccwType    = ccwType;
        this.ccwIndex   = ccwIndex;
        this.pauseBtn   = pauseBtn;
        this.pauseType  = pauseType;
        this.pauseIndex = pauseIndex;

        //Button press states.
        this.leftState  = NTInput.BS_NOT_PRESSED;
        this.rightState = NTInput.BS_NOT_PRESSED;
        this.downState  = NTInput.BS_NOT_PRESSED;
        this.cwState    = NTInput.BS_NOT_PRESSED;
        this.ccwState   = NTInput.BS_NOT_PRESSED;
        this.pauseState = NTInput.BS_NOT_PRESSED;

        //Gamepad variables.
        this.turbo         = false;
        this.firstUpdate   = true;
        this.controller    = {};
        this.buttonsCache  = [];
        this.buttonsStatus = [];
        this.axesStatus    = [];
        this.dPads         = [];

        //Keyboard variables.
        this.keysPressed = {};

        //State machine variables.
        this.leftTimer  = 0;
        this.rightTimer = 0;

        this.init();
    }

    enableInputs = (en) =>
    {
        if(en)
        {
            this.enableOutput = true;
        }
        else
        {
            this.enableOutput = false;
        }
    }

    connect = (evt) =>
    {
        this.controller = evt.gamepad;
        this.turbo = true;
        if(this.debug)console.log('Gamepad connected.');
    }

    disconnect = (evt) =>
    {
        this.turbo = false;
        delete this.controller;
        if(this.debug)console.log('Gamepad disconnected.');
    }

    onKeydown = (event) =>
    {
        this.keysPressed[event.keyCode] = true;
    }
    
    onKeyup = (event) =>
    {
        delete this.keysPressed[event.keyCode];
    }

    doKeyUp = () =>
    {
        this.onKeyup(event);
    }

    doKeyDown = () =>
    {
        this.onKeydown(event);
    }

    init = () =>
    {
        window.addEventListener("gamepadconnected", this.connect);
        window.addEventListener("gamepaddisconnected", this.disconnect);
        document.addEventListener('keyup', this.doKeyUp);
        document.addEventListener('keydown', this.doKeyDown);
        setInterval(() => { this.update() }, 17);
    }

    update = () =>
    {
        //Clear the buttons cache
        this.buttonsCache = [];

        //Move the buttons status from the previous frame to the cache
        for(let k = 0; k < this.buttonsStatus.length; k++)
        {
            this.buttonsCache[k] = this.buttonsStatus[k];
        }

        //Clear the buttons status
        this.buttonsStatus = [];

        //Get the gamepad object
        let c = this.controller || {};
      
        //Loop through buttons and push the pressed ones to the array
        let pressed = [];
        if(c.buttons)
        {
            for(let b = 0, t = c.buttons.length; b < t; b++)
            {
                if(c.buttons[b].pressed)
                {
                    pressed.push(b);
                }
            }
        }

        //Loop through axes and push their values to the array
        let axes = [];
        if(c.axes)
        {
            for(let a = 0, x = c.axes.length; a < x; a++)
            {
                axes.push(c.axes[a].toFixed(2));

                //Create an array of D-pad axis indicators on the first update.
                if(this.firstUpdate)
                {
                    this.dPads.push(false);
                }
            }

            this.firstUpdate = false;
        }

        //Assign received values
        this.axesStatus = axes;
        this.buttonsStatus = pressed;

        //Check for D-pad axis.
        for(let i = 0; i < this.axesStatus.length; i++)
        {
            if(this.axesStatus[i] > 1.0 || this.axesStatus[i] < -1.0)
            {
                this.dPads[i] = true;
            }
        }

        //Update the button press state machines.
        this.updateButtonPresses();
    }

    updateNoRetrigger = (type, button, state, index, input) =>
    {
        switch(type)
        {
            case NTInput.IT_KEYBOARD:
                if(this.keysPressed[button])
                {
                    if(state === NTInput.BS_NOT_PRESSED)
                    {
                        state = NTInput.BS_PRESSED;
                        this.ntEngineCallback(input);
                    }
                }
                else
                {
                    state = NTInput.BS_NOT_PRESSED;
                }
                break;

            case NTInput.IT_GAMEPAD_DIGITAL:
                if(this.buttonsStatus.includes(button))
                {
                    if(state === NTInput.BS_NOT_PRESSED)
                    {
                        state = NTInput.BS_PRESSED;
                        this.ntEngineCallback(input);
                    }
                }
                else
                {
                    state = NTInput.BS_NOT_PRESSED;
                }
                break;

            case NTInput.IT_GAMEPAD_ANALOG:
                if((this.axesStatus[index] >= button) && (button >= 0))
                {
                    if(state === NTInput.BS_NOT_PRESSED)
                    {
                        state = NTInput.BS_PRESSED;
                        this.ntEngineCallback(input);
                    }
                }
                else if((this.axesStatus[index] <= button) && (button < 0))
                {
                    if(state === NTInput.BS_NOT_PRESSED)
                    {
                        state = NTInput.BS_PRESSED;
                        this.ntEngineCallback(input);
                    }
                }
                else
                {
                    state = NTInput.BS_NOT_PRESSED;
                }
                break;
                
            case NTInput.IT_GAMEPAD_DPAD:
                let tenPercent = button * .10;
                if(this.axesStatus[index] >= 0 &&
                    this.axesStatus[index] <= (button + tenPercent) &&
                    this.axesStatus[index] >= (button - tenPercent))
                {
                    if(state === NTInput.BS_NOT_PRESSED)
                    {
                        state = NTInput.BS_PRESSED;
                        this.ntEngineCallback(input);
                    }
                }
                else if(this.axesStatus[index] < 0 &&
                    this.axesStatus[index] >= (button + tenPercent) &&
                    this.axesStatus[index] <= (button - tenPercent))
                {
                    if(state === NTInput.BS_NOT_PRESSED)
                    {
                        state = NTInput.BS_PRESSED;
                        this.ntEngineCallback(input);
                    }
                }
                else
                {
                    state = NTInput.BS_NOT_PRESSED;
                }
                break;
        
            default:
                console.log("Error - key type not recognized.");
                state = NTInput.BS_NOT_PRESSED;
                break;
        }
        
        return state;
    }

    updateDelayedRetrigger = (type, button, state, index, input, timer) =>
    {
        let stateReturn = 
        {
            state: state,
            timer: timer
        };
        
        switch(type)
        {
            case NTInput.IT_KEYBOARD:
                if(this.keysPressed[button])
                {
                    stateReturn = this.updateRetriggerStateMachine(state, timer, input);
                }
                else
                {
                    stateReturn.state = NTInput.BS_NOT_PRESSED;
                }
                break;

            case NTInput.IT_GAMEPAD_DIGITAL:
                if(this.buttonsStatus.includes(button))
                {
                    stateReturn = this.updateRetriggerStateMachine(state, timer, input);
                }
                else
                {
                    stateReturn.state = NTInput.BS_NOT_PRESSED;
                }
                break;

            case NTInput.IT_GAMEPAD_ANALOG:
                if((this.axesStatus[index] >= button) && (button >= 0))
                {
                    stateReturn = this.updateRetriggerStateMachine(state, timer, input);
                }
                else if((this.axesStatus[index] <= button) && (button < 0))
                {
                    stateReturn = this.updateRetriggerStateMachine(state, timer, input);
                }
                else
                {
                    stateReturn.state = NTInput.BS_NOT_PRESSED;
                }
                break;
                
            case NTInput.IT_GAMEPAD_DPAD:
                let tenPercent = button * .10;
                if(this.axesStatus[index] >= 0 &&
                    this.axesStatus[index] <= (button + tenPercent) &&
                    this.axesStatus[index] >= (button - tenPercent))
                {
                    stateReturn = this.updateRetriggerStateMachine(state, timer, input);
                }
                else if(this.axesStatus[index] < 0 &&
                    this.axesStatus[index] >= (button + tenPercent) &&
                    this.axesStatus[index] <= (button - tenPercent))
                {
                    stateReturn = this.updateRetriggerStateMachine(state, timer, input);
                }
                else
                {
                    stateReturn.state = NTInput.BS_NOT_PRESSED;
                }
                break;
        
            default:
                console.log("Error - key type not recognized.");
                break;
        }

        return stateReturn;
    }

    updateRetriggerStateMachine(state, timer, input)
    {
        switch(state)
        {
            case NTInput.BS_NOT_PRESSED:
                timer = 0;
                this.ntEngineCallback(input);
                state = NTInput.BS_WAIT;
                break;

            case NTInput.BS_WAIT:
                timer++;
                if(timer > NTInput.TIMEOUT)
                {
                    state = NTInput.BS_RETRIGGER;
                }
                break;

            case NTInput.BS_RETRIGGER:
                this.ntEngineCallback(input);
                break;

            default:
                state = NTInput.BS_NOT_PRESSED;
                break;
        }

        return {
            state: state,
            timer: timer
        };  
    }

    updateButtonPresses = () =>
    {
        //Exit if the output is not enabled. This is used when reconfiguring keys.
        if(!this.enableOutput) return;

        /******************************* Down button state machine *******************************/

        switch(this.downType)
        {
            case NTInput.IT_KEYBOARD:
                if(this.keysPressed[this.downBtn])
                {
                    this.downState = NTInput.BS_PRESSED;
                    this.ntEngineCallback(NTInput.IN_DOWN);
                }
                else
                {
                    this.downState = NTInput.BS_NOT_PRESSED;
                }
                break;

            case NTInput.IT_GAMEPAD_DIGITAL:
                if(this.buttonsStatus.includes(this.downBtn))
                {
                    this.downState = NTInput.BS_PRESSED;
                    this.ntEngineCallback(NTInput.IN_DOWN);
                }
                else
                {
                    this.downState = NTInput.BS_NOT_PRESSED;
                }
                break;

            case NTInput.IT_GAMEPAD_ANALOG:
                if((this.axesStatus[this.downIndex] >= this.downBtn) && (this.downBtn >= 0))
                {
                    this.downState = NTInput.BS_PRESSED;
                    this.ntEngineCallback(NTInput.IN_DOWN);
                }
                else if((this.axesStatus[this.downIndex] <= this.downBtn) && (this.downBtn < 0))
                {
                    this.downState = NTInput.BS_PRESSED;
                    this.ntEngineCallback(NTInput.IN_DOWN);
                }
                else
                {
                    this.downState = NTInput.BS_NOT_PRESSED;
                }
                break;
                
            case NTInput.IT_GAMEPAD_DPAD:
                let tenPercent = this.downBtn * .10;
                if(this.axesStatus[this.downIndex] >= 0 &&
                    this.axesStatus[this.downIndex] <= (this.downBtn + tenPercent) &&
                    this.axesStatus[this.downIndex] >= (this.downBtn - tenPercent))
                {
                    this.downState = NTInput.BS_PRESSED;
                    this.ntEngineCallback(NTInput.IN_DOWN);
                }
                else if(this.axesStatus[this.downIndex] < 0 &&
                    this.axesStatus[this.downIndex] >= (this.downBtn + tenPercent) &&
                    this.axesStatus[this.downIndex] <= (this.downBtn - tenPercent))
                {
                    this.downState = NTInput.BS_PRESSED;
                    this.ntEngineCallback(NTInput.IN_DOWN);
                }
                else
                {
                    this.downState = NTInput.BS_NOT_PRESSED;
                }
                break;
        
            default:
                console.log("Error - down key type not recognized.");
                break;
        }       
        
        /****************************** No Retrigger Button Checks *******************************/

        this.cwState    = this.updateNoRetrigger(this.cwType, this.cwBtn, this.cwState, this.cwIndex, NTInput.IN_ROTATE_CW);
        this.ccwState   = this.updateNoRetrigger(this.ccwType, this.ccwBtn, this.ccwState, this.ccwIndex, NTInput.IN_ROTATE_CCW);
        this.pauseState = this.updateNoRetrigger(this.pauseType, this.pauseBtn, this.pauseState, this.pauseIndex, NTInput.IN_PAUSE);

        /**************************** Delayed Retrigger Button Checks ****************************/

        let stateReturn = {};

        stateReturn = this.updateDelayedRetrigger(this.leftType, this.leftBtn, this.leftState, this.leftIndex, NTInput.IN_LEFT, this.leftTimer);
        this.leftState = stateReturn.state;
        this.leftTimer = stateReturn.timer;

        stateReturn = this.updateDelayedRetrigger(this.rightType, this.rightBtn, this.rightState, this.rightIndex, NTInput.IN_RIGHT, this.rightTimer);
        this.rightState = stateReturn.state;
        this.rightTimer = stateReturn.timer;
    }
}