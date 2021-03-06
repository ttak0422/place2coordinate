const msg = 'ようこそARの世界へ\n端末を静止させて，\nしばらくお待ち下さい';

import 'three/VRControls';
import CSS3DRenderer from 'three/examples/js/renderers/CSS3DRenderer'
import PlaneGeometry from 'three/src/geometries/PlaneGeometry'
// import firebase      from "firebase"
import Gps from './modules/Gps';
import Compass from './modules/Compass';
import CrdConverter from './modules/CrdConverter';

import ARSystem from './modules/ARSystem';

// *** THREE ***
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '5%';
const canvas   = renderer.domElement;
document.body.appendChild(canvas);
const scene   = new THREE.Scene();
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);
let vrFrameData, vrDisplay, arView, anchorManager;
let arSystem;
let cam;

// *** Debug ***
const cubeSize = 0.3;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshNormalMaterial();
const cube     = new THREE.Mesh(geometry, material);

const awake = () => {
    console.log('awake');

    THREEAR.ARUtils.getARDisplay().then(async (display) => {
        if(display){
            console.log('your device is ready for our app!');

            alert(msg);

            vrDisplay     = display;
            vrFrameData   = new VRFrameData();
            arView        = new THREEAR.ARView(vrDisplay, renderer);
            anchorManager = new THREEAR.ARAnchorManager(vrDisplay);

            cam = new THREEAR.ARPerspectiveCamera(
                vrDisplay,
                60, //fov
                window.innerWidth / window.innerHeight,
                vrDisplay.depthNear,
                2000 //vrDisplay.depthFar
            );

            window.addEventListener('resize', onWindowResized, false);
            canvas.addEventListener('touchstart', onClick, false);

            arSystem = new ARSystem(scene, cam, start);
        }else{
            console.log('your device is not supported!');
            THREEAR.ARUtils.displayUnsupportedMessage();
        }
    });
};

const start = () => {
    console.log('start');

    update();
};

const update = () => {
    renderer.clearColor();
    arView.render();
    vrDisplay.getFrameData(vrFrameData);
    arSystem.Update();
    renderer.clearDepth();
    renderer.render(scene, cam);
    vrDisplay.requestAnimationFrame(update);
};

const onWindowResized = () => {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

const onClick = (e) => {
    switch(e.touches.length){
        case 1: singletap(e); break;
        case 2: doubletap(e); break;
    }
};

const singletap = async (e) => {
    console.log('single touched');
    //arSystem.UpdateHeading();
};

const doubleTap = async (e) => {
    console.log('double touched');
    arSystem.UpdatePosition();
};

awake();