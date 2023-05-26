import * as THREE from "three";
// @ts-ignore
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    return cube;
}
const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 50000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 300;
camera.position.y = 50;
const scene = new THREE.Scene();
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const cubes = [
// makeInstance(geometry, 0x44aa88, 0),
// makeInstance(geometry, 0x8844aa, -2),
// makeInstance(geometry, 0xaa8844, 2),
];
const color = 0xffffff;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);
const objLoader = new OBJLoader();
objLoader.load("models/bamboo shark.obj", (root) => {
    setInterval(() => {
        root.rotateY(0.01);
    }, 10);
    scene.add(root);
});
renderer.render(scene, camera);
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
function render(time) {
    time *= 0.001; // convert time to seconds
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
let music = new Audio("funky-town-djlunatique.com.mp3");
music.currentTime = 15;
document.body.addEventListener("click", function () {
    if (music.paused) {
        music.play();
    }
});
