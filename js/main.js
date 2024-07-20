PluginManager.setup($plugins);

window.onload = function() {
    SceneManager.run(Scene_Boot);

    const canvas = document.getElementById('GameCanvas');
    canvas.width = 75%;
    canvas.height = 75%;
        
};
