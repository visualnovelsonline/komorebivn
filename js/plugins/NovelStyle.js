//=============================================================================
// NovelStyle.js
//=============================================================================
/*:
 * @author 莞爾の草 (Kanji the Grass)
 * @plugindesc visual novel style [adv ui]
 * @help Picture IDs 18, 19, and 20 are used to display standing images,
 * which are read from faces to pictures.
 * Button image is divided into two halves-
 * the lower half of which will be displayed when the button is pressed.
 * When you have finished displaying images,
 * call the common event to hide the pictures.
 * 
 * When setting up characters on screen, use Show Text.
 * For character to appear, face and picture must be prepared separately.
 * Character uses the same name in both faces and pictures.
 * Set face in Show Text and picture will show up automatically.
 * Window position = Bottom, picture appears on the left.
 * Window position = Middle, picture appears in the middle.
 * Window position = Top, picture appears on the right.
 *
 * @param comBackLog
 * @desc Include text history
 * @default true
 * @type boolean
 * 
 * @param comConfig
 * @desc Include config button.
 * @default true
 * @type boolean
 * 
 * @param comHide
 * @desc Hide text button 
 * @default true
 * @type boolean
 * 
 * @param comLoad
 * @desc Include load button
 * @default true
 * @type boolean
 * 
 * @param comMenu
 * @desc Include menu button
 * @default true
 * @type boolean
 * 
 * @param comQLoad
 * @desc Include quickload button
 * @default true
 * @type boolean
 * 
 * @param comQSave
 * @desc Include quicksave button
 * @default true
 * @type boolean
 * 
 * @param comSave
 * @desc Include save button
 * @default true
 * @type boolean
 * 
 * @param comSkip
 * @desc Include skip button
 * @default true
 * @type boolean
 * 
 * @param comTitle
 * @desc Include title button
 * @default true
 * @type boolean
 * 
 * @param memorableLineNumber
 * @desc Limit of lines saved in text history
 * @default 25
 * @type number
 * 
 * @param quickSaveFileId
 * @desc File id for quicksave
 * @default 1
 * @type number
 */

(function () {
    var messageButtons = ['comBacklog',
        'comConfig', 'comSave', 'comLoad']

    var messageButtonStrings = [];
    var parameters = PluginManager.parameters('NovelStyle');

    messageButtons.forEach(function(com){
        if (parameters[com]) { messageButtonStrings.push("_" + com) } });

    var quickSaveFileId = parseInt(parameters['quickSaveFileId']);

    var skipMode = false

    var messageBuff = 15;

    var memorableLineNumber = parseInt(parameters['memorableLineNumber']);

    var untouchableMode = false

    var _charaShowId = [18, 19, 20];

    touchableHeight = function () {
        return Graphics.boxHeight - ImageManager.loadSystem(messageButtonStrings[0]).height / 2;
    };

    //-----------------------------------------------------------------------------
    // Game_Temp

    var _Game_Temp_isDestinationValid = Game_Temp.prototype.isDestinationValid
    Game_Temp.prototype.isDestinationValid = function () {
        return !untouchableMode && _Game_Temp_isDestinationValid.call(this) && TouchInput.y < touchableHeight();
    };

    //-----------------------------------------------------------------------------
    // _Game_Player_moveByInput

    var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function () {
        if (!untouchableMode) { _Game_Player_moveByInput.call(this) }
    };


    //-----------------------------------------------------------------------------
    // Window_Message

    var _Window_Message_initMembers = Window_Message.prototype.initMembers
    Window_Message.prototype.initMembers = function () {
        this._handler = {}
        _Window_Message_initMembers.call(this);
    };

    Window_Message.prototype.isTriggered = function () {
        if (untouchableMode) {
            return Input.isRepeated('ok') || Input.isRepeated('cancel') ||
                TouchInput.isTriggered() || TouchInput.isCancelled();
        } else {
            return messageBuff > 15 && ((Input.isRepeated('ok') || Input.isRepeated('cancel')) ||
                (TouchInput.isRepeated() && TouchInput.y < touchableHeight()));
        }
    };

    Window_Message.prototype.updatePlacement = function () {
        this._positionType = $gameMessage.positionType();
        this.y = (Graphics.boxHeight - this.height) - 48;
        this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
    };

    Window_Message.prototype.areSettingsChanged = function () {
        return (this._background !== $gameMessage.background());
    };

    Window_Message.prototype.drawMessageFace = function () {
        var id = _charaShowId[this._positionType];
        var ox = id - _charaShowId[1];
        var x = [500, 250, 0][this._positionType];
        var y = 0;
        $gameScreen.showPicture(id, $gameMessage.faceName(), 0, x - ox * 30, y, 100, 100, 20, 0);
        $gameScreen.movePicture(id, 0, x, y, 100, 100, 255, 0, 10);
        ImageManager.releaseReservation(this._imageReservationId);
    };

    Window_Message.prototype.newLineX = function () {
        return 0;
    };

    var _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
    Window_Message.prototype.updateShowFast = function () {
        _Window_Message_updateShowFast.call(this);
        if (skipMode) {
            this._showFast = true;
            this._pauseSkip = true;
        }
    };

    var _Window_Message_updateInput = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function () {
        if (untouchableMode && this.isTriggered()) {
            messageBuff = 0
            this.show();
            untouchableMode = false;
        } else {
            if (messageBuff <= 15) { messageBuff++ };
            if (this.pause && skipMode) {
                this.pause = false;
                if (!this._textState) {
                    this.terminateMessage();
                }
                return true;
            }
        }

        return _Window_Message_updateInput.call(this);
    };

    //-----------------------------------------------------------------------------
    // Window_MessageSelection

    function Window_MessageSelection() {
        this.initialize.apply(this, arguments);
    }

    Window_MessageSelection.prototype = Object.create(Window_Command.prototype);
    Window_MessageSelection.prototype.constructor = Window_MessageSelection;

    Window_MessageSelection.prototype.initialize = function () {
        Window_Command.prototype.initialize.call(this);
        this.x = (Graphics.boxWidth - this.windowWidth()) / 2
        this.y = (Graphics.boxHeight - this.windowHeight()) / 2
        this.activate();
    };

    Window_MessageSelection.prototype.makeCommandList = function () {
        this.addCommand('Yes', 'ok');
        this.addCommand('No', 'cancel');
    };

    //-----------------------------------------------------------------------------
    // Scene_Boot

    var _Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages
    Scene_Boot.loadSystemImages = function () {
        _Scene_Boot_loadSystemImages.call(this);
        messageButtonStrings.forEach(function (str) { ImageManager.reserveSystem(str) })
    };

    //-----------------------------------------------------------------------------
    // Game_Message

    Game_Message.prototype.backLogs = function () {
        if (!this._backLogs) { this._backLogs = [] }
        return this._backLogs;
    };

    Game_Message.prototype.pushBackLog = function (text) {
        if (!this._backLogs) { this._backLogs = [] };
        this._backLogs.push(text);
        if (this._backLogs.length > memorableLineNumber) { this._backLogs.shift() };
        return this._backLogs;
    };


    Game_Message.prototype.add = function (text) {
        this.pushBackLog(text);
        this._texts.push(text);
    };

    //-----------------------------------------------------------------------------
    // Window_BackLog

    function Window_BackLog() {
        this.initialize.apply(this, arguments)
    }

    Window_BackLog.prototype = Object.create(Window_Base.prototype);
    Window_BackLog.prototype.constructor = Window_BackLog;

    Window_BackLog.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh();
        this.updateArrows();
    };

    Window_BackLog.prototype.refresh = function () {
        var y = 0
        $gameMessage.backLogs().forEach(function (text) {
            this.drawTextEx(text, 0, y);
            y += this.lineHeight();
        }, this);
    };

    Window_BackLog.prototype.contentsHeight = function () {
        return this.lineHeight() * $gameMessage.backLogs().length;
    };

    Window_BackLog.prototype.windowHeight = function () {
        return this.height - this.standardPadding() * 2;
    };

    Window_BackLog.prototype.contentsBottom = function () {
        return Math.max(this.contentsHeight(), this.windowHeight()) - this.windowHeight();
    };

    Window_BackLog.prototype.updateArrows = function () {
        if (this.origin.y < 0) { this.origin.y = 0 };
        if (this.origin.y >= this.contentsBottom()) {
            this.origin.y = this.contentsBottom();
        };
        this.upArrowVisible = this.origin.y > 0;
        this.downArrowVisible = this.origin.y < this.contentsBottom();
    };


    //-----------------------------------------------------------------------------
    // Scene_BackLog

    function Scene_BackLog() {
        this.initialize.apply(this, arguments)
    }

    Scene_BackLog.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_BackLog.prototype.constructor = Scene_BackLog;

    Scene_BackLog.prototype.threshold = function () {
        return 20;
    };

    Scene_BackLog.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
            this.popScene();
        } else if (TouchInput.wheelY >= this.threshold()) {
            this._logWindow.origin.y += 18;
            this._logWindow.updateArrows();
        } else if (TouchInput.wheelY <= -this.threshold()) {
            this._logWindow.origin.y -= 18;
            this._logWindow.updateArrows();
        } else if (Input.isPressed('down')) {
            this._logWindow.origin.y += 9;
            this._logWindow.updateArrows();
        } else if (Input.isPressed('up')) {
            this._logWindow.origin.y -= 9;
            this._logWindow.updateArrows();
        } else if (TouchInput.isPressed()) {
            if (TouchInput.y < Graphics.height / 2) {
                this._logWindow.origin.y -= 9;
                this._logWindow.updateArrows();
            } else {
                this._logWindow.origin.y += 9;
                this._logWindow.updateArrows();
            }
        }
    };


    Scene_BackLog.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._logWindow = new Window_BackLog();
        this.addWindow(this._logWindow)

    };

    //-----------------------------------------------------------------------------
    // Scene_NovelCheckCommand
    function Scene_NovelCheckCommand() {
        this.initialize.apply(this, arguments)
    }

    Scene_NovelCheckCommand.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_NovelCheckCommand.prototype.constructor = Scene_NovelCheckCommand;

    Scene_NovelCheckCommand.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createSelectionWindow()
        this.createHelpWindow()
    };

    Scene_NovelCheckCommand.prototype.prepare = function (comType) {
        switch (comType) {
            case '_comTitle':
                // \nは改行マーク。\\c[1]は文章上の文字カラー変更の制御文字と同じです。（￥c[1]）
                // ほかの制御文字もほとんど使うことができます（ウェイトなどは使えません）。
                this._helpText =
                    "Return to the title?\n\\c[1]（Your progress will not be saved.）\\c[0]";
                this._yesMethod = this.onTitleOk.bind(this);
                break;
            case '_comQLoad':
                this._helpText =
                    "Do you want to Quickload?\n\\c[1]（Your progress will not be saved.）\\c[0]";
                this._yesMethod = this.onQloadOk.bind(this);
                break;
        }

    };

    Scene_NovelCheckCommand.prototype.createSelectionWindow = function () {
        this._selectionWindow = new Window_MessageSelection();
        this._selectionWindow.setHandler('ok', this._yesMethod);
        this._selectionWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._selectionWindow);
    }

    Scene_NovelCheckCommand.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Help();
        this._helpWindow.setText(this._helpText);
        this.addWindow(this._helpWindow);
    };

    Scene_NovelCheckCommand.prototype.onTitleOk = function () {
        this.startFadeOut(this.fadeSpeed(), false);
        SceneManager.goto(Scene_Title);
    }

    Scene_NovelCheckCommand.prototype.onQloadOk = function () {
        this.startFadeOut(this.fadeSpeed(), false);
        DataManager.loadGame(quickSaveFileId);
        SceneManager.goto(Scene_Map);
    }

    //-----------------------------------------------------------------------------
    // Sprite_NovelButton
    function Sprite_NovelButton() {
        this.initialize.apply(this, arguments)
    }

    Sprite_NovelButton.prototype = Object.create(Sprite_Button.prototype);
    Sprite_NovelButton.prototype.constructor = Sprite_NovelButton;

    Sprite_NovelButton.prototype.initialize = function () {
        Sprite_Button.prototype.initialize.call(this);
        this._lastVisible = true;
    };

    Sprite_NovelButton.prototype.update = function () {
        Sprite_Button.prototype.update.call(this);
        if (this._lastVisible == untouchableMode) {
            this._lastVisible = this.visible = !untouchableMode;
        }
    };


    //-----------------------------------------------------------------------------
    // Scene_Map

    var _Scene_Map_create = Scene_Map.prototype.onMapLoaded
    Scene_Map.prototype.onMapLoaded = function () {
        _Scene_Map_create.call(this);
        skipMode = false
        untouchableMode = false
        this.createMessageButton();
    }

    Scene_Map.prototype._comAuto = function () {
    }

    Scene_Map.prototype._comBacklog = function () {
        SceneManager.push(Scene_BackLog);
    }

    Scene_Map.prototype._comConfig = function () {
        SceneManager.push(Scene_Options);
    }

    Scene_Map.prototype._comSkip = function () {
        skipMode = !skipMode;
        var i = 0
        messageButtonStrings.forEach(function (str) {
            if (str == "_comSkip") {
                this._messageButtons[i].bitmap = ImageManager.loadSystem(skipMode ? "_comSkipping" : "_comSkip");
            }
            i++;
        }, this)

    }

    Scene_Map.prototype._comQLoad = function () {
        if (DataManager.isThisGameFile(quickSaveFileId)) {
            SceneManager.push(Scene_NovelCheckCommand);
            SceneManager.prepareNextScene('_comQLoad');
        } else {
            AudioManager.playSe({ "name": "Buzzer1", "volume": 90, "pitch": 100, "pan": 0 });
        }
    }

    Scene_Map.prototype._comTitle = function () {
        SceneManager.push(Scene_NovelCheckCommand);
        SceneManager.prepareNextScene('_comTitle');
    }

    Scene_Map.prototype._comLoad = function () {
        SceneManager.push(Scene_Load);
    }

    Scene_Map.prototype._comMenu = function () {
        SceneManager.push(Scene_Menu);
    }

    Scene_Map.prototype._comQSave = function () {
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(quickSaveFileId)) {
            AudioManager.playSe({ "name": "Save", "volume": 90, "pitch": 100, "pan": 0 });
            StorageManager.cleanBackup(quickSaveFileId);
        } else {
        }
    }

    Scene_Map.prototype._comSave = function () {
        SceneManager.push(Scene_Save);
    }

    Scene_Map.prototype._comHide = function () {
        this._messageWindow._textStop = true;
        untouchableMode = true;
        this._messageWindow.hide();
    }

    Scene_Map.prototype.showMessage = function () {
        this._messageWindow._textStop = false;
        //this._messageWindow.show();
    }

    Scene_Map.prototype.createMessageButton = function () {
        this._messageWindow._handler['show'] = this.showMessage.bind(this)
        this._messageButtons = []
        this._buttonVisible = false
        var i = 0;
        var length = messageButtonStrings.length
        var bitmap = ImageManager.loadSystem(messageButtonStrings[0])
        var width = bitmap.width
        var height = bitmap.height / 2
        var space = (Graphics.width - length * width) / (length + 1)

        messageButtonStrings.forEach(function (str) {
            i++;
            var sprite = new Sprite_NovelButton();
            sprite.bitmap = ImageManager.loadSystem(str);
            sprite.x = (space + width) * i - width;
            sprite.y = Graphics.boxHeight - height;
            sprite.setColdFrame(0, 0, width, height);
            sprite.setHotFrame(0, height, width, height);
            eval(`sprite.setClickHandler(this.${str}.bind(this))`)
            this.addChild(sprite);
            this._messageButtons.push(sprite);
        }, this)

    }


})();
