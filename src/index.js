import * as THREE from "three";
global.THREE = THREE;

require("three/examples/js/controls/OrbitControls");
require("three/examples/js/loaders/GLTFLoader.js");
require("three/examples/js/loaders/RGBELoader.js");

let canvas, renderer, camera, scene;
let meshes = [];

init();
render();

function init() {
  canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x1f1e1c, 1);

  const fov = 45;
  const near = 0.1;
  const far = 500;
  camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
  camera.position.z = 20;

  scene = new THREE.Scene();

  new THREE.OrbitControls(camera, canvas);

  const hdrEquirect = new THREE.RGBELoader().load(
    "src/empty_warehouse_01_2k.hdr",
    () => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }
  );

  const textureLoader = new THREE.TextureLoader();
  const bgTexture = textureLoader.load("src/stained-glass.jpg");
  const bgGeometry = new THREE.PlaneGeometry(19.2, 14.4);
  const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
  const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  bgMesh.position.set(0, 0, -1);
  scene.add(bgMesh);

  const golfNormal = textureLoader.load("src/golfball.jpeg");
  const roughNormal = textureLoader.load("src/Water_2_M_Normal.jpeg");
  const clearcoatNormal = textureLoader.load(
    "src/Scratched_gold_01_1K_Normal.png"
  );

  const material1 = new THREE.MeshPhysicalMaterial({
    envMap: hdrEquirect,
    roughness: 0,
    transmission: 1,
    thickness: 2
  });

  const material2 = new THREE.MeshPhysicalMaterial({
    envMap: hdrEquirect,
    roughness: 0.15,
    clearcoat: 1,
    clearcoatNormalMap: clearcoatNormal,
    transmission: 1,
    thickness: 4
  });

  const material3 = new THREE.MeshPhysicalMaterial({
    envMap: hdrEquirect,
    normalMap: golfNormal,
    roughness: 0.15,
    transmission: 1,
    thickness: 2
  });

  const material4 = new THREE.MeshPhysicalMaterial({
    envMap: hdrEquirect,
    normalMap: roughNormal,
    clearcoat: 1,
    clearcoatNormalMap: clearcoatNormal,
    roughness: 0.15,
    transmission: 1,
    thickness: 2
  });

  const spGeom = new THREE.SphereGeometry(3, 32, 32);
  const sp1 = new THREE.Mesh(spGeom, material1);
  sp1.position.set(-4, 3, 3);
  scene.add(sp1);
  meshes.push(sp1);
  const sp2 = new THREE.Mesh(spGeom, material2);
  sp2.position.set(4, 3, 3);
  scene.add(sp2);
  meshes.push(sp2);
  const sp3 = new THREE.Mesh(spGeom, material3);
  sp3.position.set(-4, -3, 3);
  scene.add(sp3);
  meshes.push(sp3);
  const sp4 = new THREE.Mesh(spGeom, material4);
  sp4.position.set(4, -3, 3);
  scene.add(sp4);
  meshes.push(sp4);

  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(dirLight);
}

function update(deltaTime) {
  const ROTATE_TIME = 10; // Time in seconds for a full rotation
  const rotateX = (deltaTime / ROTATE_TIME) * Math.PI * 2;
  const rotateY = (deltaTime / ROTATE_TIME) * Math.PI * 2;

  meshes.forEach((mesh) => {
    mesh.rotateX(rotateX);
    mesh.rotateY(rotateY);
  });
}

function render() {
  requestAnimationFrame(render);

  update(0.01);

  renderer.render(scene, camera);
}
