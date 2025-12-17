import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ------------- Firebase -------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDk0cHAzNRBH_ELU3b1F2xhsYZ8RcgqIxc",
  authDomain: "herramienta-estructura.firebaseapp.com",
  projectId: "herramienta-estructura",
  storageBucket: "herramienta-estructura.firebasestorage.app",
  messagingSenderId: "622445873456",
  appId: "1:622445873456:web:eec2b418329189c91760f5",
  measurementId: "G-9F5RZ859YP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// ------------- THREE.js -------------

// Estructura
let estructuras = {};

let lamaBase;
const lamasGroup = new THREE.Group();

// Escena
const scene = new THREE.Scene();

// Fondo
scene.background = new THREE.Color('#87cefa');

// Texturas
const textureLoader = new THREE.TextureLoader();

const baseColor = textureLoader.load('/textures/suelo/BaseColor.jpg');
const normalMap = textureLoader.load('/textures/suelo/Normal.png');
const roughnessMap = textureLoader.load('/textures/suelo/Roughness.jpg');
const metalnessMap = textureLoader.load('/textures/suelo/Metallic.jpg');
const aoMap = textureLoader.load('/textures/suelo/AmbientOcclusion.jpg');
const displacementMap = textureLoader.load('/textures/suelo/Displacement.tiff');

[
  baseColor,
  normalMap,
  roughnessMap,
  metalnessMap,
  aoMap,
  displacementMap
].forEach(tex => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(50, 50);
});

const groundMaterial = new THREE.MeshStandardMaterial({
  map: baseColor,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  metalnessMap: metalnessMap,
  aoMap: aoMap,

  roughness: 0.6,
  metalness: 0.5,

  displacementMap: displacementMap,
  displacementScale: 0.05
});

const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 200, 200);

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

function configurarPosicionGrid(){
  ground.position.y = estructuras.pilar0 ? estructuras.pilar0.position.y - 0.01 : 0;
  ground.position.x = medidas.width / 2;
  ground.position.z = medidas.depth / 2;
}

// Estilos
let key = 'madera'; // Por defecto empieza como madera

const materials = {
  madera: new THREE.MeshStandardMaterial({
    map: textureLoader.load('/textures/madera/BaseColor.jpg'),
    normalMap: textureLoader.load('/textures/madera/Normal.png'),
    roughnessMap: textureLoader.load('/textures/madera/Roughness.jpg'),
    aoMap: textureLoader.load('/textures/madera/AmbientOcclusion.jpg'),
    metalnessMap: textureLoader.load('/textures/madera/Metallic.jpg'),
    displacementMap: textureLoader.load('/textures/madera/Displacement.tiff'),
    metalness: 0.1,
    roughness: 0.7,

  }),
  metal: new THREE.MeshStandardMaterial({
    map: textureLoader.load('/textures/metal/BaseColor.jpg'),
    normalMap: textureLoader.load('/textures/metal/Normal.png'),
    roughnessMap: textureLoader.load('/textures/metal/Roughness.jpg'),
    aoMap: textureLoader.load('/textures/metal/AmbientOcclusion.jpg'),
    metalnessMap: textureLoader.load('/textures/metal/Metallic.jpg'),
    displacementMap: textureLoader.load('/textures/metal/Displacement.tiff'),
    metalness: 0.9,
    roughness: 0.2,
  }),
  bronce: new THREE.MeshStandardMaterial({
    map: textureLoader.load('/textures/bronce/BaseColor.jpg'),
    normalMap: textureLoader.load('/textures/bronce/Normal.png'),
    roughnessMap: textureLoader.load('/textures/bronce/Roughness.jpg'),
    aoMap: textureLoader.load('/textures/bronce/AmbientOcclusion.jpg'),
    metalnessMap: textureLoader.load('/textures/bronce/Metallic.jpg'),
    displacementMap: textureLoader.load('/textures/bronce/Displacement.tiff'),
    metalness: 0.8,
    roughness: 0.5,
  }),
};

// Configuracion camara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 5);

// Render
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// Medidas del sistema y bases
const medidas = {
  width: 3.91,
  depth: 4,
  large: 2
}

const REAL = {
  perfilAlto: 2.94,
  perfilAncho: 0.06,
  perfilLargo: 0.12,
  vigaAncho: 3.67,
  vigaLargo: 3.88,
  separacionLama: 0.14,
  lamaAncho: 0.025,
  lamaLargo: 3.78,
  lamaAlto: 0.1,
  soporteColgado: 0.04
};

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.6);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const pointLight = new THREE.PointLight(0xffcc7, 0.5);
pointLight.position.set(-50,20,-3);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(20, 20, 3);
directionalLight.castShadow = true;
const d = 20;
directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.mapSize.set(4096, 4096);
directionalLight.shadow.bias = -0.002;
scene.add(directionalLight);

// Modelo
const loader = new GLTFLoader();
loader.load('./models/00_SK-DECO.glb', (gltf) => {
  const model = gltf.scene;

  model.rotation.y = - Math.PI / 2;  

  scene.add(model);

  scene.add(lamasGroup);
  
  if (!lamaBase) {
    lamaBase = model.getObjectByName('Lama-0');
    lamaBase.visible = false; // usamos como molde
  }
  lamaBase.userData.initialPosition = lamaBase.position.clone();

  // Guardamos las estructuras importantes
  estructuras.pilar0 = model.getObjectByName('Pilar-0');
  estructuras.pilar1 = model.getObjectByName('Pilar-1');
  estructuras.pilar2 = model.getObjectByName('Pilar-2');
  estructuras.pilar3 = model.getObjectByName('Pilar-3');

  estructuras.vigaLargo0 = model.getObjectByName('Viga-largo-0');
  estructuras.vigaLargo1 = model.getObjectByName('Viga-largo-1');
  
  estructuras.vigaAncho0 = model.getObjectByName('Viga-ancho-0');
  estructuras.vigaAncho1 = model.getObjectByName('Viga-ancho-1');

  estructuras.perfil0 = model.getObjectByName('Perfil-0');
  estructuras.perfil1 = model.getObjectByName('Perfil-1');
  estructuras.perfil2 = model.getObjectByName('Perfil-2');
  estructuras.perfil3 = model.getObjectByName('Perfil-3');

  // Establecemos la primera textura
  cambiarTextura();

  // Activamos las sombras de cada malla del modelo
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });

  // Evento para controlar los cambios en los inputs
  document.querySelectorAll('.control').forEach(control => {
    const range = control.querySelector('input[type="range"]');
    const number = control.querySelector('input[type="number"]');

    range.addEventListener('input', () => {
      number.value = range.value;
      updateValue(range.dataset.key, range.value);
    });

    number.addEventListener('input', () => {
      range.value = number.value;
      updateValue(number.dataset.key, number.value);
    });

  });

  calculateLamas(medidas.depth-REAL.perfilAncho*2);
});

// Controles camara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true; 
controls.enablePan = false;
controls.target.set(medidas.width/2, medidas.large/2, medidas.depth/2);
controls.update();

// Bucle render
function animate() {
  renderer.render(scene, camera);
  controls.update();
}
renderer.setAnimationLoop(animate);

// Organiza la actualización de los valores del modelo
function updateValue(axis, value) {
  let meters = value/100;
  if(axis === 'x'){
    medidas.width = meters;
    updateWidth(meters);
  }else if(axis === 'y'){
    updateDepth(meters);
    medidas.depth = meters;
  }else{
    updateLarge(meters);
    medidas.large = meters;
  }

  controls.target.set(medidas.width/2, medidas.large/2, medidas.depth/2);
  controls.update();
  configurarPosicionGrid();
  drawLines();
}

// Evento para manejar el cambio de tamaño de la pantalla
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Se encarga de calcular las lamas que caben en el techo y su posición
function calculateLamas(innerDepth) {
  lamasGroup.position.z = REAL.perfilAncho;

  if (!lamaBase) {
    lamaBase = scene.getObjectByName('Lama-0');
    lamaBase.visible = false; // la usamos solo como molde
  }

  lamasGroup.clear();

  const available = innerDepth;

  // Número de lamas con gap fijo
  const count = Math.floor((available) / (REAL.lamaAncho + REAL.separacionLama));
  if (count <= 0) return;

  const used = count * REAL.lamaAncho + (count - 1) * REAL.separacionLama; // ancho total ocupado por lamas + gaps
  const extra = available - used; // espacio sobrante al final

  let cursor = extra/2; // movemos la primera lamina hacia atrás para compensar

  for (let i = 0; i < count; i++) {
    const lama = lamaBase.clone(true);
    lama.position.copy(lamaBase.userData.initialPosition);

    lama.position.z = cursor;
    lama.position.x = REAL.lamaLargo - REAL.lamaLargo / 4;
    lama.rotation.y = Math.PI;

    lama.visible = true;

    lamasGroup.add(lama);

    cursor += REAL.lamaAncho + REAL.separacionLama;
  }
}

// Actualiza el ancho del modelo
function updateWidth(width) {

  estructuras.pilar2.position.z = -(width - REAL.perfilLargo);
  estructuras.pilar3.position.z = -(width - REAL.perfilLargo);

  estructuras.vigaLargo1.position.z = -(width - REAL.perfilAncho);
  
  const innerWidthViga = width - REAL.perfilLargo;
  estructuras.vigaAncho1.scale.z = innerWidthViga / REAL.vigaAncho;
  estructuras.vigaAncho0.scale.z = innerWidthViga / REAL.vigaAncho;
  
  calcularAnchoLamas(width);
}

// Actualiza el ancho de las lamas
function calcularAnchoLamas(width){
  const innerWidthLama = width - REAL.perfilAncho;

  lamaBase.children[2].scale.x = innerWidthLama / REAL.lamaLargo;
  lamaBase.children[1].position.x = - innerWidthLama + (REAL.lamaLargo - REAL.lamaLargo / 4) - REAL.soporteColgado;
  
  lamasGroup.children.forEach((lama) => {
    lama.children[2].scale.x = innerWidthLama / REAL.lamaLargo;
    lama.children[1].position.x = - innerWidthLama + (REAL.lamaLargo - REAL.lamaLargo / 4) - REAL.soporteColgado;
  });
}

// Actualiza la profundidad del modelo
function updateDepth(depth) {
  estructuras.pilar1.position.x = (depth - REAL.perfilAncho);
  estructuras.pilar2.position.x = (depth - REAL.perfilAncho);

  estructuras.vigaAncho1.position.x = (depth - REAL.perfilAncho);
  
  const innerDepth = depth - REAL.perfilAncho*2;
  estructuras.vigaLargo0.scale.z = innerDepth / REAL.vigaLargo;
  estructuras.vigaLargo1.scale.z = innerDepth / REAL.vigaLargo;

  calculateLamas(innerDepth);  
}

// Actualiza el alto del modelo
function updateLarge(large){
  // Escalamos los 4 pilares
  estructuras.pilar0.scale.y = large / REAL.perfilAlto;
  estructuras.pilar1.scale.y = large / REAL.perfilAlto;
  estructuras.pilar2.scale.y = large / REAL.perfilAlto;
  estructuras.pilar3.scale.y = large / REAL.perfilAlto;

  // Movemos las vigas
  estructuras.vigaAncho0.position.y = large - REAL.perfilLargo + REAL.lamaAlto;
  estructuras.vigaAncho1.position.y = large - REAL.perfilLargo + REAL.lamaAlto;
  estructuras.vigaLargo0.position.y = large - REAL.perfilLargo + REAL.lamaAlto;
  estructuras.vigaLargo1.position.y = large - REAL.perfilLargo + REAL.lamaAlto;

  // Movemos las lamas
  lamasGroup.position.y = large - (REAL.lamaLargo - REAL.lamaLargo/4) - REAL.lamaAlto;
}

// Lineas para mostrar las medidas de forma visual
function createMeasureLine({
  length,
  axis = 'x',
  label = '',
  color = 0xffffff
}) {
  const end =
    axis === 'x'
      ? new THREE.Vector3(length, 0, 0)
      : new THREE.Vector3(0, 0, length);

  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    end
  ]);

  const material = new THREE.LineDashedMaterial({
    color,
    dashSize: 0.1,
    gapSize: 0.05
  });

  const line = new THREE.Line(geometry, material);
  line.computeLineDistances();

  const text = createTextSprite(label);
  text.position.set(
    axis === 'x' ? length / 2 : 0,
    0.15,
    axis === 'z' ? length / 2 : 0
  );

  const group = new THREE.Group();
  line.position.y = 0.2;
  text.position.y = 0.4;
  group.add(line);
  group.add(text);

  return group;
}


function createTextSprite(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 128;

  ctx.font = '32px Motserrat';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);

  return sprite;
}

let widthLine;
let depthLine;

drawLines();

function drawLines(){
  scene.remove(widthLine);
  scene.remove(depthLine);

  widthLine = createMeasureLine({
    length: medidas.width,
    axis: 'x',
    label: `${medidas.width.toFixed(2)} m`
  });

  depthLine = createMeasureLine({
    length: medidas.depth,
    axis: 'z',
    label: `${medidas.depth.toFixed(2)} m`
  });

  scene.add(widthLine);
  scene.add(depthLine);
}

// Evento para manejar el cambio de estilos de la estructura
document.querySelectorAll('#menu .option').forEach(option => {
  option.addEventListener('click', (e) => {

    const key = option.dataset.style; // "madera", "metal", "bronce"
    if (materials[key]) {
      cambiarTextura(key);
    }
  });
});

// Realiza el cambio de textura en el modelo
function cambiarTextura(key = 'madera'){
  Object.values(estructuras).forEach(estructura => {
    estructura.material = materials[key];
    estructura.material.needsUpdate = true;
    estructura.material.normalScale.set(1, 1);
  })

  setActiveStyle(key);
}

// Marca el estilo que hay activado de forma visual
function setActiveStyle(key) {
  document.querySelectorAll('#menu .option').forEach(option => {
    option.classList.toggle(
      'active',
      option.dataset.style === key
    );
  });
}