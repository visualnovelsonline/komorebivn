//=============================================================================
// cy_FixPlaytime.js
//=============================================================================

/*:
 * @plugindesc Fixes playtime counter on high refresh displays
 * @author cyanic
 */

(function() {

var updateCount = 0;

var _SceneManager_updateScene = SceneManager.updateScene;
SceneManager.updateScene = function() {
    ++updateCount;
    _SceneManager_updateScene.call(this);
}

var _DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
    _DataManager_setupNewGame.call(this);
    updateCount = 0;
}

var _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
Game_System.prototype.onBeforeSave = function() {
    _Game_System_onBeforeSave.call(this);
    this._framesOnSave = updateCount;
}

var _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function() {
    _Game_System_onAfterLoad.call(this);
    updateCount = this._framesOnSave;
}

Game_System.prototype.playtime = function() {
    return Math.floor(updateCount / 60);
};

})();
