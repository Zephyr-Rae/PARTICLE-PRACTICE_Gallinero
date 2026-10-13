import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

let nameMesh = new THREE.Mesh();
let name = "CLARISSA RAE";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let stars, starGeo, starMaterial;
const colorChangeClock = new THREE.Clock();
const rainColors = [0xffb6c1, 0x87cefa, 0xffff00, 0xda70d6, 0x98fb98];
let lastColorIndex = 0;

lighting();
createNameText();
particles();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  const positions = starGeo.attributes.position.array;

  for (let i = 2; i < positions.length; i += 3) {
    positions[i] += 0.9;

    if (positions[i] > 300) {
      positions[i] = -300;
    }
  }

  starGeo.attributes.position.needsUpdate = true;
}

function createNameText() {
  const woodTexture = new THREE.TextureLoader().load("assets/textures/wooden.jpg");
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(0.1, 0.1);

  const fontLoader = new FontLoader();
  fontLoader.load("assets/fonts/DynaPuff_Regular.json", (font) => {
    const textGeometry = new TextGeometry(name, {
      font: font,
      size: 3,
      depth: 1,
      curveSegments: 16,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 5,
    });
    textGeometry.center();

    const textMaterial = new THREE.MeshStandardMaterial({
      map: woodTexture,
      emissive: 0xffffff,
      emissiveMap: woodTexture,
      emissiveIntensity: 0.25,
      metalness: 1.05,
      roughness: 0.5,
});
    nameMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(nameMesh);
  });

  camera.position.z = 30;
}

function lighting() {
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 1.2);
  scene.add(hemisphereLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
  keyLight.position.set(10, 15, 20);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xb76e79, 1.5);
  fillLight.position.set(-15, -5, 10);
  scene.add(fillLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  const colorIndex =
    Math.floor(colorChangeClock.getElapsedTime() / 3) % rainColors.length;
  if (colorIndex !== lastColorIndex) {
    starMaterial.color.setHex(rainColors[colorIndex]);
    lastColorIndex = colorIndex;
  }

  nameMesh.rotation.x += 0.008;
  nameMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();
