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
            new THREE.SphereGeometry(Math.sqrt(mass), 10, 10),
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
            60,
            width / height,
            1,
            10000
        );

        this.camera.position.set(0, 100, 600);
        this.clock = new THREE.Clock();
        this.clock.start();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.domElement = this.renderer.domElement;

        this.drawingFunction = function() {
        };

        var light1 = new THREE.PointLight();
        light1.position.set(500, 500, 50);
        this.scene.add(light1);

        var light2 = new THREE.PointLight();
        light2.position.set(-500, -500, 50);
        this.scene.add(light2);
        
        var boxGeometry = new THREE.BoxGeometry( 30, 30, 30 );
        var boxMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00, wireframe: false})
        var cube = new THREE.Mesh( boxGeometry, boxMaterial );
        this.scene.add( cube );
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
    
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function runDemo(window) {
        var world = new World(window.innerWidth, window.innerHeight);

        var spheres = [];
        for (var i = 0; i < 400; i++) {
            var D = 300;
            var x = getRandomInt(-D, D);
            var y = getRandomInt(-D, D);
            var z = getRandomInt(-D, D);

            var V = 40;
            var vx = rand(-V, V);
            var vy = rand(-V, V);
            var vz = rand(-V, V);


            var mass = rand(0, 1);
            mass = mass * mass;
            mass = mass * mass;
            mass = mass * mass;
            mass *= 50;
            var position = Position(x, y, z);
            var velocity = Velocity(vx, vy, vz);

            var sphere = new Sphere(mass, position, velocity);

            spheres.push(sphere);
            world.add(sphere);
        }

        var G = 5000;
        var dt = 0.01;

        world.draw(function() {
            var time = world.clock.getElapsedTime();
            var angle = time / 3;
            var distance = 1 + (1 - Math.exp(-time));
            world.camera.position.set(Math.cos(angle) * 600 * distance, 50 + 100 * distance, Math.sin(angle) * 600 * distance);
            world.camera.lookAt( new THREE.Vector3(0, 0, 0) );
            
            for (var i = 0, l = spheres.length; i < l; i++) {
                for (var j = 0; j < l; j++) {
                    if (i != j) {
                        var force = Force(0, 0, 0);
                        var force = spheres[j].position.clone();
                        force.addScaledVector(spheres[i].position, -1);
                        var dist = force.length();
                        if (dist < 0.01) {
                            continue;
                        }
                        force.setLength(G * spheres[j].mass / dist / dist);
                        
                        spheres[i].velocity.addScaledVector(force, dt);
                    }
                }

                var newPosition = spheres[i].position.clone();
                newPosition.addScaledVector(spheres[i].velocity, dt);

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

