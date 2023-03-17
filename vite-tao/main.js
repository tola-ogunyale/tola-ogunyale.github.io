import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

//create scene
const scene = new THREE.Scene();

//configuring sizing
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


//adding object to scene; TESTING
/*const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);*/


// ######## IMPORTING BLENDER FILE ###########
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
	// resource URL
	'assets/traffic_cone.glb',
	// called when the resource is loaded
	function ( gltf ) {
    var cone = gltf.scene;

		scene.add( cone );

    const gltfTimeline = gsap.timeline({defaults: {duration: 2.5}});
    gltfTimeline.fromTo(cone.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1});


		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

// ## SETTING UP ENVIROMENT ######
//setting up lights
const hemiLight = new THREE.HemisphereLight( 0xFF70A6, 0x87F6FF, 1);
const hemiLight2 = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

scene.add( hemiLight );
scene.add( hemiLight2 );


const ambiLight = new THREE.AmbientLight( 0x404040 ); // soft white light
ambiLight.intensity = 0.75;
scene.add( ambiLight );

//setting up camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100); 
camera.position.y = 5;
camera.position.z = 10;
scene.add(camera);

//setting up renderer
const canvas = document.querySelector('#threejs-canvas');
const renderer = new THREE.WebGL1Renderer({canvas}, {alpha: true});
renderer.setClearColor( 0x000000, 0 );
//renderer.setClearColor( 0x87F6FF, 1 );
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//setting up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 4;


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
const htmlTimeline = gsap.timeline({defaults: {duration: 1}});
htmlTimeline.fromTo(".greeting", {y:"-100%"}, {y:"0%"});
htmlTimeline.fromTo("#intro-1", {
  y:"-250%",
  opacity: -2
}, 
{
  y:"0%", 
  opacity: 1,
  duration: 2.5 
});
htmlTimeline.fromTo("#intro-2", {
  y:"-250%",
  opacity: -2
}, 
{
  y:"0%", 
  opacity: 1,
  duration: 2.5 
});
htmlTimeline.fromTo("#call-to-action", {
  y:"-350%",
  opacity: -9
}, 
{
  y:"0%", 
  opacity: 1,
  duration: 2.5 
});
//htmlTimeline.fromTo(".intro", {opacity: 0.1}, {opacity: 1});
//htmlTimeline.fromTo(".title", {opacity: 0}, {opacity: 1});

