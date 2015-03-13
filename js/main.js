var requestId;

if (!init())
    loop();

function init() {
    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({antialias: true});
    } else {
        renderer = new THREE.CanvasRenderer();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    // create a scene
    scene = new THREE.Scene();
    // put a camera in the scene
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 1500);
    scene.add(camera);
    // create a camera contol
    cameraControls = new THREE.OrbitControls(camera);
    // transparently support window resize
    THREEx.WindowResize.bind(renderer, camera);
    var light = new THREE.PointLight(0xffffff, 2);
    light.position.set(0, 0, 100);
    light.castShadow = true;
    scene.add(light);
    // Game goes here
    var axis = buildAxes(1000);
    scene.add(axis);

    //we add here a player
    player = new Player(player_data, 3);
    player.position.y = min_height + player.height;
    scene.add(player);
    document.getElementById("score").innerHTML = player.score;
    document.getElementById("life").innerHTML = player.lives;
    document.getElementById("killable").innerHTML = player.killable;
    level = new Level(difficulty, player);
    level.init();
    scene.add(level);

    var g = new THREE.PlaneGeometry(map_width + margin, map_height + margin, 10);
    var m = new THREE.MeshBasicMaterial({color: 0xe576523});
    var plane = new THREE.Mesh(g, m);
    scene.add(plane);
  
}

function loop() {
    requestId = window.requestAnimationFrame(loop);
    render();
    cameraControls.update();
    if (player.lives === 0) {
        stop();
    }
    if (keyboard.pressed("left")) {
        var dir = [-1, 0, 0];
        if (player.position.x + player.height * 2 > min_width)
            player.move(dir);
    }
    if (keyboard.pressed("right")) {
        var dir = [1, 0, 0];
        if (player.position.x + (player.height) * 2 < max_width)
            player.move(dir);
    }
    if (keyboard.pressed("space")) {
        player.fire();
    }

    if (keyboard.pressed("k")) {
        level.army.killAll();
    }


   

    player.moveBullets();

    if (level.army.operationnal) {
        level.army.animate();
        level.defense.move();
    }
    else {
        difficulty++;
        level.clear();
        level = new Level(difficulty, player);
        level.init();
        scene.add(level);
    }
}

function start() {
    if (!requestId) {
        loop();
    }
}

function stop() {
    if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = undefined;
    }
}
function render() {
    renderer.render(scene, camera);
}
