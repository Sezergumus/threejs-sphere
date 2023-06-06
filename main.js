import * as THREE from 'three';
import './style.css'
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Scene
const scene = new THREE.Scene();


//Create a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ 
  color: '#00ff83',
  roughness: 0.5,
 });

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 1.25;
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 20;
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 15;

//Resize
window.addEventListener('resize', () => {
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
})

const loop = () => {
  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(loop);
}
loop();

//Mouse Animation
let mouseDown = false;
let rgb = [12,23,55]
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
  if(mouseDown){
    rgb = [
      Math.floor(e.pageX / sizes.width * 255),
      Math.floor(e.pageY / sizes.width * 255),
      150
    ]
    // change color of sphere
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})})`)
    gsap.to(mesh.material.color, {
      r: newColor.r, 
      g: newColor.g, 
      b: newColor.b
    })
  }
})

//Loader
const loader = document.getElementsByClassName('loader-wrapper')[0];
const percentage = document.getElementsByClassName('percentage')[0];
let count = 0;

window.addEventListener('load', () => {
  setInterval(() => {
    if(count < 100){
      count += 2;
      percentage.innerHTML = count + '%';
    }
  }, 60)
})

let checkCount = () => {
  if(count === 100){
    //Timeline
    const tl = gsap.timeline({ defaults: { duration: 1 } });
    tl.fromTo(loader, { opacity: 1}, { opacity: 0 })
    tl.fromTo(mesh.scale, { z:0, x:0, y:0}, { z:1, x:1, y:1 })
    tl.fromTo('.title', { opacity: 0}, { opacity: 1 })
    tl.fromTo('nav', { y: "-100%"}, { y: "0%" })
  } else{
    setTimeout(checkCount, 100);
  }
}

checkCount();