import * as THREE from "three";
// Set up the scene, camera, and renderer
const canvas = document.querySelector("#c");
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const objects = [];
// Create the office room
const roomGeometry = new THREE.BoxGeometry(10, 4, 8);
const roomMaterial = new THREE.MeshBasicMaterial({
    color: 0x808080,
    wireframe: true,
});
const room = new THREE.Mesh(roomGeometry, roomMaterial);
scene.add(room);
// objects.push(room);
// Create a desk
const deskGeometry = new THREE.BoxGeometry(6, 0.2, 3);
const deskMaterial = new THREE.MeshBasicMaterial({ color: 0x654321 });
const desk = new THREE.Mesh(deskGeometry, deskMaterial);
desk.position.set(0, -1.9, 0);
room.add(desk);
objects.push(desk);
// Create a chair
const chairGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
const chairMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const chair = new THREE.Mesh(chairGeometry, chairMaterial);
chair.position.set(-1, -1.9, -1);
room.add(chair);
objects.push(chair);
// Create a computer monitor
const monitorGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.05);
const monitorMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
monitor.position.set(-0.8, -1.5, -1);
room.add(monitor);
objects.push(monitor);
// Create a keyboard
const keyboardGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.3);
const keyboardMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
keyboard.position.set(-0.8, -1.7, -1);
room.add(keyboard);
objects.push(keyboard);
// Create a chair for visitors
const visitorChairGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
const visitorChairMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const visitorChair = new THREE.Mesh(visitorChairGeometry, visitorChairMaterial);
visitorChair.position.set(1, -1.9, -2);
room.add(visitorChair);
objects.push(visitorChair);
// Create a table for visitors
const visitorTableGeometry = new THREE.BoxGeometry(2, 0.2, 1);
const visitorTableMaterial = new THREE.MeshBasicMaterial({ color: 0x654321 });
const visitorTable = new THREE.Mesh(visitorTableGeometry, visitorTableMaterial);
visitorTable.position.set(1, -1.9, -2);
room.add(visitorTable);
objects.push(visitorTable);
// Create the player object
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
// Load the custom image as a texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("1578845093813.jpg");
// Create a material with the custom image texture
const playerMaterial = new THREE.MeshBasicMaterial({ map: texture });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);
// Position the player
player.position.set(0, -1.9, 5);
// Handle keyboard input
const keys = {};
document.addEventListener("keydown", (event) => {
    keys[event.code] = true;
});
document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});
// Set the player's movement speed
const movementSpeed = 0.1;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraOffset = new THREE.Vector3(0, 1, 2); // Set the camera position relative to the player
player.add(camera);
camera.position.copy(cameraOffset);
camera.lookAt(player.position);
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.enableZoom = true;
// controls.target = player.position;
// controls.update();
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}
renderer.render(scene, camera);
// Render the scene
function animate() {
    // controls.target = player.position;
    // controls.update();
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    // Handle player movement
    if (keys["ArrowUp"]) {
        if (!checkCollision(player.position.x, player.position.z - movementSpeed)) {
            player.position.z -= movementSpeed;
        }
    }
    if (keys["ArrowDown"]) {
        if (!checkCollision(player.position.x, player.position.z + movementSpeed)) {
            player.position.z += movementSpeed;
        }
    }
    if (keys["ArrowLeft"]) {
        if (!checkCollision(player.position.x - movementSpeed, player.position.z)) {
            player.position.x -= movementSpeed;
        }
    }
    if (keys["ArrowRight"]) {
        if (!checkCollision(player.position.x + movementSpeed, player.position.z)) {
            player.position.x += movementSpeed;
        }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
function checkCollision(x, z) {
    // Define player's bounding box
    // const mesj = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial())
    const copy = player.clone();
    copy.position.x = x;
    copy.position.z = z;
    const playerBox = new THREE.Box3().setFromObject(copy);
    // Define obstacle's bounding box
    const obstacleBoxes = objects.map((obj) => new THREE.Box3().setFromObject(obj));
    // Check for intersection
    if (obstacleBoxes.some((box) => playerBox.intersectsBox(box))) {
        return true; // Collision detected
    }
    return false; // No collision
}
