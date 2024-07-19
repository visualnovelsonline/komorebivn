/*:
*
*@plugindesc Meike Save Files
*
*
*@author Meike (Mitzi S. Soto)
*
*@param Save Files
*@type number
*@min 1
*@desc The number of save files
*@default 20
*
*@param Save Show
*@type number
*@min 1
*@desc The number of save files to show at once
*@default 5
*
*
*@help
*
*Change the defult number of save files and the maximum
*amount to show on the save menu screen
*
______________________________
*Terms of Use
*______________________________
*Free for non-commercial and commercial purposes
*as long as Meike is credited and a link to
*meike.hehasplans.com is given.
*
*
*
* 
*/
(function(){
	
	var parameters = PluginManager.parameters('meike_saveFiles');
	var meikeSaveFiles = Number(parameters['Save Files']);
	var meikeSaveShow = Number(parameters['Save Show']);

	
	DataManager.maxSavefiles = function() {
    return meikeSaveFiles;
	};

	Window_SavefileList.prototype.maxVisibleItems = function() {
    return meikeSaveShow;
	};
	
	
})(); 


