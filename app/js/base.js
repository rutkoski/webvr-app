
var lib = lib || {};

var WebVRApp = function() {
    this.lastTimeMsec = 0;
    this.updateFcts = [];

    this.renderer;
    this.scene;
    this.camera;
    this.controls;
    this.effect;
    this.manager;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.controlsEnabled = true;
};

//THREE.EventDispatcher.prototype.apply( THREE.Object3D.prototype );
THREE.EventDispatcher.prototype.apply( WebVRApp.prototype );

WebVRApp.prototype.constructor = WebVRApp;

WebVRApp.prototype.init = function() {
    // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
    // Only enable it if you actually need to.
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
 
    //this.renderer.shadowMapEnabled = true;
    //this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

    //this.renderer.setClearColor( 0xffffff );

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.autoClear = true;

    // Create a three.js scene.
    this.scene = new THREE.Scene();

    // Create a three.js camera.
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 1000);

    // Apply VR headset positional data to camera.
    this.controls = new THREE.VRControls(this.camera);
    //controls = new THREE.OrbitControls(camera);

    // Apply VR stereo rendering to renderer.
    this.effect = new THREE.VREffect(this.renderer);
    this.effect.setSize(this.width, this.height);

    this.scene.add(this.camera);

    this.manager = new WebVRManager(this.renderer, this.effect, {
        hideButton: false, // Default: false.
        isUndistorted: false // Default: false.
    });

    window.addEventListener('keydown', this.onKey.bind(this), true);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.dispatchEvent({ type: 'init' });

    this.loadAssets();
};

WebVRApp.prototype.attach = function(element) {
    element.appendChild(this.renderer.domElement);
};

WebVRApp.prototype.start = function() {
    this.animate(performance ? performance.now() : Date.now());
};

WebVRApp.prototype.animate = function(nowMsec) {

    // Update VR headset position and apply to camera.
    if (this.controlsEnabled) {
        this.controls.update();
    }

    // Required to stop ghosting - must be placed before render update
    this.camera.updateMatrixWorld();

    this.lastTimeMsec = this.lastTimeMsec || nowMsec - 1000 / 60;
    var deltaMsec = Math.min(200, nowMsec - this.lastTimeMsec);
    this.lastTimeMsec = nowMsec;

    // call each update function
    /*this.updateFcts.forEach(function(updateFn) {
        updateFn(deltaMsec / 1000, nowMsec / 1000)
    });*/

    this.dispatchEvent({ type: 'update', delta: deltaMsec / 1000, now: nowMsec / 1000 });

    // Render the scene through the manager.
    this.manager.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
};

// Reset the position sensor when 'z' pressed.
WebVRApp.prototype.onKey = function(event) {
    if (event.keyCode == 90) { // z
        this.controls.resetSensor();
    }
};

WebVRApp.prototype.onWindowResize = function() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);

    this.dispatchEvent({ type: 'resize' });
};

WebVRApp.prototype.loadAssets = function(complete) {
    var self = this, t = c = manifest.length;

    for (var i = 0; i < c; i++) {
        var item = manifest[i];
        var ext = item.file.substr(-3);
        var loader;

        switch (ext) {
            case 'png':
            case 'jpg':
                loader = new THREE.TextureLoader();
                loader.load(item.file, onLoad.bind(item));
                break;

            case 'dae':
                loader = new THREE.ColladaLoader();
                loader.load(item.file, onLoad.bind(item));
                break;
        }
    }

    function onLoad(object) {
        lib[this.id] = object;
        t--;
        if (!t) {
            self.dispatchEvent({ type: 'ready' });
        }
    }
};
