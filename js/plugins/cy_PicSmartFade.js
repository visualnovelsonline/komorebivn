//=============================================================================
// cy_PicSmartFade.js
//=============================================================================

/*:
 * @plugindesc Conditionally fades out and replaces picture if file name is different.
 * @author cyanic
 *
 * @help Omit the fade out, show, fade in commands and replace with the
 * smart_fade plugin command.
 *
 * Plugin commands:
 * smart_fade <id> <name> [finalOpacity=255] [outTime=15] [inTime=15]
 *     Fades out and changes picture only if current picture is not the same.
 *     id: The picture ID.
 *     name: The name of the picture, without file extension. Case sensitive!
 *     finalOpacity: Opacity of the swapped image (if swapped).
 *     outTime: Time to fade out image (in frames).
 *     inTime: Time to fade in image (in frames).
 */

(function(){

// Plugin command handler
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    var cmd = command.toLowerCase();
    if (cmd === "smart_fade" && args.length >= 2) {
        var id = Number(args[0]);
        var name = args[1];
        var finalOpacity = Number(args[2]) || 255;
        var outTime = Number(args[3]) || 15;
        var inTime = Number(args[4]) || 15;
        if (isNaN(id))
            throw new TypeError("id is invalid.");
        applySmartFade(this, id, name, finalOpacity, outTime, inTime);
    } else if (cmd === "cleanup_smart_fade") {
        // Private helper command, do not call directly
        cleanupSmartFade(this);
    }
};

var applySmartFade = function(interpreter, id, name, finalOpacity, outTime, inTime) {
    if (finalOpacity < 0 || finalOpacity > 255)
        throw new RangeError("finalOpacity is outside of 0-255 range.");
    if (outTime < 0)
        throw new RangeError("outTime is negative.");
    if (inTime < 0)
        throw new RangeError("inTime is negative.");

    // 1. Evaluate whether replacement is necessary
    var pic = $gameScreen.picture(id);
    if (!pic || pic.name() !== name) {
        // 2. Insert commands into interpreter if necessary
        var list = interpreter._list;
        var index = interpreter._index;
        var indent = interpreter._indent;
        // Define commands
        // Move picture, fade out
        var fadeOutCmd = {
            code: 232,
            indent: indent,
            parameters: [
                id, 0,
                0, 0, 0, 0,
                100, 100,
                0, 0, outTime, true
            ]
        };
        // Show picture
        var showCmd = {
            code: 231,
            indent: indent,
            parameters: [
                id, name,
                0, 0, 0, 0,
                100, 100,
                0, 0
            ]
        };
        // Move picture, fade in
        var fadeInCmd = {
            code: 232,
            indent: indent,
            parameters: [
                id, 0,
                0, 0, 0, 0,
                100, 100,
                finalOpacity, 0, inTime, false
            ]
        };
        // Cleanup
        var cleanupCmd = {
            code: 356,
            indent: indent,
            parameters: ["cleanup_smart_fade"]
        };

        // Insert commands
        list.splice(index + 1, 0, fadeOutCmd, showCmd, fadeInCmd, cleanupCmd);
    }
};

var cleanupSmartFade = function(interpreter) {
    // Remove fade commands so they don't duplicate if smart fade is run again
    interpreter._list.splice(interpreter._index - 3, 4);
    interpreter._index -= 4;
};

})();
