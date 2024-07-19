//=============================================================================
// JavaHut's AudioManager Extension Plugin
// JavaHut_AudioManagerEx.js
// 
// Known Issues: None at this time
// 
//=============================================================================

var Imported = Imported || {};
Imported.JavaHut_AudioManagerEx = 1.02;

//=============================================================================
 /*:
 * @plugindesc v1.02 Handles more advanced audio functions.
 * @author JavaHut
 * 
 * @param --General--
 * @default ---------------
 * 
 * @param Vary Random Pitch
 * @desc Randomly varies the pitch of a sound for the randomSound command (from 0 to 100). Default: 10
 * @default 10
 * 
 * @param Prevent Random Repeat
 * @desc If the randomSound command should be prevented from playing the same random sound file back-to-back.
 * @default true
 * 
 * @param --Background Music--
 * @default ---------------
 * 
 * @param Bgm Fade Time
 * @desc The duration, in seconds, for the background music fade in/out time. 0 for no fade. Default: 2
 * @default 2
 * 
 * @param Loop Background Music
 * @desc If background music should loop.
 * @default true
 * 
 * @param --Background Sounds--
 * @default ---------------
 * 
 * @param Bgs Fade Time
 * @desc The duration, in seconds, for the background sound fade in/out time. 0 for no fade. Default: 2
 * @default 2
 * 
 * @param Loop Background Sounds
 * @desc If background sounds should loop.
 * @default true
 * 
 * @param Clean Bgs On Transfer
 * @desc If paused or faded bgs should be removed from the buffer when a player is transferred to another map.
 * @default true
 * 
 * @param --Sound Dynamics--
 * @default  ---------------
 * 
 * @param Dynamic Falloff Distance
 * @desc The distance (greater than 10), in tiles, at which a dynamic sound is no longer audible to the player. Default: 20
 * @default 20
 * 
 * @param Dynamic Dampening
 * @desc If some frequency dampening should be applied to a dynamic sound as it moves further away from the player.
 * @default false
 * 
 * @param Always Autopan
 * @desc If all dynamic sounds should have autopan. You can override this with an <autopan> notetag or comment.
 * @default true
 * 
 * @param Autopan Limit
 * @desc The default pan limit when dynamic sounds pan away/toward the player (10 to 100). Default: 75
 * @default 75
 * 
 * @param --Sound Reverb--
 * @default ---------------
 * 
 * @param Impulse Folder
 * @desc The folder name (inside the project's audio folder) that contains reverb impulse responses.
 * @default impulses
 * 
 * @param Reverb Level
 * @desc The default level of reverb for all sounds (0 to 100). 0 to disable.
 * @default 0
 * 
 * @param Reverb Name
 * @desc The default reverb name to use for all sounds if enabled. Default: hall
 * @default hall
 * 
 * @param Preload Reverbs
 * @desc The reverb names to preload to prevent latency lag. Use this format: name1, name2, etc
 * @default
 * 
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 
 * This plugin provides more advanced sound functions such as playing random
 * sounds or music from a pool of common filenames, adding reverb, or making
 * sounds dynamic.
 * Notes:
 *  -If a sound is set to dynamic, a falloff value of 20 or more
 *   is recommended for a more natural sound.
 *  -Reverb should be used sparingly as it can cause heavy lag/latency.
 * 
 * ============================================================================
 * Notetag Instructions
 * ============================================================================
 * Note: Use notetags to override plugin defaults or set functionality.
 *       All tags are case-sensitive. You can use the :false inside a tag to
 *       not allow the tag function.
 *       Example: <loopSound:false>
 * 
 * Event Notetags: Place in the Note section of an event that plays a sound.
 * Important: If an event plays multiple types of sounds, all of those sounds
 *            will be affected by the notetags. See comment instructions
 *            below for a simple fix.
 *   <dynamic>            Makes a bgs or se dynamic, allowing it to change
 *                        volume as the player moves around the scene
 *                        If only x (horizontal) or y (vertical) plane is
 *                        needed, use <dynamic:x> or <dynamic:y>
 *   <autopan>            Allows a bgs or se to automatically pan away from or
 *                        toward the player as they move around the scene
 *   <falloff:number>     The dynamic falloff amount, in tiles, at which the
 *                        bgs or se is no longer audible to the player, and is
 *                        panned as far as the autopan limit.
 *                        Must be greater than 10
 *   <loopSound>          If the bgm or bgs should loop
 *   <loopStart:number>   Set the bgm or bgs loop start time, in seconds
 *   <loopEnd:number>     Set the bgm or bgs loop end time, in seconds
 *   <fadeTime:number>    Set the bgm or bgs fade in/out duration, in seconds
 *                        Use <fadeTime:0> for no fade
 *   <startTime:number>   Set the bgm or bgs start time, in seconds, where the
 *                        audio will start playback from
 *   <reverbLevel:number> Set the reverb level for a sound
 *   <reverbName:string>  Set the reverb impulse name for a sound
 * 
 * ============================================================================
 * Comment Instructions
 * ============================================================================
 * The Event Notetags listed above can also be inserted as comments on an
 * event page to override the Event Notetag and plugin defaults. For example:
 * *Comment* <dynamic><falloff:25><fadeTime:1>
 * *Play BGS* bgs_bird1 (50, 100, 0)
 * *Comment* <dynamic:false><fadeTime:3>
 * *Play BGS* bgs_wind1 (50, 100, 0)
 * That way, the bgs_bird1 would be dynamic and the bgs_wind1 would not be,
 * and the fade times would be set differently for each sound.
 * 
 * ============================================================================
 * Plugin Command Instructions
 * ============================================================================
 * Note: All commands are case sensitive.
 *       Where a fadeTime argument is used, you can omit it to fall back to
 *       the value that was set with the <fadeTime> notetag.
 * 
 * pauseBgm fadeTime
 *     Function      : Pauses the background music.
 *                     Use the resumeBgm plugin command to start again.
 *     Arguments     :
 *         fadeTime  : The duration of the fade if required (in seconds)
 *     Example       : pauseBgm 2
 *                     will pause the background music by fading it out for 2s
 * 
 * resumeBgm fadeTime
 *     Function      : Resumes the background music.
 *     Arguments     :
 *         fadeTime  : The duration of the fade if required (in seconds)
 *     Example       : resumeBgm 2
 *                     will resume the background music by fading it in for 2s
 * 
 * eraseBgm
 *     Function      : Erase and stop the background music.
 *                     Useful if you have saved or paused the bgm,
 *                     but want to restart it with new settings.
 * 
 * pauseBgs name fadeTime
 *     Function      : Pauses a background sound.
 *                     Use null for the name argument to pause all bgs.
 *                     Use the resumeBgs plugin command to start again.
 *     Arguments     :
 *         name      : The sound name
 *         fadeTime  : The duration of the fade if required (in seconds)
 *     Example       : pauseBgs ambience1 2
 *                     will pause ambience1 by fading it out for 2s
 * 
 * resumeBgs name fadeTime
 *     Function      : Resumes a background sound or all bgs.
 *                     Use null for the name argument to resume all bgs.
 *                     Important: Dynamic bgs sounds should never be resumed
 *                     on another map.
 *     Arguments     :
 *         name      : The sound name
 *         fadeTime  : The duration of the fade if required (in seconds)
 *     Example       : resumeBgs ambience1 2
 *                     will resume play of ambience1 by fading it in for 2s
 * 
 * fadeoutBgs name fadeTime
 *     Function      : Fade out a specific background sound.
 *                     The sound will be set for deletion unless resumed or
 *                     unless Clean Bgs On Transfer is set to false.
 *                     Use null for name to fadeout all bgs.
 *     Arguments     :
 *         name      : The sound name
 *         fadeTime  : The duration of the fade if required (in seconds)
 *     Example       : fadeoutBgs ambience1 2
 *                     will fadeout ambience1 for 2 seconds
 * 
 * eraseBgs name
 *     Function      : Erase and stop a background sound or all bgs.
 *                     Omit name to erase all bgs.
 *                     If a fadeout is needed, use the fadeoutBgs command.
 *     Arguments     :
 *         name      : The sound name
 *     Example       : eraseBgs ambience1
 *                     will erase ambience1 from the bgsBuffers array
 * 
 * setLoop name start end
 *     Function      : Sets the loop start and end points for the bgm or bgs.
 *                     Use null for start or end time to leave the
 *                     current value as is, or 0 for both to disable looping.
 *     Arguments     :
 *         name      : The sound name
 *                     If name does not match the bgm, it will check for bgs
 *         start     : The start time in seconds
 *         end       : The end time in seconds
 *     Example       : setLoop epicMusic 20.35 40.24
 *                     will change the start and end loop points for epicMusic
 * 
 * fadeTo name fadeTime volume
 *     Function      : Fade a bgm or bgs to a specified volume.
 *                     Important: The sound must be playing for this to work.
 *     Arguments     :
 *         name      : The sound name
 *                     If name does not match the bgm, it will check for bgs
 *         fadeTime  : The duration of the fade (in seconds)
 *         volume    : The target volume to fade to (between 0 and 100)
 *     Example       : fadeTo softMusic 2 25
 *                     will fade softMusic for 2s to the level of 25
 * 
 * randomSound name volume pitch pan type maxFiles varyPitch
 *     Function      : Plays a random sound effect from the pool of sounds
 *                     with the same name.
 *                     Important: If using this command for background music
 *                     or a music effect, it's likely that you will need to set
 *                     the varyPitch argument to 0 to keep the correct pitch.
 *     Arguments     :
 *         name      : The sound name without spaces or appended number
 *         volume    : The volume from 0 to 100
 *         pitch     : The pitch from 50 to 150, 100 being normal
 *         pan       : The pan amount from -100 to 100, 0 being normal
 *         type      : The sound type: bgm, bgs, me or se
 *         maxFiles  : The max number of files (with same name) to choose from
 *         varyPitch : The amount from 0 to 100 to randomly vary sound pitch
 *                     (If not set, the Vary Random Pitch parameter is used)
 *     Example       : randomSound step_wood 100 100 0 se 3 10
 *                     will choose from the sound effect step_wood1, step_wood2
 *                     or step_wood3 and will vary the pitch randomly from
 *                     0 to 10 on each play
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.02: Fixed a bug that prevented paused BGM from using loop and
 *   starting points when resumed/played again.
 *   Added the eraseBgm plugin command to erase saved/paused BGM.
 * Version 1.01: Fixed a bug that caused reverb to be cut off on short sounds.
 * Version 1.00: Plugin completed.
 */
//=============================================================================

// ==============================
// * JavaHut
// ==============================

var JavaHut = JavaHut || {};
JavaHut.AudioManagerEx = JavaHut.AudioManagerEx || {};

// Checks for a comment in the form of <parameter:value> or multiple comments
JavaHut._commentRegEx = JavaHut._commentRegEx || /<(\w+)\:*([^>]*)>/i;
JavaHut._commentsRegEx = JavaHut._commentsRegEx || /(<\w+\:*[^>]*>)/gi;

/**
 * Checks if a value is undefined, null or "null"
 * @param {Mixed} value The value to check
 * @returns {Bool} If the value was omitted or not
 */
JavaHut._omitted = JavaHut._omitted || function (value) {
    return (value === undefined || value === null || value === "null");
};

/**
 * Checks if a value is "true" or true
 * @param {Mixed} value
 * @returns {Boolean} If the value is true, otherwise false
 */
JavaHut._bool = JavaHut._bool || function (value) {
    return (value === "true" || value === true) ? true : false;
};

/**
 * Chooses a random number between min and max, including mix and max
 * @param {Number} min The minimum number to choose a random from
 * @param {Number} max The maximum number to choose a random from
 * @returns {Number} The random number between min and max
 */
JavaHut._rnd = JavaHut._rnd || function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Returns the value of the specified notetag in the dataObj object
 * @param {Object} dataObj The object that contains a .meta object
 * @param {String} tagName The tag name to search for
 * @param {Array} comments The comments array to check if needed
 * @returns {Mixed} The value of the tag or null
 */
JavaHut._getNoteValue = JavaHut._getNoteValue || function (dataObj, tagName, comments) {
    var tagValue = null;
    
    if (comments !== undefined && comments.length > 0) {
        for (var i = 0; i < comments.length; i += 1) {
            // Get the comment if it matches the name and if tagValue is still null
            tagValue = (tagValue === null)
                ? JavaHut._getCommentValue(comments[i], tagName) : tagValue;
        }
    }
    if (tagValue === null && dataObj
            && dataObj.meta && dataObj.meta[tagName] !== undefined) {
        tagValue = String(dataObj.meta[tagName]).trim();
    }
    
    tagValue = (tagValue === "true" || tagValue === "false")
            ? JavaHut._bool(tagValue) : tagValue;
    
    return tagValue;
};

/**
 * Gets a comment value if the name matches
 * @param {String} comment The comment string
 * @param {String} name The comment name string
 * @returns {Mixed} The value of the comment or null if it doesn't match the name
 */
JavaHut._getCommentValue = JavaHut._getCommentValue || function (comment, name) {
    var re = JavaHut._commentRegEx;
    var m = re.exec(comment);
    var value = null;
    
    if (m !== null && m[1] !== undefined && m[1] === name) {
        value = (m[2] !== undefined && m[2] !== "") ? m[2] : true;
    }
    
    return value;
};

/**
 * Takes an event's comment array and pulls each comment into a new array
 * The format of the comments should be "<test1><test2><etc:1>"
 * @param {Array} comments The comment list from the event
 * @returns {Array} The new array with each comment or an empty array
 */
JavaHut._getCommentList = JavaHut._getCommentList || function (comments) {
    var commentList = [];
    if (JavaHut._omitted(comments)) { return commentList; }
    
    var re = JavaHut._commentsRegEx;
    var m = null;
    
    for (var i = 0; i < comments.length; i += 1) {
        while ((m = re.exec(comments[i])) !== null) {
            if (m.index === re.lastIndex) {  re.lastIndex += 1; }
            commentList.push(m[0]);
        }
    }
    
    return commentList;
};

// ==============================
// * Plugin Scope
// ==============================

(function ($) {
    
    "use strict";
    
// ==============================
// * Parameters
// ==============================
    
    $.Parameters = PluginManager.parameters("JavaHut_AudioManagerEx");
    $.Param = $.Param || {};
    // General
    $.Param.AMEXvaryPitch = Number($.Parameters["Vary Random Pitch"]);
    $.Param.AMEXpreventDuplicate = JavaHut._bool($.Parameters["Prevent Random Repeat"]);
    // Background Music
    $.Param.AMEXbgmFadeTime = Number($.Parameters["Bgm Fade Time"]);
    $.Param.AMEXloopBgm = JavaHut._bool($.Parameters["Loop Background Music"]);
    // Background Sounds
    $.Param.AMEXbgsFadeTime = Number($.Parameters["Bgs Fade Time"]);
    $.Param.AMEXloopBgs = JavaHut._bool($.Parameters["Loop Background Sounds"]);
    $.Param.AMEXcleanBgs = JavaHut._bool($.Parameters["Clean Bgs On Transfer"]);
    // Dynamic Sound
    $.Param.AMEXdynamicFalloff = Number($.Parameters["Dynamic Falloff Distance"]);
    $.Param.AMEXdamp = JavaHut._bool($.Parameters["Dynamic Dampening"]);
    $.Param.AMEXalwaysAutopan = JavaHut._bool($.Parameters["Always Autopan"]);
    $.Param.AMEXmaxPan = Number($.Parameters["Autopan Limit"]);
    // Reverb
    $.Param.AMEXimpulseFolder = String($.Parameters["Impulse Folder"]) + "/";
    $.Param.AMEXreverbLevel = Number($.Parameters["Reverb Level"]);
    $.Param.AMEXreverbName = String($.Parameters["Reverb Name"]);
    $.Param.AMEXpreload = String($.Parameters["Preload Reverbs"]);
    
// ==============================
// * Game_Interpreter
// ==============================
    
    // Overwritten Methods
    
    // Get commands sent to this plugin
    $.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        switch (command) {
            case "pauseBgm" :
                $._pauseBgm(args);
                break;
            case "resumeBgm" :
                $._resumeBgm(args);
                break;
            case "eraseBgm" :
                $._eraseBgm();
                break;
            case "pauseBgs" :
                $._pauseBgs(args);
                break;
            case "resumeBgs" :
                $._resumeBgs(args);
                break;
            case "fadeoutBgs" :
                $._fadeoutBgs(args);
                break;
            case "eraseBgs" :
                $._eraseBgs(args);
                break;
            case "setLoop" :
                $._setLoop(args);
                break;
            case "fadeTo" :
                $._fadeTo(args);
                break;
            case "randomSound" :
                $._randomSound(args, this.eventId(), this._comments);
                break;
            default :
                $.Game_Interpreter_pluginCommand.call(this, command, args);
        }
    };
    
    // Play BGM
    $.Game_Interpreter_command241 = Game_Interpreter.prototype.command241;
    Game_Interpreter.prototype.command241 = function () {
        AudioManager._initBgm(this._params[0], this.eventId(), this._comments);
        return $.Game_Interpreter_command241.call(this);
    };
    
    // Play BGS
    $.Game_Interpreter_command245 = Game_Interpreter.prototype.command245;
    Game_Interpreter.prototype.command245 = function () {
        AudioManager._initBgs(this._params[0], this.eventId(), this._comments);
        return $.Game_Interpreter_command245.call(this);
    };
    
    // Play ME
    $.Game_Interpreter_command249 = Game_Interpreter.prototype.command249;
    Game_Interpreter.prototype.command249 = function () {
        AudioManager._initMe(this._params[0], this.eventId(), this._comments);
        return $.Game_Interpreter_command249.call(this);
    };
    
    // Play SE
    $.Game_Interpreter_command250 = Game_Interpreter.prototype.command250;
    Game_Interpreter.prototype.command250 = function () {
        AudioManager._initSe(this._params[0], this.eventId(), this._comments);
        return $.Game_Interpreter_command250.call(this);
    };
    
// ==============================
// * AudioManager
// ==============================
    
    // New Properties //
    
    AudioManager._bgsBuffers = []; // Allow more than one background sound
    AudioManager._convBuffers = []; // The impulse buffers for convolver nodes
    AudioManager._prevBgm = 1; // The previous random sound IDs
    AudioManager._prevBgs = 1;
    AudioManager._prevMe = 1;
    AudioManager._prevSe = 1;
    
    // Overwritten Properties //
    
    // Allow all bgsBuffers to be updated on volume change
    Object.defineProperty(AudioManager, "bgsVolume", {
        get: function () {
            return this._bgsVolume;
        },
        set: function (value) {
            this._bgsVolume = value;
            this.updateBgsParameters();
        },
        configurable: true
    });
    
    // New Methods //
    
    /**
     * Pauses the background music.
     * @param {Number} fadeTime The fade duration in seconds
     */
    AudioManager.pauseBgm = function (fadeTime) {
        if (this._bgmBuffer && this._currentBgm) {
            fadeTime = (fadeTime === null) ? AudioManager._currentBgm.fade : fadeTime;
            this._mapBgm = AudioManager.saveBgm();
            this._bgmBuffer.fadeOut(fadeTime);
            this._bgmBuffer._paused = true;
            this._currentBgm = null;
        }
    };
    
    /**
     * Pauses a background sound, or all of them.
     * @param {Mixed} name The name of the sound, or null to pause all bgs
     * @param {Number} fadeTime The fade duration in seconds
     */
    AudioManager.pauseBgs = function (name, fadeTime) {
        this.saveBgs(name, true);
        this.fadeOutBgs(fadeTime, name);
    };
    
    /**
     * Plays a random sound from the pool of sounds with the same name.
     * @param {Object} soundObj The sound object {name:"", volume:n, pitch:n, pan:n}
     * @param {String} type The type of sound "bgm", "bgs", "me", or "se"
     * @param {Number} max The max amount of files with the same name
     * @param {Number} varyPitch The amount to randomly vary the pitch of the sound
     * @param {Number} eventId The id of the event that called this
     * @param {Array} comments The comment array from the event that called this
     */
    AudioManager.playRandomSound = function (soundObj, type, max, varyPitch, eventId, comments) {
        var maxPitch = 110;
        var minPitch = 90;
        var rnd = 1;
        var audio = $.copyAudioObject(soundObj);
        
        if (varyPitch > 0) {
            // Pitch varies by set amount, but has to be between 50 and 150
            maxPitch = Math.min(soundObj.pitch + varyPitch, 150);
            minPitch = Math.max(soundObj.pitch - varyPitch, 50);
            audio.pitch = JavaHut._rnd(minPitch, maxPitch);
        }
        if (max > 1) {
            // Choose a random number for the filename
            rnd = JavaHut._rnd(1, max);
            
            if ($.Param.AMEXpreventDuplicate && this._isPrevSound(type, rnd)) {
                // Prevent playing the previously selected sound
                if (rnd > 1) {
                    rnd -= 1; // Decrement if larger than the minimum range
                } else if (rnd < max) {
                    rnd += 1; // Increment if smaller than the maximum range
                }
            }
        }
        
        audio.name = soundObj.name + rnd;
        
        switch (type) {
            case "bgm" :
                this._prevBgm = rnd;
                this._initBgm(audio, eventId, comments);
                this.playBgm(audio);
                break;
            case "bgs" :
                this._prevBgs = rnd;
                this._initBgs(audio, eventId, comments);
                this.playBgs(audio);
                break;
            case "me" :
                this._prevMe = rnd;
                this._initMe(audio, eventId, comments);
                this.playMe(audio);
                break;
            case "se" :
                this._prevSe = rnd;
                this._initSe(audio, eventId, comments);
                this.playSe(audio);
                break;
            default :
                return false;
        }
    };
    
    /**
     * Fade a background sound (or all bgs) to a specified volume.
     * @param {Mixed} name The name of the sound, or null to fade all bgs
     * @param {Number} fadeTime The fade duration in seconds
     * @param {Number} targetVol The volume to fade to
     */
    AudioManager.fadeToBgs = function (name, fadeTime, targetVol) {
        var checkName = (name !== undefined && name !== null);
        targetVol = Math.max(targetVol, 0);
        targetVol = Math.min(targetVol, 100);
        
        this._bgsBuffers.forEach(function (buffer) {
            if (checkName && buffer._bgsInfo.name !== name) {
                return true; // continue the forEach loop
            } else if (!buffer._paused && buffer._playing) {
                fadeTime = (fadeTime === null) ? buffer._bgsInfo.fade || 0 : fadeTime;
                buffer.fadeTo(fadeTime, targetVol);
            }
        });
    };
    
    /**
     * Fades the dynamic sounds to the target volume based on distance of player from the event.
     * @param {Array} bufferList The list of buffers to fade
     * @param {type} infoProp The type of buffer info - "_bgsInfo" or "_seInfo"
     */
    AudioManager.fadeDynamicSound = function (bufferList, infoProp) {
        var realVolume = 0;
        var info = {};
        
        bufferList.forEach(function (buffer) {
            // Continue the loop if the current buffer is not set to dynamic, is paused, or faded out
            if (!buffer[infoProp].dynamic
                    || buffer._paused
                    || buffer._playing === false) {
                return true;
            }
            
            info = $._getDynamicInfo(buffer, buffer[infoProp]);
            // Get the real volume of the sound when the master bgs volume is applied
            if (infoProp === "_bgsInfo") {
                realVolume = (AudioManager._bgsVolume * info.volume) / 100;
            } else if (infoProp === "_seInfo") {
                realVolume = (AudioManager._seVolume * info.volume) / 100;
            }
            // Set the actual pan between -1 and 1 by dividing it by 100
            buffer.pan = (info.pan !== null) ? info.pan / 100 : buffer.pan;
            buffer.fadeTo(1, realVolume, true);
        });
    };
    
    /**
     * Checks if the previous random sound id is the same as the specified value.
     * @param {String} type The sound type "bgm", "bgs", "me", or "se"
     * @param {Number} value The previous random value
     * @returns {Boolean} If the random value matches the previous sound value
     */
    AudioManager._isPrevSound = function (type, value) {
        switch (type) {
            case "bgm" :
                return value === this._prevBgm;
                break;
            case "bgs" :
                return value === this._prevBgs;
                break;
            case "me" :
                return value === this._prevMe;
                break;
            case "se" :
                return value === this._prevSe;
                break;
            default :
                return false;
        }
    };
    
    /**
     * Initialize a bgm parameter object.
     * @param {Objet} param The parameter object that contains the sound info
     * @param {Number} eventId The ID of the event that triggered the command
     * @param {Array} comments The comment array for the current event
     */
    AudioManager._initBgm = function (param, eventId, comments) {
        var evt = (!JavaHut._omitted(eventId)) ? $dataMap.events[eventId] : null;
        comments = JavaHut._getCommentList(comments);
        $._regulateValues(param);
        
        if (evt && param.name) {
            if (this._mapBgm && this._mapBgm.name === param.name) {
                // Use saved data
                param.loop = this._mapBgm.loop;
                param.loopStart = this._mapBgm.loopStart;
                param.loopEnd = this._mapBgm.loopEnd;
                param.fade = this._mapBgm.fade;
                param.startTime = this._mapBgm.pos;
                param.convVolume = this._mapBgm.convVolume;
                param.convName = this._mapBgm.convName;
            } else {
                param.loop = this._getParam.loop(evt, comments, $.Param.AMEXloopBgm);
                param.loopStart = Number(JavaHut._getNoteValue(evt, "loopStart", comments));
                param.loopEnd = Number(JavaHut._getNoteValue(evt, "loopEnd", comments));
                param.fade = this._getParam.fade(evt, comments, $.Param.AMEXbgmFadeTime);
                param.startTime = this._getParam.startTime(evt, comments);
                param.convVolume = this._getParam.reverbVolume(evt, comments);
                param.convName = this._getParam.reverbName(evt, comments);
            }
        }
    };
    
    /**
     * Initialize a bgs parameter object.
     * @param {Objet} param The parameter object that contains the sound info
     * @param {Number} eventId The ID of the event that triggered the command
     * @param {Array} comments The comment array for the current event
     */
    AudioManager._initBgs = function (param, eventId, comments) {
        var evt = (!JavaHut._omitted(eventId)) ? $dataMap.events[eventId] : null;
        comments = JavaHut._getCommentList(comments);
        $._regulateValues(param);
        
        if (evt && param.name) {
            param.eventId = eventId;
            param.dynamic = JavaHut._getNoteValue(evt, "dynamic", comments);
            param.autopan = this._getParam.autopan(evt, comments);
            param.loop = this._getParam.loop(evt, comments, $.Param.AMEXloopBgs);
            param.loopStart = Number(JavaHut._getNoteValue(evt, "loopStart", comments));
            param.loopEnd = Number(JavaHut._getNoteValue(evt, "loopEnd", comments));
            param.fade = this._getParam.fade(evt, comments, $.Param.AMEXbgsFadeTime);
            param.startTime = this._getParam.startTime(evt, comments);
            param.falloff = this._getParam.falloff(evt, comments);
            param.convVolume = this._getParam.reverbVolume(evt, comments);
            param.convName = this._getParam.reverbName(evt, comments);
        }
    };
    
    /**
     * Initialize a music effect parameter object.
     * @param {Objet} param The parameter object that contains the sound info
     * @param {Number} eventId The ID of the event that triggered the command
     * @param {Array} comments The comment array for the current event
     */
    AudioManager._initMe = function (param, eventId, comments) {
        var evt = (!JavaHut._omitted(eventId)) ? $dataMap.events[eventId] : null;
        comments = JavaHut._getCommentList(comments);
        $._regulateValues(param);
        
        if (evt && param.name) {
            param.convVolume = this._getParam.reverbVolume(evt, comments);
            param.convName = this._getParam.reverbName(evt, comments);
        }
    };
    
    /**
     * Initialize a se parameter object.
     * @param {Objet} param The parameter object that contains the sound info
     * @param {Number} eventId The ID of the event that triggered the command
     * @param {Array} comments The comment array for the current event
     */
    AudioManager._initSe = function (param, eventId, comments) {
        var evt = (!JavaHut._omitted(eventId)) ? $dataMap.events[eventId] : null;
        comments = JavaHut._getCommentList(comments);
        $._regulateValues(param);
        
        if (evt && param.name) {
            param.eventId = eventId;
            param.dynamic = JavaHut._getNoteValue(evt, "dynamic", comments);
            param.autopan = this._getParam.autopan(evt, comments);
            param.falloff = this._getParam.falloff(evt, comments);
            param.convVolume = this._getParam.reverbVolume(evt, comments);
            param.convName = this._getParam.reverbName(evt, comments);
        }
    };
    
    // Get properties from notes/comments or supply defaults
    AudioManager._getParam = {
        autopan : function (evt, comments) {
            var autopan = JavaHut._getNoteValue(evt, "autopan", comments);
            autopan = (autopan === null) ? $.Param.AMEXalwaysAutopan : autopan;
            return autopan;
        },
        loop : function (evt, comments, dft) {
            var loop = JavaHut._getNoteValue(evt, "loopSound", comments);
            loop = (loop === null) ? dft : loop;
            return loop;
        },
        fade : function (evt, comments, dft) {
            var fade = JavaHut._getNoteValue(evt, "fadeTime", comments, dft);
            fade = (fade === null) ? dft : Number(fade);
            return fade;
        },
        startTime : function (evt, comments) {
            var startTime = JavaHut._getNoteValue(evt, "startTime", comments);
            startTime = (startTime !== null) ? Number(startTime) : null;
            return startTime;
        },
        falloff : function (evt, comments) {
            var falloff = JavaHut._getNoteValue(evt, "falloff", comments);
            falloff = (falloff === null)
                ? $.Param.AMEXdynamicFalloff : Number(falloff);
            falloff = (falloff < 10) ? 10 : falloff;
            return falloff;
        },
        reverbVolume : function (evt, comments) {
            var convVolume = JavaHut._getNoteValue(evt, "reverbLevel", comments);
            convVolume = (convVolume === null)
                ? $.Param.AMEXreverbLevel / 100
                : Math.max(Number(convVolume) / 100, 0);
            return Math.min(convVolume, 1);
        },
        reverbName : function (evt, comments) {
            var reverbName = JavaHut._getNoteValue(evt, "reverbName", comments);
            reverbName = (reverbName === null)
                ? $.Param.AMEXreverbName : String(reverbName);
            return reverbName;
        }
    };
    
    /**
     * Copies extra info for loop/fade/convolver on bgm for save/update
     * @param {Object} data
     * @param {Object} extras
     * @returns {Object} The altered data object
     */
    AudioManager.copyExtras = function (data, extras) {
        if (JavaHut._omitted(extras)) { return data; }
        
        data.loop = extras.loop;
        data.loopStart = extras.loopStart;
        data.loopEnd = extras.loopEnd;
        data.fade = extras.fade;
        data.convName = extras.convName;
        data.convVolume = extras.convVolume;
        
        return data;
    };
    
    // Overwritten Methods //
    
    // Allow reverb setup
    $.AudioManager_createBuffer = AudioManager.createBuffer;
    AudioManager.createBuffer = function (folder, name, convName) {
        var buffer = $.AudioManager_createBuffer.call(this, folder, name);
        
        if (!JavaHut._omitted(convName)) {
            convName = encodeURIComponent(convName);
            buffer._convRef = convName;
            $._loadImpulse(convName);
        }
        
        return buffer;
    };
    
    // Cache the extra info for bgm
    $.AudioManager_saveBgm = AudioManager.saveBgm;
    AudioManager.saveBgm = function () {
        var saveData = this.copyExtras(
                $.AudioManager_saveBgm.call(this),
                this._currentBgm
            );
        
        return saveData;
    };
    $.AudioManager_updateCurrentBgm = AudioManager.updateCurrentBgm;
    AudioManager.updateCurrentBgm = function (bgm, pos) {
        $.AudioManager_updateCurrentBgm.call(this, bgm, pos);
        this._currentBgm = this.copyExtras(this._currentBgm, bgm);
    };
    
    // Add fade option to playBgm, and cache extra info
    AudioManager.playBgm = function (bgm, pos) {
        var convName = (bgm.convVolume > 0) ? bgm.convName : null;
        
        if (bgm.name) {
            if (this.isCurrentBgm(bgm)) {
                this.updateBgmParameters(bgm);
            } else {
                this.stopBgm();
                // Look for position, then look for startTime notetag, then look
                // for saved position, then fall back to 0
                if (pos === undefined) {
                    if (!JavaHut._omitted(bgm.startTime)) {
                        pos = bgm.startTime;
                    } else if (this._mapBgm && this._mapBgm.name === bgm.name) {
                        // Use the current saved bgm position to start from
                        pos = this._mapBgm.pos;
                    } else {
                        pos = 0;
                    }
                }
                if(Decrypter.hasEncryptedAudio && this.shouldUseHtml5Audio()){
                    this.playEncryptedBgm(bgm, pos);
                } else {
                    this._bgmBuffer = this.createBuffer("bgm", bgm.name, convName);
                    this.updateBgmParameters(bgm);
                    if (!this._meBuffer) {
                        this._bgmBuffer.play(bgm.loop, pos);
                        if (bgm.fade > 0) { this._bgmBuffer.fadeIn(bgm.fade); }
                    }
                }
                
                this._bgmBuffer._customLoopStart = bgm.loopStart;
                this._bgmBuffer._customLoopEnd = bgm.loopEnd;
                this._paused = false;
            }
            
            this.updateCurrentBgm(bgm, pos);
        }
    };
    
    // Use custom fade time for replay of bgm
    AudioManager.replayBgm = function (bgm, fadeTime) {
        if (bgm === undefined) { return false; }
        
        bgm.fade = (JavaHut._omitted(fadeTime)) ? bgm.fade : fadeTime;
        this.playBgm(bgm, bgm.pos);
    };
    
    // Allow playing of multiple bgs, dynamic bgs, and fade in
    AudioManager.playBgs = function (bgs, pos) {
        // Check for saved bgsBuffers array
        if (bgs instanceof Array && bgs[0]) {
            for (var i = 0; i < bgs.length; i += 1) {
                AudioManager.playBgs(bgs[i]);
            }
            
            return true;
        }
        
        var isCurrent = false;
        var play = function (info, bfr) {
            // Play the buffer and update the parameters
            this.updateBgsParameters(info, bfr);
            bfr.play(bfr._bgsInfo.loop, pos || 0);
            
            bfr._playing = true;
            bfr._paused = false;
            if (bfr._bgsInfo.fade > 0) { bfr.fadeIn(bfr._bgsInfo.fade); }
        }.bind(this);
        
        if (bgs && bgs.name) {
            // Look for pos, then look for startTime notetag, then look for
            // bgsInfo saved position, then fall back to 0
            if (pos === undefined) {
                if (!JavaHut._omitted(bgs.startTime)) {
                    pos = bgs.startTime;
                } else {
                    pos = null;
                }
            }
            // Filter out unused sounds and check for sound match or play a paused buffer
            this._bgsBuffers = this._bgsBuffers.filter(function (buffer) {
                var result = true;
                
                if (!buffer._playing && !buffer._paused && $.Param.AMEXcleanBgs) {
                    buffer.stop();
                    result = false;
                } else if (buffer._bgsInfo.name === bgs.name) {
                    isCurrent = true;
                    if (buffer._paused) {
                        pos = (pos === null) ? buffer._bgsInfo.pos : pos;
                        // Use null for the play info to force updateBgsParameters
                        // to copy data from the buffer
                        play(null, buffer);
                    } else {
                        AudioManager.updateBgsParameters(bgs, buffer);
                    }
                }
                
                return result;
            });
            if (!isCurrent) {
                // Create a new bgs buffer and push it to the list
                var convName = (bgs.convVolume > 0) ? bgs.convName : null;
                var buffer = this.createBuffer("bgs", bgs.name, convName);
                
                buffer._customLoopStart = bgs.loopStart;
                buffer._customLoopEnd = bgs.loopEnd;
                buffer._bgsInfo = $.copySoundInfo(bgs);
                buffer._bgsInfo.pos = pos || 0;
                
                play(bgs, buffer);
                this._bgsBuffers.push(buffer);
            }
        }
    };
    
    // Allow multiple bgsBuffers
    AudioManager.replayBgs = function (bgs, fadeTime) {
        var checkName = (bgs && !JavaHut._omitted(bgs.name));
        
        this._bgsBuffers.forEach(function (buffer) {
            if (checkName && buffer._bgsInfo.name !== bgs.name) { return true; }
            
            if (!buffer._playing || buffer._paused) {
                buffer._bgsInfo.fade = (JavaHut._omitted(fadeTime))
                    ? buffer._bgsInfo.fade || 0 : fadeTime;
                AudioManager.playBgs(buffer._bgsInfo, buffer._bgsInfo.pos);
            }
        });
    };
    $.AudioManager_stopBgs = AudioManager.stopBgs;
    AudioManager.stopBgs = function (onlyDynamic, name) {
        // onlyDynamic will stop only the dynamic background sounds
        // name will stop only the sound that matches the name
        this._bgsBuffers = this._bgsBuffers.filter(function (buffer) {
            if (onlyDynamic === undefined
                    || (onlyDynamic === true && buffer._bgsInfo.dynamic)
                    || (name !== undefined && buffer._bgsInfo.name === name)) {
                buffer.stop();
                return false;
            } else {
                return true;
            }
        });
        
        // Clear the buffer only when not stopping dynamic sounds or a specific one
        if (!onlyDynamic && name === undefined) { this._bgsBuffers = []; }
        $.AudioManager_stopBgs.call(this);
    };
    AudioManager.saveBgs = function (name, isPausing) {
        var checkName = (name !== undefined && name !== null);
        var bgsBuffers = [];
        var info = {};
        
        this._bgsBuffers.forEach(function (buffer) {
            if (checkName && buffer._bgsInfo.name !== name) { return true; }
            if (isPausing) { buffer._paused = true; }
            
            // Set buffer's position in case of resumeBgs command
            buffer._bgsInfo.pos = buffer.seek() || 0;
            info = $.copySoundInfo(buffer._bgsInfo);
            info.loopStart = buffer._customLoopStart;
            info.loopEnd = buffer._customLoopEnd;
            bgsBuffers.push(info);
        });
        
        if (bgsBuffers.length <= 0) { bgsBuffers[0] = this.makeEmptyAudioObject(); }
        return bgsBuffers;
    };
    AudioManager.fadeOutBgs = function (duration, name, onlyDynamic) {
        var checkName = (name !== undefined && name !== null);
        
        this._bgsBuffers.forEach(function (buffer) {
            if (checkName && buffer._bgsInfo.name !== name) {
                // Continue the forEach loop
                return true;
            } else if ((onlyDynamic === true && buffer._bgsInfo.dynamic)
                    || onlyDynamic === undefined) {
                duration = (duration === null) ? buffer._bgsInfo.fade || 0 : duration;
                buffer._playing = false;
                buffer.fadeOut(duration);
            }
        });
    };
    AudioManager.fadeInBgs = function (duration, name) {
        var checkName = (name !== undefined && name !== null);
        
        this._bgsBuffers.forEach(function (buffer) {
            if (checkName && buffer._bgsInfo.name !== name) { return true; }
            buffer._playing = true;
            buffer._paused = false;
            buffer.fadeIn(duration);
        });
    };
    AudioManager.updateBgsParameters = function (bgs, buffer) {
        var info = {};
        var newBgs = {};
        
        if (buffer === undefined) {
            this._bgsBuffers.forEach(function (i) {
                newBgs = $.copySoundInfo(i._bgsInfo);
                if (i._bgsInfo.dynamic) {
                    // Change the actual volume/pan to reflect the distance from the player
                    info = $._getDynamicInfo(i, i._bgsInfo);
                    newBgs.volume = info.volume;
                    newBgs.pan = info.pan;
                }
                
                AudioManager.updateBufferParameters(i, AudioManager._bgsVolume, newBgs);
            });
        } else  {
            newBgs = (!bgs) ? $.copySoundInfo(buffer._bgsInfo) : $.copySoundInfo(bgs);
            newBgs.pitch = newBgs.pitch || 100;
            
            if (buffer._bgsInfo.dynamic) {
                info = $._getDynamicInfo(buffer, buffer._bgsInfo);
                newBgs.volume = info.volume;
                newBgs.pan = (info.pan !== null) ? info.pan : newBgs.pan;
            }
            
            this.updateBufferParameters(buffer, this._bgsVolume, newBgs);
        }
    };
    
    // Add reverb option for music effects
    AudioManager.playMe = function (me) {
        var convName = (me.convVolume > 0) ? me.convName : null;
        
        this.stopMe();
        if (me.name) {
            if (this._bgmBuffer && this._currentBgm) {
                this._currentBgm.pos = this._bgmBuffer.seek();
                this._bgmBuffer.stop();
            }
            this._meBuffer = this.createBuffer('me', me.name, convName);
            this.updateMeParameters(me);
            this._meBuffer.play(false);
            this._meBuffer.addStopListener(this.stopMe.bind(this));
        }
    };
    
    // Add the extra info to the se buffer
    AudioManager.playSe = function (se) {
        var convName = (se.convVolume > 0) ? se.convName : null;
        
        if (se.name) {
            this._seBuffers = this._seBuffers.filter(function (audio) {
                return audio.isPlaying();
            });
            var buffer = this.createBuffer("se", se.name, convName);
            
            // copySoundInfo copies reverb name and volume if present
            buffer._seInfo = $.copySoundInfo(se);
            this.updateSeParameters(buffer, se);
            buffer.play(false);
            this._seBuffers.push(buffer);
        }
    };
    
    // Set dynamic info if needed
    $.AudioManager_updateSeParameters = AudioManager.updateSeParameters;
    AudioManager.updateSeParameters = function (buffer, se) {
        var newSe = (!se) ? $.copySoundInfo(buffer._seInfo) : $.copySoundInfo(se);
        var info = {};
        
        if (newSe.dynamic) {
            // Change the actual volume/pan to reflect the distance from the player
            info = $._getDynamicInfo(buffer, newSe);
            newSe.volume = info.volume;
            newSe.pan = (info.pan !== null) ? info.pan : newSe.pan;
        }
        
        $.AudioManager_updateSeParameters.call(this, buffer, newSe);
    };
    
// ==============================
// * WebAudio
// ==============================
    
    // Overwritten Properties //
    
    // Fix volume set after fade in issue by using setValueAtTime
    Object.defineProperty(WebAudio.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            if (this._gainNode) {
                this._gainNode.gain.value = value;
                this._gainNode.gain.setValueAtTime(value, WebAudio._context.currentTime);
            }
        },
        configurable: true
    });
    
    // Allow for 0 - far left pan, to 1 - far right (original is -1 to 1)
    Object.defineProperty(WebAudio.prototype, 'pan', {
        get: function () {
            var value = this._pan * 2 - 1;
            return value;
        },
        set: function (value) {
            value = (value + 1) / 2;
            this._pan = value;
            this._updatePanner();
        },
        configurable: true
    });
    
    // New Methods //
    
    /**
     * Creates a limiter node for the sound destination.
     * Is static, so needs to be on the WebAudio object.
     * @param {Object} ctx The WebAudio context
     */
    WebAudio._createLimiterNode = function (ctx) {
        this._limiter = ctx.createDynamicsCompressor();
        this._limiter.threshold.value = -0.3;
        this._limiter.knee.value = 0.0;
        this._limiter.ratio.value = 20.0;
        this._limiter.attack.value = 0.003;
        this._limiter.release.value = 0.075;
    };
    
    /**
     * Allows the WebAudio to fade to a target volume.
     * @param {Number} duration The duration in seconds
     * @param {Number} targetVol The target volume between 0 and 100
     * @param {Bool} exp If fade should be an exponential ramp
     */
    WebAudio.prototype.fadeTo = function (duration, targetVol, exp) {
        targetVol = $._getWebVolume(targetVol);
        exp = (exp === undefined) ? false : exp;
        
        if (this.isReady()) {
            if (this._gainNode) {
                var gain = this._gainNode.gain;
                var currentTime = WebAudio._context.currentTime;
                
                gain.cancelScheduledValues(currentTime);
                gain.setValueAtTime(this._volume, currentTime);
                
                if (exp) {
                    targetVol = (targetVol <= 0) ? 0.001 : targetVol; // Must be above 0
                    gain.exponentialRampToValueAtTime(targetVol, currentTime + duration);
                } else {
                    gain.linearRampToValueAtTime(targetVol, currentTime + duration);
                }
                
                this._volume = targetVol;
            }
        } else {
            this.addLoadListener(function () {
                this.fadeTo(duration, targetVol, exp);
            }.bind(this));
        }
    };
    
    /**
     * Creates a custom panning node.
     * @param {Object} ctx The WebAudio context
     */
    WebAudio.prototype._createPannerNode = function (ctx) {
        this._pannerNode = {
            in : ctx.createChannelSplitter(2),
            out : ctx.createChannelMerger(2),
            left : ctx.createGain(),
            right : ctx.createGain()
        };
        this._pannerNode.in.connect(this._pannerNode.left, 0);
        this._pannerNode.in.connect(this._pannerNode.right, 1);
        this._pannerNode.left.connect(this._pannerNode.out, 0, 0);
        this._pannerNode.right.connect(this._pannerNode.out, 0, 1);
    };
    
    /**
     * Clears the extra nodes.
     */
    WebAudio.prototype._clearExtraNodes = function () {
        this._dryGain = null;
        if (this._pannerNode) {
            this._pannerNode.in = null;
            this._pannerNode.out = null;
            this._pannerNode.left = null;
            this._pannerNode.right = null;
        }
        if (this._filterNode) {
            this._filterNode = null;
        }
        if (this._convNode) {
            // It's important to disconnect the convolver node before removing
            // it to prevent sound from carrying over if the sound is resumed
            if (this._paused) {
                this._convNode.disconnect();
            }
            this._convNode = null;
            this._wetGain = null;
        }
    };
    
    /**
     * Gets the dry and wet values based on the new dry value and wet volume.
     * @param {Number} wetVolume The current volume of the reverb
     * @returns {Array} The array [newDry, newWet]
     */
    WebAudio.prototype._getDryWetMix = function (wetVolume) {
        var dryPercent = 1 - wetVolume;
        var newValues = [1, 0];
        
        if (wetVolume <= 0) { return newValues; }
        
        newValues[0] = dryPercent; // New dry value
        newValues[1] = wetVolume; // New wet value
        return newValues;
    };
    
    // Overwritten Methods //
    
    // Allow custom loop points
    $.WebAudio__onLoad = WebAudio.prototype._onLoad;
    WebAudio.prototype._onLoad = function () {
        if (this._customLoopEnd > 0) {
            this._loopStart = this._customLoopStart;
            this._loopLength = this._customLoopEnd - this._customLoopStart;
        }
        
        $.WebAudio__onLoad.call(this);
    };
    
    // Use reverb load listener if reverb is present
    WebAudio.prototype.play = function (loop, offset) {
        if (this.isReady()) {
            if (this._convRef && AudioManager._convBuffers[this._convRef]
                    && !AudioManager._convBuffers[this._convRef]._buffer) {
                // Set a callback to play this buffer when reverb buffer is ready
                AudioManager._convBuffers[this._convRef].addLoadListener(function () {
                    this.play(loop, offset);
                }.bind(this));
            } else {
                offset = offset || 0;
                this._startPlaying(loop, offset);
            }
        } else if (WebAudio._context) {
            this._autoPlay = true;
            this.addLoadListener(function () {
                if (this._autoPlay) {
                    this.play(loop, offset);
                }
            }.bind(this));
        }
    };
    
    // Allow bgs to clear itself from the buffer list when end is reached
    WebAudio.prototype._createEndTimer = function () {
        if (this._sourceNode && !this._sourceNode.loop) {
            var endTime = this._startTime + this._totalTime / this._pitch;
            var delay =  endTime - WebAudio._context.currentTime;
            this._endTimer = setTimeout(function () {
                if (!!this._bgsInfo) {
                    AudioManager.stopBgs(false, this._bgsInfo.name);
                } else {
                    this.stop();
                }
            }.bind(this), delay * 1000);
        }
    };
    
    // Allow the limiter node to be created
    WebAudio._createMasterGainNode = function () {
        var context = WebAudio._context;
        if (context) {
            this._createLimiterNode.call(this, context);
            this._masterGainNode = context.createGain();
            this._masterGainNode.gain.value = 1;
            this._masterGainNode.connect(this._limiter);
            this._limiter.connect(context.destination);
        }
    };
    
    // Add filter and reverb functionality
    // and change pan node to custom stereo panner
    WebAudio.prototype._createNodes = function () {
        var context = WebAudio._context;
        var bufferInfo = this._bgsInfo || this._seInfo || this;
        var volumes = [1, 0];
        
        // Source and dry gain nodes
        this._sourceNode = context.createBufferSource();
        this._sourceNode.buffer = this._buffer;
        this._sourceNode.loopStart = this._loopStart;
        this._sourceNode.loopEnd = this._loopStart + this._loopLength;
        this._sourceNode.playbackRate.value = this._pitch;
        this._dryGain = context.createGain();
        // Lowpass filter node
        if (((this._bgsInfo && this._bgsInfo.dynamic)
                || (this._seInfo && this._seInfo.dynamic))
                && $.Param.AMEXdamp) {
            // Setup the lowpass filter with max hz frequency cutoff
            this._filterNode = context.createBiquadFilter();
            this._filterNode.type = "lowpass";
            this._filterNode.frequency.value = $._maxFilterFreq;
        }
        // Convolution Reverb node
        if (this._convRef) {
            volumes = this._getDryWetMix(bufferInfo.convVolume);
            this._convNode = context.createConvolver();
            this._wetGain = context.createGain();
            this._wetGain.gain.value = volumes[1];
            this._convNode.buffer = AudioManager._convBuffers[this._convRef]._buffer;
        }
        // Dry gain volume and main buffer gain
        this._dryGain.gain.value = volumes[0];
        this._gainNode = context.createGain();
        this._gainNode.gain.value = this._volume;
        // Custom panner node
        this._createPannerNode(context);
        this._updatePanner();
    };
    WebAudio.prototype._connectNodes = function () {
        var filter = !!(this._filterNode);
        var chCount = this._buffer.numberOfChannels;
        
        this._sourceNode.connect((filter)
            ? this._filterNode : this._dryGain);
        if (filter) { this._filterNode.connect(this._dryGain); }
        this._dryGain.connect(this._gainNode);
        
        // Connect mono to left/right panner or stereo to panner in
        if (chCount < 2) {
            this._gainNode.connect(this._pannerNode.left);
            this._gainNode.connect(this._pannerNode.right);
        } else {
            this._gainNode.connect(this._pannerNode.in);
        }
        
        // If a reverb is needed, connect the output of the filter/source
        // to the reverb and send it to the master gain
        if (this._convNode) {
            if (filter) {
                this._filterNode.connect(this._convNode);
            } else {
                this._sourceNode.connect(this._convNode);
            }
            this._convNode.connect(this._wetGain);
            this._wetGain.connect(this._gainNode);
        }
        
        this._pannerNode.out.connect(WebAudio._masterGainNode);
    };
    $.WebAudio__removeNodes = WebAudio.prototype._removeNodes;
    WebAudio.prototype._removeNodes = function () {
        this._clearExtraNodes();
        $.WebAudio__removeNodes.call(this);
    };
    $.WebAudio_clear = WebAudio.prototype.clear;
    WebAudio.prototype.clear = function () {
        this._clearExtraNodes();
        $.WebAudio_clear.call(this);
    };
    
    // Allow 0 for far left pan, 1 for far right
    WebAudio.prototype._updatePanner = function () {
        if (this._pannerNode) {
            this._pannerNode.left.gain.value = 1 - this._pan;
            this._pannerNode.right.gain.value = this._pan;
        }
    };
    
// ==============================
// * Html5Audio
// ==============================
    
    // New Methods //
    
    /**
     * Allows the Html5Audio to fade to a target volume.
     * @param {Number} duration The duration in seconds
     * @param {Number} targetVol The target volume between 0 and 100
     */
    Html5Audio.fadeTo = function (duration, targetVol) {
        targetVol = $._getWebVolume(targetVol);
        
        if (this.isReady()) {
            if (this._audioElement) {
                this._tweenTargetGain = targetVol;
                this._tweenGain = this.volume;
                this._startGainTween(duration);
                this._volume = targetVol;
            }
        } else if (this._autoPlay) {
            this.addLoadListener(function () {
                this.fadeIn(duration, targetVol);
            }.bind(this));
        }
    };
    
// ==============================
// * Game_Player
// ==============================
    
    // Overwritten Properties //
    
    // Allow dynamic sound changes when player moves
    $.Game_Player_increaseSteps = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function () {
        AudioManager.fadeDynamicSound(AudioManager._bgsBuffers, "_bgsInfo");
        AudioManager.fadeDynamicSound(AudioManager._seBuffers, "_seInfo");
        
        $.Game_Player_increaseSteps.call(this);
    };
    
    // Allows cleaning of the bgs and se buffer on transfer
    $.Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        if (this._newMapId !== $gameMap.mapId()) {
            AudioManager._bgsBuffers = AudioManager._bgsBuffers.filter(function (buffer) {
                // Clear out any paused, faded, or dynamic bgs
                if (buffer._bgsInfo.dynamic
                        || ((!buffer._playing || buffer._paused)
                        && $.Param.AMEXcleanBgs)) {
                    buffer.stop();
                    return false;
                } else {
                    return true;
                }
            });
            AudioManager._seBuffers = AudioManager._seBuffers.filter(function (buffer) {
                if (buffer._seInfo.dynamic) {
                    buffer.stop();
                    return false;
                } else {
                    return true;
                }
            });
        }
        
        $.Game_Player_performTransfer.call(this);
    };
    
// ==============================
// * Private Properties
// ==============================
    
    // Get the base 2 log value of the filter based on the max and min cutoff
    // Used for the dynamic dampening, where far-distant sounds have an
    // exponentially greater dampening than close-by sounds
    $._maxFilterFreq = 18000;
    $._minFilterFreq = 3000;
    $._octaveLog = Math.log2($._maxFilterFreq / $._minFilterFreq);
    $._freqRange = $._maxFilterFreq - $._minFilterFreq;
    
// ==============================
// * Private Methods
// ==============================
    
    /**
     * Returns the proper volume number for a buffer.
     * @param {Number} vol The initial volume
     * @returns {Number} The adjusted volume between 0 and 1
     */
    $._getWebVolume = function (vol) {
        vol = Math.abs(vol) / 100;
        return (vol > 1) ? 1 : vol || 0;
    };
    
    /**
     * Regulates a sound's volume, pitch and pan
     * @param {Object} param The sound info object
     */
    $._regulateValues = function (param) {
        if (param.volume !== undefined) {
            param.volume = Math.max(param.volume, 0);
            param.volume = Math.min(param.volume, 100);
        }
        if (param.pitch !== undefined) {
            param.pitch = Math.max(param.pitch, 50);
            param.pitch = Math.min(param.pitch, 150);
        }
        if (param.pan !== undefined) {
            param.pan = Math.max(param.pan, -100);
            param.pan = Math.min(param.pan, 100);
        }
    };
    
    /**
     * Copies an audio object's name, volume, pitch and pan properties.
     * @param {Object} obj The audio object to copy values from
     * @returns {Object} The new audio object
     */
    $.copyAudioObject = function (obj) {
        if (obj.name === undefined) { return AudioManager.makeEmptyAudioObject(); }
        
        return {
            name : obj.name,
            volume : (obj.volume === undefined) ? 100 : obj.volume,
            pitch : (obj.pitch === undefined) ? 100 : obj.pitch,
            pan : (obj.pan === undefined) ? 0 : obj.pan
        };
    };
    
    /**
     * Copies the info from a dynamic sound's info object. / Supplies defaults if needed.
     * @param {Object} info The sound info object
     * @returns {Object} The new info object
     */
    $.copySoundInfo = function (info) {
        var newInfo = $.copyAudioObject(info);
        
        newInfo.eventId = info.eventId || 0;
        newInfo.pos = info.pos || null;
        newInfo.dynamic = info.dynamic || false;
        newInfo.autopan = info.autopan || false;
        newInfo.loop = info.loop || false;
        newInfo.fade = info.fade || 0;
        newInfo.falloff = info.falloff || $.Param.AMEXdynamicFalloff;
        newInfo.convName = info.convName || $.Param.AMEXreverbName;
        newInfo.convVolume = info.convVolume || 0;
        
        return newInfo;
    };
    
    /**
     * Gets the new target volume/pan based on the player and event positions.
     * @param {Object} buffer The sound buffer
     * @param {Object} info The extra info on the sound buffer
     * @returns {Object} An object with volume (between 0 and 100),
     *      and pan (between -100 and 100) or null. Do not use pan if null.
     */
    $._getDynamicInfo = function (buffer, info) {
        var evt = $gameMap.event(info.eventId);
        
        if (!info || !evt) { return AudioManager.makeEmptyAudioObject(); }
        
        var targets = {
            volume : (buffer.volume <= 1) ? buffer.volume * 100 : buffer.volume,
            pan : null
        };
        if (!info || info.eventId <= 0) { return targets; }
        var playerX = $gamePlayer.x;
        var playerY = $gamePlayer.y;
        var x = evt.x;
        var y = evt.y;
        var maxPan = 0;
        
        // The distance of the sound from the player is based on the falloff
        // point. Find the player's percentage of the falloff and calculate
        // an exponential volume change based on that distance. This will allow
        // a quick decrease in volume followed by a slow decrease as the player
        // gets further away from the sound.
        var realDistanceX = playerX - x;
        var distanceX = (info.dynamic === "y") ? 0 : Math.abs(realDistanceX);
        var distanceY = (info.dynamic === "x") ? 0 : Math.abs(playerY - y);
        var distance = distanceX + distanceY;
        var percentage = -(distance / info.falloff);
        // The percentage is negative (instead of subtracting 1) to invert
        // the exponential curve.
        var targetExp = Math.pow(2, Math.log2(info.falloff) * percentage);
        var targetVol = info.volume * (targetExp < 0.05 ? 0 : targetExp);
        
        targets.volume = targetVol;
        if ($.Param.AMEXdamp && buffer._filterNode) {
            // Dampen the sound based on its distance from the player
            buffer._filterNode.frequency.value = $._getDampValue(info.volume, targets.volume);
        }
        if (info.autopan) {
            // If autopan is a number, use it to determine the max amount of pan
            maxPan = (Number(info.autopan) > 1)
                ? Number(info.autopan) : $.Param.AMEXmaxPan;
            if (realDistanceX < 0 || realDistanceX > 0) {
                // The pan value should be opposite of its position on the player
                // becuase the player is moving away from the dynamic sound,
                // meaning it pans to the opposite direction.
                // The pan falloff should be a bit less than the regular falloff
                // to simulate max pan before the volume hits 0.
                targets.pan = -((maxPan / (info.falloff * 0.8)) * realDistanceX);
                targets.pan = (targets.pan < -100) ? -100 : targets.pan;
                targets.pan = (targets.pan > 100) ? 100 : targets.pan;
            } else {
                targets.pan = 0;
            }
        }
        
        return targets;
    };
    
    /**
     * Gets the dampening value for the sound
     * @param {Number} max The maximum volume of the sound
     * @param {Number} current The current volume of the sound
     * @returns {Number} The new frequency cutoff
     */
    $._getDampValue = function (max, current) {
        // Find the multiplier between 0 and 1 of the octave logarithm
        // based on the current volume percentage of the sound
        var percentage = current / max;
        var multiplier = Math.pow(2, $._octaveLog * (percentage - 1.0));
        var freqDamp = $._maxFilterFreq * multiplier;
        
        return Math.floor(freqDamp);
    };
    
    
    /**
     * Updates loop points for a sound buffer.
     * @param {Object} buffer The sound buffer object
     * @param {Mixed} start The new start time in seconds / Use null for current start time
     * @param {Mixed} end The new end time in seconds / Use null for current end time
     */
    $._updateLoopPoints = function (buffer, start, end) {
        if (start === null && end === null) {
            // Disable the loop on the bgm or bgs buffer as well as the sourceNode
            if (buffer._bgsInfo) {
                buffer._bgsInfo.loop = false;
            } else {
                buffer.loop = false;
            }
            if (buffer._sourceNode) { buffer._sourceNode.loop = false; }
            return true;
        }
        
        start = (start === null)
            ? buffer._loopStart : start;
        end = (end === null)
            ? buffer._loopStart + buffer._loopLength : end;
        
        buffer._customLoopStart = start;
        buffer._customLoopEnd = end;
        buffer._loopStart = start;
        buffer._loopLength = end - start;
        
        if (buffer._sourceNode) {
            buffer._sourceNode.loopStart = start;
            buffer._sourceNode.loopEnd = end;
        }
    };
    
    /**
     * Loads a reverb impulse into the convBuffers if it doesn't exist already.
     * @param {String} name The reverb impulse name
     */
    $._loadImpulse = function (name) {
        if (!AudioManager._convBuffers[name]) {
            var url = AudioManager._path + $.Param.AMEXimpulseFolder
                + name + AudioManager.audioFileExt();
            AudioManager._convBuffers[name] = new WebAudio(url);
        }
    };
    
    // See Plugin Command Instructions for info
    $._pauseBgm = function (args) {
        var fadeTime = (JavaHut._omitted(args[0])) ? null : Number(args[0]);
        AudioManager.pauseBgm(fadeTime);
    };
    $._resumeBgm = function (args) {
        var fadeTime = (JavaHut._omitted(args[0])) ? null : Number(args[0]);
        AudioManager.replayBgm(AudioManager._mapBgm, fadeTime);
    };
    $._eraseBgm = function () {
        AudioManager.stopBgm();
        AudioManager._mapBgm = null;
        $gameSystem._savedBgm = null;
    };
    $._pauseBgs = function (args) {
        var name = (JavaHut._omitted(args[0])) ? null : String(args[0]);
        var fadeTime = (JavaHut._omitted(args[1])) ? null : Number(args[1]);
        AudioManager.pauseBgs(name, fadeTime);
    };
    $._resumeBgs = function (args) {
        var bgs = (JavaHut._omitted(args[0])) ? null : {name : String(args[0])};
        var fadeTime = (JavaHut._omitted(args[1])) ? null : Number(args[1]);
        AudioManager.replayBgs(bgs, fadeTime);
    };
    $._fadeoutBgs = function (args) {
        var name = (JavaHut._omitted(args[0])) ? null : String(args[0]);
        var fadeTime = (JavaHut._omitted(args[1])) ? null : Number(args[1]);
        AudioManager.fadeOutBgs(fadeTime, name);
    };
    $._eraseBgs = function (args) {
        if (JavaHut._omitted(args[0])) {
            AudioManager.stopBgs();
        } else {
            AudioManager.stopBgs(false, String(args[0]));
        }
    };
    $._setLoop = function (args) {
        if (JavaHut._omitted(args[0])) { return false; }
        
        var bgm = AudioManager._currentBgm;
        var name = String(args[0]);
        var startTime = (JavaHut._omitted(args[1])) ? null : Number(args[1]);
        var endTime = (JavaHut._omitted(args[2])) ? null : Number(args[2]);
        var updateBgm = function (bgmObj) {
            if (startTime === null && endTime === null) {
                bgmObj.loop = false;
            } else {
                startTime = (startTime === null)
                    ? bgmObj.loopStart : startTime;
                endTime = (endTime === null)
                    ? bgmObj.loopEnd : endTime;
                bgmObj.loopStart = startTime;
                bgmObj.loopEnd = endTime;
            }
        };
        
        if (!bgm && AudioManager._mapBgm) {
            // Set the loop points on the saved bgm
            bgm = AudioManager._mapBgm;
            updateBgm(bgm);
        } else if (bgm && bgm.name === name) {
            updateBgm(bgm);
            $._updateLoopPoints(AudioManager._bgmBuffer, startTime, endTime);
        } else {
            AudioManager._bgsBuffers.forEach(function (buffer) {
                if (buffer._bgsInfo.name !== name) { return true; }
                $._updateLoopPoints(buffer, startTime, endTime);
            });
        }
    };
    $._fadeTo = function (args) {
        if (JavaHut._omitted(args[0])) { return false; }
        
        var bgm = AudioManager._currentBgm;
        var name = String(args[0]);
        var fadeTime = (JavaHut._omitted(args[1])) ? null : Number(args[1]);
        var targetVol = Number(args[2]);
        targetVol = Math.max(targetVol, 0);
        targetVol = Math.min(targetVol, 100);
        
        if (bgm && bgm.name === name) {
            fadeTime = (fadeTime === null) ? bgm.fade || 0 : fadeTime;
            AudioManager._bgmBuffer.fadeTo(fadeTime, targetVol);
        } else {
            AudioManager.fadeToBgs(name, fadeTime, targetVol);
        }
    };
    $._randomSound = function (args, eventId, comments) {
        if (args[0] === undefined) { return false; }
        
        var seObj = {
            name : String(args[0]),
            volume : Number(args[1]) || 100,
            pitch : Number(args[2]) || 100,
            pan : Number(args[3]) || 0
        };
        var type = String(args[4]).toLowerCase();
        var max = Number(args[5]);
        var varyPitch = (!JavaHut._omitted(args[6]))
            ? Number(args[6]) : $.Param.AMEXvaryPitch;
        
        AudioManager.playRandomSound(seObj, type, max, varyPitch, eventId, comments);
    };
    
    // Check reverb preloads
    (function reverbPreload () {
        var list = $.Param.AMEXpreload.split(/,+ */);
        
        for (var i = 0; i < list.length; i += 1) {
            if (list[i].length > 0) {
                $._loadImpulse(list[i]);
            }
        }
    }());
    
}(JavaHut.AudioManagerEx));