import * as THREE from 'three';
import gsap from 'gsap';
import * as Firework from '/firework.js';
import * as Football from '/football.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { DeviceOrientationControls } from  '/DeviceOrientationControls.js';

const ratio = 4096/2907;
const scale = 5.5;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const cameraParent = new THREE.Object3D();
// cameraParent.position.z = 5;
// camera.position.set(0,0,5);
camera.position.z = 5;
cameraParent.attach(camera);
// cameraParent.position.z = 0;

const renderer = new THREE.WebGLRenderer({alpha: true});
document.addEventListener("DOMContentLoaded", function() {

    // document.body.addEventListener("deviceorientation", handleOrientation, true);
    
});

var lastBeta;
var lastAlpha;
var lastGamma;

var degtorad = Math.PI / 180;

function deltaAngle (a1, a2) {
    let diff = a1 - a2;
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    return diff;
}


renderer.setSize( window.innerWidth, window.innerHeight );
let controls;
let fakeRotation = new THREE.Object3D();
let fakeRotationLastFrame;
document.body.appendChild( renderer.domElement );
document.body.addEventListener('click', (e) => {
    controls = new DeviceOrientationControls(fakeRotation);
    onPointerDown(e);
});
const open = document.getElementById("open");

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const clock = new THREE.Clock();

const fireworks = [];

const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
scene.add( ambientLight );

const light1 = new THREE.DirectionalLight( 0xffffff, 100 );
scene.add( light1 );

const light2 = new THREE.DirectionalLight( 0xffffff, 100 );
scene.add( light2 );

let particleTexture = new THREE.TextureLoader().load( "particle.png" );



const geometryPlane = new THREE.PlaneGeometry(  scale / ratio, scale );
// const packetDiffuse = new THREE.TextureLoader().load( "old/diffuse.jpg" );
const packetDiffuse = new THREE.TextureLoader().load( "textures/diffuse.png" );
const packetBump = new THREE.TextureLoader().load( "textures/bump.png" );

packetDiffuse.colorSpace = THREE.SRGBColorSpace;
// const packetBump = new THREE.TextureLoader().load( "old/bump.jpeg" );
var noteDiffuse ;
var oldDiffuse = new THREE.TextureLoader().load( "textures/note-diffuse.png" );;
const noteBump = new THREE.TextureLoader().load( "textures/note-bump.png" );
const packetMetal = new THREE.TextureLoader().load( "old/metallic.jpg" );
const packetRoughness = new THREE.TextureLoader().load( "old/roughness.jpg" );
const footballDiffuse = new THREE.TextureLoader().load("football/diffuse.png" );

var cardMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff, 
    side: THREE.DoubleSide,
    map: oldDiffuse,
    bumpMap: noteBump,
    metalness: 0,
    roughness: 1,
});
cardMaterial.colorSpace = THREE.SRGBColorSpace;
const card = new THREE.Mesh( geometryPlane, cardMaterial );
scene.add( card );
card.position.z = -0.001;

if(window.location.hash) {
    console.log("hash", window.location.hash);
    console.log(`textures/${window.location.hash.slice(1)}.png`);
    noteDiffuse = new THREE.TextureLoader().load( `textures/${window.location.hash.slice(1)}.png`,
    function () {
        cardMaterial = new THREE.MeshStandardMaterial( {
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: noteDiffuse,
            bumpMap: noteBump,
            metalness: 0,
            roughness: 1,
        });
        
        cardMaterial.colorSpace = THREE.SRGBColorSpace;

        card.material = cardMaterial;
    },
    undefined,
    // onError callback
    function () {
        console.error( 'An error happened.' );
        cardMaterial = new THREE.MeshStandardMaterial( {
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: oldDiffuse,
            bumpMap: noteBump,
            metalness: 0,
            roughness: 1,
        });
        cardMaterial.colorSpace = THREE.SRGBColorSpace;

        card.material = cardMaterial;

    });

    
    
} else {

}

const footballMaterial = new THREE.MeshBasicMaterial( {
    color: 0xffffff, 
    side: THREE.DoubleSide,
    map: footballDiffuse,
})

const objLoader = new OBJLoader().load("football/football.obj", onLoadFootball);
var footballPrefab;
function onLoadFootball (object) {
    footballPrefab = new THREE.Mesh(object.children[0].geometry, footballMaterial);
    footballPrefab.position.set(0, 0, 1);
    let footballScale = 0.03;
    footballPrefab.scale.set(footballScale,footballScale,footballScale);
}

const packetMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff, 
    transparent: true,
    alphaMap: packetBump,
    side: THREE.DoubleSide,
    map: packetDiffuse,
    bumpMap: packetBump,
    metalnessMap: packetMetal,
    roughnessMap: packetRoughness,
});

const packetUnlit = new THREE.MeshBasicMaterial( {
    side: THREE.DoubleSide,
    map: packetDiffuse,
})


const envelope = new THREE.Mesh( geometryPlane, packetMaterial );
const envelopeUnlit = new THREE.Mesh(geometryPlane, packetUnlit);
envelope.add( envelopeUnlit );
scene.add( envelope );
const lightHolder = new THREE.Group();
lightHolder.attach(light1);
lightHolder.attach(light2);
scene.add( lightHolder );
const envelopeHolder = new THREE.Group();
envelopeHolder.attach(envelope);
envelopeHolder.attach(card);
scene.add( envelopeHolder );

// let firstRotation;

function animate() {
	requestAnimationFrame( animate );
    var xPos = scale * (Math.sin(2 * clock.getElapsedTime()));
    var yPos = scale * (Math.cos(2 * clock.getElapsedTime()));
    light1.position.set(xPos, yPos, 0.05);
    light2.position.set(-xPos, -yPos, 0.05);

    for (let i = 0; i < fireworks.length; i++) {
        let firework = fireworks[i];
        let deltaTime = 0.05;
        firework.render(deltaTime);
    
    }
    cameraParent.attach(camera);
    // cameraParent.position.x += 0.05;
    cameraParent.position.set(0,0,0);
    // cameraParent.rotation.y += 0.05;
    // camera.updateMatrixWorld();
    // let worldPos;
    if (controls){
        
        controls.update(); //updates fakerotation
        if (fakeRotationLastFrame === undefined) {
            fakeRotationLastFrame = fakeRotation.rotation.clone();
        }
        let dx = fakeRotation.rotation.x - fakeRotationLastFrame.x;
        let dy = fakeRotation.rotation.y - fakeRotationLastFrame.y;
        let dz = fakeRotation.rotation.z - fakeRotationLastFrame.z;
        // if (dx != 0){
        //     console.log(dx, dy, dz);
        //     console.log(fakeRotationLastFrame, fakeRotation);

        // }
        // console.log(fakeRotation, fakeRotationLastFrame, dy);
        // cameraParent.rotation.y -= dy;
        if (Math.abs(dx) < 0.3) {
            envelopeHolder.rotation.x += dx / 5;
            lightHolder.rotation.x += dx / 10;

        }
        if (Math.abs(dy) < 0.3) {
            envelopeHolder.rotation.y += dy / 5;
            lightHolder.rotation.y += dy / 10;

        }

        if (Math.abs(dz) < 0.3) {
            // lightHolder.rotation.z -= dz ;
        }

        if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
            
        }
        fakeRotationLastFrame = fakeRotation.rotation.clone();
    }
    lightHolder.quaternion.slerp(camera.quaternion, 0.1);
    envelopeHolder.quaternion.slerp(camera.quaternion, 0.1);
    
	renderer.render( scene, camera );
}




var isAnimatingEnvelope = false;
var isAnimatingCard = false;

var isOut = false;

function createFirework () {
    
    let offsetXY = new THREE.Vector2( ( Math.random() - 0.5), Math.random() - 0.5);
    fireworks.push(new Firework.Firework (
        new THREE.Vector3(offsetXY.x, offsetXY.y + scale/3, 1), 
        scene, 
        particleTexture
    ));
    
}

function createFootball () {
    let offsetXY = new THREE.Vector2(( Math.random() - 0.5), Math.random() - 0.5);
    fireworks.push(new Football.Football (
        new THREE.Vector3(offsetXY.x, offsetXY.y + scale/3, 1), 
        scene, 
        footballPrefab
    ));
    
}

function onTapCard (event) {
    if (isOut) {
        let d = 0.1;
        gsap.to(card.position, {z: -0.3, duration: d, ease: "power1.out"});
        gsap.to(card.position, {z: -0.001, duration: d, ease: "power1.in", delay: d });
        // createFootball();
        if (Math.random() < 0.2) {
            createFootball();
        }
        createFirework();
        
    }
    
    
}

function onTapEnvelope (event) {
    if (isOut) {
        moveIn();
    }
    else{
        moveOut();
    }
    
}

function moveIn(){
   
    if (isAnimatingEnvelope) return;
    isAnimatingEnvelope = true;
    gsap.to(envelope.position, {z: 0, duration: 0.1});
    gsap.to(card.position, {
        y: 0,
        delay: 0.1,
        duration: 0.5,
    })
    gsap.to(envelope.position, {
        y: 0, 
        delay: 0.1,
        duration: 0.5, 
        onComplete: () => {
            isOut = false;
            isAnimatingEnvelope = false;
            // gsap.to(open.style.opacity, {value: 1, duration: 0.2});
            gsap.to(open, {
                opacity: 1,
              });
            // open.style.display = "block";
        }
    });
}

function moveOut() {
    if (isAnimatingEnvelope) return;
    // open.style.display = "none";
    // gsap.to(open.style.opacity, {value: 0, duration: 0.2});
    gsap.to(open, {
        opacity: 0,
      });
    isAnimatingEnvelope = true;
    gsap.to(envelope.position, {z: 0.2, duration: 0.2});
    envelope.position.set(0, 0, 0);
    gsap.to(card.position, {
        y: scale * 1/ 8,
        delay: 0.2,
        duration: 1,
    })
    gsap.to(envelope.position, {
        y: -scale * 6/8, 
        delay: 0.2,
        duration: 1, 
        // ease: "power1.in", 
        onComplete: () => {
            isOut = true;
            isAnimatingEnvelope = false
            
            
        }
    });
}

function onPointerDown( event ) {
    // createFootball();
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
    
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( scene.children );

    for ( let i = 0; i < intersects.length; i ++ ) {
        if (intersects[ i ].object === envelope) {
            onTapEnvelope();
            break;
        }
        if (intersects[ i ].object === card) {
            onTapCard();
            break;
        }
	}

}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


animate();