var Application = undefined;
var TinkObj = undefined;
var TinkPointer = undefined;
var PORTRAIT = false;

// App object for updating & rendering
var App = {};
App.update = function() {
    if (!SceneManager.currentScene) {
        return;
    }

    // Check for orientation
    if (Application.renderer.width < Application.renderer.height) {
        PORTRAIT = true;
    } else {
        PORTRAIT = false;
    }

    // Get all entities and update them
    var allEntities = SceneManager.currentScene.children;
    for (var i in allEntities) {
        let entity = allEntities[i];
        
        if (entity.update) {
            entity.update();
        }
    }

    // Update waypoints
    WaypointManager.update();

    // Update Tink
    TinkObj.update();
}

App.render = function() {
    // Updates
    this.update();

    // Renders stage
    Application.renderer.render(Application.stage);

    // Calls next render
    requestAnimationFrame(this.render.bind(this));
}

App.resizeAll = function() {
	let parent = Application.view.parentNode;
   
	// Resize the renderer
	Application.renderer.resize(parent.clientWidth, parent.clientHeight);

    // Resize all entities in current scene
    var allEntities = SceneManager.currentScene.children;
    for (var i in allEntities) {
        let entity = allEntities[i];
        
        if (entity.resize) {
            entity.resize();
        }
    }
}

App.initialize = function() {
    // Assign rendererOptions
    let rendererOptions = {
        autoResize: true,
        resolution: devicePixelRatio,
        backgroundColor: 0xeff4f5,
        antialias: true,
    }

    // Create application
    Application = new PIXI.Application(rendererOptions);
    TinkObj = new Tink(PIXI, Application.renderer.view);
    TinkPointer = TinkObj.makePointer();
    document.querySelector('#map-canvas').appendChild(Application.view);

    // Initialize scenes & set initial scene
    SceneManager.initializeScenes();
    SceneManager.enterScene(SceneManager.Scenes.HOME);

    App.render();
}

function showShowcasePage(id) {

    Transition.enableTransition(function() {
        // Create iframe
        let frameElement = $('<iframe>', {
            src: 'showcasepage.html?showcase=' + id,
            id: 'showcase-frame',
            frameborder: '0',
            scrolling: 'no'
        });
        frameElement.css('pointer-events', 'all');

        // Add iframe to DOM
        frameElement.insertBefore('#showcase-page .back-button');

        // Display back button
        $('#showcase-page .back-button').css('display', 'block');
    });
}

function hideShowcasePage() {

    Transition.enableTransition(function() {
        $('#showcase-frame').remove();
    });
}

$(document).ready(function() {
    Loader.loadAll(App.initialize);
});

window.addEventListener('resize', App.resizeAll)