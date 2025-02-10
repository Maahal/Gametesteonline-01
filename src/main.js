import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

// JOYSTICK

document.addEventListener('DOMContentLoaded', () => {
  const joystickContainer = document.getElementById('joystickContainer');

  const joystick = nipplejs.create({
      zone: joystickContainer, // Define onde o joystick será renderizado
      mode: 'static',          // Joystick fixo
      position: { left: '50%', top: '-50%' },
      color: 'gray',           // Cor do joystick
      size: 120                // Tamanho do joystick
  });

  joystick.on('move', (evt, data) => {
      const forward = -data.vector.y; // Movimento para frente e para trás
      const sideways = data.vector.x; // Movimento lateral

      // Adapte esse código para movimentar o avatar no seu game
      avatar.position.x += sideways * 0.2;
      avatar.position.z += forward * 0.2;
  });

  joystick.on('end', () => {
      // Aqui você pode parar o movimento do avatar quando o joystick não estiver em uso
  });
});


// IMPORTE MAP

const loader = new GLTFLoader();

loader.load(
  '/map.glb', // Caminho para o arquivo
  (gltf) => {
    const model1 = gltf.scene;
    model1.position.set(0, 0, 0); // Ajuste a posição
    model1.scale.set(1, 1, 1); // Ajuste o tamanho
    model1.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Permite sombras
        child.receiveShadow = true;
      }
    });
    scene.add(model1); // Adiciona à cena
  },
  (xhr) => {
    console.log(`Carregando: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error('Erro ao carregar o modelo:', error);
  }
);


// POSTES DE LUZ

function criarPoste(x, z) {
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00 });

  // Poste (cilindro)
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 3), postMaterial);
  post.position.set(x, 1.5, z);
  post.castShadow = true;
  scene.add(post);

  // Lâmpada (esfera)
  const lightBulb = new THREE.Mesh(new THREE.SphereGeometry(0.3), lightMaterial);
  lightBulb.position.set(x, 3.2, z);
  scene.add(lightBulb);

  // Luz pontual
  const pointLight = new THREE.PointLight(0xffffaa, 5, 10);
  pointLight.position.set(x, 3.2, z);
  pointLight.castShadow = true;

  // Melhorando a qualidade das sombras
pointLight.shadow.mapSize.width = 1024;  // Aumenta a resolução da sombra
pointLight.shadow.mapSize.height = 1024; // Aumenta a resolução da sombra
pointLight.shadow.radius = 4;            // Suaviza as sombras
pointLight.shadow.bias = -0.005;         // Corrige possíveis artefatos

  scene.add(pointLight);
}

// Criando postes em diferentes posições
//direito
criarPoste(5, 0);
criarPoste(5, 5);
criarPoste(5, -11);
//Esquerdo
criarPoste(-5, 0);
criarPoste(-5, 5);
criarPoste(-5, -11);

//direito
criarPoste(5, -20);
criarPoste(15, -20);
criarPoste(22, -20);
//Esquerdo
criarPoste(-5, -20);
criarPoste(-15, -20);
criarPoste(-22, -20);

// luz ambiente 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Cor branca com intensidade 0.5
scene.add(ambientLight);

// Criando função para adicionar casas
function createHouse(x, z) {
  const houseGeometry = new THREE.BoxGeometry(4, 4, 4);
  const houseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const house = new THREE.Mesh(houseGeometry, houseMaterial);
  house.position.set(x, 2, z);
  house.castShadow = true;
  house.receiveShadow = true;
  scene.add(house);

  const roofGeometry = new THREE.ConeGeometry(3, 2, 4);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x772200 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(x, 5, z);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  scene.add(roof);
}

// Adicionando múltiplas casas
createHouse(-11, 0);
createHouse(11, -5);
createHouse(11, 8);

// Criando o avatar
const avatarGeometry = new THREE.BoxGeometry(1, 1, 1);
const avatarMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
avatar.position.y = 0.5;
avatar.castShadow = true;
scene.add(avatar);

// Posição inicial da câmera
camera.position.set(0, 1, 5);
camera.lookAt(avatar.position);

// Controles do avatar
const keys = {};
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);

function moveAvatar() {
    if (keys['ArrowUp']) avatar.position.z -= 0.1;
    if (keys['ArrowDown']) avatar.position.z += 0.1;
    if (keys['ArrowLeft']) avatar.position.x -= 0.1;
    if (keys['ArrowRight']) avatar.position.x += 0.1;
    
    // Atualizando a posição da câmera para seguir o avatar
    camera.position.set(avatar.position.x, avatar.position.y + 1.5, avatar.position.z + 4);
    camera.lookAt(avatar.position);
}

// Ajustar o tamanho ao redimensionar a janela
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    moveAvatar();
    renderer.render(scene, camera);
}
animate();
