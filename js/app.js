function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeSphere(x, y, z) {
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2, 20, 20),
        new THREE.MeshLambertMaterial({ color: 0xff00ff, wireframe: false})
    );

    sphere.position.set(x, y, z);
    return sphere;
}

function makeGround() {
    var ground = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: false})
    );

    ground.position.y = 0;
    ground.rotation.x = -1;
    return ground;
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// var axisHelper = new THREE.AxisHelper(5);
// axisHelper.position.set(0, 0, 15);
// scene.add(axisHelper);

// var cameraHelper = new THREE.CameraHelper(camera);
// scene.add(cameraHelper);

var light1 = new THREE.PointLight();
light1.position.set(50, 50, 50);
scene.add(light1);

var light2 = new THREE.PointLight();
light2.position.set(-50, -50, 50);
scene.add(light2);

// var ground = makeGround();
// scene.add(ground);

var spheres = [];
for (var i = 0; i < 10; i++) {
    var x = getRandomInt(-15, 15);
    var y = getRandomInt(1, 40);
    var z = getRandomInt(-15, 15);

    var sphere = makeSphere(x, y, z);
    console.log([x, y, z]);

    scene.add(sphere);
    spheres.push({sphere: sphere, m: getRandomInt(1, 5), v: 0});
}

camera.position.set(0, 5, 30);

var animate = function() {
    requestAnimationFrame(animate);

    for (var i = 0, l = spheres.length; i < l; i++) {
        spheres[i].v = spheres[i].v += -9.81;
        var y = spheres[i].sphere.position.y + 0.01 * spheres[i].v;
        if (y > 0) {
            spheres[i].sphere.position.y = y;
        } else {
            spheres[i].sphere.position.y = getRandomInt(1, 40);
            spheres[i].v = getRandomInt(0, 5);
        }
    }

    renderer.render(scene, camera);
}

animate();

