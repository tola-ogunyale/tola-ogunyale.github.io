import * as THREE from 'three';
import gsap from 'gsap';
import './style.css';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

//create scene
const scene = new THREE.Scene();

//configuring sizing
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


//adding object to scene
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//setting up lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 1.5;
scene.add(light);

//extra lights
let dlight, dlight2, hemiLight, pointLight, ambientLight, spotLight;
//ambient lights
ambientLight = new THREE.AmbientLight("red", 1000);
//directional lights
dlight = new THREE.DirectionalLight("white", 1);
dlight.position.set(10, 20, 16);
dlight2 = new THREE.DirectionalLight("purple", 1);
dlight2.position.set(-10, 20, 16);
//hemisphere lights
hemiLight = new THREE.HemisphereLight(0xffeeb1,0x080820, 1);
//spot lights
spotLight = new THREE.SpotLight(0xffa95c,3, 0, 2);
spotLight.castShadow = true;
//point lights
pointLight = new THREE.PointLight("purple",10,0,2);
pointLight.position.set(0, 20, 0);


ambientLight.intensity = 0.5;
pointLight.intensity = 0.5;
dlight.intensity = 0.5;
dlight2.intensity = 0.5;
spotLight.intensity = 0.75;
//scene.add(ambientLight);
scene.add(dlight);
scene.add(dlight2);
scene.add(hemiLight);
scene.add(spotLight);
scene.add(pointLight);





//setting up camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100); 
camera.position.z = 20;
scene.add(camera);


//setting up renderer
const canvas = document.querySelector('#threejs-canvas');
const renderer = new THREE.WebGL1Renderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//setting up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;


// > updating sizing
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //change camera; updating aspect ratio
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //change renderer; sets the camera sizes
  renderer.setSize(sizes.width, sizes.height);
})

const loop = () => {
  //animation test
  //mesh.rotation.x += 1;
  //mesh.rotation.z -= 0.5;
  controls.update();
  
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop ();

//animation
const timelineMagic = gsap.timeline({defaults: {duration: 1}});
timelineMagic.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1});
timelineMagic.fromTo("nav", {y:"-100%"}, {y:"0%"});
timelineMagic.fromTo(".title", {opacity: 0}, {opacity: 1});

// mouse animations
let mouseDown = false;
let objColor = [];
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mousedup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
  if (mouseDown){
    objColor = [
      Math.round((e.pageX / sizes.width) * (255)),
      Math.round((e.pageY / sizes.height) * (255)),
      150,
    ]
    //animation
    let newObjColor = new THREE.Color(`rgb(${objColor.join(",")})`)
    //new THREE.Color(`rgb(0,100,150)`)
    gsap.to(mesh.material.color, {
      r: newObjColor.r, 
      g: newObjColor.g, 
      b: newObjColor.b,
    })
  }
})