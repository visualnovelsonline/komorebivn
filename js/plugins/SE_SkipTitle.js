"use strict";
/*:
╔════════════════╗
║ Plugin Manager ║
╚════════════════╝
 * @plugindesc v1.11 - Skips the titlescreen and optionally can change the starting scene to whatever you want.
 * @author Squirting Elephant
   ╔════════════╗
   ║ Parameters ║
   ╚════════════╝
 * @param SkipIfSavefile
 * @text Skip titlescreen if savefile present?
 * @desc Skip the titlescreen if one or more savefiles are present?
 * @type boolean
 * @on Skip
 * @off Don't skip
 * @default true
 * 
 * @param SkipTitleEntirely
 * @text Skip Title Entirely?
 * @desc Skip titlescreen also from other calls like the menu?
 * @type boolean
 * @on Skip Entirely
 * @off Don't skip
 * @default false
 * 
 * @param StartScene
 * @text Starting Scene
 * @desc The name of the scene to load when the game starts. Note: does nothing if the titlescreen isn't skipped.
 * @type select
 * @option Scene_Battle
 * @option Scene_Boot
 * @option Scene_Debug
 * @option Scene_Equip
 * @option Scene_File
 * @option Scene_GameEnd
 * @option Scene_Gameover
 * @option Scene_Item
 * @option Scene_Load
 * @option Scene_Map
 * @option Scene_Menu
 * @option Scene_Name
 * @option Scene_Options
 * @option Scene_Save
 * @option Scene_Shop
 * @option Scene_Skill
 * @option Scene_Status
 * @option Scene_Title
 * @default Scene_Map
 * 
   ╔══════╗
   ║ Help ║
   ╚══════╝
 * @help
 * License: Public Domain or CC0.
 * 
 * Required Plugin(s):
 * * <None>
 *
 * Overrides:
 * * Scene_Boot.prototype.start()
 * 
 * Aliases:
 * * SceneManager.goto()
 */

/*╔═══════════════════════╗
  ║ Plugin Initialization ║
  ╚═══════════════════════╝*/
var Imported = Imported || {};
Imported.SE_SkipTitle = { name: 'SE_SkipTitle', version: 1.11, author: 'Squirting Elephant', date: '2020-02-21' };
var SE = SE || {};
SE.Alias = SE.Alias || {};

if (!Imported.SE_Core) {
    SE.parseParameters = function (string) {
        try {
            return JSON.parse(string, (key, value) => {
                try { return SE.parseParameters(value); }
                catch (e) { return value; }
            });
        } catch (e) { return string; }
    };
}

(function (){
    /*╔════════════╗
      ║ Parameters ║
      ╚════════════╝*/
    SE.Params = SE.Params || {};
    SE.Params.SkipTitle = PluginManager.parameters('SE_SkipTitle');
	for (let key in SE.Params.SkipTitle) { SE.Params.SkipTitle[key] = SE.Params.SkipTitle[key].replace("\r", ""); } // Because: fix stupid RMMV bug (https://forums.rpgmakerweb.com/index.php?threads/parameter-string-does-not-equal-string.113697/)
    SE.Params.SkipTitle = SE.parseParameters(JSON.stringify(SE.Params.SkipTitle));
    let params = SE.Params.SkipTitle; // Alias
    SE.SkipTitle = SE.SkipTitle || {};

    SE.SkipTitle.StartSceneAsStr = params.StartScene;
    SE.SkipTitle.SkipIfSavefile = params.SkipIfSavefile;
    SE.SkipTitle.SkipTitleEntirely = params.SkipTitleEntirely;
})();

(function () {

    function bShowTitleScreen()
    {
        return (DataManager.isAnySavefileExists() && (SE.Params.SkipTitle.SkipIfSavefile === false));
    }

    /*╔══════════════════════════════════════╗
      ║ Override: Scene_Boot.prototype.start ║
      ╚══════════════════════════════════════╝*/
    SE.Alias.SkipTitleScreen_Scene_Boot_prototype_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        if (bShowTitleScreen() === true) {
            // Load regular titlescreen.
            SE.Alias.SkipTitleScreen_Scene_Boot_prototype_start.apply(this, arguments);
        }
        else // Skip titlescreen.
        {
            Scene_Base.prototype.start.call(this);

            SoundManager.preloadImportantSounds();
            if (DataManager.isBattleTest()) {
                DataManager.setupBattleTest();
                SceneManager.goto(Scene_Battle);
            } else if (DataManager.isEventTest()) {
                DataManager.setupEventTest();
                SceneManager.goto(Scene_Map);
            } else {
                this.checkPlayerLocation();
                DataManager.setupNewGame();
                SceneManager.goto(eval(SE.SkipTitle.StartSceneAsStr)); // Note: This is the only overridden line.
                Window_TitleCommand.initCommandPosition();
            }

            this.updateDocumentTitle();
        }
    };

    /*╔══════════════════════════╗
      ║ Alias: SceneManager.goto ║
      ╚══════════════════════════╝*/
    SE.Alias.SkipTitleScreen_SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function(sceneClass)
    {
        if (SE.SkipTitle.SkipTitleEntirely === true && sceneClass === Scene_Title)
        {
            SE.Alias.SkipTitleScreen_SceneManager_goto.call(this, eval(SE.SkipTitle.StartSceneAsStr));
        }
        else
        {
            SE.Alias.SkipTitleScreen_SceneManager_goto.apply(this, arguments);
        }
    }

})();
/*╔═════════════╗
  ║ End of File ║
  ╚═════════════╝*/