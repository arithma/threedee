(function (exports) {
    function Position(x, y, z) {
        return new THREE.Vector3(x, y, z);
    }

    function Velocity(x, y, z) {
        return new THREE.Vector3(x, y, z);
    }

    function Force(x, y, z) {
        return new THREE.Vector3(x, y, z);
    }

    function Sphere(mass, position, velocity) {
        this.mass = mass;
        this.velocity= velocity;

        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(2, 20, 20),
            new THREE.MeshLambertMaterial({ color: 0xff00ff, wireframe: false})
        );

        this.setPosition(position);
    }

    Sphere.prototype.setPosition = function(position) {
        this.position = position;
        this.mesh.position.set(position.x, position.y, position.z);
    };

    function World(width, height) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );

        this.camera.position.set(0, 5, 30);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.domElement = this.renderer.domElement;

        this.drawingFunction = function() {
        };

        var light1 = new THREE.PointLight();
        light1.position.set(50, 50, 50);
        this.scene.add(light1);

        var light2 = new THREE.PointLight();
        light2.position.set(-50, -50, 50);
        this.scene.add(light2);
    }

    World.prototype.add = function(worldObject) {
        this.scene.add(worldObject.mesh);
    };

    World.prototype.draw = function(drawingFunction) {
        this.drawingFunction = drawingFunction;
    };

    World.prototype.run = function(window) {
        window.document.body.appendChild(this.domElement);

        var world = this;
        var runAnimationLoop = function () {
            window.requestAnimationFrame(runAnimationLoop);
            world.drawingFunction();
            world.renderer.render(world.scene, world.camera);
        };

        runAnimationLoop();
    };

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function runDemo(window) {
        var world = new World(window.innerWidth, window.innerHeight);

        var spheres = [];
        for (var i = 0; i < 10; i++) {
            var x = getRandomInt(-15, 15);
            var y = getRandomInt(1, 40);
            var z = getRandomInt(-15, 15);

            var mass = getRandomInt(1, 5);
            var position = Position(x, y, z);
            var velocity = Velocity(0, 0, 0);

            var sphere = new Sphere(mass, position, velocity);

            spheres.push(sphere);
            world.add(sphere);
        }

        var gravity = new Force(0, -0.0981, 0);

        world.draw(function() {
            for (var i = 0, l = spheres.length; i < l; i++) {
                spheres[i].velocity.add(gravity);

                var newPosition = spheres[i].position.clone();
                newPosition.add(spheres[i].velocity);

                if (newPosition.y < 0) {
                    newPosition.y = 0;
                }

                spheres[i].setPosition(newPosition);
            }
        });

        world.run(window);
    }

    exports.Position = Position;
    exports.Velocity = Velocity;
    exports.Force = Force;
    exports.Sphere = Sphere;
    exports.World = World;
    exports.runDemo = runDemo;
})(this.SphereWorld = {});

