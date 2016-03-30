if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";
}

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

/**
 * 
 */

var lib = lib || {};

/**
 * 
 */

(function() {

    (lib.BasicPlane = function() {
        THREE.Mesh.apply(this);

        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.material = new THREE.MeshBasicMaterial();
    }).prototype = p = Object.create(THREE.Mesh.prototype);

    p.constructor = lib.BasicPlane;

}());

/**
 *
 * reticulum - gaze navigation
 * 
 */

var reticulumOptions = {
    proximity: true,
    clickevents: true,
    reticle: {
        visible: true,
        restPoint: 1, //Defines the reticle's resting point when no object has been targeted
        color: 0xFFFFFF,
        innerRadius: 0.005,
        outerRadius: 0.01,
        hover: {
            color: 0x1B89A6,
            innerRadius: 0.02,
            outerRadius: 0.024,
            speed: 5,
            vibrate: 0 //Set to 0 or [] to disable
        }
    },
    fuse: {
        visible: true,
        duration: 2.5,
        color: 0x1B89A6,
        innerRadius: 0.045,
        outerRadius: 0.06,
        vibrate: 0, //Set to 0 or [] to disable
        clickCancelFuse: false //If users clicks on targeted object fuse is canceled
    }
};

/**
 *
 * main
 * 
 */

var app = new WebVRApp();

app.addEventListener('init', function(event) {
    Reticulum.init(app.camera, reticulumOptions);

    app.addEventListener('update', function(event) {
        Reticulum.update();
    });
});

app.addEventListener('ready', function(event) {
    hideLoader(init);
});

app.addEventListener('update', function(event) {
    TWEEN.update();
});

//var gui = new dat.GUI();

function init() {

    var size = 4;

    var plane = new lib.BasicPlane();
    plane.material.map = lib.niii;
    plane.scale.set(size * lib.niii.image.width / lib.niii.image.height, size, 1);
    plane.position.set(0, 0, -5);

    app.scene.add(plane);

    app.attach(document.body);
    app.start();
};

document.addEventListener("DOMContentLoaded", function(event) {
    app.init();
});
