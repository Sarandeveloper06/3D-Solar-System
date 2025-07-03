import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===== Basic Scene Setup =====
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(0, 40, 120);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor('#00000f');

// ===== Camera Controls =====
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== Lighting =====
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const sunlight = new THREE.PointLight(0xffffff, 4, 1000);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);

// ===== Star Background =====
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
const starVertices = [];

for (let i = 0; i < 10000; i++) {
  starVertices.push(
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000
  );
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
scene.add(new THREE.Points(starGeometry, starMaterial));

// ===== Texture Loader =====
const textureLoader = new THREE.TextureLoader();

// ===== Sun (center of the solar system) =====
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(16, 64, 64),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('textures/sun.jpg') })
);
scene.add(sun);

// ===== Function to Create Planets =====
function createPlanet(name, size, texture, orbitRadius, ring = null) {
  const planetMesh = new THREE.Mesh(
    new THREE.SphereGeometry(size, 30, 30),
    new THREE.MeshStandardMaterial({ map: textureLoader.load(`textures/${texture}`) })
  );
  planetMesh.name = name;

  const orbitGroup = new THREE.Object3D();
  planetMesh.position.x = orbitRadius;
  orbitGroup.add(planetMesh);

  if (ring) {
    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 64),
      new THREE.MeshBasicMaterial({
        map: textureLoader.load(`textures/${ring.texture}`),
        side: THREE.DoubleSide,
        transparent: true
      })
    );
    ringMesh.rotation.x = -0.5 * Math.PI;
    ringMesh.position.x = orbitRadius;
orbitGroup.add(ringMesh);

  }

  scene.add(orbitGroup);
  return { mesh: planetMesh, group: orbitGroup };
}

// ===== Create All 8 Planets =====
const planets = [
  createPlanet('Mercury', 3.2, 'mercury.jpg', 28),
  createPlanet('Venus', 5.8, 'venus.jpg', 44),
  createPlanet('Earth', 6, 'earth.jpg', 62),
  createPlanet('Mars', 4, 'mars.jpg', 78),
  createPlanet('Jupiter', 12, 'jupiter.jpg', 100),
  createPlanet('Saturn', 10, 'saturn.jpg', 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: 'saturn_ring.jpg'
  }),
  createPlanet('Uranus', 7, 'uranus.jpg', 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: 'uranus_ring.jpg'
  }),
  createPlanet('Neptune', 7, 'neptune.jpg', 200)
];

// ===== Tooltip and Raycaster =====
const tooltip = document.getElementById('tooltip');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isPaused = false;
let selectedPlanet = null;

// ===== Mouse Tracking for Tooltips =====
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  tooltip.style.top = `${event.clientY + 10}px`;
  tooltip.style.left = `${event.clientX + 10}px`;
});

// ===== Click to Select Planet =====
window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

  if (selectedPlanet) {
    selectedPlanet.material.emissive.setHex(0x000000);
  }

  if (intersects.length > 0) {
    selectedPlanet = intersects[0].object;
    selectedPlanet.material.emissive.setHex(0x444444);
  } else {
    selectedPlanet = null;
  }
});

// ===== UI Controls =====
document.getElementById('pause-button').onclick = () => {
  isPaused = !isPaused;
  document.getElementById('pause-button').textContent = isPaused ? 'Resume' : 'Pause';
};

document.getElementById('theme-button').onclick = (e) => {
  const controlsPanel = document.getElementById('controls');
  controlsPanel.classList.toggle('light-theme');

  const isLightTheme = controlsPanel.classList.contains('light-theme');
  renderer.setClearColor(isLightTheme ? '#eeeeff' : '#00000f');
  e.target.textContent = isLightTheme ? 'Dark Theme' : 'Light Theme';
};

const defaultSpeeds = {
  mercury: 4.7, venus: 3.5, earth: 2.9, mars: 2.4,
  jupiter: 1.3, saturn: 0.9, uranus: 0.6, neptune: 0.5
};

document.getElementById('reset-button').onclick = () => {
  for (const name in defaultSpeeds) {
    document.getElementById(name).value = defaultSpeeds[name];
  }
};

// ===== Animation Loop =====
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.001;

  if (!isPaused) {
    // Update raycaster for tooltip
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(planets.map(p => p.mesh));

    if (hits.length > 0) {
      tooltip.style.display = 'block';
      tooltip.textContent = hits[0].object.name;
    } else {
      tooltip.style.display = 'none';
    }

    // Animate each planet
    planets.forEach((planet) => {
      const speed = parseFloat(document.getElementById(planet.mesh.name.toLowerCase()).value);
      planet.mesh.rotation.y += 0.005;
      planet.group.rotation.y += speed / 1000;
    });
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

// ===== Handle Window Resize =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

