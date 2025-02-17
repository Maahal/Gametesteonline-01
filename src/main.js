import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

//CARREGANDO
loader.load(
  "/map.glb",
  (gltf) => {
    const model1 = gltf.scene;
    model1.position.set(0, 0, 0);
    model1.scale.set(1, 1, 1);
    model1.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model1);

    // 🛑 Ocultar tela de carregamento após carregar
    document.getElementById("loadingScreen").style.display = "none";
  },
  (xhr) => {
    // 🟢 Atualizar progresso
    let progress = (xhr.loaded / xhr.total) * 100;
    document.getElementById("progressBar").style.width = progress + "%";
    document.getElementById("progressText").innerText = `Carregando... ${Math.round(progress)}%`;
  },
  (error) => {
    console.error("Erro ao carregar o modelo:", error);
  }
);


// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

//COR DO CEU
scene.background = new THREE.Color(0x0E161A);

// estrelas 

function createStars() {
  const starsGeometry = new THREE.SphereGeometry(0.05, 8, 8); // Pequena esfera
  const starsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Branco brilhante

  for (let i = 0; i < 500; i++) { // Criar 100 estrelas
      const star = new THREE.Mesh(starsGeometry, starsMaterial);
      
      // Posição aleatória no céu
      const x = (Math.random() - 0.5) * 100; // Espalha em uma área maior
      const y = Math.random() * 20 + 10; // Altura do céu
      const z = (Math.random() - 0.5) * 505;
      
      star.position.set(x, y, z);
      scene.add(star);
  }
}

// Chamar a função para criar as estrelas
createStars();


// JOYSTICK

document.addEventListener('DOMContentLoaded', () => {
  const joystickContainer = document.getElementById('joystickContainer');

  const joystick = nipplejs.create({
      zone: joystickContainer, 
      mode: 'static',
      position: { left: '60%', top: '25%' },
      color: 'gray',
      size: 120
  });

  let moveX = 0, moveZ = 0; // Armazena o movimento

  joystick.on('move', (evt, data) => {
    let dx = data.vector.x; // Movimento lateral (vira o avatar)
    let dz = data.vector.y; // Movimento frontal (anda para frente ou ré)

    // Faz o avatar girar para os lados sem se mover lateralmente
    avatar.rotation.y -= dx * 0.05; 

    // Anda para frente ou para trás baseado na rotação atual
    moveX = Math.sin(avatar.rotation.y) * dz * 0.2;
    moveZ = Math.cos(avatar.rotation.y) * dz * 0.2;
});

  joystick.on('end', () => {
      moveX = 0;
      moveZ = 0;
  });

  function animate() {
    requestAnimationFrame(animate);

    // Aplica o movimento continuamente
    avatar.position.x += moveX;
    avatar.position.z += moveZ;
}

animate(); // Inicia o loop de animação
});


// IMPORTE MAP

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

// Criar um cubo
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Criar Raycaster e um vetor de mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Evento de clique
window.addEventListener("click", (event) => {
  // Converter a posição do mouse para coordenadas normalizadas (-1 a 1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Atualizar o Raycaster com a posição do mouse e a câmera
  raycaster.setFromCamera(mouse, camera);

  // Verificar interseção com o segundo cubo
  const intersects = raycaster.intersectObject(cube1);
  if (intersects.length > 0) {
    window.open("https://www.bymahal.com/portf%C3%B3lio", "_blank"); // 🔗 Abre uma nova aba
  }
});

// Criar um segundo cubo (cor vermelha)
const geometry2 = new THREE.BoxGeometry(2.3, 5, 1);
const material2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const cube2 = new THREE.Mesh(geometry2, material2);
scene.add(cube2);

// Posicionar o segundo cubo um pouco à direita
cube2.position.x = -0.5;
cube2.position.y = 1;
cube2.position.z = -96;

// Adicionar interação de clique no segundo cubo
window.addEventListener("click", (event) => {
  // Converter a posição do mouse para coordenadas normalizadas (-1 a 1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Atualizar o Raycaster com a posição do mouse e a câmera
  raycaster.setFromCamera(mouse, camera);

  // Verificar interseção com o segundo cubo
  const intersects = raycaster.intersectObject(cube2);
  if (intersects.length > 0) {
    window.open("https://www.bymahal.com/portf%C3%B3lio", "_blank"); // 🔗 Abre uma nova aba
  }
});




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

// RUA X
//direito
criarPoste(5, -20);
criarPoste(15, -20);
criarPoste(22, -20);
//Esquerdo
criarPoste(-5, -20);
criarPoste(-15, -20);
criarPoste(-22, -20);

// PRAÇA
//direito
criarPoste(5, -46.41);
//Esquerdo
criarPoste(-5, -50);



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
//avatar.position.x = -1;
//avatar.position.y = 1;
//avatar.position.z = -50;
avatar.castShadow = true;
scene.add(avatar);

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
    camera.lookAt(avatar.position);
}

// Ajustar o tamanho ao redimensionar a janela
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// 📌 Posição inicial e final da câmera
const startPosition = new THREE.Vector3(0, 1, 1000); // Começa afastada
const endPosition = new THREE.Vector3(0, 2, -5); // Posição final atrás do avatar

camera.position.copy(startPosition);
let animationProgress = 0; // Para controlar a animação
let isAnimationDone = false; // Impede que o jogador se mova antes do fim

// Função de animação inicial da câmera
function animateCamera() {
    if (animationProgress < 1) {
        animationProgress += 0.005; // Velocidade da animação (ajuste conforme necessário)
        camera.position.lerpVectors(startPosition, endPosition, animationProgress);
        camera.lookAt(avatar.position); // Mantém a câmera olhando para o avatar
        requestAnimationFrame(animateCamera);
    } else {
        isAnimationDone = true; // Habilita o controle do jogador após a animação
    }
}


// Configuração da câmera de terceira pessoa
const cameraOffset = new THREE.Vector3(0, 2, -5); // Define a posição relativa da câmera
const lookAtOffset = new THREE.Vector3(0, 2, 5); // Ponto para onde a câmera olhará
const lerpSpeed = 0.05 // Velocidade da suavização (menor = mais suave)




// Loop de animação
function animate() {
    requestAnimationFrame(animate);

    document.getElementById("positionDisplay").innerText = 
    `X: ${avatar.position.x.toFixed(2)}, Y: ${avatar.position.y.toFixed(2)}, Z: ${avatar.position.z.toFixed(2)}`;



    //CAMERA ROTATION!
    moveAvatar();
  // 📌 Calcular a posição desejada da câmera (atrás do avatar)
  let cameraTargetPosition = cameraOffset.clone();
  cameraTargetPosition.applyQuaternion(avatar.quaternion); // Gira junto com o avatar
  let targetPosition = avatar.position.clone().add(cameraTargetPosition);

  // 🎥 Suavizar a movimentação da câmera com LERP
  camera.position.lerp(targetPosition, lerpSpeed);

  // 👀 Calcular um ponto à frente do avatar para olhar
  let lookAtTarget = avatar.position.clone().add(lookAtOffset.clone().applyQuaternion(avatar.quaternion));

  // 🔄 Suavizar a rotação da câmera para olhar para frente
  camera.lookAt(lookAtTarget);

  //CUBO GIRANDO
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();
