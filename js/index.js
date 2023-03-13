//WEBGL & THREE variables
  //variables
  let scene, camera, renderer, mesh, material, image, geometry, clock, mixer;
  //lights
  let dlight, dilight2, hemiLight, pointLight, ambientLight, spotLight;


  //**EXECUTING FUNCTIONS & EVENT LISTENERS
  // when the whole page has loaded, including all dependent resources
      window.addEventListener('load', () => {
        init();
        //animate();
        setup();
        draw();
      });

  // resize canvas when window is resized (for full browser canvas only)
      window.addEventListener('resize', () => {
        setup();
        draw();
      });


      //******** FUNCTIONS **********
      //HTML CANVAS 2D BACKGROUND
      //setup
      function setup(){
         wHeight = window.innerHeight;
         wWidth = window.innerWidth;

        //canvas dimensions
        cHeight = canvas.height;
        cWidth = canvas.width;

        //CSS scaling and such
        canvas.style.height = wHeight +'px';
        canvas.style.width = wWidth + 'px';

        canvas.height = wHeight * pixelRescale;
        canvas.width = wWidth * pixelRescale;

        //lastly
        ctxt.scale(pixelRescale, pixelRescale);
      }
      function draw() {
        //just drawing a gradient
        //let grad = ctxt.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);

        //grad.addColorStop(0, 'rgba(255, 235, 59, 0.5)');
        //grad.addColorStop(1, 'rgba(233, 30, 99, 0.3)');

        //ctxt.fillStyle = grad;
        //ctxt.fillRect(0, 0, window.innerWidth, window.innerHeight);

      }
      function init(){
        //get dimensions
        let height = window.innerHeight;
        let width = window.innerWidth;

        //set up camera
        camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000);
        camera.position.z = 12; // back camera out
        camera.position.y = 12; // move camera up

        //set up lights
        ambientLight = new THREE.AmbientLight("red", 10000);
        dlight = new THREE.DirectionalLight("white", 1);
        dlight.position.set(10, 20, 16);
        dlight2 = new THREE.DirectionalLight("purple", 1);
        dlight2.position.set(-10, 20, 16);
        hemiLight = new THREE.HemisphereLight(0xffeeb1,0x080820, 1);
        spotLight = new THREE.SpotLight(0xffa95c,3, 0, 2);
        spotLight.castShadow = true;
        pointLight = new THREE.PointLight("purple",10,0,2);
        pointLight.position.set(0, 20, 0);

        //set up scene
        scene = new THREE.Scene();
        //load hdri for env map
        //let hdri = new THREE.CubeTextureLoader()
        //.setPath('cubemap4k/')
        //.load( [
          'px.png',
          'nx.png',
          'py.png',
          'ny.png',
          'pz.png',
          'nz.png'
        ]);

        //adding things to the scene
        scene.add(camera);
        scene.add(ambientLight);
        scene.add(dlight);
        scene.add(hemiLight);
        scene.add(spotLight);
        scene.add(pointLight);
          //scene helpers **USE FOR DEBUGGING OR PLACING LIGHTING/MODELS
          /*scene.add(new THREE.PointLightHelper(pointLight, 1));
          scene.add(new THREE.DirectionalLightHelper(dlight, 1));
          scene.add(new THREE.DirectionalLightHelper(dlight2, 1));
          scene.add(new THREE.AxesHelper(500));*/

        //set up clock
        clock = new THREE.Clock();

        //object
        //LOAD MODEL FROM BLENDER
        // instantiate a GL Transmission Format loader
        let loader = new THREE.GLTFLoader();
        // load a glTF resource
        loader.load(
          // resource URL
          'assets/T_O_L_A_2.glb',
          // called when the resource is loaded
          function(gltf) {
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            //load model
            //applying materials
            gltf.parser.getDependencies( 'material' ).then( ( materials ) => {
              console.log("materials", materials );
              gltf.scene.traverse((child) => {
                //console.log(gltf.scene.children);

                //basically just taking Blender materials and applying them to the model
                gltf.scene.children[3].material = materials[0]; // changing bottom shell ([3]) to shell material ([0])
                gltf.scene.children[4].material = materials[0]; // changing top shell ([3]) to shell material ([0])
                gltf.scene.children[5].material = materials[2]; // changing yolk ([5]) to yolk material ([2])

                //apply envmaps
                gltf.scene.children[5].material.envMap = hdri;
                gltf.scene.children[5].material.side = THREE.DoubleSide;
                gltf.scene.children[4].material.envMap = hdri;
                gltf.scene.children[4].material.side = THREE.DoubleSide;
                gltf.scene.children[3].material.envMap = hdri;
                gltf.scene.children[3].material.side = THREE.DoubleSide;

              })
            } );

            // * specially defined material for eggwhiteeeee cause used Shapekey animation in blender -> requires morphTargets = true
            let yolk = new THREE.MeshPhysicalMaterial({
              envMap: hdri,
              side: THREE.DoubleSide,
              morphTargets: true,
              color: "white",
              metalness: 0,
              specular: 0.5,
              roughness: 0,
              sheen: 0,
              clearcoat: 0,
              clearcoatRoughness: 0.030,
              ior: 2,
              transmission: 1,
              opacity: 1,
              transparent: true,
            });
            gltf.scene.children[7].material = yolk;
            gltf.scene.remove(gltf.scene.children[6]);// remove backdrop prop used in blender render

            //play animation
            mixer = new THREE.AnimationMixer( gltf.scene );
            console.log("animations", gltf.animations);
            //Animations made in Blender :)
            var action = mixer.clipAction( gltf.animations[ 0 ] ); // egg shell, bottom
            var action1 = mixer.clipAction( gltf.animations[ 1 ] ); // egg shell, top
            var action2 = mixer.clipAction( gltf.animations[ 2 ] ); // egg white
            var action3 = mixer.clipAction( gltf.animations[ 3 ] ); // egg yolk

            //play all
      		  action.play();
            action1.play();
            action2.play();
            action3.play();

            scene.add(gltf.scene);
          }
        );

        //render everythinggg
        renderer = new THREE.WebGLRenderer({alpha: 1, antalias: true});
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 2.3;
        renderer.setSize(width, height);
      
        document.body.appendChild(renderer.domElement);
        renderer.render(scene,camera);

        //controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
      }
      function animate(){
        requestAnimationFrame(animate);
        //dynamic lighting? sort of?
        spotLight.position.set(
          camera.position.x + 10,
          camera.position.y + 10,
          camera.position.z + 10
        )
        var delta = clock.getDelta();
        if(mixer) mixer.update(delta);

        renderer.render(scene,camera);
      }

/*// canvas setup
const threejsCanvas = document.querySelector('#threejs-canvas')

let width = threejsCanvas.offsetWidth
let height = threejsCanvas.offsetHeight


//scene and camera setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000)
camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)

render = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true.

})
renderer.setSize(width,height)
renderer.setPixelRation(Nath.min(window.devicePixelRatio, 2))
threejsCanvas.appendChild(renderer.domElement)




//function call
update()

//redraws the canvas every page refresh
function update() {
  renderer.render(scene, camera)
  window.requestAnimationFrame(update)
}*/
